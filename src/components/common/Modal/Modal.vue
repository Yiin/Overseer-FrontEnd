<template>
  <transition name="fade">
    <div v-show="isOpen" class="background-dim">
      <transition name="move">
        <div v-show="isOpen" v-clickaway="closeOrHide" class="modal-background">
          <div class="modal__title">
            {{ $t(title) }}
          </div>
          <div class="modal__controls">
            <div class="modal-icon modal-icon__hide" @click="hide"></div>
            <div class="modal-icon modal-icon__full"></div>
            <div class="modal-icon modal-icon__close" @click="close"></div>
          </div>
          <div class="modal__body">
            <component :is="component" :data="data.data" @cancel="close"></component>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'modal',

  data() {
    return {
      hasChanges: false
    }
  },

  computed: {
    isOpen() {
      return this.$store.state.modal.isOpen
    },

    data() {
      return this.$store.state.modal.data
    },

    title() {
      return this.data.title
    },

    component() {
      return this.data.component
    }
  },

  methods: {
    hide() {
      this.$store.dispatch('HIDE_MODAL')
    },

    close() {
      this.$store.dispatch('CLOSE_MODAL')
    },

    closeOrHide() {
      if (this.hasChanges) {
        this.hide()
      } else {
        this.close()
      }
    }
  }
}
</script>

<style lang="scss" src="@/styles/modal.scss"></style>

<style lang="scss">
.move-enter {
  transform: translate(-50%, 600px) !important;
}

.move-enter-active {
  transition: all 0.4s;
}

.move-enter-to {
  transform: translate(-50%, 0) !important;
}

.move-leave {
  transform: translate(-50%, 0) !important;
}

.move-leave-active {
  transition: all 0.4s;
}

.move-leave-to {
  transform: translate(-50%, 600px) !important;
}
</style>