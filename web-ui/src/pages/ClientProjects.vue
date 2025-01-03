<template>
  <div>
    <h1>Projeler</h1>
    <button class="btn btn-primary" @click="showAddProjectModal">Proje Ekle</button>

    <!-- Projeler Tablosu -->
    <div class="table-responsive mt-4">
      <table class="table table-bordered table-striped">
        <thead>
          <tr>
            <th>No</th>
            <th>Müşteri Adı</th>
            <th>Proje Adı</th>
            <th>Durum</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="projects.length === 0">
            <td colspan="5" class="text-center">Gösterilecek veri bulunamadı</td>
          </tr>
          <tr v-for="(project, index) in projects" :key="project.id">
            <td>{{ index + 1 + (currentPage - 1) * pageSize }}</td>
            <td>{{ project.clientName }}</td>
            <td>{{ project.n }}</td>
            <td>
              <span :class="['badge', project.ia ? 'badge-success' : 'badge-danger']">
                {{ project.ia ? 'Aktif' : 'Pasif' }}
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
        <select v-model="pageSize" @change="fetchProjects">
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

  <!-- Proje Ekle Modal -->
  <div
    class="modal fade"
    id="addProjectModal"
    tabindex="-1"
    aria-labelledby="addProjectModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addProjectModalLabel">Yeni Proje Ekle</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addProject">
            <div class="mb-3">
              <label for="clientId" class="form-label">Müşteri Seçin</label>
              <select id="clientId" class="form-select" v-model="newProject.cid" required>
                <option v-for="client in clients" :value="client.id" :key="client.id">
                  {{ client.t }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label for="projectName" class="form-label">Proje Adı</label>
              <input
                type="text"
                id="projectName"
                class="form-control"
                v-model="newProject.n"
                required
              />
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
  name: 'ClientProjects',
  data() {
    return {
      projects: [],
      clients: [],
      newProject: {
        clientId: null,
        name: '',
        isActive: true,
      },
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.pageSize)
    },
  },
  async mounted() {
    try {
      await Promise.all([this.fetchClients(), this.fetchProjects()])
    } catch (error) {
      console.error('Veriler yüklenirken hata oluştu:', error)
    }
  },

  methods: {
    // Projeleri çek
    async fetchProjects() {
      try {
        const response = await this.$axios.get('/client-projects/all', {
          params: {
            pn: this.currentPage,
            rpp: this.pageSize,
          },
        })
        console.log('Backend Yanıtı:', response.data)

        if (response.data.r !== 0) {
          console.error('Projeler alınırken hata:', response.data.em)
          return
        }

        const result = response.data.ro
        if (!result) {
          this.projects = []
          this.totalItems = 0
          return
        }

        this.projects = result.map((project) => {
          const client = this.clients.find((client) => client.id === project.cid)
          return {
            id: project.id,
            cid: project.cid,
            n: project.n,
            ia: project.ia,
            clientName: client ? client.t : 'Bilinmiyor', // Müşteri adını doğrudan burada ata
          }
        })

        this.totalItems = response.data.totalItems || this.projects.length
      } catch (error) {
        console.error('Projeler alınırken hata oluştu:', error)
      }
    },

    getClientNameById(clientId) {
      const client = this.clients.find((client) => client.id === clientId)
      return client ? client.t : 'Bilinmiyor'
    },

    // Müşterileri çek
    async fetchClients() {
      try {
        const response = await this.$axios.get('/clients/all', {
          params: { pn: 1, rpp: 100 },
        })
        console.log('Müşteri Listesi:', response.data)

        if (response.data.r !== 0) {
          console.error('Müşteriler alınırken hata:', response.data.em)
          return
        }

        this.clients = response.data.ro.map((client) => ({
          id: client.id,
          st: client.st,
          t: client.t,
          nt: client.nt,
          ia: client.ia,
        }))
      } catch (error) {
        console.error('Müşteri verileri alınırken hata oluştu:', error)
      }
    },

    showAddProjectModal() {
      const modal = new bootstrap.Modal(document.getElementById('addProjectModal'))
      modal.show()
    },

    // Yeni proje ekle
    async addProject() {
      try {
        const response = await this.$axios.post('/client-projects/create', this.newProject)
        console.log('Proje Ekleme Yanıtı:', response.data)

        if (response.data.r !== 0) {
          this.$toastr.error('Proje eklenemedi.', 'Hata')
          return
        }

        this.$toastr.success('Proje başarıyla eklendi!', 'Başarılı')
        this.fetchProjects()
        const modal = bootstrap.Modal.getInstance(document.getElementById('addProjectModal'))
        modal.hide()
        this.newProject = { clientId: null, name: '', isActive: true }
      } catch (error) {
        console.error('Proje eklenirken hata oluştu:', error)
        this.$toastr.error('Bir hata oluştu.', 'Hata')
      }
    },

    goToPage(page) {
      if (page < 1 || page > this.totalPages) return
      this.currentPage = page
      this.fetchProjects()
    },
  },
}
</script>

<style scoped>
/* Tablo için temel stiller */
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
</style>
