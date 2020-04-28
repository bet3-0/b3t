<!-- ActivityComponent
Base Component for an activity page -->

<template>
  <div class="container" role="main">
    <Alert :show="showDismissibleAlert" :text="textAlert"/>
    <ActivityProgressBar :progress="progress"/>
    <div class="row">
      <div id="main-container" class="activity-container col-12">
        <Spinner :activated="!activity.nom && loading"/>
        <h1 class="activity-title" :style="'color:' + getParcoursColor()">
          {{ activity.nom }}
        </h1>
        <div v-if="pageNumber == 1 && activity.nom" class="details-container">
          <div id="details">
            <div class="card card-body">
              <ul>
                <li>
                  Description:<br/>
                  <i>{{ activity.description }}</i>
                </li>
                <li
                  v-if="
                    activity.materiel &&
                      activity.materiel.length &&
                      activity.materiel[0].length
                  "
                >
                  Matériel:
                  <ul>
                    <li v-for="item in activity.materiel" :key="item">
                      {{ item }}
                    </li>
                  </ul>
                </li>
                <li>Durée: {{ activity.duree }} minutes</li>
                <li>Difficulté: {{ activity.difficulte }}</li>
              </ul>
            </div>
          </div>
        </div>
        <ActivityContent :idActivite="idActivite" :idParcours="idParcours"/>
        <div class="end-container">
          <Spinner :activated="!progression.id && loading"/>
          <div class="submit-container">
            <!-- Choisir parmi ces rendus en fonction de l'activité -->
            <div
              v-for="entry in pageEntries()"
              :key="entry.position"
              style="text-align: center; width: 100%"
            >
              <h3 style="text-align: left">
                {{ entry.question }}
              </h3>
              <UploadFile
                v-if="entry.typeRendu === 'file'"
                :entry="entry"
                :updateEntry="updateEntry"
              />
              <UploadText
                v-if="entry.typeRendu === 'text'"
                :entry="entry"
                :updateEntry="updateEntry"
              />
              <OrderList
                v-if="entry.typeRendu === 'orderList'"
                :entry="entry"
                :updateEntry="updateEntry"
              />
              <Qcm
                v-if="entry.typeRendu === 'qcm'"
                :entry="entry"
                :updateEntry="updateEntry"
              />
            </div>
          </div>

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
                v-if="!hasNext() && progression.entries && progression.entries.length && role === 'jeune'"
                @click="validatePage()"
              >
                <span v-show="loading" class="spinner-border spinner-border-sm"></span>
                Valider
              </button>
            </div>
            <!-- Modal -->
            <ValidateActivityModal
              title="Valider l'activité"
              :message="validationMessage"
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

        </div>
      </div>
    </div>
    <CheckPageModal modal-id="checkModal" :check-text="checkText" :check-callback="checkCallback"/>
    <ErrorModal
      :title="titleError"
      :message="messageError"
      :link="linkError"
      :linkMessage="linkMessage"
    />
  </div>
</template>

