<template>
  <div class="container" role="main">
    <h1>Halte</h1>
    <div>
      <div
        v-for="description in progressionEntries"
        v-bind:key="description.question"
        style="height: 20rem;position: relative;width: 100%;"
      >
        <div
          style="height:10rem;bottom: 0;left: 0;position: absolute;right: 0;top: 0;transition-duration: 1s;"
        >
          <h2>{{ description.question }}</h2>
          <vue-word-cloud
            :words="description.words"
            :color="
              ([, weight]) =>
                weight > 20
                  ? 'var(--robinson)'
                  : weight > 10
                  ? 'var(--bosses-et-bobos)'
                  : weight > 5
                  ? 'var(--trois-etoiles)'
                  : 'var(--default)'
            "
            font-family="Caveat Brush"
          />
        </div>
      </div>

      <vue-word-cloud :words="words">
        <template slot-scope="{ word, text, weight }">
          <div
            style="cursor: pointer;"
            :title="weight"
            @click="onWordClick(word)"
          >
            {{ text }}
          </div>
        </template>
      </vue-word-cloud>
    </div>
  </div>
</template>

<script>
// import Chance from "chance";
import VueWordCloud from "vuewordcloud";

export default {
  name: "HalteComponent",
  components: {
    [VueWordCloud.name]: VueWordCloud,
  },
  data() {
    return {
      progTest: [
        {
          question: "c'est quoi ?",
          words: [
            ["romance", 19],
            ["horror", 3],
            ["fantasy", 7],
            ["adventure", 3],
          ],
        },
        {
          question: "c'est quoi 2?",
          words: ["aa", "aa", "b", "c", "c", "c", "c", "c", "c", "d", "i"],
        },
      ],
      progressions: [
        {
          id: 8,
          idActivite: 1,
          idParcours: 4,
          entries: [
            {
              id: 0,
              question: "Quel est le sens de la vie pour toi ?",
              typeRendu: "text",
              rendu: "beaucoup de choses",
            },
            {
              id: 1,
              question: "Pourquoi les scouts c'est bien ?",
              typeRendu: "text",
              rendu: "parce que",
            },
          ],
        },
        {
          id: 9,
          idActivite: 1,
          idParcours: 4,
          entries: [
            {
              id: 0,
              question: "Quel est le sens de la vie pour toi ?",
              typeRendu: "text",
              rendu: "plein de trucs",
            },
            {
              id: 1,
              question: "Pourquoi les scouts c'est bien ?",
              typeRendu: "text",
              rendu: "car il me semble que ce n'est pas nul",
            },
          ],
        },
      ],
    };
  },
  computed: {
    progressionEntries: () => {
      // console.log(this.progressions);
      let progressions = [
        {
          id: 8,
          idActivite: 1,
          idParcours: 4,
          entries: [
            {
              id: 0,
              question: "Quel est le sens de la vie pour toi ?",
              typeRendu: "text",
              rendu: "beaucoup de choses",
            },
            {
              id: 1,
              question: "Pourquoi les scouts c'est bien ?",
              typeRendu: "text",
              rendu: "parce que",
            },
          ],
        },
        {
          id: 9,
          idActivite: 1,
          idParcours: 4,
          entries: [
            {
              id: 0,
              question: "Quel est le sens de la vie pour toi ?",
              typeRendu: "text",
              rendu: "plein de trucs",
            },
            {
              id: 1,
              question: "Pourquoi les scouts c'est bien ?",
              typeRendu: "text",
              rendu: "car il me semble que ce n'est pas nul",
            },
          ],
        },
      ];
      let filteredProgressions = progressions.filter((prog) => {
        return Boolean(prog.idActivite == 1 && prog.idParcours == 4);
      });
      console.log(filteredProgressions);
      let result0 = {};
      filteredProgressions.entries.forEach((entry) => {
        result0[entry.id] = { question: entry.question, words: [] };
        entry.rendu.split(" ").forEach((word) => {
          if (word in result0[entry.id]["words"]) {
            result0[entry.id]["words"][word]++;
          } else {
            result0[entry.id]["words"][word] = 1;
          }
        });
        console.log(result0);
      });
      let result1 = {};
      result0.forEach((id) => {
        result1[id] = {
          question: result0[id]["question"],
          words: result0[id]["words"].map((v, i, a) => {
            return [i, a[i]];
          }),
        };
      });
      console.log(result1);
      return result1;
    },
  },
  created() {
    // TODO: fetch all progressions of Halte (idParcours = 4)
    this.progressions = [];
    const a = true;
    if (a == true) {
      return this.$router.push("/activity/4/1");
    }
  },
  methods: {},
};
</script>

<style scoped></style>
