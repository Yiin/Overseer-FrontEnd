<template lang="pug">
  div
    .pageContent
      .profileContainer(
        ref='profileContainer'
      )
        .profileHeader

          //-
            Employee profile picture

          .profilePicture(
            :class='profilePictureClasses'
          )
            img(
              v-show='!editing'
              :src='profilePicture'
            )

            //-
              New picture upload overlay

            .profilePictureInput(v-if='canChangePicture' v-show='!editing')
              label(for='profile-image')
                .profilePictureInputDim
                  v-icon(x-large) camera_alt
              input(id='profile-image' type='file' accept="image/*" @change='changePicture')

            //-
              Uploaded picture cropping component

            vue-croppie(
              v-show='editing'
              ref='croppieRef'
              :viewport='{ width: 128, height: 128 }'
              :boundary='{ width: 250, height: 250 }'
              :enableResize='false'
            )

            template(v-if='editing')
              v-btn.button--save(@click='crop') Save
              .cancel-cropping(@click='cancelProfileImageCropping') Cancel

          .profileTitle {{ profile.getTitle() }}
          .profileSubtitle {{ profile.jobTitle }}
        hr

        //-
          Contact information

        .profileBlock
          .profileBlockTitle Contact Information

          //-
            Email Address

          .profileBlockEntry
            .profileBlockEntryTitle Email Address:
            .profileBlockEntryContent
              a(
                v-if='profile.email'
                :href='"mailto:" + profile.email'
                target='_blank'
              ) {{ profile.email }}
              template(v-else) -

          //-
            Phone number

          .profileBlockEntry
            .profileBlockEntryTitle Phone number:
            .profileBlockEntryContent
              a(
                v-if='profile.phone'
                :href='"tel:" + profile.phone' target='_blank'
              ) {{ profile.phone }}
              template(v-else) -

          //-
            Address

          .profileBlockEntry
            .profileBlockEntryTitle Address:
            .profileBlockEntryContent.
              West End 45th Street, San Francisco #[br]
              90123 California, US
        hr

        //-
          Custom information

        .profileBlock
          .profileBlockTitle Custom Information

          //-
            Social media

          .profileBlockEntry
            .profileBlockEntryTitle Facebook:
            .profileBlockEntryContent
              a(href='https://www.facebook.com/claudiamills' target='_blank') facebook.com/claudiamills

          //-
            Personal contact information

          .profileBlockEntry
            .profileBlockEntryTitle Personal Phone Number:
            .profileBlockEntryContent
              a(href='tel:+919533480564' target='_blank') +919533480564


      .tabsContainer(:style='tabsContainerStyles')
        tabs(inline)
          timeline(
            :profile='profile'
            :timeline-style='timelineStyles'
          )
          tab(title='Notes')
          tab(title='Events')
          tab(title='Tasks')
          tab(title='Mail')
          tab(title='Documents')
</template>

<script>
import Timeline from './tabs/Timeline.vue'

export default {
  components: {
    Timeline
  },

  props: {
    employee: {
      default: null
    },

    isVisible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      cropped: null,
      editing: false,
      showEmail: false,
      observer: null,
      columnsHeight: null
    }
  },

  computed: {
    profilePictureClasses() {
      return {
        'profilePicture--editing': this.editing
      }
    },

    tabsContainerStyles() {
      return {
        'min-height': this.columnsHeight && (this.columnsHeight + 'px')
      }
    },

    timelineStyles() {
      const timelineOffsetFromContainerTop = 143
      const targetHeight = this.columnsHeight && ((this.columnsHeight - timelineOffsetFromContainerTop) + 'px')

      return {
        'max-height': targetHeight,
        'min-height': targetHeight,
        'height': targetHeight
      }
    },

    who() {
      if (this.employee) {
        if (this.employee.isMe()) {
          return 'me'
        }
        return this.employee.uuid
      }
      if (this.$route.params.who === this.$user.uuid) {
        return 'me'
      }
      return this.$route.params.who || 'me'
    },

    profile() {
      if (this.who === 'me') {
        return this.$user.authenticable
      } else {
        return this.$store.getters[`documents/repositories/employee/FIND_ITEM_BY_KEY`](this.who)
      }
    },

    profilePicture() {
      return this.cropped ? URL.createObjectURL(this.cropped) : this.profile.getPicture()
    },

    canChangePicture() {
      if (!this.profile) {
        return false
      }
      return this.$authorization.accessController.canEditDocument(this.profile) || this.profile.isMe()
    }
  },

  watch: {
    cropped(image) {
      if (image) {
        const formData = new FormData()

        formData.append('picture', image)

        this.$api.post(`employees/${this.profile.uuid}/profile-picture`, formData)
      }
    },

    isVisible() {
      this.$nextTick(() => {
        this.columnsHeight = this.$refs.profileContainer.clientHeight
      })
      this.cancelProfileImageCropping()
    }
  },

  mounted() {
    /**
     * Watch profile container
     */
    this.observer = new MutationObserver(() => {
      this.columnsHeight = this.$refs.profileContainer.clientHeight
    })

    this.observer.observe(this.$refs.profileContainer, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true
    })
  },

  destroyed() {
    this.observer.disconnect()
  },

  methods: {
    changePicture(e) {
      if (e.target.files.length) {
        this.editing = true
        this.$nextTick(() => {
          this.$refs.croppieRef.bind({
            url: URL.createObjectURL(e.target.files[0])
          })
          this.$refs.croppieRef.get((data) => {
            console.log('get', data)
          })
        })
      } else {
        this.editing = false
      }
    },

    crop() {
      const options = {
        type: 'blob',
        size: {
          width: 250,
          height: 250
        }
      }

      this.$refs.croppieRef.result(options, (output) => {
        this.cropped = output
      })

      this.editing = false
    },

    cancelProfileImageCropping() {
      this.cropped = null
      this.editing = false
    }
  }
}
</script>

<style lang="scss" src="./styles/main.scss"></style>