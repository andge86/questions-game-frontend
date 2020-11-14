import React, { useState, useEffect } from 'react';
import Axios from 'axios'
import { Redirect } from 'react-router-dom';
import './components/style.css';
import QuestionPage from './QuestionPage';
import VotePage from './VotePage';
import StatisticsPage from './StatisticsPage';

var Stomp = require('stompjs');
var SockJS = require('sockjs-client');

function GameFlowPage() {

  const [pageState, setPageState] = useState(null)  // states: Question, Vote, Statistics
  const [answer, setAnswer] = useState('')
  const [round, setRound] = useState(1)
  const [game, setGame] = useState(null)
  const [redirectToFinalStatisticsPage, setRedirectToFinalStatisticsPage] = useState(false)
  const [stompClient, setStompClient] = useState()


  useEffect(() => {
    if (localStorage.getItem('pageState') === null || localStorage.getItem('pageState') === '') localStorage.setItem('pageState', 'Question')
    else setPageState(localStorage.getItem('pageState'))
    getGame();
    connect();
  }, []);


const getGame = () => {
  Axios.post(window.$endpoint + '/game/info', null, {
    params: {
      gameId: localStorage.getItem('gameId')
    }
  }).then((response) => { setGame(response.data) });
}


  const connect = () => {
    var socket = new SockJS(window.$endpoint + '/handler');
    let stompClient = Stomp.over(socket);
    stompClient.connect({}, () => {
      stompClient.subscribe('/topic/greetings', (message) => {

          if (JSON.parse(message.body).type === 'NEWANSWER') {getGame()}
          else if (JSON.parse(message.body).type === 'ALLANSWERED') { 
            setPageState('Vote');
            localStorage.setItem('pageState', 'Vote')
            getGame(); 
          }
          else if (JSON.parse(message.body).type === 'NEWVOTE') {getGame()}
          else if (JSON.parse(message.body).type === 'ALLVOTED') {
            setPageState('Statistics');
            localStorage.setItem('pageState', 'Statistics')
            getGame();
          }

          else if (JSON.parse(message.body).type === 'NEWFINISHROUND') {getGame()}
          else if (JSON.parse(message.body).type === 'ALLFINISHEDROUNDS') {
            setPageState('Question')
            localStorage.setItem('pageState', 'Question')
            getGame()
            setRound(JSON.parse(message.body).game.roundList.filter( round => round.state == 'NEW')[0].roundPlace);
          
          }
          else if (JSON.parse(message.body).type === 'GAMEFINISHED') {
            localStorage.setItem('pageState', '')
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
      if (localStorage.getItem('pageState') === 'Question') return < QuestionPage data = {{game, round, stompClient}} />
      else if (localStorage.getItem('pageState') === 'Vote') return < VotePage data = {{game, round, stompClient}} />
      else if (localStorage.getItem('pageState') === 'Statistics') return < StatisticsPage data = {{game, round, stompClient}} />
  }
 

  

  if (game === null) {
    return <>Still loading!!!...</>;
  }
  else {
    return (
    <div className="App">
      <h2> Round {round} - {localStorage.getItem('pageState')} </h2>
      <div> {renderProperSubPage()} </div>
    </div>
  );
 }}

export default GameFlowPage;
