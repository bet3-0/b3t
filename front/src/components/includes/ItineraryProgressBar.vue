<template>
  <div class="progress">
    <div
      class="progress-bar progress-bar-animated"
      role="progressbar"
      v-bind:style="{
        width: progress + '%',
        background: getItineraryColor(),
      }"
      :aria-valuenow="progress"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      {{ progress.toFixed(0) }}%
    </div>
  </div>
</template>
<script>
import ItineraryHelpers from "./../../service/itineraryHelpers";

export default {
  name: "ItineraryProgressBar",
  computed: {
    progress(){
      return this.getProgression();
    }
  },
  methods: {
    // Use local storage for more reactivity (avoid call to API).
    getProgression() {
      return this.$store.state.progression.progression;
    },
    getItinerary() {
      return this.$store.state.parcours.parcours;
    },
    getItineraryColor() {
      return ItineraryHelpers.getItineraryColor(
        this.$store.state.parcours.parcours
      );
    },
  },
};
</script>
<style scoped></style>