<script>
  import Alert from "./includes/Alert";
  import ActivityContent from "./includes/activityComponents/ActivityContent";
  import ActivityProgressBar from "./includes/activityComponents/ActivityProgressBar";
  import UploadFile from "./includes/activityComponents/UploadFile";
  import UploadText from "./includes/activityComponents/UploadText";
  import OrderList from "./includes/activityComponents/OrderList";
  import Qcm from "./includes/activityComponents/Qcm";
  import activityService from "./../service/activity";
  import itineraryHelpers from "./../service/itineraryHelpers";
  import Spinner from "./includes/Spinner";
  import ErrorModal from "./includes/ErrorModal";
  import $ from "jquery";
  import ProgressionService from "../service/progression.service";
  import ValidateActivityModal from "./includes/activityComponents/ValidateActivityModal";
  import CheckPageModal from "./includes/activityComponents/CheckPageModal";

  export default {
  name: "ActivityComponent",
  components: {
    CheckPageModal,
    Spinner,
    ErrorModal,
    UploadFile,
    UploadText,
    Qcm,
    ValidateActivityModal,
    ActivityContent,
    ActivityProgressBar,
    OrderList,
    Alert,
  },
  props: ["pastProgression"],
  data() {
    return {
      loading: true,
      isFrozen: true, // if True, progression cannot be updated.
      showDismissibleAlert: false, // for Alert
      textAlert: false, // for Alert
      idActivite: NaN,
      idParcours: NaN,
      pageNumber: 1, // number of the visible page. 1 at start
      progress: 0,
      activity: {},
      progression: {},
      // Error modal
      titleError: "Activité impossible à charger !",
      messageError: "L'activité est imposible à charger ou inexistante !",
      linkError: "",
      linkMessage: "",
      // Check page entries modal
      checkText: "",
      checkCallback: ()=>{},
      // Validation modal
      validationMessage :"",
    };
  },
  computed:{
    role(){
      return this.$store.state.auth.user ? this.$store.state.auth.user.role : undefined
    }
  },
  async created() {
    this.idActivite = this.$route.params.idActivite;
    this.idParcours = this.$route.params.idParcours;
    await this.loadActivity();
  },
  updated() {
    this.showCurrentPages();
  },
  beforeMount() {
    this.showCurrentPages();
  },
  mounted() {
    this.showCurrentPages();
  },
  methods: {
    // DISPLAY METHODS
    getParcoursColor() {
      return itineraryHelpers.getItineraryColor(this.activity.idParcours);
    },
    showCurrentPages() {
      for (let i = 0; i < this.activity.page; i++) {
        if (i + 1 !== this.pageNumber) {
          $(`#page${i + 1}`).hide();
        } else {
          $(`#page${i + 1}`).show();
        }
      }
      $(".content-container").removeAttr("hidden");
    },
    stopVideo(element) {
      var iframe = element.querySelector("iframe");
      var video = element.querySelector("video");
      if (iframe !== null) {
        var iframeSrc = iframe.src;
        // Remove autoplay option if it exists
        iframeSrc = iframeSrc
          .replace(/&autoplay=.+&/, "&")
          .replace(/\?autoplay=.+&/, "?")
          .replace(/[&?]autoplay=.+$/, "");
        console.log("New Youtube video src: " + iframeSrc);
        iframe.src = iframeSrc;
      }
      if (video !== null) {
        video.pause();
        video.autoplay = false;
        console.log(video.autoplay);
      }
    },

    // ACTIVITY/PROGRESSION METHODS
    // Calls:  loadActivity --> retrieveProgression --> findProgression
    async loadActivity() {
      this.loading = true;

      // Retrieve the activity from DB (content of activity.json)
      let activity = await activityService.getActivity(
        this.idParcours,
        this.idActivite
      );
      if (activity === undefined) {
        this.titleError = "Activité impossible à charger !";
        this.messageError =
          "L'activité est imposible à charger ou inexistante !";
        this.linkError = "";
        this.$bvModal.show("errorModal");
        this.activity = {nom: "Activité inconnue !"};
        this.loading = false;
        return;
      }
      this.loading = false;
      this.activity = activity;

      // Retrieve the progression linked to this activity, for the current user
      await this.retrieveProgression(this.idParcours, this.idActivite);
      this.loading = false;
    },
    async findProgression(progressionId) {
      let progressions = await ProgressionService.getProgressions();
      if (progressions === undefined) {
        console.log("failed to retrieve progressions");
        return false; // do not create a new progression and raises an error
      }
      let existingProgression = progressions.find(
        (prog) => prog.id === progressionId
      );
      if (!existingProgression) {
        console.log("Existing progression id is incorrect!");
        return "TOCREATE"; // do create a new progression
      }
      return existingProgression;
    },
    freezeActivityIfNecessary(progression, lightWarning=false){
      if (["FINISHED", "EXTRA", "REVIEWING", "VALIDATED"].includes(progression.state)) {
        console.log("Existing progression is in a non-editable state");
        // Freezes entries
        this.isFrozen = true;
        progression.id = undefined;  // ensure the progression cannot be sent!
        // Freezes entries (answers fields)
        progression.entries.forEach(
          (_entry) => (_entry.state = "REVIEWING")
        );
        // Show a warning
        if (progression.state === "VALIDATED") {
          this.titleError = "Activité déjà validée !";
          this.messageError =
            "Tu as déjà fait cette activité ! Elle est maintenant validée, tu peux la voir sur la page Mes activités !";
          this.textAlert =
            "Tu as déjà fait cette activité ! Elle est maintenant validée, tu peux la voir sur la page Mes activités !";
        } else {
          this.titleError = "Activité en cours de validation";
          this.messageError =
            "Tu as déjà fait cette activité ! Elle est en train d'être relue, tu peux la voir sur la page Mes activités !";
          this.textAlert =
            "Tu as déjà fait cette activité ! Elle est sûrement en train d'être relue, tu peux la voir sur la page Mes activités !";
        }
        this.linkError = "/progression";
        this.linkMessage = "Voir mes activités";
        if (!lightWarning){
          this.$bvModal.show("errorModal");
        }
        this.showDismissibleAlert = true;
      } else {
        this.isFrozen = false
      }
    },
    async retrieveProgression(idParcours, idActivity) {
      // CASE 1: ROLE IS NOT 'jeune'
      if (
        !this.$store.state.auth.user ||
        this.$store.state.auth.user.role !== "jeune"
      ) {
        // Get a new progression without id (so it cannot override an existing progression in back)
        this.progression = activityService.getProgression(
          idParcours,
          idActivity
        );
        this.textAlert =
          "Ceci correspond à l'activité vue par les jeunes. Ton rôle ne permet pas d'envoyer de réponse.";
        this.showDismissibleAlert = true;
        return;
      }

      // CASE 2: ROLE IS 'jeune'
      // FIRST OPTION: progression comes from PersonalProgression page: up to date in the store
      if (this.$store.state.activity.progression) {
        // loaded from PersonalProgression vue
        this.progression = this.$store.state.activity.progression;
        this.$store.state.activity.progression = undefined;
        this.freezeActivityIfNecessary(this.progression, true)
        return;
      }

      // SECOND OPTION: a progression previously started. Its id is stored in localStorage.
      let activities;
      try {
        activities = JSON.parse(localStorage.getItem("activities")) || {};
      } catch (error) {
        //localStorage corrupted
        activities = {};
      }
      if (!(idParcours in activities)) {
        activities[idParcours] = {};
      }
      if (idActivity in activities[idParcours]) {
        let savedProgression = activities[idParcours][idActivity].progression; // retrieve the previous progression created.
        // SECOND OPTION: a progression previously started. Its id is stored in localStorage.
        if (savedProgression) {
          let progression = await this.findProgression(savedProgression.id);
          if (progression === "TOCREATE") {
            console.log("Creating a new progression");
          } else if (progression) {
            this.freezeActivityIfNecessary(progression);
            this.progression = progression;
            return;
          } else {
            this.titleError = "Impossible de charger l'activité";
            this.messageError =
              "Nous ne parvenons pas à charger les réponses que tu as déjà envoyées ! Si l'erreur persiste, essaie de te déconnecter/reconnecter.";
            this.linkError = "";
            this.linkMessage = "";
            this.$bvModal.show("errorModal");
            return;
          }
        }
      }

      // THIRD OPTION: No progression exists: retrieve a new one and post it to backend
      // Retrieve the default progression linked to the activity
      this.isFrozen = false;
      let progression = activityService.getProgression(idParcours, idActivity);

      // Post the new progression
      let progressionUpdated = await ProgressionService.createProgression(
        progression
      );
      if (progressionUpdated === undefined) {
        console.warn("Impossible to create a progression!");
        this.titleError = "Impossible de charger les réponses";
        this.messageError =
          "Impossible de charger les réponses à envoyer, elles ont dû se perdre en cours de route ! Essaie de recharger la page ?";
        this.linkError = "";
        this.linkMessage = "";
        this.$bvModal.show("errorModal");
        this.textAlert = "Impossible de charger les réponses !";
        this.showDismissibleAlert = true;
        this.progression = progression; // Progression without id: answers validation will fail.
        return;
      }
      this.progression = progressionUpdated;
      this.activity.progression = this.progression; // store the progression for future reconnection
      activities[idParcours][idActivity] = this.activity;
      console.log("Progression created!");

      localStorage.activities = JSON.stringify(activities);
    },
    // Activity progression
    getProgress() {
      let counter = 0;
      let total = 0;
      for (let entryIndex in this.progression.entries) {
        if (this.progression.entries[entryIndex].tracked) {
          total += 1;
          if (this.progression.entries[entryIndex].state === "FINISHED") {
            counter += 1;
          }
        }
      }
      if (total === 0) {
        this.progress = 0; // div by 0
        return;
      }
      this.progress = (100 * counter) / total;
    },

    // PAGE MANAGEMENT METHODS
    // UPDATE ENTRIES/PAGES/PROGRESSION METHODS
    pageEntries() {
      if (!this.progression.entries) {
        return [];
      }
      return this.progression.entries
        .filter((entry) => entry.page === this.pageNumber)
        .sort((a, b) => a.position - b.position);
    },
    /**
     * Checks whether the entries are empty or not (not working for QCM/OrderList).
     * @return {String} a non-empty string message on error, else an empty string.
     */
    checkEntries(entries) {
      // Check entries are filled
      if (!entries) {
        return "";
      }
      const incompleteEntries = entries.filter(
        (entry) =>
          entry.state !== "FINISHED" ||
          (entry.typeRendu !== "file" && !entry.rendu) ||
          (entry.typeRendu === "file" && !entry.documents.length)
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
            message += ` Notamment, 1 fichier n'a pas été envoyé.`
          } else {
            message += ` Notamment, ${filesNotSent.length} fichiers n'ont pas été envoyés.`
          }
        }
        return message;
      }
    },
    /**Save the entry in local progression + update progression bar */
    updateEntryInProgression(newEntry) {
      if (!this.progression.entries) {
        this.progression.entries = [];
      }
      for (let i in this.progression.entries) {
        if (this.progression.entries[i].id === newEntry.id) {
          this.progression.entries[i] = newEntry;
          break;
        }
      }
      this.getProgress();  // update activity progress bar
    },
    /**If INPROGRESS/NOT STARTED, send the entry and save the entry in local progression, else do nothing */
    async updateEntry(entry) {
      if (
        // CASE 1
        ["REVIEWING", "VALIDATED"].includes(entry.state) ||
        this.role !== "jeune"
      ) {
       // Impossible to edit entry in this state
        console.debug("Entry not updatable: " + entry.state);
        return true;
      }
      if (this.isFrozen){
        // Not updatable-state
        return true;
      }
      entry.state = "FINISHED";

      if (entry.parsedRendu) {
        entry.rendu = JSON.stringify(entry.parsedRendu);
      }
      let isUpdated = await ProgressionService.updateProgression(
        entry,
        "entry"
      );
      if (!isUpdated) {
        console.warn("Error while sending text entry: " + entry.rendu);
        entry.state = "INPROGRESS";
        return false;
      }
      console.log("Answer sent: " + entry.rendu);
      this.updateEntryInProgression(entry); // update the primary progression object
      return true;
    },
    /**
     * Displays the page pageNumber and stops a potentially playing YouTube video
     * @param pageNumber
     */
    updatePage(pageNumber) {
      const pastPage = this.pageNumber;
      if (pageNumber != this.pageNumber) {
        $(`#page${this.pageNumber}`).hide();
        this.pageNumber = pageNumber;
        $(`#page${this.pageNumber}`).show();
      }
      console.log(`Current page number: ${this.pageNumber}`);
      window.scrollTo(0, 0);
      // Stop Youtube videos
      try {
        const elements = $(`#page${pastPage}`);
        Object.values(elements).forEach((element) => {
          this.stopVideo(element);
        });
      } catch (error) {
        // console.warn("Impossible to stop video automatically");
        // console.warn(error);
      }
    },
    /**
     * Sends entries to ensure intermediate backups.
     * @returns {Promise<boolean>} whether entries update succeeded or not.
     */
    async updateEntries() {
      if (!this.progression.entries) {
        return true;
      }
      if (this.isFrozen){
        // Not updatable-state
        return true;
      }
      let isUpdated = true;
      const entriesToValidate = this.progression.entries.filter(entry => {
        return entry.page === this.pageNumber
      });
      for (const entry of entriesToValidate) {
        if (!(await this.updateEntry(entry))) {
          isUpdated = false;
          console.log("Validation of entry failed:", entry);
        }
      }
      if (!isUpdated) {
        this.titleError = "Impossible d'envoyer tes réponses !";
        this.messageError =
          "Tes réponses sont bloquées ici ! Réessaie pour voir ?";
        this.$bvModal.show("errorModal-VAL");
        return false;
      }
      return true;
    },

    // PAGE CHANGES
    hasNext() {
      return this.pageNumber < this.activity.page;
    },
    async previousPage() {
      await this.updateEntries();
      this.updatePage(this.pageNumber - 1)
    },
    async nextPage() {
      this.loading = true;
      if (!(await this.updateEntries())){
        this.loading = false;
        return
      }
      if (this.isFrozen){
        // Not updatable-state
        await this.updatePage(this.pageNumber + 1);
        this.loading = false;
        return;
      }
      const checkMessage = this.checkEntries(this.pageEntries())
      if (checkMessage) {
        this.checkText = checkMessage
        this.checkCallback = () => {
          this.$bvModal.hide("checkModal");
          this.updatePage(this.pageNumber + 1);
        }
        this.$bvModal.show("checkModal");
      } else {
        await this.updatePage(this.pageNumber + 1);
      }
      this.loading = false;
    },
    // Go to previous/next page or validate
    async validatePage() {
      this.loading = true;
      const isUpdated = await this.updateEntries();
      this.loading = false;
      if (!isUpdated) {
        return false;
      }
      // Try to send the updated progression

      // CASE 1: an adult is on the page (rare case)
      if (this.role !== "jeune") {
        // Nothing happens.
      }

      // CASE 2: a 'jeune' is on the page
      // FIRST OPTION: the activity is finished, reviewing or validated
      else if (this.isFrozen) {
        // Cannot send this type of progression !
        this.titleError = "Impossible d'envoyer tes réponses !";
        this.messageError =
          "Tu as déjà envoyé cette activité ! Elle se trouve maintenant dans Mes activités où tu peux suivre la progression de sa validation !";
        this.linkMessage = "Voir Mes activités";
        this.linkError = "/progression";
        this.$bvModal.show("errorModal-VAL");
        return false;
      }
      // SECOND OPTION: an error occurred previously and the progression has no id
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
      // THIRD OPTION: the activity has a correct state: it can be sent!
      else {
        this.validationMessage = this.checkEntries(this.progression.entries);
        if (this.validationMessage) {
          console.warn("Entries not complete");
        }
        // This modal integrates the logic to send the completed progression
        this.$bvModal.show("validateActivityModal");
      }
    },
  },
};
</script>

<style scoped>
/* Require main.css */

.activity-container {
  border: dashed;
  border-color: var(--default);
  border-width: thick;
  padding: 0.5rem 0.5rem;
  margin-top: 1rem;
  margin-bottom: 2rem;
  background-color: #fafafa;
  border-radius: 0.3rem;
}

.details-container {
  margin: 0.5rem;
  padding: 0.5rem;
}

.content-container {
  margin: 1rem;
  padding: 1rem;
}

.end-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.submit-container {
  display: flex;
  flex-wrap: wrap;
}

h1.activity-title {
  color: var(--default);
}
</style>
