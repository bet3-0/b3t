<template>
  <div>
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
          <p>En me connectant, j'accepte les mentions légales : <a href="policies">Mentions légales</a></p>
        </div>
      </div>
    </div>
    <ErrorModal :title="titleError" :message="messageError" />
    <CongratsModal :idParcours="idParcours"/>
  </div>
</template>

<script>
import User from "../models/user";
import activityService from "../service/activity";
import ErrorModal from "./includes/ErrorModal";
import CongratsModal from "./includes/CongratsModal";

export default {
  name: "LoginComponent",
  components: {CongratsModal, ErrorModal},
  data() {
    return {
      user: new User(""),
      loading: false,
      message: "",
      titleError: "Connexion impossible !",
      messageError: "",
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
    idParcours() {
      return this.$store.state.parcours.parcours;
    }
  },
  created() {
    if (this.loggedIn) {
      if (this.$route.params.nextUrl != null) {
        this.router.push(this.$route.params.nextUrl);
      } else {
        this.$router.push("/parcours");
      }
    }
  },
  mounted() {
    this.$root.$on('bv::modal::hide', (bvEvent, modalId) => {
      if (modalId === "endModal" && this.$route.path === '/login') {
        this.redirect();
      }
    })
  },
  methods: {
    async onLoggin() {
      // Load activities, past progressions, global progression, parcours
      const isLoaded = await activityService.getAllParcoursWithProgressions();
      if (isLoaded === undefined) {
        this.titleError = "Impossible de charger le contenu !";
        this.messageError =
          "Tu es bien connecté, mais nous parvenons pas à charger la page ! Réessaie pour voir ?";
        this.$bvModal.show("errorModal");
        return;
      }
      if (this.$store.state.progression.globalProgression >= 100) {
        this.$bvModal.show("endModal")
        return
      }
      this.redirect()
    },
    redirect() {
      // redirect
      if (this.$route.params.nextUrl != null) {
        this.$router.push(this.$route.params.nextUrl);
      } else {
        switch (this.$store.state.auth.user.role) {
          case "jeune":
            return this.$router.push("/parcours");
          case "chef":
            return this.$router.push("/youth");
          case "ap":
            return this.$router.push("/territoire");
          case "relecteur":
            return this.$router.push("/validation");
          case "admin":
            return this.$router.push("/validation");
          default:
            return this.$router.push("/");
        }
      }
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
