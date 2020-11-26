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

  const [pageState, setPageState] = useState('Question')  // states: Question, Vote, Statistics
  const [answer, setAnswer] = useState('')
  const [round, setRound] = useState(1)
  const [game, setGame] = useState(null)
  const [redirectToFinalStatisticsPage, setRedirectToFinalStatisticsPage] = useState(false)
  const [stompClient, setStompClient] = useState()


  useEffect(() => {
   // if (sessionStorage.getItem('pageState') === null || sessionStorage.getItem('pageState') === '') sessionStorage.setItem('pageState', 'Question')
   // else setPageState(sessionStorage.getItem('pageState'))
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

          if (JSON.parse(message.body).type === 'NEWANSWER') {getGame()}
          else if (JSON.parse(message.body).type === 'ALLANSWERED') { 
            setPageState('Vote');
            sessionStorage.setItem('pageState', 'Vote')
            getGame(); 
          }
          else if (JSON.parse(message.body).type === 'NEWVOTE') {getGame()}
          else if (JSON.parse(message.body).type === 'ALLVOTED') {
            setPageState('Statistics');
            sessionStorage.setItem('pageState', 'Statistics')
            getGame();
          }

          else if (JSON.parse(message.body).type === 'NEWFINISHROUND') {getGame()}
          else if (JSON.parse(message.body).type === 'ALLFINISHEDROUNDS') {
            setPageState('Question')
            sessionStorage.setItem('pageState', 'Question')
            getGame()
            setRound(JSON.parse(message.body).game.roundList.filter( round => round.state == 'NEW')[0].roundPlace);
          
          }
          else if (JSON.parse(message.body).type === 'GAMEFINISHED') {
            sessionStorage.setItem('pageState', '')
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
      if (sessionStorage.getItem('pageState') === 'Question') return < QuestionPage data = {{game, round, stompClient}} />
      else if (sessionStorage.getItem('pageState') === 'Vote') return < VotePage data = {{game, round, stompClient}} />
      else if (sessionStorage.getItem('pageState') === 'Statistics') return < StatisticsPage data = {{game, round, stompClient}} />
  }
 

  

  if (game === null) {
    return <>Still loading!!!...</>;
  }
  else {
    return (
    <div className="App">
      <h2> Round {round} - {sessionStorage.getItem('pageState')} </h2>
      <div> {renderProperSubPage()} </div>
    </div>
  );
 }}

export default GameFlowPage;
