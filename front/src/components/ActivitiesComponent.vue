<template>
    <div class="container mt-4">
      <h1>Bosses et bobos</h1>
        <div class="row mb-5 mt-1">
            <div class="col-4" style="text-align: center">
                <button class="choice" @click.prevent.stop.capture="change('parcours')" :class="parcours">Ordre
                    alpabetique
                </button>
            </div>
            <div class="col-4" style="text-align: center">
                <button class="choice" @click.prevent.stop.capture="change('duration')" :class="duration">Classer par
                    durée
                </button>
            </div>
            <div class="col-4" style="text-align: center">
                <button class="choice" @click.prevent.stop.capture="change('difficult')" :class="difficult">Classer par
                    difficulté
                </button>
            </div>

        </div>


        <!-- /#wrapper -->
        <div class="container">
            <table class="table">
                <thead>
                <tr>
                    <th scope="col"></th>
                    <th scope="col">Nom</th>
                    <th scope="col">Difficulté</th>
                    <th scope="col">durée</th>
                </tr>
                </thead>
                <tbody>
                    <tr v-for="activity in displayActivities" :key="activity.id" v-b-modal="'activityModal'" @click="sendInfo(activity)" style="cursor: pointer">
                        <td>
                            <svg class="bi bi-play-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" style="display: inline">
                                <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 010 1.393z"/>
                            </svg>
                        </td>
                        <td>{{ activity.nom }}</td>
                        <td>{{ activity.difficult | difficult }}</td>
                        <td>{{ activity.duree }} min</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Modal -->
        <ActivityModal :activity="currentActivity"/>
    </div>
</template>

<script>
    import ActivityModal from "./includes/ActivityModal";
    import activityService from './../service/activity'
    import Vue from "vue";
    import BootstrapVue from "bootstrap-vue";
    import VueRouter from "vue-router";

    Vue.use(BootstrapVue);
    Vue.use(VueRouter);

    export default {
        name: "ActivitiesComponent",
        components: {ActivityModal},
        props: ["idParcours"],
        data() {
            return {
                parcours: '',
                duration: '',
                difficult: '',
                red: '',
                currentActivity: {},
                activities: [],
                displayActivities: []
            };
        },
        mounted() {
            this.activities = activityService.getAllActivity()
            this.displayActivities = this.activities
        },
        methods: {
            sendInfo(activity) {
                this.currentActivity = activity;
            },

            change(data) {
                if (data === 'parcours') {
                    this.displayActivities = this.activities
                    this.displayActivities.sort(function (item, other) {
                        if (item.nom < other.nom) {
                            return -1;
                        }
                        if (item.nom > other.nom) {
                            return 1;
                        }
                    })
                }


                if (data === 'difficult') {
                    this.displayActivities = this.activities
                    this.displayActivities.sort(function (item, other) {
                        if (item.difficult < other.difficult) {
                            return -1;
                        }
                        if (item.difficult > other.difficult) {
                            return 1;
                        }
                    })
                }

                if (data === 'duration') {
                    this.displayActivities = this.activities
                    this.displayActivities.sort(function (item, other) {
                        if (item.duree < other.duree) {
                            return -1;
                        }
                        if (item.duree > other.duree) {
                            return 1;
                        }
                    })
                }

                data === 'parcours' ? this[data] = this[data] === '' ? 'active' : '' : this.parcours = ''
                data === 'duration' ? this[data] = this[data] === '' ? 'active' : '' : this.duration = ''
                data === 'difficult' ? this[data] = this[data] === '' ? 'active' : '' : this.difficult = ''
                data === 'red' ? this[data] = this[data] === '' ? 'active' : '' : this.red = ''
            },

            getParcoursName(idParcours) {
                switch (idParcours) {
                    case 0:
                        return "Bosses et Bobos";
                    case 1:
                        return "Trois étoiles";
                    case 2:
                        return "Cés'Art";
                    case 3:
                        return "Robinson";
                    default:
                        return "La Halte"; // où mettre la halte ?
                }
            }
        }
    };
</script>

<style scoped>
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
