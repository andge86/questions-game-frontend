import currentGameState from './currentGameState'
import currentRound from './currentRound'
import {combineReducers} from 'redux'

const rootReducer = combineReducers({
    currentGameState,
    currentRound
})

export default rootReducer