const progressionSaved = parseInt(localStorage.getItem("progression")) || 0;

export const progression = {
  namespaced: true,
  state: {
    progression: progressionSaved, // initial stae
  },
  actions: {
    setProgression({ commit }, prog) {
      commit("set", parseInt(prog));
      localStorage.setItem("progression", this.state.progression.progression);
      console.log("Global progression: " + this.state.progression.progression + ' %');
    },
  },
  mutations: {
    set(state, prog) {
      state.progression = Math.min(prog / 3, 100);
    },
  },
};
