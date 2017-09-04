import Echo from 'laravel-echo'
import store from '@/store'

export default {
  listeners: [],

  listen(event, listener) {
    this.listeners.push({
      event,
      fn: listener
    })
  },

  socketId() {
    if (this.echo) {
      return this.echo.socketId()
    }
    return null
  },

  connect() {
    if (this.echo) {
      this.disconnect()
    }

    if (store.state.auth.accessToken) {
      this.echo = new Echo({
        broadcaster: 'socket.io',
        host: `${window.location.hostname}:6001`,
        auth: {
          headers: {
            Authorization: 'Bearer ' + store.state.auth.accessToken
          }
        }
      })

      const { company, key } = store.state.user

      const channel = this.echo.private(`main:${company}.${key}`)

      this.listeners.forEach((listener) => {
        channel.listen(listener.event, listener.fn)
      })
    }
  },

  disconnect() {
    if (this.echo) {
      this.echo.disconnect()
    }
  }
}
