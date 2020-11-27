const currentRound = (state = {}, action) => {
    switch(action.type){
        case "NEXT_ROUND":
            return {
                ...state,
                round: action.payload + 1
            }
        case "FIRST_ROUND":
            return {
                ...state,
                round: 1
            }
        default: 
            return {
            ...state,
            round: 1
        }
    }
}

export default currentRound