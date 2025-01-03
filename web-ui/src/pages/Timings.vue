<template>
  <div>
    <div class="text-center mb-5">
      <h1>Çalışma Süreleri</h1>
    </div>

    <!-- Zamanlayıcı Ekle Butonu -->
    <div class="d-flex justify-content-end mb-3">
      <button class="btn btn-primary" @click="showAddTimingModal">Zamanlayıcı Ekle</button>
    </div>

    <!-- Filtreleme ve Arama -->
    <div class="filter-controls mb-3 d-flex gap-3">
      <div>
        <label for="filterStatus" class="form-label">Zamanlayıcı Durumuna Göre Filtrele:</label>
        <select id="filterStatus" class="form-select" v-model="filterStatus" @change="fetchTimings">
          <option value="all">Tümü</option>
          <option value="play">Çalışıyor</option>
          <option value="pause">Durduruldu</option>
          <option value="stop">Sıfırlandı</option>
        </select>
      </div>
      <div>
        <label for="searchQuery" class="form-label">Arama:</label>
        <input
          id="searchQuery"
          type="text"
          class="form-control"
          placeholder="Proje Adı, Başlık veya Açıklama"
          v-model="searchQuery"
          @input="fetchTimings"
        />
      </div>
    </div>

    <!-- Tablo -->
    <div class="table-responsive mt-4">
      <table class="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Zamanlayıcı</th>
            <th>Proje Adı</th>
            <th>Başlık</th>
            <th>Açıklama</th>
            <th>Başlangıç Tarihi</th>
            <th>Bitiş Tarihi</th>
            <th>Toplam Süre</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="timings.length === 0">
            <td colspan="8" class="text-center">Gösterilecek veri bulunamadı</td>
          </tr>
          <tr v-for="(item, index) in timings" :key="item.id">
            <td>
              <div>
                <div class="timer-display">{{ item.timer }}</div>
                <div class="timer-controls">
                  <button
                    class="btn-timer"
                    :class="{ 'btn-success': item.status === 1 }"
                    @click="startTimer(index + (currentPage - 1) * pageSize)"
                  >
                    <i class="fas fa-play"></i>
                  </button>
                  <button
                    class="btn-timer"
                    :class="{ 'btn-warning': item.status === 0 }"
                    @click="pauseTimer(index + (currentPage - 1) * pageSize)"
                  >
                    <i class="fas fa-pause"></i>
                  </button>
                  <button
                    class="btn-timer"
                    :class="{ 'btn-danger': item.status === 2 }"
                    @click="stopTimer(index + (currentPage - 1) * pageSize)"
                  >
                    <i class="fas fa-stop"></i>
                  </button>
                </div>
              </div>
            </td>
            <td>{{ item.projectName }}</td>
            <td>{{ item.t }}</td>
            <td>{{ item.desc }}</td>
            <td>{{ formatDate(item.sdt) }}</td>
            <td>{{ formatDate(item.edt) }}</td>
            <td>{{ item.totalTime }}</td>
            <td>
              <button class="btn btn-warning btn-sm" @click="openEditModal(item)">Güncelle</button>
              <button class="btn btn-danger btn-sm" @click="deleteTiming(item.id)">Sil</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="d-flex justify-content-between align-items-center mt-3">
      <div class="d-flex align-items-center gap-3">
        <label for="pageSize" class="form-label">Sayfa Boyutu:</label>
        <select id="pageSize" class="form-select" v-model.number="pageSize" @change="fetchTimings">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
      <nav>
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="goToPage(currentPage - 1)">Önceki</button>
          </li>
          <li
            class="page-item"
            v-for="page in totalPages"
            :key="page"
            :class="{ active: page === currentPage }"
          >
            <button class="page-link" @click="goToPage(page)">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="goToPage(currentPage + 1)">Sonraki</button>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Add Modal -->
    <div
      class="modal fade"
      id="addTimingModal"
      tabindex="-1"
      aria-labelledby="addTimingModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addTimingModalLabel">Zamanlayıcı Ekle</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addTiming">
              <div class="mb-3">
                <label for="projectId" class="form-label">Proje</label>
                <select id="projectId" v-model="newTiming.cpid" class="form-select">
                  <option v-for="project in clientProjects" :key="project.id" :value="project.id">
                    {{ project.name }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label for="title" class="form-label">Başlık</label>
                <input id="title" v-model="newTiming.t" type="text" class="form-control" />
              </div>
              <div class="mb-3">
                <label for="description" class="form-label">Açıklama</label>
                <textarea id="description" v-model="newTiming.desc" class="form-control"></textarea>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                  Kapat
                </button>
                <button type="submit" class="btn btn-primary">Ekle</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div
      class="modal fade"
      id="editTimingModal"
      tabindex="-1"
      aria-labelledby="editTimingModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editTimingModalLabel">Zamanlayıcı Güncelle</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveTimingChanges">
              <div class="mb-3">
                <label for="editTitle" class="form-label">Başlık</label>
                <input id="editTitle" v-model="editTiming.t" type="text" class="form-control" />
              </div>
              <div class="mb-3">
                <label for="editDescription" class="form-label">Açıklama</label>
                <textarea
                  id="editDescription"
                  v-model="editTiming.desc"
                  class="form-control"
                ></textarea>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                  Kapat
                </button>
                <button type="submit" class="btn btn-primary">Güncelle</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Timings',
  data() {
    return {
      timings: [], // Zamanlayıcı verisi
      clientProjects: [], // Projeler verisi
      newTiming: {
        cpid: null, // ClientProjectId
        t: '', // Title
        desc: '', // Description
      },
      editTiming: {}, // Düzenlenecek zamanlayıcı verisi
      currentPage: 1, // Mevcut sayfa
      pageSize: 10, // Sayfa başına kayıt sayısı
      totalItems: 0, // Toplam kayıt sayısı
      filterStatus: 'all', // Filtre durumu
      searchQuery: '', // Arama sorgusu
      systemUserId: null, // Oturum açmış kullanıcının ID'si
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.pageSize)
    },
  },
  mounted() {
    this.getSystemUserId()
    this.fetchTimings()
  },
  methods: {
    formatDate(date) {
      if (!date || date.startsWith('0001')) return '' // Geçersiz tarih kontrolü
      const d = new Date(date)
      return d.toLocaleString() // Tarihi yerel formatta döndür
    },
    // Zamanlayıcıları backend'den fetch et
    async fetchTimings() {
      try {
        const response = await this.$axios.get('/timings/all', {
          params: {
            pn: this.currentPage,
            rpp: this.pageSize,
            st: this.filterStatus,
            q: this.searchQuery,
          },
        })
        console.log('Backend Yanıtı (Timings):', response.data)

        if (response.data.r !== 0) {
          console.error('Zamanlayıcılar alınırken hata:', response.data.em)
          return
        }

        const result = response.data.ro
        if (!result) {
          this.timings = []
          this.totalItems = 0
          return
        }

        this.timings = result.map((timing) => ({
          id: timing.id,
          projectName: timing.client_project || 'Bilinmiyor',
          t: timing.title,
          desc: timing.description,
          sdt: timing.start_date_time,
          edt: timing.end_date_time,
          st: parseInt(timing.status, 10),
          totalTime: this.calculateTotalTime(timing.start_date_time, timing.end_date_time),
        }))

        this.totalItems = response.data.totalItems || this.timings.length
      } catch (error) {
        console.error('Zamanlayıcı verileri alınırken hata oluştu:', error)
      }
    },

    showAddTimingModal() {
      const addModal = new window.bootstrap.Modal(document.getElementById('addTimingModal'))
      this.fetchClientProjects()
      addModal.show()
    },

    async fetchClientProjects() {
      try {
        const response = await this.$axios.get('/client-projects/all', {
          params: {
            pn: 1,
            rpp: 100,
          },
        })

        if (response.data.r !== 0) {
          console.error('Projeler alınırken hata:', response.data.em)
          this.clientProjects = []
          return
        }

        const result = response.data.ro
        if (!result) {
          this.clientProjects = []
          return
        }

        this.clientProjects = result.map((project) => ({
          id: project.id,
          name: project.n,
        }))
      } catch (error) {
        console.error('Projeler alınırken hata oluştu:', error)
        this.clientProjects = []
      }
    },

    // Yeni zamanlayıcı ekle
    async addTiming() {
      try {
        const response = await this.$axios.post('/timings/create', {
          ...this.newTiming,
          suid: this.systemUserId,
        })

        console.log('Zamanlayıcı Ekleme Yanıtı:', response.data)

        if (response.data.r !== 0) {
          console.error('Zamanlayıcı eklenirken hata:', response.data.em)
          this.$toastr.error('Zamanlayıcı eklenemedi.', 'Hata')
          return
        }

        this.$toastr.success('Zamanlayıcı başarıyla eklendi!', 'Başarılı')
        this.fetchTimings()

        const modal = bootstrap.Modal.getInstance(document.getElementById('addTimingModal'))
        modal.hide()
        this.resetNewTiming()
      } catch (error) {
        console.error('Zamanlayıcı eklenirken hata oluştu:', error)
        this.$toastr.error('Bir hata oluştu.', 'Hata')
      }
    },
    // Zamanlayıcı düzenle
    async saveTimingChanges() {
      try {
        const response = await this.$axios.put(
          `/timings/update/${this.editTiming.id}`,
          this.editTiming,
        )

        if (response.data.r !== 0) {
          console.error('Zamanlayıcı güncellenirken hata:', response.data.em)
          this.$toastr.error('Zamanlayıcı güncellenemedi.', 'Hata')
          return
        }

        this.$toastr.success('Zamanlayıcı başarıyla güncellendi!', 'Başarılı')
        this.fetchTimings()

        const modal = new bootstrap.Modal.getInstance(document.getElementById('editTimingModal'))
        modal.hide()
        this.editTiming = {}
      } catch (error) {
        console.error('Zamanlayıcı güncellenirken hata oluştu:', error)
        this.$toastr.error('Bir hata oluştu.', 'Hata')
      }
    },

    // Zamanlayıcı sil
    async deleteTiming(id) {
      try {
        const response = await this.$axios.delete(`/timings/delete/${id}`)

        if (response.data.r !== 0) {
          console.error('Zamanlayıcı silinirken hata:', response.data.em)
          this.$toastr.error('Zamanlayıcı silinemedi.', 'Hata')
          return
        }

        this.$toastr.success('Zamanlayıcı başarıyla silindi!', 'Başarılı')
        this.fetchTimings()
      } catch (error) {
        console.error('Zamanlayıcı silinirken hata oluştu:', error)
        this.$toastr.error('Bir hata oluştu.', 'Hata')
      }
    },

    // Kullanıcı ID'sini al
    getSystemUserId() {
      this.systemUserId = sessionStorage.getItem('systemUserId')
      if (!this.systemUserId) {
        console.error('Kullanıcı ID bilgisi alınamadı.')
      }
    },

    // Sayfa değiştirme
    goToPage(page) {
      if (page < 1 || page > this.totalPages) return
      this.currentPage = page
      this.fetchTimings()
    },

    // Yeni zamanlayıcı verisini sıfırla
    resetNewTiming() {
      this.newTiming = {
        cpid: null,
        t: '',
        desc: '',
      }
    },

    // Toplam süreyi hesapla
    calculateTotalTime(start, end) {
      if (!start || !end) return '0 saat'
      const diffInMs = new Date(end) - new Date(start)
      const diffInHours = (diffInMs / (1000 * 60 * 60)).toFixed(1)
      return `${diffInHours} saat`
    },
  },
}
</script>

<style scoped>
.table {
  width: 100%;
  margin-top: 20px;
  background-color: #ffffff;
}

.table th {
  background-color: #f4f6f9;
  text-align: center;
}

.table td {
  text-align: center;
}

.timer-display {
  font-size: 1rem;
  margin-bottom: 10px;
}

.timer-controls {
  display: flex;
  gap: 5px;
  justify-content: center;
}

.btn-timer {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 1rem;
}

.btn-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem !important;
}

.btn-success {
  background-color: #28a745;
  color: #ffffff;
}

.btn-warning {
  background-color: #ffc107;
  color: #ffffff;
}

.btn-danger {
  background-color: #dc3545;
  color: #ffffff;
}

.filter-controls {
  display: flex;
  gap: 15px;
  flex-direction: row;
  margin-bottom: 20px;
}

.summary-text {
  font-size: 1rem;
  color: #555;
}

.pagination {
  margin: 0;
}

.pagination .page-item.active .page-link {
  background-color: #007bff;
  border-color: #007bff;
  color: white;
}

.btn-sm {
  padding: 5px 10px;
  font-size: 0.875rem;
}

.d-flex.align-items-center.gap-1 {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
