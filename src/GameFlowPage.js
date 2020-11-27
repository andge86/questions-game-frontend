import React, { useState, useEffect } from 'react';
import Axios from 'axios'
import { Redirect } from 'react-router-dom';
import './components/style.css';
import QuestionPage from './QuestionPage';
import VotePage from './VotePage';
import StatisticsPage from './StatisticsPage';

import { useSelector, useDispatch } from 'react-redux'
import allActions from './actions'

var Stomp = require('stompjs');
var SockJS = require('sockjs-client');

function GameFlowPage() {

  const [pageState, setPageState] = useState('')  // states: Question, Vote, Statistics
  const [answer, setAnswer] = useState('')
  const [round, setRound] = useState(1)
  const [game, setGame] = useState(null)
  const [redirectToFinalStatisticsPage, setRedirectToFinalStatisticsPage] = useState(false)
  const [stompClient, setStompClient] = useState()


  const currentGameState = useSelector(state => state.currentGameState)
  // const currentRound = useSelector(state => state.currentRound)

  const dispatch = useDispatch()

  useEffect(() => {
    // if (sessionStorage.getItem('pageState') === null || sessionStorage.getItem('pageState') === '') sessionStorage.setItem('pageState', 'Question')
    // else setPageState(sessionStorage.getItem('pageState'))
    if (sessionStorage.getItem('pageState') === null || sessionStorage.getItem('pageState') === "") sessionStorage.setItem('pageState', 'Question');
    if (sessionStorage.getItem('round') === null || sessionStorage.getItem('round') === "") sessionStorage.setItem('round', 1);

    // dispatch(allActions.gameStateActions.showQuestionPage(1))
    //dispatch(allActions.roundCounterActions.nextRound(2))

    getGame();
    connect();


  }, []);



  const getGame = () => {
    Axios.post(window.$endpoint + '/game/info', null, {
      params: {
        gameId: sessionStorage.getItem('gameId')
      }
    }).then((response) => { setGame(response.data) });
  }


  const connect = () => {
    var socket = new SockJS(window.$endpoint + '/handler');
    let stompClient = Stomp.over(socket);
    stompClient.connect({}, () => {
      stompClient.subscribe('/topic/greetings', (message) => {

        if (JSON.parse(message.body).type === 'NEWANSWER') { getGame() }
        else if (JSON.parse(message.body).type === 'ALLANSWERED') {
          // setPageState('Vote');
          sessionStorage.setItem('pageState', 'Vote')
          // dispatch(allActions.gameStateActions.showVotePage(currentGameState.round))
          getGame();
        }
        else if (JSON.parse(message.body).type === 'NEWVOTE') { getGame() }
        else if (JSON.parse(message.body).type === 'ALLVOTED') {
          // setPageState('Statistics');
          sessionStorage.setItem('pageState', 'Statistics')
          // dispatch(allActions.gameStateActions.showStatisticsPage(currentGameState.round))
          getGame();
        }

        else if (JSON.parse(message.body).type === 'NEWFINISHROUND') { getGame() }
        else if (JSON.parse(message.body).type === 'ALLFINISHEDROUNDS') {
          //   setPageState('Question')
          sessionStorage.setItem('pageState', 'Question')
          // dispatch(allActions.gameStateActions.showQuestionPage(currentGameState.round + 1))
          // dispatch(allActions.roundCounterActions.nextRound(currentRound))
          getGame()
          // setRound(JSON.parse(message.body).game.roundList.filter( round => round.state == 'NEW')[0].roundPlace);


          sessionStorage.setItem('round', parseInt(sessionStorage.getItem('round')) + 1);
          //  setRound(sessionStorage.getItem('round'));


        }
        else if (JSON.parse(message.body).type === 'GAMEFINISHED') {
          sessionStorage.setItem('pageState', '')
          sessionStorage.setItem('round', '')
          stompClient.disconnect();
          setRedirectToFinalStatisticsPage(true);
        }

      }
      )
    });
    setStompClient(stompClient);
  }

  if (redirectToFinalStatisticsPage === true) {
    return <Redirect to="/FinalStatisticsPage" />
  }


  const renderProperSubPage = () => {
    //    if (sessionStorage.getItem('pageState') === "Question") return < QuestionPage data = {{game, currentRound, stompClient}} />
    //    else if (currentGameState.desc === 'Vote') return < VotePage data = {{game, currentRound, stompClient}} />
    //    else if (currentGameState.desc === 'Statistics') return < StatisticsPage data = {{game, currentRound, stompClient}} />

    switch (sessionStorage.getItem('pageState')) {
      case "Question": return < QuestionPage data={{ game, stompClient }} />
      case 'Vote': return < VotePage data={{ game, stompClient }} />
      case 'Statistics': return < StatisticsPage data={{ game, stompClient }} />
      default: return <h1>Error: wrong Page State</h1>
    }


  }



  if (game === null) {
    return <>Still loading!!!...</>;
  }
  else {
    return (
      <div className="App">
        <h2> Round {sessionStorage.getItem('round')} - {sessionStorage.getItem('pageState')} </h2>
        <div> {renderProperSubPage()} </div>
      </div>
    );
  }
}

export default GameFlowPage;
