<template>
  <div class="content-container">
    <!-- Activité -->
    <span v-html="activityContent"></span>
  </div>
</template>

<script>

export default {
  name: "AventureContent",
  props: [ "idActivite"],
  data() {
    return {
      activityContent: "",
      titleError: "Impossible de charger l'aventure",
      messageError:
        "Le coeur de l'aventure a un petit souci... ",
    };
  },
  mounted() {
    this.loadContent();
  },
  methods: {
    loadContent() {
      // retrieve HTML content
      this.loading = true;
      try {
        this.activityContent = require("@/aventure/" +
          this.idActivite +
          "/content.html");
      } catch (error) {
        this.activityContent =
          "Petit souci avec le contenu ! </i>";
      }
      this.loading = false;
    },
  },
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
