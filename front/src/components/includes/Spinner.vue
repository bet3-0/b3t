<template>
  <img
    v-if="activated"
    class="img-spinner"
    src="/img/icons/spinner.svg"
    alt="Chargement en cours..."
  />
</template>
<script>
export default {
  name: "Spinner",
  props: ["activated"],
};
</script>
<style scoped>
/* Loader */
.img-spinner {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}
</style>
