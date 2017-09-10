<template>
  <div>
    <div class="items-list__new-item">
      <form-inputs-group>
        <slot name="fields"></slot>
        <div class="field--actions">
          <button class="button button--positive" @click="addItem">ADD</button>
        </div>
      </form-inputs-group>
    </div>

    <!--
      Added items list
    -->
    <div class="items-list scrollable">
      <div v-for="(item, index) in items" class="items-list__item">
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
      default: null
    }
  },

  data() {
    return {
      items: []
    }
  },

  computed: {
    itemsWithoutValueText() {
      return this.items.map((item) => {
        const _item = {}

        for (let key in item) {
          if (item.hasOwnProperty(key)) {
            if (item[key].hasOwnProperty('__valueWithText')) {
              _item[key] = item[key].value
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
      const item = Object.assign({}, this.model)

      console.log(item)

      this.items.push(item)

      this.$emit('add', item)
    },

    removeItem(item) {
      const index = this.items.indexOf(item)

      if (index > -1) {
        this.items.splice(index, 1)
        this.$forceUpdate()
      }
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