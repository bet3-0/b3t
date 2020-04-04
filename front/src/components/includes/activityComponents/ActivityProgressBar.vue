<template>
  <div class="progress">
    <div
      class="progress-bar progress-bar-animated"
      role="progressbar"
      v-bind:style="{ width: progress + '%' }"
      aria-valuenow="25"
      aria-valuemin="0"
      aria-valuemax="100"
      color="var(--default)"
    >
      {{ progress }}%
    </div>
  </div>
</template>
<script>
export default {
  name: "ActivityProgressBar",
  props: ["progress"],
};
</script>
<style scoped>
.progress {
  margin: 1rem;
}
</style>
