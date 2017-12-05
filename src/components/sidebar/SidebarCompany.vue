<template lang="pug">
  .company(:class='companyClasses')
    .companyLogo(:class='companyLogoClasses')
      .companyLogoContent
    .companyInfo
      .companyName {{ companyName }}
</template>

<script>
export default {
  props: {
    company: {
      type: Object
    },
    newCompany: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    companyName() {
      if (this.newCompany) {
        return 'New Company'
      } else {
        return this.company.name
      }
    },

    companyClasses() {
      return {
        'company--newCompany': this.newCompany
      }
    },

    companyLogoClasses() {
      return {
        'companyLogo--none': !this.newCompany
      }
    }
  }
}
</script>