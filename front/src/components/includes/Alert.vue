<template>
  <b-alert
    class="alert"
    v-model="show"
    :variant="variantName"
    dismissible
    :focus="focus"
  >
    {{ text }}
  </b-alert>
</template>
<script>
export default {
  name: "Alert",
  props: ["show", "variant", "text"],
  computed: {
    focus: () => true,
    showValue: function() {
      return this.show || false;
    },
    variantName: function() {
      return this.variant || "warning";
    },
    textValue: function() {
      return this.text || "Erreur inconnue";
    },
  },
};
</script>
<style scoped>
.alert {
  margin-top: 1rem;
}
</style>
