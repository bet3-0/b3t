<template>
  <div class="progress">
    <div
      class="progress-bar progress-bar-animated"
      role="progressbar"
      v-bind:style="{ width: progress + '%', background: getItineraryColor(itineraryId) }"
      aria-valuenow="25"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      {{ progress }}%
    </div>
  </div>
</template>
<script>
import ItineraryHelpers from './../../service/itineraryHelpers';

export default {
  name: "ItineraryProgressBar",
  props: { progress: { default: 0 }, itineraryId: { default: 5 } },
  data() {
    return {
      itineraryColor: this.getItineraryColor(this.itineraryId),
    };
  },
  methods: {
    getItineraryColor: ItineraryHelpers.getItineraryColor
  }
};
</script>
<style scoped></style>
