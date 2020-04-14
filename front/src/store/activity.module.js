export const activity = ({
    state: {
        activity: {}
    },
    mutations: {
        set (state, test) {
            console.log(state)
            console.log(test)
            state.activity = test
        }
    }
})