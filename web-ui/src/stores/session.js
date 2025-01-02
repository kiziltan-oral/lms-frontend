import { defineStore } from 'pinia'

export const useSessionStore = defineStore('session', {
  state: () => ({
    token: sessionStorage.getItem('token') || null,
  }),
  actions: {
    startSession(token) {
      this.token = token
      sessionStorage.setItem('token', token)
    },
    endSession() {
      this.token = null
      sessionStorage.removeItem('token')
    },
    sessionExists() {
      return this.token !== null
    },
  },
})
