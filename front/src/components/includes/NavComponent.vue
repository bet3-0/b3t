<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-primary ">
    <router-link to="/" class="navbar-brand text-white">
      <img
        class="logo"
        src="/img/logo-BET-france.png"
        alt=""
        ondblclick="alert('Tu veux de la potion magique ?')"
      />
      <span class="logo-title">BET 3.0</span></router-link
    >

    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item active" v-if="role === 'jeune'">
          <router-link class="nav-link text-white" to="/parcours">{{
            activityNavItem
          }}</router-link>
        </li>
        <li class="nav-item" v-if="['relecteur', 'admin'].includes(role)">
          <router-link class="nav-link text-white" to="/validation"
            >Activités à valider</router-link
          >
        </li>
        <li class="nav-item" v-if="role === 'jeune'">
          <router-link class="nav-link text-white" to="/progression"
            >Mes activités</router-link
          >
        </li>
        <li class="nav-item" v-if="['chef'].includes(role)">
          <router-link class="nav-link text-white" to="/groupe"
          >Progression de mes jeunes
          </router-link
          >
        </li>
        <li class="nav-item" v-if="['ap'].includes(role)">
          <router-link class="nav-link text-white" to="/territoire"
            >Progression des jeunes de mon territoire</router-link
          >
        </li>
        <li class="nav-item" v-if="['jeune'].includes(role)">
          <router-link class="nav-link text-white" to="/halte"
            >Halte</router-link
          >
        </li>
        <li class="nav-item">
          <router-link class="nav-link text-white" to="/activity/4/2"
            >Espace prévention</router-link
          >
        </li>
        <li class="nav-item">
          <router-link class="nav-link text-white" to="/aventure/1"
            >Aventure</router-link
          >
        </li>
        <li class="nav-item">
          <router-link
            class="nav-link text-white"
            v-if="role === 'admin'"
            to="/"
            >Progression générale</router-link
          >
        </li>
      </ul>
    </div>
    <div
      @click.prevent="logOut"
      class="btn bg-light my-2 my-sm-0"
      v-if="isConnected"
    >
      Se déconnecter
    </div>
    <router-link to="/login" class="btn bg-light my-2 my-sm-0" v-else
      >Se connecter</router-link
    >
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
  </nav>
</template>

<script>
export default {
  name: "NavComponent",
  computed: {
    isConnected() {
      return this.$store.state.auth.user;
    },
    role() {
      if (this.$store.state.auth.user) {
        return this.$store.state.auth.user.role || "jeune";
      }
      return "jeune";
    },
    activityNavItem() {
      if (isNaN(this.$store.state.parcours.parcours)) {
        return "Choix de parcours";
      }
      return "Choix des activités";
    },
  },
  methods: {
    logOut() {
      this.$store.dispatch("auth/logout");
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.navbar-brand {
  height: 3rem;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
}
.logo-title {
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  color: white;
  font-family: "Caveat Brush";
}
.logo {
  height: 100%;
  max-height:50px;
}
</style>
