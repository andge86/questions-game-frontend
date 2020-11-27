const currentGameState = (state = {}, action) => {
   // console.log(state)
    console.log("Action type logging: "+action.type)
    switch(action.type) {
        case "SHOW_QUESTION":
            return {
                ...state,
                desc: action.desc,
                round: action.round
            }
        case "SHOW_VOTE":
            return {
                ...state,
                desc: action.desc,
                round: action.round
            }
        case "SHOW_STATISTICS":
            return {
                ...state,
                desc: action.desc,
                round: action.round
            }
        default:
            return {
                ...state,
                desc: "desc error",
                round: 0
            }
    }
}


export default currentGameState;
