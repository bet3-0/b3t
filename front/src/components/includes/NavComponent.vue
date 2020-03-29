<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-primary ">
        <router-link to="/" class="navbar-brand text-white">BET 2k20</router-link>

        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item active">
                    <router-link class="nav-link text-white" to="/">Parcours</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link text-white" to="/">Progression personelle</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link text-white" to="/">Halte</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link text-white" to="/">Espace écoute</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link text-white" to="/">Progression Générale</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link text-white" to="/">Forum</router-link>
                </li>
            </ul>
        </div>
        <router-link to="/login" class="btn bg-light my-2 my-sm-0" v-if="isConnected"> Se connecter</router-link>
        <router-link to="/login" class="btn bg-light my-2 my-sm-0" v-else>Se déconnecter</router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
              aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    </nav>
</template>

<script>
    export default {
        data(){

          return {
            isConnected: true
          }
        },
        name: "NavComponent"
    }
</script>

<style scoped>

</style>
