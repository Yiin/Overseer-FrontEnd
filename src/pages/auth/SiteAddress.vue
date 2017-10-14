<template>
  <div class="registration-details">
    <h1 class="auth__title">
      Name your <span class="project-name">Site Address</span>
    </h1>
    <div class="site-address-input">
      <input ref="input" type="text" placeholder="workspace" v-model="site_address">
      <label><span class="dot">.</span>overseer<span class="dot">.</span>io</label>
      <label v-if="$store.state.auth.registration.fields.site_address.errors.length" class="error">
        {{ $store.state.auth.registration.fields.site_address.errors[0] }}
      </label>
    </div>
    <div class="site-address-explanation">
      This custom link to your workspace can be shared with employees and customers.
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
    site_address: {
      get() { return this.$store.state.auth.registration.fields.site_address.value },
      set(value) {
        this.$store.commit('auth/registration/UPDATE_FIELD', {
          field: 'site_address',
          value
        })
      }
    }
  },

  mounted() {
    this.$refs.input.focus()
  }
}
</script>

<style lang="scss">
.site-address-input {
  margin: 89px 0 0 52px;
  font-size: 59px;
  display: flex;
  font-weight: 100;
}

.site-address-input {
    font-size: 59px;
    display: flex;
    font-weight: 100;
}

.site-address-input input {
    width: 334px;
    text-align: right;
    line-height: 0;
    padding-right: 15px;
    margin-top: -15px;

    &::-webkit-input-placeholder { /* Chrome/Opera/Safari */
      color: #daddf1;
    }
    &::-moz-placeholder { /* Firefox 19+ */
      color: #daddf1;
    }
    &:-ms-input-placeholder { /* IE 10+ */
      color: #daddf1;
    }
    &:-moz-placeholder { /* Firefox 18- */
      color: #daddf1;
    }
}

.site-address-input {
  .dot {
    margin-left: -6px;
    padding-right: 9px;
  }
  .dot + .dot {
    padding-right: 7px;
    margin-left: 2px;
  }
  label {
      height: 133px;
      padding-top: 36px;
  }
}

.site-address-input input:focus {
    outline: none;
}

.site-address-explanation {
    width: 330px;
    position: absolute;
    height: 141px;
    bottom: -235px;
    right: 0;
    line-height: 1.4;
    font-weight: 600;
    letter-spacing: normal;
    background: url(../../assets/icons/exclamation-mark.svg) no-repeat;
    background-size: 7px 37px;
    background-position-y: 7px;
    padding-left: 22px;
    padding-top: 6px;
    color: #373737;
}
</style>