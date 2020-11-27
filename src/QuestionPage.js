import React, { useState, useEffect } from 'react';
import Axios from 'axios'
import { Redirect } from 'react-router-dom';
import './components/style.css';
import Popup from './components/Popup';

//import {useSelector, useDispatch} from 'react-redux'

var Stomp = require('stompjs');
var SockJS = require('sockjs-client');

function QuestionPage(props) {

 // const currentRound = useSelector(state => state.currentRound)


  const [answer, setAnswer] = useState('')


  const handleSendAnswerMessage = () => {
    props.data.stompClient.send("/app/newAnswer", {}, JSON.stringify(
      {
        type: 'NEWANSWER',
        answerParams: {
          description: answer,
          gameId: sessionStorage.getItem('gameId'),
          round: sessionStorage.getItem('round'),
          userId: sessionStorage.getItem('userId')
        }
      }
    ));
  }

  const renderUsersTableHeader = () => {
    var headers = ['id', 'name', 'state'];
    return headers.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>
    })
  }

  const renderUsersTable = () =>
  props.data.game.usersBelongToGame.map((user, index) => {
      const { id, name, isAnswered } = user //destructuring
      return (
            <tr key={id}>
              <td>{id}</td>
              <td>{name}</td>
              <td> {userState(id)} </td>
            </tr>
      )
    })

    const userState = (id) => {
      return (props.data.game.roundList.filter(round => round.roundPlace == sessionStorage.getItem('round'))[0].answers.find(answer => answer.belongsToUser.id == id) === undefined) ? 'Answering...' : 'Answered'
     // return (props.data.game.roundList[props.data.round-1].answers.find(answer => answer.belongsToUser.id == id) === undefined) ? 'Answering...' : 'Answered'
     }

    const getQuestionDescription = () => {
     return "Question: " + props.data.game.roundList.filter(round => round.roundPlace == sessionStorage.getItem('round'))[0].question.description
//return "Question: " + props.data.game.roundList[props.data.round-1].question.description

    }

    const isDisabled = () => {
     // if (answer === '') return true
    // return (props.data.game.roundList[props.data.round-1].answers.find(answer => answer.belongsToUser.id == sessionStorage.getItem('userId')) === undefined) ? false : true
    return (props.data.game.roundList.filter(round => round.roundPlace == sessionStorage.getItem('round'))[0].answers.find(answer => answer.belongsToUser.id == sessionStorage.getItem('userId')) === undefined) ? false : true
    }

      return (
        <div>
          <h1> {getQuestionDescription()} </h1>
          <input placeholder="Enter your answer" type="text" disabled={isDisabled()} onChange={(e) => { setAnswer(e.target.value) }} />
            <button disabled = {isDisabled()} onClick={() => { handleSendAnswerMessage(); }}>{(isDisabled()) ? 'Submitted' : 'Submit'} </button>

            <table id='users'>
            <tbody>
              <tr>{renderUsersTableHeader()}</tr>
              {renderUsersTable()}
            </tbody>
            </table>

        </div>
      )
    }
  

export default QuestionPage;
