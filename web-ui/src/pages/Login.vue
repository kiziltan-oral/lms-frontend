<template>
  <div class="hold-transition login-page">
    <div class="login-box">
      <div class="login-logo">
        <a href="#"><b>LGY</b>tech</a>
      </div>
      <div class="card">
        <div class="card-body login-card-body">
          <p class="login-box-msg">Giriş Yapınız</p>

          <form @submit.prevent="handleLogin">
            <div class="input-group mb-3">
              <input
                type="email"
                class="form-control"
                placeholder="Email"
                v-model="email"
                required
              />
              <div class="input-group-append">
                <div class="input-group-text">
                  <span class="fas fa-envelope"></span>
                </div>
              </div>
            </div>
            <div class="input-group mb-3">
              <input
                type="password"
                class="form-control"
                placeholder="Password"
                v-model="password"
                required
              />
              <div class="input-group-append">
                <div class="input-group-text">
                  <span class="fas fa-lock"></span>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-8">
                <div class="icheck-primary">
                  <input type="checkbox" id="remember" />
                  <label for="remember">Beni Hatırla</label>
                </div>
              </div>
              <div class="col-4">
                <button type="submit" class="btn btn-primary btn-block">Giriş Yap</button>
              </div>
            </div>
          </form>

          <p class="mb-1">
            <a href="#">Şifremi Unuttum</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useSessionStore } from '@/stores/session'

export default {
  data() {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    async handleLogin() {
      try {
        const response = await this.$axios.post('/system-user/login', {
          e: this.email,
          p: this.password,
        })

        console.log('Login Response:', response.data)

        if (response.data.r !== 0) {
          this.$toastr.error(
            response.data.em || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.',
            'Hata',
          )
          return
        }

        const sessionStore = useSessionStore()
        sessionStore.startSession(response.data.ro)

        this.$toastr.success('Başarılı giriş yaptınız!', 'Başarılı')
        await this.$router.push({ name: 'Timings' })
      } catch (error) {
        console.error('Login Hatası:', error)
        this.$toastr.error('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.', 'Hata')
      }
    },
  },
}
</script>

<style>
/* AdminLTE'nin varsayılan stillerine bağlı */
</style>
