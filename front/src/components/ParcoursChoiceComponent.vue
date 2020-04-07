<template>
    <div class="container">
        <h1>Choisi ton parcours</h1>
        <div class="row">
            <div class="col-md-3">
                <img @click="selectChoice('bosse et bobos')" src="@/assets/img/bosseEtBobo.png" alt="">
            </div>
            <div class="col-md-3">
                <img @click="selectChoice('robinson')" src="@/assets/img/robinson.png" alt="">
            </div>
            <div class="col-md-3">
                <img @click="selectChoice('cesarts')" src="@/assets/img/cesArt.png" alt="">
            </div>
            <div class="col-md-3">
                <img @click="selectChoice('trois étoiles')" src="@/assets/img/troisEtoiles.png" alt="">
            </div>
        </div>
    </div>
</template>

<script>

    import Vue from 'vue'
    import VueRouter from "vue-router";

    Vue.use(VueRouter)

    export default {
        name: "ParcoursChoiceComponent",
        methods: {
            selectChoice(selected){
                console.log(selected)
                this.$router.push('/activitees')
            },
        }
    }
</script>

<style scoped>
    .container{
        text-align: center;
    }
    .col-md-3 img{
        max-width: 100%;
        cursor: pointer;
    }


</style>