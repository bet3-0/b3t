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
  </div>
</template>
<script>
// import ProgressionService from "./../../../service/progression.service";
import ValidateActivityModal from "./ValidateActivityModal";
import ActivityToValidateModal from "./ActivityToValidateModal";

//import $ from "jquery";

export default {
  name: "ValidateActivityPage",
  components: { ValidateActivityModal, ActivityToValidateModal },
  props: ["activity", "progression", "pageNumber", "updatePage"],
  data() {
    return {
      title: "Valider l'activité", // for validation modal
      message: "", // for valiation modal
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
    async previousPage() {
      return await this.updatePage(this.pageNumber - 1);
    },
    async nextPage() {
      return await this.updatePage(this.pageNumber + 1);
    },
    // Go to previous/next page or validate
    async validate() {
      if (this.hasNext()) {
        this.nextPage();
      } else {
        await this.updatePage(this.pageNumber);
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
