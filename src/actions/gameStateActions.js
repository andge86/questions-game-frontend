const showQuestionPage = (round=1) => {
    return {
        type: "SHOW_QUESTION",
        desc: "Question",
        round: round
    }
}

const showVotePage = (round=1) => {
    return {
        type: "SHOW_VOTE",
        desc: "Vote",
        round: round
    }
}

const showStatisticsPage = (round=1) => {
    return {
        type: "SHOW_STATISTICS",
        desc: "Statistics",
        round: round
    }
}

export default {
    showQuestionPage,
    showVotePage,
    showStatisticsPage
}