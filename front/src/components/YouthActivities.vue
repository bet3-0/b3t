<template>
  <div class="container mt-4">
    <h1>
      Activitées de mes jeunes <br/>
      Groupe {{ group.code_structure }}
    </h1>
    <div>
      <button class="btn btn-primary" @click="pollData()">Mettre à jour</button>
      <b-dropdown
        id="dropdown-parcours"
        :text="currentParcoursName"
        variant="primary"
        class="m-md-2"
      >
        <b-dropdown-item @click="filterParcours(4)"
        >Tous les parcours
        </b-dropdown-item>
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item @click="filterParcours(0)"
        >Bosses et Bobos
        </b-dropdown-item
        >
        <b-dropdown-item @click="filterParcours(1)"
        >Trois étoiles
        </b-dropdown-item
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
        >Voir tout le groupe
        </b-dropdown-item
        >
        <b-dropdown-item @click="filterRole(3)"
        >Voir mes jeunes
        </b-dropdown-item
        >
      </b-dropdown>
      <b-dropdown
        id="dropdown-parcours"
        :text="currentState"
        variant="primary"
        class="m-md-2"
      >
        <b-dropdown-item @click="filterState('ALL')">Toutes les progressions</b-dropdown-item>
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item @click="filterState(_state)" v-bind:key="_state" v-for="_state in validStates"
        >{{getStateName(_state)}}
        </b-dropdown-item>
      </b-dropdown>
    </div>
    <Spinner :activated="loading"/>

    <!-- /#wrapper -->
    <div class="container">
      <div
        role="tablist"
        v-for="user in filteredUsers"
        v-bind:key="user.code_adherent"
      >
        <b-card no-body class="mb-1">
          <b-card-header class="p-2" header-tag="header" role="tab">
            <b-button
              block
              href="#"
              v-b-toggle="`accordion-${user.code_adherent}`"
              style="background-color: #fafafa"
            >
              <div class="user-accordion-button">
                <span style="text-align: left; flex-grow: 1">{{ user.role }} {{ user.code_adherent }}</span>
                <div class="progress" style="height: inherit; flex-grow: 4">
                  <div :aria-valuenow="user.globalProgression || 0"
                       :style="`width: ${user.globalProgression || 0}%; background: ${getParcoursColor(user.idParcours)};`"
                       aria-valuemax="100"
                       aria-valuemin="0" class="progress-bar" role="progressbar">
                    {{ user.globalProgression ? user.globalProgression.toFixed(0) : 0 }}%
                  </div>
                </div>
                <span style="text-align: right; flex-grow: 1">Parcours {{getParcoursName(user.idParcours)}}</span>
              </div>
            </b-button
            >
          </b-card-header>
          <b-collapse
            :id="`accordion-${user.code_adherent}`"
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
                  <th scope="col">Date de réalisation</th>
                  <th scope="col">...</th>
                </tr>
                </thead>
                <tbody>
                <tr
                  :key="progression.id"
                  :style="
                      'cursor: pointer; color:' +
                        getParcoursColor(progression.idParcours)
                    "
                  v-for="progression in user.progressions"
                >
                  <td>
                    <svg
                      class="bi bi-play-fill"
                      fill="currentColor"
                      height="1em"
                      style="display: inline"
                      viewBox="0 0 16 16"
                      width="1em"
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
                  <td
                    @click="sendInfo(progression)"
                    v-b-modal="'validationModal'">
                    <img
                      :src="`/img/icons/${progression.state}.png`"
                      alt=""
                      class="icon"
                    />
                    {{ getStateName(progression.state) }}
                  </td>
                  <td> {{ getDate( progression.finishedAt || progression.startedAt ) }}</td>
                  <td @click="gotToReview(progression)"
                      v-if="['FINISHED', 'REVIEWING', 'VALIDATED', 'REFUSED'].includes(progression.state)"><b>Voir
                    l'activité</b></td>
                </tr>
                </tbody>
              </table>
            </b-card-body>
          </b-collapse>
        </b-card>
      </div>
    </div>
    <p v-if="!loading && !filteredUsers.length">
      Aucun jeune trouvé dans le groupe avec ces critères.
    </p>
    <!-- Modal -->
    <ValidationModal :progression="currentProgression"/>
  </div>
</template>

