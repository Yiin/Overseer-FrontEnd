<template lang="pug">
  .modal-form
    modal-tabs(
      @save='save' @fill='fill' @cancel='cancel'
      :hide-buttons='preview'
    )

      //-
        Company details
      modal-tab(:title="$t('tabs.details')")
        form-container
          form-row
            form-field(
              :errors='validationErrors.name'
              :label="$t('labels.name')"
            )
              form-text-input(
                v-model='name'
                name='name'
                :readonly='preview'
              )
          form-row
            form-field(
              :errors='validationErrors.email'
              :label="$t('labels.email')"
            )
              form-text-input(
                v-model='email'
                name='email'
                :readonly='preview'
              )
</template>

<script>
import FormMixin from '@/mixins/FormMixin'

export default {
  mixins: [
    FormMixin('company', [
      'name',
      'email'
    ])
  ]
}
</script>

<style lang="scss" scoped>
.modal-form {
  display: flex;
  height: 417px;

  .modal-tabs {
    width: 550px;
  }
}
</style>