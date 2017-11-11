<template>
  <div class="modal-form">
    <modal-tabs @save="save" @cancel="cancel">
      <modal-tab :title="$t('tabs.details')">

        <form-container>
          <form-row>
            <!--
              project Name
            -->
            <form-field :label="$t('labels.project_name')" :errors="validationErrors.name">
              <form-text-input v-model="name" name="name" :readonly="preview"></form-text-input>
            </form-field>
          </form-row>

          <form-row>
            <!--
              Description
            -->
            <form-field :label="$t('labels.description')">
              <form-textarea-input v-model="description" name="description" :readonly="preview"></form-textarea-input>
            </form-field>
          </form-row>
        </form-container>

      </modal-tab>
    </modal-tabs>
  </div>
</template>

<script>
import FormMixin from '@/mixins/FormMixin'

export default {
  name: 'edit-project',

  mixins: [
    FormMixin('project', [
      'name',
      'description'
    ])
  ],

  computed: {
    taxRates() {
      return this.$store.state.table.tax_rates.items
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