<template>
  <div v-html="data">
  </div>
  </template>
<script>

export default {
  name: "ActivityContentSample",
  mounted() {
    let a = this.$parent.$parent.$data.activity.idParcours
    let b = this.$parent.$parent.$data.activity.id
    console.log( a )
    console.log( b )
    this.data = require('@/activities/' + a + '/' + b + '/content.html')
    this.data = require('@/activities/0/45/content.html')
    console.log(this.idParcours)
    console.log(this.id)
  },
  data(){
    return{
      data: null,
      idParcours: null,
      idActivity: null
    }
  }

}
</script>

<style scoped>
.img-center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  max-width: 80%;
}
</style>