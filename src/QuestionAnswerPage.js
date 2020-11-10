import React, { useState, useEffect } from 'react';
import Axios from 'axios'
import { Redirect } from 'react-router-dom';
import './components/style.css';
import Popup from './components/Popup';

var Stomp = require('stompjs');
var SockJS = require('sockjs-client');

function QuestionAnswerPage() {

  const [pageState, setPageState] = useState('')  // states: Question, Vote, Statistics
  const [answer, setAnswer] = useState('')
  const [round, setRound] = useState(1)
//  const [roundList, setRoundList] = useState([{}])
//  const [userList, setUserList] = useState([{}])
  const [game, setGame] = useState(null)
  const [redirectToFinalStatisticsPage, setRedirectToFinalStatisticsPage] = useState(false)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isVoted, setIsVoted] = useState(false)
  const [isFinishedRound, setIsFinishedRound] = useState(false)

  const [stompClient, setStompClient] = useState()


  useEffect(() => {
    if (pageState == '') localStorage.setItem('pageState', 'Question')
    else localStorage.setItem('pageState', pageState)
    getGame();
    connect();
  }, []);


const getGame = () => {
  Axios.post('http://localhost:8080/game/info', null, {
    params: {
      gameId: localStorage.getItem('gameId')
    }
  }).then((response) => { setGame(response.data) });
}


  const connect = () => {
    var socket = new SockJS('http://localhost:8080/handler');
    let stompClient = Stomp.over(socket);
    stompClient.connect({}, () => {
      stompClient.subscribe('/topic/greetings', (message) => {

          if (JSON.parse(message.body).type === 'NEWANSWER') {getGame()}
          else if (JSON.parse(message.body).type === 'ALLANSWERED') { 
            setPageState('Vote');
            localStorage.setItem('pageState', 'Vote')
           // if (localStorage.getItem('userId') ==
            setIsVoted(true);
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



  const handleSendAnswerMessage = () => {
    stompClient.send("/app/newAnswer", {}, JSON.stringify(
      {
        type: 'NEWANSWER',
        answerParams: {
          description: answer,
          gameId: localStorage.getItem('gameId'),
          round: round,
          userId: localStorage.getItem('userId')
        }
      }
    ));
    setIsAnswered(true);
  }

  const handleSendVoteMessage = (answerId) => {
    stompClient.send("/app/newVote", {}, JSON.stringify(
      {
        type: 'NEWVOTE',
        voteParams: {
          userId: localStorage.getItem('userId'),
          answerId: answerId,
          round: round,
          gameId: localStorage.getItem('gameId')
        }
      }
    ));
    setIsVoted(true);
  }

  const handleSendFinishRoundMessage = () => {
    stompClient.send("/app/finishRound", {}, JSON.stringify(
      {
        type: 'NEWFINISHROUND',
        finishRoundParams: {
          userId: localStorage.getItem('userId'),
          round: round,
          gameId: localStorage.getItem('gameId')
        }
      }
    ));
    setIsFinishedRound(true);
  }

  const renderUsersTableHeader = () => {
    var headers = ['id', 'name', 'state'];
    return headers.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>
    })
  }

  const renderUsersTable = () =>
    game.usersBelongToGame.map((user, index) => {
      const { id, name, isAnswered } = user //destructuring
      return (
            <tr key={id}>
              <td>{id}</td>
              <td>{name}</td>
              <td> {userState(id)} </td>
            </tr>
      )
    })

    const userAnswer = (id) =>{
      return game.roundList[round - 1].answers.find(answer => answer.belongsToUser.id == id);
    }

    const userState = (id) => {
      if (localStorage.getItem('pageState') === 'Question') {return (userAnswer(id) == null) ? 'Answering...' : 'Answered'}
      else if (localStorage.getItem('pageState') === 'Vote') {return (game.roundList[round - 1].answers.find(answer => answer.votesBelongToAnswer.find(vote => vote.belongsToUser.id == id)) == null) ? 'Voting...' : 'Voted'}
    }

    const getQuestionDescription = () => {
     return "Question: " + game.roundList[round - 1].question.description
    }

    const isDisabled = () => {
      let currentUserAnswer = game.roundList[round - 1].answers.find(answer => answer.belongsToUser.id == localStorage.getItem('userId'));
      return (currentUserAnswer == null) ? false : true
    }

    const isVoteDisabled = () => {
      let currentUserAnswer = game.roundList[round - 1].answers.find(answer => answer.belongsToUser.id == localStorage.getItem('userId'));
     
      if (currentUserAnswer.length === 0) return false;
     else return  (currentUserAnswer.votesBelongToAnswer.find(vote => vote.belongsToUser.id == localStorage.getItem('userId'))
      == null) ? false : true
    }

    const getAnswers = () => {
      return game.roundList[round - 1].answers
    }


    const renderVotesTableHeader = () => {
      var headers = ['id', 'answer', 'votes'];
      return headers.map((key, index) => {
        return <th key={index}>{key.toUpperCase()}</th>
      })
    }
  
    const renderVotesTable = () =>
      game.roundList[round - 1].answers.map((answer, index) => {
        const { id, description, votesBelongToAnswer } = answer //destructuring
        return (
              <tr key={id}>
                <td>{id}</td>
                <td>{description}</td>
                <td> {votesBelongToAnswer.length} </td>
              </tr>
        )
      })

      const isDisabledNextRoundButton = () => {
        let currentUserFinishedRound = game.roundList[round - 1].usersFinishedRound.find(user => user.id == localStorage.getItem('userId'));
        return (currentUserFinishedRound == null) ? false : true
      }

  const renderProperSubPage = () => {
    if (localStorage.getItem('pageState') === 'Question') {
      return (
        <div>
          <h1> {getQuestionDescription()} </h1>
          <input placeholder="Enter your answer" type="text" disabled={isDisabled()} onChange={(e) => { setAnswer(e.target.value) }} />
            <button disabled = {isAnswered} onClick={() => { handleSendAnswerMessage(); }}>{(isAnswered) ? 'Submitted' : 'Submit'} </button>
        </div>
      )
    }
    else if (localStorage.getItem('pageState') === 'Vote') {
      return (
        <ul>
          {getAnswers().filter(answer => answer.belongsToUser.id != localStorage.getItem('userId')).map(answer => (
            <div key={answer.id}>
              <button disable = {isVoted.toString()} onClick = {() => {handleSendVoteMessage(answer.id)}}> {answer.description} </button>
            </div>
          ))}
        </ul>
      )
    }
    else if (localStorage.getItem('pageState') === 'Statistics') {
      return (
        <div>
        <table id='votes'>
        <tbody>
          {<tr>{renderVotesTableHeader()}</tr>}
          {renderVotesTable()}
        </tbody>
      </table>
      <button disable = {isFinishedRound} onClick = {() => handleSendFinishRoundMessage()}> Next Round </button>
</div>
      )
    }

  }



  if (game === null) {
    return <>Still loading...</>;
  }
  else {
    return (
    <div className="App">
      <div> Round {round} - {localStorage.getItem('pageState')} </div>
      <div> {renderProperSubPage()} </div> 
      <table id='games'>
            <tbody>
              {<tr>{(localStorage.getItem('pageState') !== 'Statistics') ? renderUsersTableHeader() : null}</tr>}
              {(localStorage.getItem('pageState') !== 'Statistics') ? renderUsersTable() : null}
            </tbody>
      </table>
    </div>
  );
 }}

export default QuestionAnswerPage;
