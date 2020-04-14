<template>
  <div hidden class="content-container">
    <!-- Placeholder content -->
    <ActivityContentSample />
    <!-- Activité -->
    <span v-html="activityContent"></span>
  </div>
</template>

<script>
export default {
  name: "ActivityContent",
  props: ["idParcours", "idActivite"],
  data() {
    return {
      activityContent: ""
    };
  },
  mounted() {
    // retrieve HTML content
    this.activityContent = require("@/activities/" +
      this.idParcours +
      "/" +
      this.idActivite +
      "/content.html");
  },
  methods: {}
};
</script>
<style scoped>
.img-center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  max-width: 80%;
}
</style>
