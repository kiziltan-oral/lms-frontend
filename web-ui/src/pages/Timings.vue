<template>
  <div>
    <div class="text-center mb-5">
      <h1>Çalışma Süreleri</h1>
    </div>

    <!-- Filtreleme ve Arama -->
    <div class="filter-controls mb-3 d-flex gap-3">
      <div>
        <label for="filterStatus" class="form-label">Zamanlayıcı Durumuna Göre Filtrele:</label>
        <select id="filterStatus" class="form-select" v-model="filterStatus" @change="applyFilter">
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
          @input="applyFilter"
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
          <tr v-for="(item, index) in paginatedData" :key="index">
            <td>
              <div>
                <div class="timer-display">{{ item.timer }}</div>
                <div class="timer-controls">
                  <button
                    class="btn-timer"
                    :class="{ 'btn-success': item.status === 'play' }"
                    @click="startTimer(index + (currentPage - 1) * pageSize)"
                  >
                    <i class="fas fa-play"></i>
                  </button>
                  <button
                    class="btn-timer"
                    :class="{ 'btn-warning': item.status === 'pause' }"
                    @click="pauseTimer(index + (currentPage - 1) * pageSize)"
                  >
                    <i class="fas fa-pause"></i>
                  </button>
                  <button
                    class="btn-timer"
                    :class="{ 'btn-danger': item.status === 'stop' }"
                    @click="stopTimer(index + (currentPage - 1) * pageSize)"
                  >
                    <i class="fas fa-stop"></i>
                  </button>
                </div>
              </div>
            </td>
            <td>{{ item.projectName }}</td>
            <td>{{ item.title }}</td>
            <td>{{ item.description }}</td>
            <td>{{ formatDate(item.startDateTime) }}</td>
            <td>{{ formatDate(item.endDateTime) }}</td>
            <td>{{ item.totalTime }}</td>
            <td>
              <button
                class="btn-actions btn-warning btn-sm d-flex align-items-center gap-1"
                @click="openEditModal(item)"
              >
                <i class="fas fa-edit"></i> Güncelle
              </button>
              <button
                class="btn-actions btn-danger btn-sm d-flex align-items-center gap-1"
                @click="deleteItem(index + (currentPage - 1) * pageSize)"
              >
                <i class="fas fa-trash"></i> Sil
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="d-flex justify-content-between align-items-center mt-3">
      <div class="d-flex align-items-center gap-3">
        <label for="pageSize" class="form-label">Sayfa Boyutu:</label>
        <select
          id="pageSize"
          class="form-select"
          v-model.number="pageSize"
          @change="applyPagination"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <div class="summary-text">
          Gösterilen: <strong>{{ startItem }}</strong> - <strong>{{ endItem }}</strong> / Toplam:
          <strong>{{ filteredData.length }}</strong>
        </div>
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

    <!-- Edit Modal -->
    <div
      class="modal fade"
      id="editModal"
      tabindex="-1"
      aria-labelledby="editModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editModalLabel">Kayıt Güncelle</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveChanges">
              <div class="mb-3">
                <label for="editTitle" class="form-label">Başlık</label>
                <input
                  type="text"
                  id="editTitle"
                  class="form-control"
                  v-model="editItem.title"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="editDescription" class="form-label">Açıklama</label>
                <textarea
                  id="editDescription"
                  class="form-control"
                  v-model="editItem.description"
                  rows="3"
                  required
                ></textarea>
              </div>
              <button type="submit" class="btn btn-success">Kaydet</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as bootstrap from 'bootstrap'
window.bootstrap = bootstrap

