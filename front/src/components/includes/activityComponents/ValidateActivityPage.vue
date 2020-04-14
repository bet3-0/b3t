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
export default {
  name: "ValidateActivityPage",
  props: ["activity", "progression", "pageNumber", "changePage"],
  data() {
    return {};
  },
  methods: {
    hasNext() {
      return this.pageNumber < this.activity.pages;
    },
    previousPage() {
      return this.changePage(this.pageNumber - 1);
    },
    nextPage() {
      return this.changePage(this.pageNumber + 1);
    },
    validate() {
      if (this.hasNext()) {
        this.nextPage();
      } else {
        this.checkValidation();
      }
    },
    checkValidation() {
      // Check entries are filled
      let incompleteEntries = this.progression.entries.filter(entry => entry.state != "FINISHED")
      if (incompleteEntries.length > 0){
        console.log("Some entries where not sent!")
        alert("Certains rendus n'ont pas été envoyés !") // todo: faire une modale
        return;
      }

      //Change state
      this.progression.state = "FINISHED";

      // Update progression
      ProgressionService.updateProgression(this.progression)
        .then(() => {
          console.log("Progression sent: " + this.progression);
          this.updateEntry(this.progression); // update the primary progression object
          // Redirect
          window.location.href = "/activitees";
        })
        .catch(() => {
          console.log("Error while sending text entry: " + this.progression);
          this.progression.state = "INPROGRESS";
          alert(
            "Impossible d'envoyer ta progression ! Vérifie ta connexion et réessaye !"
          );
        });
    }
  }
};
</script>
<style scoped>
.container {
  margin: 1rem;
  display: flex;
  justify-content: space-evenly;
}
</style>
