<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="form-group" v-for="(question, indexQ) in questions" :key="indexQ">
          <div class="form-label">
            <b>Question {{indexQ + 1}} :</b>
            {{question.question}}
          </div>
          <div class="form-check" v-for="(proposition, indexP) in question.reponses" :key="indexP">
            <input
              class="form-check-input"
              type="radio"
              :name="'q' + indexQ"
              :id="'q' + indexQ + 'r' + indexP"
              v-bind:value="proposition"
              v-model="question.value"
            />
            <label class="form-check-label" :for="'q' + indexQ + 'r' + indexP">{{proposition}}</label>
          </div>
        </div>
      </div>

      

      <br />

      <button class="btn btn-primary" type="button" v-on:click="submitQcm()">Envoyer mes réponses</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Qcm",
  props: ["activityId", "entryId", "changeEntryState", "questions"],
  data() {
    return {
      text: "",
      q2: 'init'
    };
  },
  created() {
    for(var i = 0; i < this.questions.length; i++) {
      this.questions[i].value = undefined;
    }

    console.log(this.questions);
    console.log(this.q2);
  },
  methods: {
    /* Submits the text to the server */
    // TODO
    submitQcm() {
      console.log(this.questions);
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
