<template>
  <div class="container mt-4">
    <h1>
      {{role ==='ap' ? 'Activités des jeunes de mon territoire' : 'Activités de mes jeunes'}} <br/>
      {{role ==='ap' ? 'Territoire' : 'Groupe'}} {{ structure.code_structure }}
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
        :text="currentStatesName"
        variant="primary"
        class="m-md-2"
      >
        <b-dropdown-item @click="filterState('ALL')">Toutes les progressions</b-dropdown-item>
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item @click="filterState(_state)" v-bind:key="_state" v-for="_state in validStates"
        >{{getStateName(_state)}}
        </b-dropdown-item>
      </b-dropdown>
      <b-dropdown
        :text="currentRolesName"
        class="m-md-2"
        id="dropdown-parcours"
        variant="primary"
      >
        <b-dropdown-item @click="filterRole(['jeune', 'chef', 'ap'])"
        >Voir tout le {{role==='ap' ? 'territoire': 'groupe'}}
        </b-dropdown-item
        >
        <b-dropdown-item @click="filterRole(['jeune'])"
        >Voir les jeunes
        </b-dropdown-item>
        <b-dropdown-item @click="filterRole(['chef', 'ap'])"
        >Voir les autres adultes
        </b-dropdown-item
        >
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
                <span style="text-align: left; flex-grow: 1">{{ user.role }} {{ user.code_adherent }} {{ role==='ap' ? `(Groupe: ${user.code_structure_groupe})`: '' }}</span>
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
                  v-for="progression in filterProgressions(user.progressions)"
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
                  <td> {{ getActivityName( progression) }}</td>
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
    <!-- Modal with detailed information on the activity -->
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
        role: this.$store.state.auth.user ? this.$store.state.auth.user.role : undefined,
        validStates: VALID_STATES,
        currentParcoursName: "Filtrer par parcours",
        currentParcours: ["0", "1", "2", "3", undefined],
        currentStatesName: "Filter par état d'avancement",
        currentStates: VALID_STATES,
        currentRolesName: "Mes jeunes",
        currentRoles: ["jeune"],
        currentProgression: {},
        structure: {"code_structure": "[chargement...]"},
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
        if (!this.structure.users) {
          return []
        }
        return this.structure.users.filter(
          (user) => {
            return this.currentRoles.includes(user.role) && this.currentParcours.includes(user.idParcours)
          }
        );
      },
    },
    async mounted() {
      await this.loadProgressions();
    },

    methods: {
      // Fetch functions
      async pollData() {
        await this.loadProgressions();
      },
      async loadProgressions() {
        this.loading = true;
        let structure = {}
        switch (this.role) {
          case 'chef':
            structure = await ProgressionService.getGroup();
            break
          case 'ap':
            structure = await ProgressionService.getTerritoire();
            break;
          default:
            alert("Tu n'as pas les droits pour accéder à cette page !")
            return this.$router.push('/')
        }
        if (structure && structure.users && structure.code_structure) {
          structure.users.forEach((user) => {
            user.globalProgression = activityService.getGlobalProgressionFromProgressions(user.progressions);
            user.idParcours = activityService.getParcoursFromProgressions(user.progressions);
          });
          this.structure = structure;
        } else {
          alert("Impossible de charger la page ! Merci de la recharger pour réessayer.")
          this.structure = {
            code_structure: "Inconnu",
          };
        }
        this.loading = false;
      },
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
      getActivity: ProgressionHelpers.getActivityFromLocalStorage,
      getActivityName(progression) {
        if (progression.nom) {
          return progression.nom
        }
        const activity = this.getActivity(progression.idParcours, progression.idActivite);
        if (!activity) {
          return "Activité invalide";
        }
        return activity.nom || "Activité au nom inconnu";
      },
      getStateName: ProgressionHelpers.getStateName,
      getTimeDiff: ProgressionHelpers.getTimeDiff,
      getDate: ProgressionHelpers.timestampToPrettyDate,
      sendInfo(progression) {
        this.currentProgression = progression;
      },
      getParcoursName(idParcours) {
        return itineraryHelpers.getParcoursName(idParcours);
      },
      getParcoursColor(idParcours) {
        return itineraryHelpers.getItineraryColor(idParcours);
      },

      // Filters
      filterParcours(idParcours) {
        if (idParcours == 4) {
          this.currentParcoursName = "Tous les parcours";
          this.currentParcours = ["0", "1", "2", "3", undefined]
        } else {
          this.currentParcoursName = this.getParcoursName(idParcours);
          this.currentParcours = [idParcours.toString()]
        }
      },
      filterState(state) {
        if (state === 'ALL') {
          this.currentStatesName = "Toutes les progressions"
          this.currentStates = this.validStates
        } else {
          this.currentStatesName = this.getStateName(state)
          this.currentStates = [state]
        }
      },
      filterRole(roles) {
        this.currentRoles = roles
        this.currentRolesName = "Filtre par: " + roles
      },
      filterProgressions(progressions) {
        if (!progressions) {
          return []
        }
        console.log(progressions)
        return progressions.filter(
          (progression) => {
            return this.currentStates.includes(progression.state)
          }
        );
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
