<template>
  <v-snackbar
    :timeout="timeout"
    :color="color"
    v-model="isVisible"
    bottom
    left
  >
    {{ message }}
    <template v-if="action">
      <v-btn @click="dispatchAction" flat class="btn--action">
        {{ actionText }}
      </v-btn>
    </template>
    <div class="btn--close-snack" @click="$store.dispatch('notification/CLOSE')"></div>
  </v-snackbar>
</template>

<script>
import {
  VSnackbar,
  VBtn,
  VIcon
} from 'vuetify'

export default {
  components: {
    VSnackbar,
    VBtn,
    VIcon
  },

  computed: {
    state() {
      return this.$store.state.notification
    },

    options() {
      return this.state.options
    },

    action() {
      return this.options.action
    },

    actionText() {
      return this.options.actionText
    },

    timeout() {
      return this.options.timeout
    },

    color() {
      return this.options.color
    },

    message() {
      return this.options.message
    },

    isVisible: {
      set(isVisible) {
        if (isVisible) {
          this.$store.dispatch('notification/SHOW')
        } else {
          this.$store.dispatch('notification/CLOSE')
        }
      },
      get() {
        return this.state.isVisible
      }
    }
  },

  methods: {
    dispatchAction() {
      this.action()
      this.$store.dispatch('notification/CLOSE')
    }
  }
}
</script>

<style lang="scss">
.snack {
  background-color: #323232 !important;
}

.snack__content {
  line-height: initial;
  min-width: 245px;

  .btn {
    background-color: transparent !important;
    min-width: auto !important;
    margin: 6px 8px;
    box-shadow: none;
  }

  .btn--action {
    color: #a1c2fa !important;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 14px;
  }

  .btn--close-snack {
    width: 36px;
    height: 36px;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 12px;
      right: 12px;

      width: 12px;
      height: 12px;

      cursor: pointer;

      background: url(../../assets/icons/cross-white.svg) center center no-repeat;
      background-size: contain;

      filter: opacity(.8);
    }
    &:hover {
      .snack__content {
        background-color: transparent !important;
      }
    }
  }
}
</style>