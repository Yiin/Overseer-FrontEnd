<template>
  <div class="modal-sidebar">
    <div class="form__inline-inputs">
      <div class="form__input-wrapper form">
        <label class="form__label">{{ $t('labels.country_code') }}</label>
        <form-dropdown-input
          v-model="vat_checker.country_code"
          :items="dropdownOptions.memberStates"
          avatar
        >
          <template slot="option" slot-scope="{ item, parent }">
            <v-list-tile avatar @click="parent.select(item)">
              <v-list-tile-avatar>
                <span class="flag-icon" :class="['flag-icon-' + (item.iso_3166 || item.code).toLowerCase() ]"></span>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-html="item.code"></v-list-tile-title>
                <v-list-tile-sub-title v-html="item.name"></v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </form-dropdown-input>
      </div>
    </div>
    <div class="form__inline-inputs">
      <div class="form__input-wrapper">
        <label class="form__label">{{ $t('labels.vat_number') }}</label>
        <input v-model="vat_checker.number" class="form__input" type="text" name="vat_number" data-lpignore="true">
      </div>
    </div>
    <button @click="checkVat" class="button button--primary">
      {{ $t('common.check') }}
    </button>
    <div class="results__list scrollable" :class="{ 'result__list--empty': !vatCheckerResults.length }">
      <div v-if="!vatCheckerResults.length" class="placeholder__text">
        You can use this tool to<br>
        validate a VAT number.
      </div>
      <div v-for = "result in vatCheckerResults"
           class = "result"
          :class = "{
            'result--success': result.status === 'valid',
            'result--failure': result.status === 'invalid'
          }"
      >
        <div class="result-border"></div>
        <div class="result-details">
          <div class="result-detail">
            VAT: <span class="result-detail__value">{{ result.country_code + result.number }}</span>
          </div>
          <div class="result-detail result-detail--highlight">
            Status: <span class="result-detail__value">{{ $t(`vat_status.${result.status}`) }}</span>
          </div>
          <div v-if="result.name" class="result-detail__title">
            {{ result.name }}
          </div>
          <div v-if="result.address" class="result-detail__sub-title">
            {{ result.address }}
          </div>
          <div class="result-detail">
            Checked <span class="result-detail__value">{{ result.checked_time_ago }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VatCheckerMixin from '@/mixins/VatCheckerMixin'

export default {
  mixins: [
    VatCheckerMixin
  ]
}
</script>