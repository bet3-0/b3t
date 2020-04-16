<template>
  <div class="wrap-login">
    <div class="login-pic" data-tilt>
      <img src="img/logo-BET-france.png" alt="BET 2k20" />
    </div>
    <div class="card" style="text-align: center;">
      <div class="card-body">
        <h1 class="card-title">Connexion</h1>
        <p class="card-text">Entre ton identifiant BET !</p>
        <form name="form" @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="idUser">Identifiant :</label>
            <input
              v-model="user.code_adherent"
              v-validate="'required|min:6|max:40'"
              type="text"
              class="form-control"
              id="idUser"
              name="idUser"
            />
            <div
              v-if="errors.has('idUser')"
              class="alert alert-danger"
              role="alert"
            >
              L'identifiant doit avoir 9 chiffres !
            </div>
          </div>
          <div class="form-group">
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span
                v-show="loading"
                class="spinner-border spinner-border-sm"
              ></span>
              <span>Se connecter</span>
            </button>
          </div>
          <div class="form-group">
            <div v-if="message" class="alert alert-danger" role="alert">
              {{ message }}
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import User from "../models/user";
import ProgressionService from "../service/progression.service";

export default {
  name: "LoginComponent",
  data() {
    return {
      user: new User(""),
      loading: false,
      message: "",
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  created() {
    if (this.loggedIn) {
      this.$router.push("/parcours");
    }
  },
  methods: {
    async onLoggin() {
      let pastProgressions = await ProgressionService.getProgressions();
      let gloabalProgression = 0;
      if (pastProgressions) {
        let activities = {};
        pastProgressions.forEach((prog) => {
          if (
            ["FINISHED", "INREVIEW", "VALIDATED", "REFUSED"].includes(
              prog.state
            )
          ) {
            gloabalProgression += parseInt(prog.duration);
          }
          if (!(prog.idParcours in activities)) {
            activities[prog.idParcours] = {};
          }
          if (!(prog.idActvite in activities[prog.idParcours])) {
            activities[prog.idParcours][prog.idActivite] = {};
          }
          activities[prog.idParcours][prog.idActivite] = {
            idParcours: prog.idParcours,
            id: prog.idActvite,
            nom: "Activité",
            progression: prog,
          };
        });
        localStorage.setItem("activities", JSON.stringify(activities));
        localStorage.setItem("progression", gloabalProgression);
      }
      this.$router.push("/parcours");
    },
    async handleLogin() {
      this.loading = true;
      this.$validator.validateAll().then((isValid) => {
        if (!isValid) {
          this.loading = false;
          return;
        }

        if (this.user.code_adherent) {
          this.$store.dispatch("auth/login", this.user).then(
            async () => {
              if (this.loggedIn) {
                await this.onLoggin();
              }
            },
            (error) => {
              this.loading = false;
              console.error(error);
              this.message = "Identifiant incorrect !";
            }
          );
        }
      });
    },
  },
};
</script>

<style scoped>
.wrap-login {
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  padding: 2rem 1rem 1rem 1rem;
}

.login-pic {
  width: 350px;
  flex-shrink: 1;
}

.login-pic img {
  max-width: 100%;
}
</style>
