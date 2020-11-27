import React, { useState, useEffect } from 'react';
import Axios from 'axios'
import { Redirect } from 'react-router-dom';
import './components/style.css';
import Popup from './components/Popup';

//import {useSelector, useDispatch} from 'react-redux'

var Stomp = require('stompjs');
var SockJS = require('sockjs-client');

function VotePage(props) {

  //const currentRound = useSelector(state => state.currentRound)


  const handleSendVoteMessage = (answerId) => {
    props.data.stompClient.send("/app/newVote", {}, JSON.stringify(
      {
        type: 'NEWVOTE',
        voteParams: {
          userId: sessionStorage.getItem('userId'),
          answerId: answerId,
          round: sessionStorage.getItem('round'),
          gameId: sessionStorage.getItem('gameId')
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
              <td> {(userState(id)) ? "Voted" : "Voting..."} </td>
            </tr>
      )
    })



    const userState = (id) => {
      return (props.data.game.roundList.filter(round => round.roundPlace == sessionStorage.getItem('round'))[0].answers.find(answer => answer.votesBelongToAnswer.find(vote => vote.belongsToUser.id == id)) == undefined) ? false : true
    }


    const isVoteDisabled = (id) => {
        return (props.data.game.roundList.filter(round => round.roundPlace == sessionStorage.getItem('round'))[0].answers.find(answer => answer.votesBelongToAnswer.find(vote => vote.belongsToUser.id == id)) == undefined) ? 'false' : 'true'
    }

    const getAnswers = () => {
      return props.data.game.roundList.filter(round => round.roundPlace == sessionStorage.getItem('round'))[0].answers
    }



    return (
    <div className="vote">
    <ul>
          {getAnswers().filter(answer => answer.belongsToUser.id != sessionStorage.getItem('userId')).map(answer => (
            <div key={answer.id}>
              <button disabled = {userState(sessionStorage.getItem('userId'))} onClick = {() => {handleSendVoteMessage(answer.id)}}> {answer.description} </button>
            </div>
          ))}
        </ul>
      <table id='users'>
            <tbody>
              <tr>{renderUsersTableHeader()}</tr>
              {renderUsersTable()}
            </tbody>
      </table>
    </div>
  );
 }

export default VotePage;
