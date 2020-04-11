<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="form-group" v-for="(question, indexQ) in tabQuestions" :key="indexQ">
          <div class="form-label">
            <b>Question {{indexQ + 1}} :</b>
            {{question.text}}
          </div>
          <div class="form-check" v-for="(proposition, indexP) in question.reponses" :key="indexP">
            <input
              class="form-check-input"
              type="checkbox"
              :name="'q' + indexQ"
              :id="'q' + indexQ + 'r' + indexP"
              v-bind:value="proposition.value"
              v-model="proposition.value"
            />
            <label class="form-check-label" :for="'q' + indexQ + 'r' + indexP">{{proposition.text}}</label>
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
      q2: 'init',
      tabQuestions: []
    };
  },
  created() {
    for(var i = 0; i < this.questions.length; i++) {
      this.tabQuestions.push({
        text: this.questions[i].question,
        reponses: []
      })

      for(var j = 0; j < this.questions[i].reponses.length; j++) {
        this.tabQuestions[i].reponses.push({
          text: this.questions[i].reponses[j],
          value: false
        })
      }
    }

    console.log(this.questions);
    console.log(this.q2);
  },
  methods: {
    /* Submits the text to the server */
    // TODO
    submitQcm() {
      var reponse = [];

      for (let i = 0; i < this.tabQuestions.length; i++) {
        reponse.push({
          text: this.tabQuestions[i].text,
          reponses: []
        })

        for(var j = 0; j < this.tabQuestions[i].reponses.length; j++) {
          if(this.tabQuestions[i].reponses[j].value) {
            reponse[i].reponses.push(this.tabQuestions[i].reponses[j].text)
          }
        }
        
      }


      console.log(reponse);
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
