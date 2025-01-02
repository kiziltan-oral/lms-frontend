<template>
    <div>
      <h1>Client Projects Page</h1>
      <p>Bu sayfada müşteri projeleri listesi görüntülenmektedir.</p>
  
      <!-- Tablo -->
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
            <tr v-for="(project, index) in projects" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ project.clientName }}</td>
              <td>{{ project.projectName }}</td>
              <td>
                <span
                  :class="['badge', project.status === 'Aktif' ? 'badge-success' : 'badge-danger']"
                >
                  {{ project.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "ClientProjects",
    data() {
      return {
        // Dummy veri
        projects: [
          {
            clientName: "ABC Şirketi",
            projectName: "Proje 1",
            status: "Aktif",
          },
          {
            clientName: "XYZ Şirketi",
            projectName: "Proje 2",
            status: "Pasif",
          },
          {
            clientName: "DEF Şirketi",
            projectName: "Proje 3",
            status: "Aktif",
          },
          {
            clientName: "GHI Şirketi",
            projectName: "Proje 4",
            status: "Pasif",
          },
          {
            clientName: "JKL Şirketi",
            projectName: "Proje 5",
            status: "Aktif",
          },
        ],
      };
    },
  };
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
  