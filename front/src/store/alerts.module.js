// TODO ?

// current activity
export const activity = {
  state: {
    activity: activitySaved,
    progression: undefined,
  },
  mutations: {
    set(state, test) {
      localStorage.setItem("activity", JSON.stringify(test));
      state.activity = test;
    },
  },
};
