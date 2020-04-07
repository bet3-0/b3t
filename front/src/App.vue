<template>
  <div id="app">
    <div>
      <NavComponent />
      <ItineraryProgressBar :progress="getProgression()" :itineraryId="getItinerary()" />
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import NavComponent from "./components/includes/NavComponent";
import ItineraryProgressBar from "./components/includes/ItineraryProgressBar";

export default {
  components: { NavComponent, ItineraryProgressBar },
  methods: {
    // Use local storage for more reactivity (avoid call to API).
    getProgression: () => {
      return localStorage.getItem("progression") || 0;
    },
    getItinerary: () => {
      return localStorage.getItem("itinerary") || 5;
    },
  },
};
</script>
