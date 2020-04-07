<template>
  <div id="app">
    <div>
      <NavComponent />
      <ItineraryProgressBar />
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import NavComponent from "./components/includes/NavComponent";
import ItineraryProgressBar from "./components/includes/ItineraryProgressBar";

export default {
  components: { NavComponent, ItineraryProgressBar }
};
</script>
