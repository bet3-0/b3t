const parcoursSaved = parseInt(localStorage.getItem("parcours"));

export const parcours = {
  namespaced: true,
  state: {
    parcours: parcoursSaved // initial state
  },
  actions: {
    setParcours({ commit }, parcoursId) {
      console.log("Parcours chosen: " + parcoursId);
      localStorage.setItem("parcours", parseInt(parcoursId));
      commit("set", parcoursId);
    },
  },
  mutations: {
    set(state, parcoursId) {
      state.parcours = parseInt(parcoursId);
    }
  }
};
