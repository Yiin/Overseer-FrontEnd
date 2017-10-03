<template>
  <div class="modal-form">
    <modal-tabs @save="save" @cancel="cancel" :hide-buttons="preview">
      <modal-tab :title="$t('tabs.details')">

        <form-container name="project">
          <form-row>
            <!--
              project Name
            -->
            <form-field :label="$t('labels.project_name')" catch-errors="name">
              <form-text-input v-model="form.name" name="name" :readonly="preview"></form-text-input>
            </form-field>
          </form-row>
          <form-row>
            <!--
              Description
            -->
            <form-field :label="$t('labels.description')">
              <form-textarea-input v-model="form.description" name="description" :readonly="preview"></form-textarea-input>
            </form-field>
          </form-row>
        </form-container>

      </modal-tab>
    </modal-tabs>
  </div>
</template>

<script>
export default {
  name: 'edit-project',

  props: {
    data: {
      default: null
    }
  },

  computed: {
    form() {
      return this.$store.state.form.project
    },

    preview() {
      return this.form.__preview
    },

    passive() {
      return this.$store.state.passive
    },

    taxRates() {
      return this.$store.state.table.tax_rates.items
    }
  },

  methods: {
    save() {
      if (this.form.uuid) {
        this.$store.dispatch('form/project/SAVE')
      } else {
        this.create()
      }
    },

    create() {
      this.$store.dispatch('form/project/CREATE')
    },

    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped lang="scss">
.modal-form {
    width: 866px;
}

textarea {
    height: 124px !important;
}
</style>