<template lang="pug">
  .lockscreen
    .lockscreen-col
      img(src='http://psd2allconversion.com/templates/themeforest/html/horizon/html/default/light-sidebar/images/avtar-1.jpg')

      h3
        small Logged In As
        | {{ user.full_name }}

      .lockscreen-form
        v-text-field(
          v-model='pin'
          type='password'
          maxlength='4'
          label='Enter your pin'
          :error-messages='errors'
          data-lpignore='true'
        )
        .button.button--create(@click='unlock') Unlock
        .signOutLink
          router-link(:to="{ name: 'logout' }") Sign out
</template>

<script>
export default {
  data() {
    return {
      pin: '',
      errors: []
    }
  },

  computed: {
    user() {
      return this.$store.state.auth.user
    }
  },

  methods: {
    unlock() {
      if (!this.pin) {
        return
      }
      this.$store.dispatch('auth/UNLOCK', {
        pin: this.pin
      })
      .then(() => {
        this.errors = []
      })
      .catch((response) => {
        const attempts = response.body.attempts
        const maxAttempts = response.body.max_attempts

        this.errors = [`Invalid PIN. ${attempts} / ${maxAttempts}`]
      })
      this.pin = ''
    }
  }
}
</script>

<style lang="scss">
.lockscreen {
  display: flex;
  justify-content: center;
  padding-top: 150px;

  img {
    border: 6px solid rgba(0,0,0,0.1);
    border-radius: 50%;
  }

  .button {
    margin-top: 25px;
  }

  .signOutLink {
    margin-top: 15px;
    font-weight: 600;
    line-height: 130%;
    text-transform: capitalize;
    &:hover, &:focus {
      color: $color-main;
    }
  }
}

.lockscreen-col {
  min-width: 220px;
  text-align: center;
}

.lockscreen h3 {
  margin-top: 20px;
  font-size: 25px;
  font-weight: 500;
  line-height: 1.1;
  color: #333;
}

.lockscreen h3 small {
  font-size: 13px;
  display: block;
  margin-bottom: 15px;
  font-weight: 400;
  line-height: 1;
  color: #777;
}

.lockscreen-form {
  margin: 0 auto;
  margin-top: 20px;
}

</style>