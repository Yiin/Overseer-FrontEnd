<template>
  <div>
    <div class="items-list__new-item">
      <form-inputs-group>
        <slot name="fields" :form="form"></slot>
        <div class="field--actions">
          <button class="button button--positive" @click="addItem">ADD</button>
        </div>
      </form-inputs-group>
    </div>

    <!--
      Added items list
    -->
    <div class="items-list scrollable">
      <div v-for="(item, index) in items" :key="index" class="items-list__item">
        <slot name="preview" :item="item" :index="index"></slot>
        <div class="list-item__field field--actions">
          <div class="remove-item-btn">
            <div class="remove-item-btn__icon" @click="removeItem(item)"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="items-list__summary">
      <slot name="summary"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'form-items-list',

  props: {
    name: {
      type: String,
      default: undefined
    },

    model: {
      type: Object,
      required: true
    },

    value: {
      default: []
    }
  },

  data() {
    return {
      form: Object.assign({}, this.model),
      items: this.value
    }
  },

  computed: {
    itemsWithoutValueText() {
      return this.items.map((item) => {
        const _item = {}

        for (let key in item) {
          if (item.hasOwnProperty(key)) {
            if (typeof item[key] === 'object' && item[key] !== null) {
              if (typeof item[key].id !== 'undefined') {
                _item[key + '_id'] = item[key].id
              } else if (typeof item[key].uuid !== 'undefined') {
                _item[key + '_uuid'] = item[key].uuid
              }
            } else {
              _item[key] = item[key]
            }
          }
        }
        return _item
      })
    }
  },

  watch: {
    items: function () {
      if (this.$parent) {
        this.$parent.$emit('input:field', {
          name: this.name,
          value: this.itemsWithoutValueText
        })
      }
    }
  },

  methods: {
    addItem() {
      const item = Object.assign({}, this.form)

      this.items.push(item)

      this.form = Object.assign({}, this.model)
    },

    removeItem(item) {
      const index = this.items.indexOf(item)

      if (index > -1) {
        this.items.splice(index, 1)
        this.$forceUpdate()
      }
    },

    setItemAttribute(key, value) {
      this.form[key] = value
    }
  }
}
</script>

<style lang="scss">
.field--actions {
  min-width: 15%;
  margin-top: 20px;
  &.list-item__field {
    margin-top: 0;
    min-width: 10%;
  }
}
</style>