const nextRound = (currentRound) => {
    return {
        type: "NEXT_ROUND",
        payload: currentRound
    }
}

const firstRound = () => {
    return {
        type: "FIRST_ROUND"
    }
}

export default {
    nextRound,
    firstRound
}