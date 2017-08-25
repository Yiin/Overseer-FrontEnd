<template>
    <div class="form form__auth">
        <h1>Registration Form</h1>
        <h3>Company Information</h3>
        <label>Company Name</label>
        <input type="text" name="company_name" v-model="form.company_name">
        <label>Company E-Mail</label>
        <input type="text" name="company_email" v-model="form.company_email">
        <h3>Your information</h3>
        <label>First Name</label>
        <input type="text" name="first_name" v-model="form.first_name">
        <label>Last Name</label>
        <input type="text" name="last_name" v-model="form.last_name">
        <label>E-Mail</label>
        <input type="text" name="email" v-model="form.email">
        <label>Password</label>
        <input type="password" name="password" v-model="form.password">
        <label>Repeat Password</label>
        <input type="password" name="password_confirmation" v-model="form.password_confirmation">
        <button @click="register">Register</button>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        form: {
          company_name: '',
          company_email: '',
          first_name: '',
          last_name: '',
          email: '',
          password: '',
          password_confirmation: ''
        }
      }
    },

    methods: {
      register() {
        const form = this.form
        this.$store.dispatch('register', form)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .form {
    width: 400px;
    background: $color-white;
    box-shadow: $box-shadow;
    margin: 0 auto;
    padding: 50px;
  }

  label {
    font-size: 12px;
    font-weight: $font-weight-semibold;
  }

  input {
    width: 100%;
    display: block;
    padding: 5px 10px;
    font-size: 16px;
    border: 1px solid lighten($color-main-dark, 50%);
    margin: 5px 0;
  }

  button {
    background: $color-main;
    color: $color-text-alt;
    border: none;
    padding: 10px 20px;
    margin-top: 15px;
    width: 100%;
  }
</style>