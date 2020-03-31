<!-- ActivityComponent
Base Component for an activity page -->

<template>
  <div class="container" role="main" onload="changeParcoursColor()">
    <div id="main-container" class="activity-container">
      <h1 class="activity-title" :style="'color:' + changeParcoursColor()">
        {{ activity.nom }}
      </h1>
      <div class="details-container">
        <a
          class="btn btn-secondary"
          data-toggle="collapse"
          href="#details"
          role="button"
          aria-expanded="false"
          aria-controls="details"
        >
          Details
        </a>
        <div class="collapse" id="details">
          <div class="card card-body">
            <ul>
              <li>Description: {{ activity.description }}</li>
              <li>Matériel: {{ activity.materiel }}</li>
              <li>Durée: {{ activity.duree }}</li>
              <li>Difficulté: {{ activity.difficulte }}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="content-container">
        <!-- Activité -->
        <span v-html="activityFile"></span>
      </div>
      <div class="end-container">
        <div class="submit-container">
          <!-- Choisir parmi ces deux rendus en fonction de l'activité -->
          <UploadFile :activityId="activity.id" />
          <UploadText :activityId="activity.id" />
        </div>
        <div class="next-container">
          <ValidateActivityPage
            :activity="activity"
            :pageNumber="pageNumber ? pageNumber : 1"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UploadFile from "./includes/activityComponents/UploadFile";
import UploadText from "./includes/activityComponents/UploadText";
import ValidateActivityPage from "./includes/activityComponents/ValidateActivityPage";

function getParcoursColor(idParcours) {
  switch (idParcours) {
    case 0:
      return "var(--bosses-et-bobos)";
    case 1:
      return "var(--trois-etoiles)";
    case 2:
      return "var(--cesart)";
    case 3:
      return "var(--robinson)";
    default:
      return "var(--default)";
  }
}

export default {
  name: "ActivityComponent",
  components: { UploadFile, UploadText, ValidateActivityPage },
  props: { pageNumber: Number },
  data() {
    return {
      activity: {
        id: 65,
        idParcours: 0,
        nom: "Activité !",
        materiel: "Plein de matos!",
        pages: 1
      },
      activityFile: "<b>Mon activité trop stylée en <i>HTML</i> !</b>"
    };
  },
  methods: {
    changeParcoursColor() {
      console.log(this.activity.idParcours);
      let color = getParcoursColor(this.activity.idParcours);
      console.log(color);
      return color;
    }
  }
};
</script>

<style scoped>
/* Require main.css */

.activity-container {
  border: dashed;
  border-color: var(--default);
  border-width: thick;
  padding: 2rem 2rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
  background-color: #e9ecef; /* to be changed ? */
  border-radius: 0.3rem;
}
.details-container {
  margin: 1rem;
  padding: 1rem;
}

.content-container {
  margin: 1rem;
  padding: 1rem;
}

.end-container {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-evenly;
  align-items: center;
}
.submit-container {
  display: flex;
  flex-wrap: wrap;
}
.next-container {
  margin: 1rem;
}
h1.activity-title {
  color: var(--default);
}
</style>
