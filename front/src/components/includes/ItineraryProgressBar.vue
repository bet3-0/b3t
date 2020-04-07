<template>
  <div class="progress">
    <div
      class="progress-bar progress-bar-animated"
      role="progressbar"
      v-bind:style="{
        width: progress + '%',
        background: itineraryColor,
      }"
      aria-valuenow="25"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      {{ progress }}%
    </div>
  </div>
</template>
<script>
import ItineraryHelpers from "./../../service/itineraryHelpers";

export default {
  name: "ItineraryProgressBar",
  data() {
    return {
      progress: 0,
      itineraryColor: "var(--default)",
    };
  },
  beforeMount() {
    this.progress = this.getProgression();
    this.itineraryColor = this.getItineraryColor();
  },
  methods: {
    // Use local storage for more reactivity (avoid call to API).
    getProgression: () => {
      return localStorage.getItem("progression") || 0;
    },
    getItinerary: () => {
      return localStorage.getItem("itinerary") || 5;
    },
    getItineraryColor: () => {
      return ItineraryHelpers.getItineraryColor(localStorage.getItem("itinerary") || 5);
    },
  },
};
</script>
<style scoped></style>
