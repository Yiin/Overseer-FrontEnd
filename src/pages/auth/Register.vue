<template>
  <div>
    <div class="auth__input-area">
      <transition name="slow-cross-fade">

        <registration-account-details
          v-if="currentStep === 'ACCOUNT_DETAILS'"
        ></registration-account-details>

        <registration-site-address
          v-if="currentStep === 'SITE_ADDRESS'"
        ></registration-site-address>
      </transition>
    </div>
  </div>
</template>

<script>
import RegistrationAccountDetails from './AccountDetails.vue'
import RegistrationSiteAddress from './SiteAddress.vue'

export default {
  components: {
    RegistrationAccountDetails,
    RegistrationSiteAddress
  },

  computed: {
    currentStep() {
      return this.$store.state.auth.registration.steps[this.$store.state.auth.registration.step]
    },

    hasErrors() {
      let hasErrors = false

      for (let field in this.$store.state.auth.registration.fields) {
        if (this.$store.state.auth.registration.fields[field].errors.length) {
          hasErrors = true
          break
        }
      }
      return hasErrors
    }
  },

  mounted() {
    this.$store.commit('auth/registration/RESET_STATE')
  },

  methods: {
    nextStep() {
      // wait for all validation checks to complete
      if (this.$store.state.auth.registration.validationPromises.length) {
        Promise.all(this.$store.state.auth.registration.validationPromises).then(this.nextStep)
        return
      }
      // validation errors were found, do no proceed further
      if (this.hasErrors) {
        return
      }
      // validate all fields once again just to be sure everything's ok
      this.$store.dispatch('auth/registration/VALIDATE').then(() => {
        if (!this.hasErrors) {
          this.$store.commit('auth/registration/NEXT_STEP')
        }
      })
    },

    prevStep() {
      this.$store.commit('auth/registration/PREV_STEP')
    }
  }
}
</script>

<style lang="scss">
.registration-details {
    position: absolute;
    width: 100%;
}
</style>

<style lang="scss">
.application--light .input-group:not(.input-group--error) label {
  color: #373737;
}

.auth__title {
  font-size: 30px;
  font-weight: normal;
  letter-spacing: -1px;
  line-height: 125%;
  margin: 0 0 42px -3px;
}

.auth__input-area {
  position: absolute;
}

.form__input--auth {
  display: block;
  width: 300px;
  height: 50px;
  border-radius: 8px;
  border: 1px solid $color-oslo-gray;

  &:focus {
    outline: none;
  }

  &.form__input--username {
    margin-top: 53px;
  }

  &.form__input--password {
    margin-top: 19px;
  }
}
</style>