<script>
  import ValidationModal from "./includes/ValidationModal";
  import Spinner from "./includes/Spinner";
  import itineraryHelpers from "./../service/itineraryHelpers";
  import ProgressionHelpers from "./../service/progressionHelpers";
  import activityService from "./../service/activity";
  import {VALID_STATES} from "../service/progressionHelpers";

  import Vue from "vue";
  import BootstrapVue from "bootstrap-vue";
  import VueRouter from "vue-router";
  import ProgressionService from "../service/progression.service";

  Vue.use(BootstrapVue);
  Vue.use(VueRouter);

  export default {
    name: "YouthActivities",
    components: {ValidationModal, Spinner},
    data() {
      return {
        loading: true,
        idParcours: 4, // deprecated
        currentParcoursName: "Filtrer par parcours",
        currentParcours: [0, 1, 2, 3, 4],
        currentState: "Filter par état d'avancement",
        validStates: VALID_STATES,
        currentRoles: ["jeune"],
        currentProgression: {},
        progressions: [], // deprecated
        displayProgressions: [], // deprecated
        text: "blabla", // deprecated
        group: {"code_structure": "[chargement...]"},
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
    computed: {
      filteredUsers() {
        if (!this.group.users) {
          console.log("HERRE")
          return []
        }
        console.log("THEERE")
        return this.group.users.filter(
          (user) => {
            return this.currentRoles.includes(user.role) && this.currentParcours.includes(user.idParcours)
          }
        );
      }
    },
    async mounted() {
      await this.loadProgressions();
    },

    // not working...
    ready() {
      this.pollData().then(console.log("updated!"));
      // reload data every 30 seconds
      this.interval = setInterval(
        function () {
          this.pollData().then(console.log("updated!"));
        }.bind(this),
        30000
      );
    },
    beforeDestroy: function () {
      clearInterval(this.interval);
    },

    methods: {
      gotToReview(progression) {
        this.$store.state.activity.progression = progression;
        this.$router.push(
          "/apercu/" +
          progression.id +
          "/" +
          progression.idParcours +
          "/" +
          progression.idActivite
        );
      },
      async pollData() {
        await this.loadProgressions();
      },
      async loadProgressions() {
        this.loading = true;
        let group = await ProgressionService.getGroup();
        if (group && group.users && group.code_structure) {
          group.users.forEach((user) => {
            user.globalProgression = activityService.getGlobalProgressionFromProgressions(user.progressions);
            user.idParcours = activityService.getParcoursFromProgressions(user.progressions);
          });
          this.group = group;
          console.log(group)
        } else {
          this.group = {
            code_structure: "Inconnu",
            users: [
              {
                code_adherent:
                  "Une erreur de chargement est survenue. Merci de recharger la page.",
                globalProgression: 20,
                idParcours: 0,
              },
              {
                code_adherent: "1000000012",
                role: "jeune",
                globalProgression: 50,
                idParcours: 3,
                progressions: [
                  {
                    id: "00501cdc-a12d-416d-8644-5228d1713",
                    idActivite: "9",
                    idParcours: "3",
                    nom: "",
                    state: "VALIDATED",
                    startedAt: 1587254316,
                  },
                  {
                    id: "00501cdc-a12d-416d44-5228d1111713",
                    idActivite: "9",
                    idParcours: "3",
                    nom: "",
                    state: "FINISHED",
                    startedAt: 1587254316,
                  },
                  {
                    id: "00501cdc-d-416d-8644-5228d1111713",
                    idActivite: "9",
                    idParcours: "3",
                    nom: "",
                    state: "REVIEWING",
                    startedAt: 1587254316,
                  },
                  {
                    id: "0050c-a12d-416d-8644-5228d1111713",
                    idActivite: "9",
                    idParcours: "3",
                    nom: "",
                    state: "INPROGRESS",
                    startedAt: 1587254316,
                  },
                  {
                    id: "01cdc-a12d-416d-8644-5228d1111713",
                    idActivite: "9",
                    idParcours: "3",
                    nom: "",
                    state: "NOTSTARTED",
                    startedAt: 1587254316,
                  },
                  {
                    id: "00501cdc-a12d-416d-8613",
                    idActivite: "10",
                    idParcours: "3",
                    nom: "Blabla",
                    state: "REFUSED",
                    startedAt: 1587254516,
                    finishedAt: 1587281246,
                  },
                ],
              },
              {
                code_adherent: "1000000013",
                role: "jeune",
                progressions: [],
                globalProgression: 100,
                idParcours: 0,
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
      getParcoursColor(idParcours) {
        return itineraryHelpers.getItineraryColor(idParcours);
      },
      getDate: ProgressionHelpers.timestampToPrettyDate,
      filterParcours(idParcours) {
        if (idParcours == 4) {
          this.displayProgressions = this.progressions;
          this.currentParcoursName = "Tous les parcours";
          this.currentParcours = [0, 1, 2, 3, 4]
        } else {
          this.currentParcoursName = this.getParcoursName(idParcours);
          this.displayProgressions = this.progressions.filter((progression) => {
            return progression.idParcours == idParcours;
          });
          this.currentParcours = [idParcours]
        }
      },
      filterState(state) {
        console.log(state)
      },
      filterRole(roles) {
        console.log(roles)
        // todo
      },
    },
  };
</script>

<style scoped>
  .user-accordion-button {
    width: 100%;
    color: var(--default);
    display: flex;
    justify-content: space-between;
    align-items: stretch
  }

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
