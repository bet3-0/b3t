<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="form-group" v-for="(question, indexQ) in questions" :key="indexQ">
          <div class="form-label">
            <b>Question {{indexQ + 1}} :</b> {{question.question}}
          </div>
          <div class="form-check" v-for="(proposition, indexP) in question.reponses" :key="indexP">
            <input class="form-check-input" type="radio" :name="'q' + indexQ" :id="'q' + indexQ + 'r' + indexP" value="option1" />
            <label class="form-check-label" :for="'q' + indexQ + 'r' + indexP">{{proposition}}</label>
          </div>
        </div>
      </div>


      <br />
      
      <button
        class="btn btn-primary"
        type="button"
        v-on:click="submitText()"
      >Envoyer mon résultat</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Qcm",
  props: ["activityId", "entryId", "changeEntryState", "questions"],
  data() {
    return {
      text: ""
    };
  },
  created() {
    console.log(this.questions);
  },
  methods: {
    /* Submits the text to the server */
    // TODO
    submitText() {
      console.log("Not Implemented");
      this.changeEntryState(this.entryId, "finished");
      return {};
    }
  }
};
</script>
<style scoped>
.form-group {
  text-align: left;
}

.input-group {
  margin: 1rem;
  display: flex;
}

.btn {
  word-wrap: break-word;
}
</style>
