<template>
  <div class="container">
    <div class="container-buttons">
      <button
        v-if="pageNumber > 1"
        class="btn btn-success"
        @click="previousPage()"
      >
        Précédent
      </button>
      <button class="btn btn-success" @click="validate()">
        <span v-show="loading" class="spinner-border spinner-border-sm"></span>
        {{ hasNext() ? "Page suivante" : validationString }}
      </button>
    </div>
    <!-- Modal -->
    <ValidateActivityModal
      :title="title"
      :message="message"
      :progression="progression"
    />
    <ActivityToValidateModal
      :title="title"
      :message="message"
      :progression="progression"
    />
    <ErrorModal idError="-VAL" :title="titleError" :message="messageError" />
  </div>
</template>
<script>
// import ProgressionService from "./../../../service/progression.service";
import ValidateActivityModal from "./ValidateActivityModal";
import ActivityToValidateModal from "./ActivityToValidateModal";
import ErrorModal from "./../ErrorModal";

//import $ from "jquery";

export default {
  name: "ValidateActivityPage",
  components: { ValidateActivityModal, ActivityToValidateModal, ErrorModal },
  props: ["activity", "progression", "pageNumber", "updatePage"],
  data() {
    return {
      title: "Valider l'activité", // for validation modal
      message: "", // for valiation modal
      loading: false,
      titleError: "Impossible d'envoyer tes réponses !",
      messageError: "",
    };
  },
  computed: {
    validationString() {
      if (this.progression.state == "REVIEWING") {
        return "Réviser l'activité";
      }
      return "Valider";
    },
  },
  methods: {
    hasNext() {
      console.log("nb pages: " + this.activity.page);
      return this.pageNumber < this.activity.page;
    },
    async updateAndCheckPage(newPage) {
      let isUpdated = await this.updatePage(newPage);
      if (!isUpdated) {
        this.titleError = "Impossible d'envoyer tes réponses !";
        this.messageError =
          "Tes réponses sont bloquées ici ! Réessaie pour voir ?";
        this.$bvModal.show("errorModal-VAL");
        return false;
      }
      return true;
    },
    async previousPage() {
      return await this.updateAndCheckPage(this.pageNumber - 1);
    },
    async nextPage() {
      return await this.updateAndCheckPage(this.pageNumber + 1);
    },
    // Go to previous/next page or validate
    async validate() {
      if (this.hasNext()) {
        this.loading = true;
        this.nextPage();
        this.loading = false;
      } else {
        this.loading = true;
        let isUpdated = await this.updateAndCheckPage(this.pageNumber);
        this.loading = false;
        if (!isUpdated) {
          return false;
        }
        if (!this.progression.id) {
          // progression was never initialized with server
          this.titleError = "Impossible d'envoyer tes réponses !";
          this.messageError =
            "Tes réponses ne peuvent pas être enregistrées ! Tu dois rafraîchir la page !";
          this.$bvModal.show("errorModal-VAL");
          return false;
        }
        if (this.progression.state == "REVIEWING") {
          // Validation for reviewer
          this.$bvModal.show("activityToValidateModal");
        } else {
          // Validation for jeune
          this.message = this.checkEntries();
          if (this.message) {
            console.warn("Entries not complete");
          }
          this.$bvModal.show("validateActivityModal");
        }
      }
    },
    checkEntries() {
      // Check entries are filled
      if (!this.progression.entries) {
        this.progression.entries = [];
      }
      let incompleteEntries = this.progression.entries.filter(
        (entry) =>
          entry.state != "FINISHED" ||
          (entry.typeRendu != "file" && !entry.rendu) ||
          (entry.typeRendu == "file" && !entry.documents.length)
      );
      if (incompleteEntries.length > 0) {
        console.log(
          "Some entries where not sent: " + JSON.stringify(incompleteEntries)
        );
        return `Attention ! Certains rendus (au nombre de ${incompleteEntries.length}) n'ont pas été remplis ou envoyés !`;
      }
      return "";
    },
  },
};
</script>
<style scoped>
.container-buttons {
  margin: 1rem;
  display: flex;
  justify-content: space-evenly;
}
</style>
