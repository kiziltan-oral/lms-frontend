import { defineStore } from 'pinia'

export const useSessionStore = defineStore('session', {
  state: () => ({
    token: sessionStorage.getItem('token') || null,
    systemUserId: sessionStorage.getItem('systemUserId') || null,
  }),
  actions: {
    startSession(token, userId) {
      this.token = token
      this.systemUserId = userId
      sessionStorage.setItem('token', token)
      sessionStorage.setItem('systemUserId', userId)
    },
    endSession() {
      this.token = null
      this.systemUserId = null
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('systemUserId')
    },
    sessionExists() {
      return this.token !== null
    },
  },
})
