<template>
  <div class="registration-details">
    <h1 class="auth__title">
      Enter your <span class="project-name">Account Details</span>
    </h1>
    <div class="inputs__group">
      <div class="input__column">

        <md-text-field
          label="Company Name"
          name="company_name"
          v-model="company_name"
          @change="validate('company_name')"
          :error-messages="validationErrors.company_name"
          data-lpignore="true"
          tabindex="1"
        ></md-text-field>

        <md-text-field
          label="First Name"
          name="first_name"
          v-model="first_name"
          @change="validate('first_name')"
          :error-messages="validationErrors.first_name"
          data-lpignore="true"
          tabindex="3"
        ></md-text-field>

        <md-text-field
          label="Password"
          type="password"
          v-model="password"
          @change="validate('password')"
          :error-messages="validationErrors.password"
          tabindex="5"
        ></md-text-field>

      </div>

      <div class="input__column">

        <md-text-field
          label="Email"
          name="email"
          v-model="email"
          @change="validate('email')"
          :error-messages="validationErrors.email"
          data-lpignore="true"
          tabindex="2"
        ></md-text-field>

        <md-text-field
          label="Last Name"
          name="last_name"
          v-model="last_name"
          @change="validate('last_name')"
          :error-messages="validationErrors.last_name"
          data-lpignore="true"
          tabindex="4"
        ></md-text-field>

        <md-text-field
          label="Confirm Pasword"
          v-model="password_confirmation"
          @input="validate('password')"
          type="password"
          tabindex="6"
        ></md-text-field>

      </div>
    </div>
  </div>
</template>

<script>
import MdTextField from './MdTextField.vue'

export default {
  components: {
    MdTextField
  },

  computed: {
    validationErrors() {
      let errors = {}

      for (let field in this.$store.state.auth.registration.fields) {
        errors[field] = this.$store.state.auth.registration.fields[field].errors
      }

      return errors
    },

    company_name: {
      get() { return this.$store.state.auth.registration.fields.company_name.value },
      set(value) { this.$store.commit('auth/registration/UPDATE_FIELD', { field: 'company_name', value }) }
    },

    email: {
      get() { return this.$store.state.auth.registration.fields.email.value },
      set(value) { this.$store.commit('auth/registration/UPDATE_FIELD', { field: 'email', value }) }
    },

    first_name: {
      get() { return this.$store.state.auth.registration.fields.first_name.value },
      set(value) { this.$store.commit('auth/registration/UPDATE_FIELD', { field: 'first_name', value }) }
    },

    last_name: {
      get() { return this.$store.state.auth.registration.fields.last_name.value },
      set(value) { this.$store.commit('auth/registration/UPDATE_FIELD', { field: 'last_name', value }) }
    },

    password: {
      get() { return this.$store.state.auth.registration.fields.password.value },
      set(value) { this.$store.commit('auth/registration/UPDATE_FIELD', { field: 'password', value }) }
    },

    password_confirmation: {
      get() { return this.$store.state.auth.registration.fields.password_confirmation.value },
      set(value) { this.$store.commit('auth/registration/UPDATE_FIELD', { field: 'password_confirmation', value }) }
    }
  },

  methods: {
    validate(field) {
      this.$nextTick(() => {
        this.$store.dispatch('auth/registration/VALIDATE_FIELD', field)
      })
    }
  }
}
</script>

<style>
.input__column .input-group__details {
    overflow: visible !important;
}
</style>

<style lang="scss">
.inputs__group {
    display: flex;
    justify-content: space-between;
}
.input__column {
    width: 100%;
}

.input__column + .input__column {
    margin-left: 92px;
}
</style>