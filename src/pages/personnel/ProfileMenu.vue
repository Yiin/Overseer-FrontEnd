<template lang="pug">
  v-menu(
    v-model='isOpen'
    @mouseover.native='open'
    @mouseout.native='shouldNotOpen'
    :close-on-content-click='false'
    content-class='profile-menu'
    min-width='250px'
    right
  )
    //-
      Profile picture thumbnail

    .profile-picture-thumbnail(slot='activator')
      img(:src='profilePicture')

        //-
          New picture upload overlay

      .profile-picture__input(v-if='canChangePicture')
        label(:for='imageInputID')
          div.profile-picture__input-dim
            v-icon camera_alt
        input(:id='imageInputID' type='file' accept="image/*" @change='changePicture')

    v-card(
      v-clickaway='handleClickaway'
    )

      //-
        Employees profile picture

      v-card-media(
        v-show='!editing'
        :src='profilePicture'
        height='200px'
      )

      vue-croppie(
        v-show='editing'
        ref='croppieRef'
        :viewport="{ width: 250, height: 250 }"
        :enableResize='false'
      )

      //-
        List of actions

      v-list(two-line class='md-list')

        //-
          Image crop actions

        template(v-if='editing')

          //-
            Save image

          v-list-tile(@click='crop')
            v-list-tile-action
              v-icon(color='indigo') save
            v-list-tile-content
              v-list-tile-title Save picture
              v-list-tile-sub-title Picture will be cropped and saved

        //-
          Other actions

        template(v-else)

          //-
            View employees profile page

          v-list-tile(@click='view')
            v-list-tile-action
              v-icon(color='indigo') person
            v-list-tile-content
              v-list-tile-title View Profile
              v-list-tile-sub-title @{{ employee.firstName.toLowerCase() }}
</template>

<script>
import S from 'string'
import Employee from '@models/employee'
import { editDocument } from '@/modules/documents/actions'
import { EventBus } from '@/events'

export default {
  props: {
    employee: {
      type: Employee,
      required: true
    }
  },

  data() {
    return {
      isOpen: false,
      shouldOpen: false,
      cropped: null,
      editing: false
    }
  },

  computed: {
    imageInputID() {
      return `image-input--${this.employee.uuid}`
    },

    canChangePicture() {
      return this.$authorization.accessController.canEditDocument(this.employee) || this.employee.isMe()
    },

    profilePicture() {
      return this.cropped ? URL.createObjectURL(this.cropped) : this.employee.getPicture()
    }
  },

  watch: {
    cropped(image) {
      if (image) {
        const formData = new FormData()

        formData.append('picture', image)

        this.$api.post(`employees/${this.employee.uuid}/profile-picture`, formData)
      }
    },

    isOpen(isOpen) {
      if (isOpen) {
        EventBus.$emit('profile-menu.closeAllBut', this)
      } else {
        this.editing = false
      }
    }
  },

  mounted() {
    EventBus.$on('profile-menu.closeAllBut', this.handleCloseAllBut)
  },

  destroyed() {
    EventBus.$off('profile-menu.closeAllBut', this.handleCloseAllBut)
  },

  methods: {
    view() {
      this.$router.push({
        name: 'profile',
        params: {
          who: this.employee.uuid,
          slug: S(this.employee.getTitle()).slugify().s
        }
      })
    },

    edit() {
      editDocument(this.employee, 'employee')
    },

    open() {
      this.shouldOpen = true

      setTimeout(() => {
        if (this.shouldOpen) {
          this.isOpen = true
        }
      }, 250)
    },

    shouldNotOpen() {
      this.shouldOpen = false
    },

    changePicture(e) {
      if (e.target.files.length) {
        this.editing = true
        this.$refs.croppieRef.bind({
          url: URL.createObjectURL(e.target.files[0])
        })
      } else {
        this.editing = false
      }
    },

    crop() {
      const options = {
        type: 'blob'
      }

      this.$refs.croppieRef.result(options, (output) => {
        this.cropped = output
      })

      this.editing = false
    },

    handleCloseAllBut(component) {
      if (component !== this) {
        this.close()
      }
    },

    handleClickaway(e) {
      if (!this.$el.contains(e.target)) {
        this.close()
      }
    },

    close() {
      this.isOpen = false
    }
  }
}
</script>

<style lang="scss" scoped>
.profile-picture-thumbnail {
  position: relative;
  margin-right: 15px;
  img {
    height: 35px;
    width: 35px;
    border-radius: 100%;
    transition: opacity 0.2s;
  }
  &:hover {
    img {
      opacity: 0;
    }
  }
}

.profile-picture__input {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  border-radius: 100%;
  overflow: hidden;
}

.profile-picture__input-dim {
  opacity: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  transition: opacity 0.2s;

  .icon {
    transform: scale(0.9);
    opacity: 0.9;
    image-rendering: pixelated;
    margin-left: -1px;
    margin-top: 1px;
    color: #373737;
  }
}

.profile-picture__input-dim:hover {
  opacity: 1;
  background: #e4e4e4;
}

.profile-picture__input input {
    display: none;
}
</style>

<style lang="scss">
.profile-menu {
  transform: translate(54px, -20px);

  .list--two-line .list__tile {
    height: 66px;
  }
}

.card {
  .modal-icon {
    position: absolute;
    right: 0;
  }
}
.modal-icon--white i::before {
  color: #ffffff;
}
</style>