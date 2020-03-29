<template>
    <div>
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
        <div class="progress">
            <div class="progress-bar bg-warning progress-bar-striped progress-bar-animated" role="progressbar" v-bind:style="{width: progress + '%'}" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">{{progress}}%</div>
        </div>
    </div>

</template>

<script>
    export default {
        data(){

            return {
                isConnected: true,
                progress: 40
          }
        },
        name: "NavComponent"
    }
</script>

<style scoped>

</style>
