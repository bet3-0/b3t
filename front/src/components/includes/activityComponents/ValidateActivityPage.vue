<template>
  <div class="container">
    <div class="container-buttons">
      <button
        v-if="pageNumber > 1"
        class="btn btn-success"
        @click="previousPage()"
      >
        Page précédente
      </button>
      <button class="btn btn-success" v-if="hasNext()" @click="nextPage()">
        <span v-show="loading" class="spinner-border spinner-border-sm"></span>
        Page suivante
      </button>
      <button
        class="btn btn-success"
        v-if="!hasNext() && progression.entries && progression.entries.length"
        @click="validate()"
      >
        <span v-show="loading" class="spinner-border spinner-border-sm"></span>
        {{ validationString }}
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
    <ErrorModal
      idError="-VAL"
      :title="titleError"
      :message="messageError"
      :link="linkError"
      :linkMessage="linkMessage"
    />
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
      linkMessage: "Voir Mes activités",
      linkError: "/progression",
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
      this.loading = true;
      await this.updateAndCheckPage(this.pageNumber + 1);
      this.loading = false;
    },
    // Go to previous/next page or validate
    async validate() {
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
        this.linkMessage = "";
        this.linkError = "";
        this.$bvModal.show("errorModal-VAL");
        return false;
      }
      if (this.$store.state.auth.user.role != "jeune") {
        // Validation for reviewer
        if (this.progression.state == "REVIEWING") {
          this.$bvModal.show("activityToValidateModal");
        }
      } else {
        // Validation for jeune
        if (["FINISHED", "REVIEWING"].includes(this.progression.state)) {
          // Cannot send this type of progression !
          this.titleError = "Impossible d'envoyer tes réponses !";
          this.messageError =
            "Tu as déjà envoyé cette activité ! Elle se trouve maintenant dans Mes activités où tu peux suivre la progression de sa validation !";
          this.linkMessage = "Voir Mes activités";
          this.linkError = "/progression";
          this.$bvModal.show("errorModal-VAL");
          return;
        }
        this.message = this.checkEntries();
        if (this.message) {
          console.warn("Entries not complete");
        }
        this.$bvModal.show("validateActivityModal");
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
