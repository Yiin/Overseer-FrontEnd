<template>
  <div id="app">
    <template v-if="isLoggedIn">
      <navbar></navbar>
      <sidebar ></sidebar>
    </template>
    <drag-select-container selectorClass="itemToBeSelected">
      <template scope="{ selectedItems }">
        <div class="page-content">
          <router-view></router-view>
        </div>
      </template>
    </drag-select-container>
    <taskbar></taskbar>
  </div>
</template>

<script>
import DragSelect from 'vue-drag-select/src/DragSelect.vue'
import NavBar from '@/components/navbar/Navbar.vue'
import Sidebar from '@/components/sidebar/Sidebar.vue'
import Taskbar from '@/components/taskbar/Taskbar.vue'

export default {
  name: 'app',

  components: {
    'drag-select-container': DragSelect,
    'navbar': NavBar,
    'sidebar': Sidebar,
    'taskbar': Taskbar
  },

  computed: {
    isLoggedIn() {
      return this.$store.state.auth.isLoggedIn
    }
  }
}
</script>

<style lang="scss" src="@/styles/app.scss"></style>