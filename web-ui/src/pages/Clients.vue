<template>
  <div>
    <h1>Clients Page</h1>
    <p>Bu sayfada müşteri listesi görüntülenmektedir.</p>

    <!-- Tablo -->
    <div class="table-responsive mt-4">
      <table class="table table-bordered table-striped">
        <thead>
          <tr>
            <th>No</th>
            <th>Müşteri Adı</th>
            <th>Notlar</th>
            <th>Durum</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(client, index) in clients" :key="index">
            <td>{{ index + 1 + (currentPage - 1) * pageSize }}</td>
            <td>{{ client.name }}</td>
            <td>{{ client.notes }}</td>
            <td>
              <span
                :class="['badge', client.status === 'Aktif' ? 'badge-success' : 'badge-danger']"
              >
                {{ client.status }}
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
</template>

<script>
export default {
  name: 'Clients',
  data() {
    return {
      clients: [],
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
  mounted() {
    this.fetchClients()
  },
  methods: {
    async fetchClients() {
      try {
        const response = await this.$axios.post('/clients/all', {
          pn: this.currentPage, // Sayfa numarası
          rpp: this.pageSize, // Sayfa başına kayıt
        })

        // Gelen verileri kaydet
        this.clients = response.data.clients // Backend `clients` key'ini döndürmeli
        this.totalItems = response.data.totalItems // Backend toplam kayıt sayısını döndürmeli
      } catch (error) {
        console.error('Müşteri verileri alınırken hata oluştu:', error)
      }
    },
    goToPage(page) {
      if (page < 1 || page > this.totalPages) return
      this.currentPage = page
      this.fetchClients()
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
