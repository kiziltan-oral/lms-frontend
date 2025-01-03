<template>
  <div>
    <h1>Müşteriler</h1>
    <button class="btn btn-primary" @click="showAddClientModal">Müşteri Ekle</button>

    <!-- Tablo -->
    <div class="table-responsive mt-4">
      <table class="table table-bordered table-striped">
        <thead>
          <tr>
            <th>No</th>
            <th>Kısa Başlık</th>
            <th>Müşteri Adı</th>
            <th>Notlar</th>
            <th>Durum</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="clients.length === 0">
            <td colspan="6" class="text-center">Gösterilecek veri bulunamadı</td>
          </tr>
          <tr v-for="(client, index) in clients" :key="client.id">
            <td>{{ index + 1 + (currentPage - 1) * pageSize }}</td>
            <td>{{ client.st }}</td>
            <td>{{ client.t }}</td>
            <td>{{ client.nt }}</td>
            <td>
              <span :class="['badge', client.ia ? 'badge-success' : 'badge-danger']">
                {{ client.ia ? 'Aktif' : 'Pasif' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="d-flex justify-content-between align-items-center mt-3">
      <div>
        Sayfa Boyutu:
        <select v-model="pageSize" @change="fetchClients">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
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
  </div>
  <!-- Müşteri Ekle Modal -->
  <div
    class="modal fade"
    id="addClientModal"
    tabindex="-1"
    aria-labelledby="addClientModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addClientModalLabel">Yeni Müşteri Ekle</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addClient">
            <div class="mb-3">
              <label for="shortTitle" class="form-label">Kısa Başlık</label>
              <input
                type="text"
                id="shortTitle"
                class="form-control"
                v-model="newClient.st"
                required
              />
            </div>
            <div class="mb-3">
              <label for="title" class="form-label">Başlık</label>
              <input type="text" id="title" class="form-control" v-model="newClient.t" required />
            </div>
            <div class="mb-3">
              <label for="notes" class="form-label">Notlar</label>
              <textarea id="notes" class="form-control" v-model="newClient.nt"></textarea>
            </div>
            <div class="mb-3">
              <label for="isActive" class="form-label">Durum</label>
              <select id="isActive" class="form-select" v-model="newClient.ia">
                <option :value="true">Aktif</option>
                <option :value="false">Pasif</option>
              </select>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Kapat</button>
              <button type="submit" class="btn btn-primary">Kaydet</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Clients',
  data() {
    return {
      clients: [], // Müşteri listesi
      currentPage: 1, // Mevcut sayfa
      pageSize: 10, // Sayfa başına kayıt sayısı
      totalItems: 0, // Toplam müşteri sayısı
      newClient: {
        st: '', // ShortTitle (Kısa Başlık)
        t: '', // Title (Başlık)
        nt: '', // Notes (Notlar)
        ia: true, // IsActive (Durum)
      },
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.pageSize)
    },
  },
  mounted() {
    this.fetchClients()
  },
  methods: {
    // Müşteri listesi çekme
    async fetchClients() {
      try {
        const response = await this.$axios.get('/clients/all', {
          params: {
            pn: parseInt(this.currentPage, 10),
            rpp: parseInt(this.pageSize, 10),
            so: [],
            flt: '',
            src: '',
            srcf: [],
          },
        })

        if (response.data.r !== 0) {
          console.error('Veri alırken hata:', response.data.em)
          return
        }

        const result = response.data.ro
        if (!result) {
          this.clients = []
          this.totalItems = 0
          return
        }

        this.clients = result.map((client) => ({
          id: client.id,
          st: client.st,
          t: client.t,
          nt: client.nt,
          ia: client.ia,
        }))
        this.totalItems = this.clients.length
      } catch (error) {
        console.error('Müşteri verileri alınırken hata oluştu:', error)
      }
    },

    // Modal'ı açma
    showAddClientModal() {
      const modal = new bootstrap.Modal(document.getElementById('addClientModal'))
      modal.show()
    },

    // Yeni müşteri ekleme
    async addClient() {
      try {
        const response = await this.$axios.post('/clients/create', this.newClient)

        if (response.data.r !== 0) {
          console.error('Müşteri eklenirken hata:', response.data.em)
          this.$toastr.error('Müşteri eklenemedi.', 'Hata')
          return
        }

        this.$toastr.success('Müşteri başarıyla eklendi!', 'Başarılı')

        // Yeni müşteri eklendikten sonra tabloyu güncelle
        this.fetchClients()

        // Modal'ı kapat
        const modal = bootstrap.Modal.getInstance(document.getElementById('addClientModal'))
        modal.hide()

        // Modal içindeki verileri temizle
        this.newClient = {
          st: '',
          t: '',
          nt: '',
          ia: true,
        }
      } catch (error) {
        console.error('Müşteri eklenirken hata oluştu:', error)
        this.$toastr.error('Bir hata oluştu. Lütfen tekrar deneyin.', 'Hata')
      }
    },
  },
}
</script>

<style scoped>
.table {
  width: 100%;
  background-color: #ffffff;
}

.table th {
  background-color: #f4f6f9;
  text-align: center;
}

.table td {
  text-align: center;
}

.badge-success {
  background-color: #28a745;
  color: #ffffff;
}

.badge-danger {
  background-color: #dc3545;
  color: #ffffff;
}

.pagination {
  margin: 0;
}
</style>
