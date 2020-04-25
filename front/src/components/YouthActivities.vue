<template>
  <div class="container mt-4">
    <h1>
      Activitées de mes jeunes <br />
      Groupe {{ group.code_structure }}
    </h1>
    <div>
      <button class="btn btn-primary" @click="pollData()">Mettre à jour</button>
      <b-dropdown
        id="dropdown-parcours"
        :text="currentParcours"
        variant="primary"
        class="m-md-2"
      >
        <b-dropdown-item @click="filterParcours(4)"
          >Tous les parcours</b-dropdown-item
        >
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item @click="filterParcours(0)"
          >Bosses et Bobos</b-dropdown-item
        >
        <b-dropdown-item @click="filterParcours(1)"
          >Trois étoiles</b-dropdown-item
        >
        <b-dropdown-item @click="filterParcours(2)">Cés'Arts</b-dropdown-item>
        <b-dropdown-item @click="filterParcours(3)">Robinson</b-dropdown-item>
      </b-dropdown>
      <b-dropdown
        id="dropdown-parcours"
        text="Mes jeunes"
        variant="primary"
        class="m-md-2"
      >
        <b-dropdown-item @click="filterRole(3)"
          >Voir tout le groupe</b-dropdown-item
        >
        <b-dropdown-item @click="filterRole(3)"
          >Voir mes jeunes</b-dropdown-item
        >
      </b-dropdown>
      <b-dropdown
        id="dropdown-parcours"
        text="Filter par performance"
        variant="primary"
        class="m-md-2"
      >
        <b-dropdown-item>Tous les jeunes</b-dropdown-item>
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item>Les plus nuls</b-dropdown-item>
        <b-dropdown-item>Les plus géniaux</b-dropdown-item>
        <b-dropdown-item>Les pénibles</b-dropdown-item>
        <b-dropdown-item>Les invisibles</b-dropdown-item>
        <b-dropdown-item>Les fayots</b-dropdown-item>
        <b-dropdown-item>Les plus péda</b-dropdown-item>
      </b-dropdown>
    </div>
    <Spinner :activated="loading" />

    <!-- /#wrapper -->
    <div class="container">
      <div
        role="tablist"
        v-for="user in group.users"
        v-bind:key="user.code_adherent"
      >
        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button
              block
              href="#"
              v-b-toggle="`accordion-${user.code_adherent}`"
              :style="
                `background: ${changeParcoursColor(
                  user.progressions && user.progressions.length
                    ? user.progressions[0].idParcours
                    : 4
                )};`
              "
              >{{ user.code_adherent }} ({{ user.role }})</b-button
            >
          </b-card-header>
          <b-collapse
            :id="`accordion-${user.code_adherent}`"
            visible
            accordion="my-accordion"
            role="tabpanel"
          >
            <b-card-body>
              <span v-if="!user.progressions || !user.progressions.length"
                >Le jeune n'a pas encore démarré son BET.</span
              >
              <table
                class="table"
                v-if="user.progressions && user.progressions.length"
              >
                <thead>
                  <tr>
                    <th scope="col"></th>
                    <th scope="col">Activité</th>
                    <th scope="col">État</th>
                    <th scope="col">Durée prise par le jeune</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="progression in user.progressions"
                    :key="progression.id"
                    v-b-modal="'validationModal'"
                    @click="sendInfo(progression)"
                    :style="
                      'cursor: pointer; color:' +
                        changeParcoursColor(progression.idParcours)
                    "
                  >
                    <td>
                      <svg
                        class="bi bi-play-fill"
                        width="1em"
                        height="1em"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        style="display: inline"
                      >
                        <path
                          d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 010 1.393z"
                        />
                      </svg>
                    </td>
                    <td>
                      {{
                        getActivityName(
                          progression.idParcours,
                          progression.idActivite
                        )
                      }}
                    </td>
                    <td>
                      <img
                        :src="`/img/icons/${progression.state}.png`"
                        alt=""
                        class="icon"
                      />
                      {{ getStateName(progression.state) }}
                    </td>
                    <td>
                      {{
                        getTimeDiff(
                          progression.finishedAt,
                          progression.startedAt
                        )
                      }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </b-card-body>
          </b-collapse>
        </b-card>
      </div>
    </div>
    <p v-if="!loading && !group.users.length">
      Aucun jeune trouvé dans le groupe.
    </p>
    <!-- Modal -->
    <ValidationModal :progression="currentProgression" />
  </div>
</template>

<script>
import ValidationModal from "./includes/ValidationModal";
import Spinner from "./includes/Spinner";
import itineraryHelpers from "./../service/itineraryHelpers";
import ProgressionHelpers from "./../service/progressionHelpers";
import { VALID_STATES } from "./../service/progressionHelpers";

import Vue from "vue";
import BootstrapVue from "bootstrap-vue";
import VueRouter from "vue-router";
import ProgressionService from "../service/progression.service";

Vue.use(BootstrapVue);
Vue.use(VueRouter);

export default {
  name: "YouthActivities",
  components: { ValidationModal, Spinner },
  data() {
    return {
      loading: true,
      idParcours: 4, // deprecated
      currentParcours: "Filtrer par parcours",
      currentProgression: {},
      progressions: [], // deprecated
      displayProgressions: [], // deprecated
      text: "blabla", // deprecated
      group: undefined,
      counter: {
        NOTSTARTED: 0,
        INPROGRESS: 0,
        FINISHED: 0,
        REVIEWING: 0,
        VALIDATED: 0,
        REFUSED: 0,
      },
      interval: null,
    };
  },
  async mounted() {
    await this.loadProgressions();
  },

  // not working...
  ready() {
    this.pollData().then(console.log("updated!"));
    // reload data every 30 seconds
    this.interval = setInterval(
      function() {
        this.pollData().then(console.log("updated!"));
      }.bind(this),
      30000
    );
  },
  beforeDestroy: function() {
    clearInterval(this.interval);
  },

  methods: {
    async pollData() {
      await this.loadProgressions();
    },
    async loadProgressions() {
      this.loading = true;
      let group = await ProgressionService.getGroup();
      if (group && group.users && group.code_structure) {
        this.group = group;
        this.group.users.forEach((user) => {
          user.globalProgression = 20;
          user.idParcours = 3;
        });
      } else {
        this.group = {
          code_structure: "Inconnu",
          users: [
            {
              code_adherent:
                "Une erreur de chargement est survenue. Merci de recharger la page.",
            },
            {
              code_adherent: "1000000012",
              role: "jeune",
              progressions: [
                {
                  id: "00501cdc-a12d-416d-8644-5228d1111713",
                  idActivite: "9",
                  idParcours: "0",
                  nom: "",
                  state: "VALIDATED",
                },
              ],
            },
            {
              code_adherent: "1000000013",
              role: "jeune",
              progressions: [],
            },
          ],
        };
      }
      this.countProgressionStates();
      this.displayProgressions = this.progressions;
      this.loading = false;
    },

    getActivity: ProgressionHelpers.getActivityFromLocalStorage,
    getActivityName(idParcours, idActivite) {
      const activity = this.getActivity(idParcours, idActivite);
      if (!activity) {
        return "Activité invalide";
      }
      return activity.nom || "Activité au nom inconnu";
    },
    getStateName: ProgressionHelpers.getStateName,
    getTimeDiff: ProgressionHelpers.getTimeDiff,
    sendInfo(progression) {
      this.currentProgression = progression;
    },
    countProgressionStates() {
      this.progressions.forEach((progression) => {
        if (VALID_STATES.includes(progression.state)) {
          this.counter[progression.state]++;
        }
      });
    },
    getParcoursName(idParcours) {
      return itineraryHelpers.getParcoursName(idParcours);
    },
    changeParcoursColor(idParcours) {
      return itineraryHelpers.getItineraryColor(idParcours);
    },
    filterParcours(idParcours) {
      if (idParcours == 4) {
        this.displayProgressions = this.progressions;
        this.currentParcours = "Tous les parcours";
      } else {
        this.currentParcours = this.getParcoursName(idParcours);
        this.displayProgressions = this.progressions.filter((progression) => {
          return progression.idParcours == idParcours;
        });
      }
    },
    filterRole(roles) {
      // todo
    },
  },
};
</script>

<style scoped>
.icon {
  width: 30px;
}

.choices-container {
  margin-top: 3em;
}

.choices {
  display: flex;
  justify-content: space-evenly;
}

#activities p {
  margin: 0;
}

#activities p {
  width: 20%;
}

#activities p:first-of-type {
  width: 45%;
}

#activities p:last-of-type {
  text-align: right;
}

.choices li {
  list-style-type: none;
}

.choice {
  border: solid;
  cursor: pointer;
  padding: 1em;
  border-radius: 10px;
  transition: background-color 0.3s, color 0.3s, border 0.3s;
}

.choice:hover {
  transform: translate(0, -10px);
}

.active {
  background-color: #0077b3;
  border: solid #0077b3;
  color: white;
}
</style>
