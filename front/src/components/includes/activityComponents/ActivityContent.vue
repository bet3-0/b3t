<template>
  <div hidden class="content-container">
    <Spinner :activated="loading" />
    <!-- Activité -->
    <span v-html="activityContent"></span>
    <!-- <ErrorModal :title="titleError" :message="messageError" /> -->
  </div>
</template>

<script>
import Spinner from "./../Spinner";
//import ErrorModal from "./../ErrorModal";

export default {
  name: "ActivityContent",
  components: { Spinner },
  props: ["idParcours", "idActivite"],
  data() {
    return {
      loading: true,
      activityContent: "",
      titleError: "Impossible de charger l'activité",
      messageError:
        "Le coeur de l'activité a un petit souci... Tu peux en essayer une autre peut-être ?",
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
        this.activityContent = require("@/activities/" +
          this.idParcours +
          "/" +
          this.idActivite +
          "/content.html");
      } catch (error) {
        this.activityContent =
          "Petit souci avec le contenu ! Tu peux peut-être essayer une autre activité, le temps que celle-ci soit complétée ?<br><i>Moi je vais rester là pour raviver le feu parce que des fois il se déravive.</i>";
        // this.$bvModal.show("errorModal");
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
