<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-primary ">
      <router-link to="/" class="navbar-brand text-white">
        <img
          class="logo"
          src="/img/logo-BET-france.png"
          alt=""
        />
        <span class="logo-title">BET 3.0</span></router-link
      >

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item active">
            <router-link class="nav-link text-white" to="/parcours"
              >Parcours</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/progression"
              >Progression personelle</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/">Halte</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/"
              >Espace écoute</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/"
              >Progression Générale</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/">Forum</router-link>
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
.navbar {
  height: 3rem;
}
.navbar-brand {
  height: inherit;
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
}
</style>
