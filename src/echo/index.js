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
        host: `${location.protocol}//${process.env.WS_SERVER}`,
        auth: {
          headers: {
            Authorization: 'Bearer ' + store.state.auth.accessToken
          }
        }
      })

      const { company, uuid } = store.state.auth.user

      const channel = this.echo.private(`user:${company}.${uuid}`)

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
