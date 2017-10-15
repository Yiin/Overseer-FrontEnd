<template>
  <div>
    <div class="auth__input-area">
      <h1 class="auth__title">
        Welcome to <span class="project-name">Overseer,</span><br>
        please sign in
      </h1>

      <div class="auth__input-fields">
        <md-input-container :class="{ 'md-input-invalid': errorMessages.username.length }">
          <label>Email</label>
          <md-input v-model="username"></md-input>

          <span v-for="error in errorMessages.username" class="md-error">
            {{ error }}
          </span>
        </md-input-container>

        <md-input-container :class="{ 'md-input-invalid': errorMessages.password.length }">
          <label>Password</label>
          <md-input type="password" v-model="password"></md-input>

          <span v-for="error in errorMessages.password" class="md-error">
            {{ error }}
          </span>
        </md-input-container>
      </div>
    </div>
  </div>
</template>

<script>
import {
  VTextField
} from 'vuetify'

export default {
  components: {
    VTextField
  },

  computed: {
    errorMessages() {
      return this.$store.state.auth.login.validationErrors
    },

    username: {
      get() { return this.$store.state.auth.login.fields.username },
      set(value) {
        return this.$store.commit('auth/login/UPDATE_FIELD', {
          field: 'username',
          value
        })
      }
    },
    password: {
      get() { return this.$store.state.auth.login.fields.password },
      set(value) {
        return this.$store.commit('auth/login/UPDATE_FIELD', {
          field: 'password',
          value
        })
      }
    }
  },

  mounted() {
    this.$store.commit('auth/login/SET_ERRORS', {
      username: [],
      password: []
    })
  }
}
</script>

<style lang="scss">
.auth__title {
  font-size: 30px;
  font-weight: normal;
  letter-spacing: -1px;
  line-height: 125%;
  margin: 0;
}

.auth__input-area {
  position: absolute;
}

.auth__input-fields {
    width: 274px;
    margin-top: 63px;
    margin-left: 4px;
    overflow: hidden;
}
</style>