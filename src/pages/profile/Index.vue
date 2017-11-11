<template lang="pug">
  div
    .pageContent
      .pageHeader
      .profileContainer
        .profileHeader
          .profilePicture
            img(src='http://psd2allconversion.com/templates/themeforest/html/horizon/html/default/light-sidebar/images/avtar-1.jpg')
          .profileTitle {{ user.full_name }}
          .profileSubtitle Product Manager @TechoCore
        hr
        .profileBlock
          .profileBlockTitle Contact Information
          .profileBlockEntry
            .profileBlockEntryTitle Email Address:
            .profileBlockEntryContent
              a(href='mailto:asd' target='_blank') {{ user.email }}
          .profileBlockEntry
            .profileBlockEntryTitle Phone number:
            .profileBlockEntryContent
              a(href='tel:+919533480564' target='_blank') +919533480564
          .profileBlockEntry
            .profileBlockEntryTitle Address:
            .profileBlockEntryContent.
              West End 45th Street, San Francisco #[br]
              90123 California, US
        hr
        .profileBlock
          .profileBlockTitle Custom Information
          .profileBlockEntry
            .profileBlockEntryTitle Facebook:
            .profileBlockEntryContent
              a(href='https://www.facebook.com/claudiamills' target='_blank') facebook.com/claudiamills
          .profileBlockEntry
            .profileBlockEntryTitle Personal Phone Number:
            .profileBlockEntryContent
              a(href='tel:+919533480564' target='_blank') +919533480564


      .tabsContainer
        tabs(inline)
          timeline(
            :user='user'
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

  computed: {
    who() {
      return this.$route.params.who || 'me'
    },

    user() {
      if (this.who === 'me') {
        return this.$store.state.auth.user
      } else {
        return {}
      }
    }
  },

  mounted() {
    console.log('Who: ', this.user)
  }
}
</script>

<style lang="scss" src="./styles/main.scss"></style>