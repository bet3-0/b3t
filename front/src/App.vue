<template>
  <div id="app">
    <div>
      <NavComponent />
      <ItineraryProgressBar />
    </div>
    <router-view></router-view>
    <FooterComponent />
  </div>
</template>

<script>
import NavComponent from "./components/includes/NavComponent";
import ItineraryProgressBar from "./components/includes/ItineraryProgressBar";
import FooterComponent from "./components/includes/FooterComponent";

export default {
  components: { NavComponent, ItineraryProgressBar, FooterComponent }
};
</script>

