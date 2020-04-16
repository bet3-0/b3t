<template>
  <div class="container">
    <button
      v-if="pageNumber > 1"
      class="btn btn-success"
      @click="previousPage()"
    >
      Précédent
    </button>
    <button class="btn btn-success" @click="validate()">
      {{ hasNext() ? "Page suivante" : "Valider" }}
    </button>
  </div>
</template>
<script>
import ProgressionService from "./../../../service/progression.service";

export default {
  name: "ValidateActivityPage",
  props: ["activity", "progression", "pageNumber", "changePage"],
  data() {
    return {};
  },
  methods: {
    hasNext() {
      console.log("nb pages: " + this.activity.page);
      return this.pageNumber < this.activity.page;
    },
    previousPage() {
      return this.changePage(this.pageNumber - 1);
    },
    nextPage() {
      return this.changePage(this.pageNumber + 1);
    },
    async validate() {
      if (this.hasNext()) {
        this.nextPage();
      } else {
        await this.checkValidation();
      }
    },
    async checkValidation() {
      // Check entries are filled
      if (!this.progression.entries) {
        this.progression.entries = [];
      }
      let incompleteEntries = this.progression.entries.filter(
        (entry) => entry.state != "FINISHED"
      );
      if (incompleteEntries.length > 0) {
        console.log("Some entries where not sent!");
        alert(
          `Certains rendus (${incompleteEntries.length}) n'ont pas été envoyés !`
        ); // todo: faire une modale
        return;
      }

      //Change state
      this.progression.state = "FINISHED";

      // Update progression
      try {
        await ProgressionService.updateProgression(
          this.progression,
          "progression"
        );
        console.log("Progression sent: " + this.progression);
        // Redirect
        alert("Ton activité a bien été envoyée !")
        window.location.href = "/activitees";
      } catch (error) {
        console.log("Error while sending text entry: " + this.progression);
        this.progression.state = "INPROGRESS";
        alert(
          "Impossible d'envoyer ta progression ! Vérifie ta connexion et réessaye !"
        );
      }
    },
  },
};
</script>
<style scoped>
.container {
  margin: 1rem;
  display: flex;
  justify-content: space-evenly;
}
</style>
