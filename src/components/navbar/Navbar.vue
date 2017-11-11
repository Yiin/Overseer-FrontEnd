<template>
  <div class="navbar">
    <div class="navbar__content navbar__content--left">
      <div class="sidebar-toggle">
        <i class="fa fa-bars"></i>
      </div>
      <div class="logo-holder">
        <!-- <img class="logo" src="/static/overseer_logo_small_first_letter.svg"> -->
        <div class="logo">
          <span>Over</span><span>seer</span>
        </div>
      </div>
    </div>
    <div class="navbar__content navbar__content--right">
      <button @click="locale('en')" class="locale-picker">EN</button>
      <button @click="locale('lt')" class="locale-picker">LT</button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    locale(lang) {
      this.$store.dispatch('CHANGE_LOCALE', lang)
    }
  }
}
</script>

<style lang="scss" scoped>
.locale-picker {
  background: white;
  border: none;
  box-shadow: $box-shadow;
}

.navbar {
  display: none;
}
</style>

<style lang="scss" src="./style.scss"></style>