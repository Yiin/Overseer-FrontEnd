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
              :class='{ changeable: canChangePicture }'
            )

            //-
              New picture upload overlay

            template(v-if='canChangePicture')
              .profilePictureInput(v-show='!editing')
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
        tabs(ref='tabs')
          tab-dropdown
            all-activity-tab(:profile='profile' :timeline-style='timelineStyles')
            payments-activity-tab(v-if='canViewPayments' :profile='profile' :timeline-style='timelineStyles')
            invoices-activity-tab(v-if='canViewInvoices' :profile='profile' :timeline-style='timelineStyles')
            expenses-activity-tab(v-if='canViewExpenses' :profile='profile' :timeline-style='timelineStyles')
            quotes-activity-tab(v-if='canViewQuotes' :profile='profile' :timeline-style='timelineStyles')
            clients-activity-tab(v-if='canViewClients' :profile='profile' :timeline-style='timelineStyles')
            credits-activity-tab(v-if='canViewCredits' :profile='profile' :timeline-style='timelineStyles')
            products-activity-tab(v-if='canViewProducts' :profile='profile' :timeline-style='timelineStyles')
            vendors-activity-tab(v-if='canViewVendors' :profile='profile' :timeline-style='timelineStyles')
            employees-activity-tab(v-if='canViewEmployees' :profile='profile' :timeline-style='timelineStyles')
            projects-activity-tab(v-if='canViewProjects' tab-key='projects-activity' :profile='profile' :timeline-style='timelineStyles')
            tasks-activity-tab(v-if='canViewProjects' tab-key='tasks-activity' :profile='profile' :timeline-style='timelineStyles')
          upcoming-payments-tab(v-if='canViewInvoices' :profile='profile')
          overdue-invoices-tab(v-if='canViewInvoices' :profile='profile')
          projects-tab(v-if='canViewProjects' :profile='profile')
          tasks-tab(v-if='canViewProjects' :profile='profile')
</template>

<script>
import AuthorizationHelpersMixin from '@/mixins/authorization/helpers'

import AllActivityTab from '@/components/overview/tabs/activity/all'
import PaymentsActivityTab from '@/components/overview/tabs/activity/payments'
import ExpensesActivityTab from '@/components/overview/tabs/activity/expenses'
import InvoicesActivityTab from '@/components/overview/tabs/activity/invoices'
import CreditsActivityTab from '@/components/overview/tabs/activity/credits'
import QuotesActivityTab from '@/components/overview/tabs/activity/quotes'
import ClientsActivityTab from '@/components/overview/tabs/activity/clients'
import ProductsActivityTab from '@/components/overview/tabs/activity/products'
import VendorsActivityTab from '@/components/overview/tabs/activity/vendors'
import EmployeesActivityTab from '@/components/overview/tabs/activity/employees'
import ProjectsActivityTab from '@/components/overview/tabs/activity/projects'
import TasksActivityTab from '@/components/overview/tabs/activity/tasks'

import UpcomingPaymentsTab from '@/components/overview/tabs/UpcomingPaymentsTab.vue'
import OverdueInvoicesTab from '@/components/overview/tabs/OverdueInvoicesTab.vue'
import ProjectsTab from '@/components/overview/tabs/ProjectsTab.vue'
import TasksTab from '@/components/overview/tabs/TasksTab.vue'

export default {
  mixins: [
    AuthorizationHelpersMixin
  ],

  components: {
    AllActivityTab,
    PaymentsActivityTab,
    ExpensesActivityTab,
    InvoicesActivityTab,
    CreditsActivityTab,
    QuotesActivityTab,
    ClientsActivityTab,
    ProductsActivityTab,
    VendorsActivityTab,
    EmployeesActivityTab,
    ProjectsActivityTab,
    TasksActivityTab,

    UpcomingPaymentsTab,
    OverdueInvoicesTab,
    ProjectsTab,
    TasksTab
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
      const timelineOffsetFromContainerTop = 115
      const targetHeight = this.columnsHeight && ((this.columnsHeight - timelineOffsetFromContainerTop) + 'px')
      const styles = {
        'max-height': targetHeight,
        'min-height': targetHeight,
        'height': targetHeight
      }
      return styles
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
        return this.$repository('employees').availableItems.find((employee) => employee.isMe())
      } else {
        return this.$repository('employees').find(this.who)
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

    isVisible(isVisible) {
      this.$nextTick(() => {
        this.columnsHeight = this.$refs.profileContainer.clientHeight
      })
      this.cancelProfileImageCropping()

      if (isVisible) {
        this.resetTabs()
      }
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
    },

    resetTabs() {
      this.$refs.tabs.reset()
    }
  }
}
</script>

<style lang="scss" src="./styles/main.scss"></style>