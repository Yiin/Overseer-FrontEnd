<template>
    <div class="form form__auth">
        <h1>Login</h1>
        <label>Site adress</label>
        <input type="text" v-model="site_address">
        <label>Username</label>
        <input type="text" v-model="username">
        <label>Password</label>
        <input type="password" v-model="password">
        <button @click="login">Login</button>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        site_address: '',
        username: '',
        password: ''
      }
    },

    methods: {
      login() {
        const { site_address, username, password } = this
        this.$store.dispatch('LOGIN', { site_address, username, password })
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
    padding: 50px 50px 100px;
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
    width: 100%;
  }
</style>