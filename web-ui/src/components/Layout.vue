<template>
  <div class="wrapper">
    <!-- Navbar -->
    <nav class="main-header navbar navbar-expand navbar-white navbar-light">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" data-widget="pushmenu" href="#" role="button">
            <i class="fas fa-bars"></i>
          </a>
        </li>
      </ul>
    </nav>

    <!-- Main Sidebar Container -->
    <aside class="main-sidebar sidebar-dark-primary elevation-4">
      <!-- Brand Logo -->
      <a href="#" class="brand-link">
        <span class="brand-text font-weight-light">LGYtech</span>
      </a>

      <!-- Sidebar -->
      <div class="sidebar">
        <!-- Sidebar Menu -->
        <nav class="mt-2">
          <ul
            class="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            <!-- Sidebar Menü Öğeleri -->
            <li class="nav-item">
              <RouterLink to="/timings" class="nav-link">
                <i class="nav-icon fas fa-clock"></i>
                <span class="menu-text m-4">Çalışılan Süreler</span>
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/clients" class="nav-link">
                <i class="nav-icon fas fa-dog"></i>
                <span class="menu-text m-4">Müşteriler</span>
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/clientProjects" class="nav-link">
                <i class="nav-icon fas fa-book"></i>
                <span class="menu-text m-4">Projeler</span>
              </RouterLink>
            </li>
          </ul>
        </nav>
        <!-- /.sidebar-menu -->
      </div>
      <!-- /.sidebar -->
    </aside>

    <!-- Content Wrapper -->
    <div class="content-wrapper">
      <section class="content">
        <div class="container-fluid">
          <RouterView />
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Layout',
}
</script>

<style scoped>
.wrapper {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.main-sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 250px;
  background-color: #343a40;
  z-index: 1000;
}

.brand-link {
  text-align: center;
  color: #ffffff;
  font-size: 1.25rem;
  line-height: 1.75;
  background-color: #343a40;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content-wrapper {
  margin-left: 0 !important;
  flex: 1;
  padding: 20px;
  background-color: #f4f6f9;
  overflow-y: auto;
}

.nav-link {
  color: #c2c7d0;
}

.nav-link:hover {
  background-color: #1e282c;
  color: #ffffff;
}
</style>