export default {
  name: 'Timings',
  data() {
    return {
      data: [
        {
          projectName: 'Proje 1',
          title: 'Analiz Toplantısı',
          description: 'Detaylı analiz çalışması',
          startDateTime: null,
          endDateTime: null,
          totalTime: '0 saat',
          timer: '00:00:00',
          status: 'stop',
          interval: null,
        },
        {
          projectName: 'Proje 2',
          title: 'Kod Gözden Geçirme',
          description: 'Kod inceleme süreci',
          startDateTime: null,
          endDateTime: null,
          totalTime: '0 saat',
          timer: '00:00:00',
          status: 'stop',
          interval: null,
        },
        {
          projectName: 'Proje 3',
          title: 'Sonuç Değerlendirme',
          description: 'Sonuç raporu oluşturma',
          startDateTime: null,
          endDateTime: null,
          totalTime: '0 saat',
          timer: '00:00:00',
          status: 'stop',
          interval: null,
        },
      ],
      filterStatus: 'all',
      searchQuery: '',
      filteredData: [],
      currentPage: 1,
      pageSize: 10,
      paginatedData: [],
      editItem: {},
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredData.length / this.pageSize)
    },
    startItem() {
      return (this.currentPage - 1) * this.pageSize + 1
    },
    endItem() {
      return Math.min(this.currentPage * this.pageSize, this.filteredData.length)
    },
  },
  mounted() {
    this.applyFilter()
  },
  methods: {
    formatDate(date) {
      if (!date) return '-'
      const d = new Date(date)
      return d.toLocaleString()
    },
    calculateTotalTime(start, end) {
      if (!start || !end) return '0 saat'
      const diffInMs = new Date(end) - new Date(start)
      const diffInHours = (diffInMs / (1000 * 60 * 60)).toFixed(1)
      return `${diffInHours} saat`
    },
    startTimer(index) {
      const item = this.data[index]
      if (item.interval) return

      // Set startDateTime if it's null (only first play)
      if (!item.startDateTime) {
        item.startDateTime = new Date()
      }

      item.status = 'play'

      let [hours, minutes, seconds] = item.timer.split(':').map(Number)
      item.interval = setInterval(() => {
        seconds++
        if (seconds === 60) {
          seconds = 0
          minutes++
        }
        if (minutes === 60) {
          minutes = 0
          hours++
        }
        item.timer = `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      }, 1000)

      this.applyFilter()
    },
    pauseTimer(index) {
      const item = this.data[index]
      clearInterval(item.interval)
      item.interval = null
      item.status = 'pause'
      this.applyFilter()
    },
    stopTimer(index) {
      const item = this.data[index]
      clearInterval(item.interval)
      item.interval = null
      item.endDateTime = new Date()
      item.status = 'stop'
      item.totalTime = this.calculateTotalTime(item.startDateTime, item.endDateTime)
      item.timer = '00:00:00'
      this.applyFilter()
    },
    applyFilter() {
      let result = this.data

      if (this.filterStatus !== 'all') {
        result = result.filter((item) => item.status === this.filterStatus)
      }

      if (this.searchQuery.trim()) {
        const query = this.searchQuery.trim().toLowerCase()
        result = result.filter(
          (item) =>
            item.projectName.toLowerCase().includes(query) ||
            item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query),
        )
      }

      this.filteredData = result
      this.applyPagination()
    },
    applyPagination() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      this.paginatedData = this.filteredData.slice(start, end)
    },
    goToPage(page) {
      if (page < 1 || page > this.totalPages) return
      this.currentPage = page
      this.applyPagination()
    },
    openEditModal(item) {
      this.editItem = { ...item } // Düzenlenecek öğeyi ayarla
      this.$nextTick(() => {
        // Vue.js'in DOM'u güncellemesini bekle
        const modalElement = document.getElementById('editModal')
        if (modalElement) {
          const modal = new window.bootstrap.Modal(modalElement)
          modal.show()
        } else {
          console.error('Modal element not found.')
        }
      })
    },
    saveChanges() {
      const index = this.data.findIndex((i) => i.projectName === this.editItem.projectName)
      if (index !== -1) {
        this.$set(this.data, index, { ...this.editItem })
        this.applyFilter()
        const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'))
        modal.hide()
      }
    },
    deleteItem(index) {
      this.data.splice(index, 1)
      this.applyFilter()
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
