<template>
  <div id="app">
    <NavComponent/>
    <router-view></router-view>
  </div>
</template>

<script>

import NavComponent from "./components/includes/NavComponent";

export default {
  components: {NavComponent}
}
</script>

