export const parcours = ({
    state: {
        parcours: 5
    },
    mutations: {
        set (state, test) {
            console.log(state)
            console.log(test)
            state.parcours = test
        }
    }
})