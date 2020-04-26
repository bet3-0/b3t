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
      if (this.progression.state === "REVIEWING"
        && this.$store.state.auth.user
        && this.$store.state.auth.user.role === "relecteur") {
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

      // Try to send the updated progression

      // CASE 1: an adult is on the page
      if (this.$store.state.auth.user.role != "jeune") {
        // Validation for reviewer, only if the state is REVIEWING
        if (this.progression.state == "REVIEWING") {
          this.$bvModal.show("activityToValidateModal");
        }
        // Otherwise, nothing happens.
      }
      // CASE 2: a 'jeune' is on the page and this is not its main parcours
      else if (this.progression.idParcours != 4
        && this.progression.idParcours != this.$store.state.parcours.parcours) {
        // progression was never initialized with server
        this.titleError = "Activité hors parcours terminée !";
        this.messageError =
          "Cette activité ne correspond pas à ton parcours et ne peut donc pas être sauvegardée !" +
          " Nous n'enverrons pas tes réponses et l'activité ne s'affichera pas dans la page \"Mes activités\".";
        this.linkMessage = "Retour au choix d'activités";
        this.linkError = "/activitees";
        this.$bvModal.show("errorModal-VAL");
        return false;
      }
      // CASE 3: a 'jeune' is on the page and this is its main parcours
      // FIRST OPTION: an error occurred previously and the progression has no id
      else if (!this.progression.id) {
        // progression was never initialized with server
        this.titleError = "Impossible d'envoyer tes réponses !";
        this.messageError =
          "Tes réponses ne peuvent pas être enregistrées ! Tu dois rafraîchir la page et réessayer !";
        this.linkMessage = "";
        this.linkError = "";
        this.$bvModal.show("errorModal-VAL");
        return false;
      }
      // SECOND OPTION: the activity is finished, reviewing or validated
      else if (["FINISHED", "REVIEWING", "VALIDATED"].includes(this.progression.state)) {
        // Cannot send this type of progression !
        this.titleError = "Impossible d'envoyer tes réponses !";
        this.messageError =
          "Tu as déjà envoyé cette activité ! Elle se trouve maintenant dans Mes activités où tu peux suivre la progression de sa validation !";
        this.linkMessage = "Voir Mes activités";
        this.linkError = "/progression";
        this.$bvModal.show("errorModal-VAL");
        return false;
      }
      // THIRD OPTION: the activity has a correct state: it can be sent!
      else {
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
      const incompleteEntries = this.progression.entries.filter(
        (entry) =>
          entry.state != "FINISHED" ||
          (entry.typeRendu != "file" && !entry.rendu) ||
          (entry.typeRendu == "file" && !entry.documents.length)
      );
      let message = "";
      if (incompleteEntries.length > 0) {
        console.log("Some entries where not sent: " + JSON.stringify(incompleteEntries));
        message = `Attention ! Certains rendus (au nombre de ${incompleteEntries.length}) n'ont pas été remplis ou envoyés !`
        const filesNotSent = this.progression.entries.filter(
          (entry) =>
            (entry.typeRendu === "file" && !entry.documents.length)
        );
        if (filesNotSent.length > 0) {
          console.log("Some files where not sent: " + JSON.stringify(filesNotSent));
          if (filesNotSent.length === 1) {
            message += `Notamment, 1 fichier n'a pas été envoyé.`
          } else {
            message += `Notamment, ${filesNotSent.length} fichiers n'ont pas été envoyés.`
          }
        }
      }
      return message;
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
