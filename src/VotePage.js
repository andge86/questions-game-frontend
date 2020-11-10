import React, { useState, useEffect } from 'react';
import Axios from 'axios'
import { Redirect } from 'react-router-dom';
import './components/style.css';
import Popup from './components/Popup';

var Stomp = require('stompjs');
var SockJS = require('sockjs-client');

function VotePage(props) {


  const handleSendVoteMessage = (answerId) => {
    props.data.stompClient.send("/app/newVote", {}, JSON.stringify(
      {
        type: 'NEWVOTE',
        voteParams: {
          userId: localStorage.getItem('userId'),
          answerId: answerId,
          round: props.data.round,
          gameId: localStorage.getItem('gameId')
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
      return (props.data.game.roundList[props.data.round - 1].answers.find(answer => answer.votesBelongToAnswer.find(vote => vote.belongsToUser.id == id)) == null) ? false : true
    }


    const isVoteDisabled = (id) => {
        return (props.data.game.roundList[props.data.round - 1].answers.find(answer => answer.votesBelongToAnswer.find(vote => vote.belongsToUser.id == id)) == null) ? 'false' : 'true'
    }

    const getAnswers = () => {
      return props.data.game.roundList[props.data.round - 1].answers
    }



  
const disab = () => {
    return 'true'
}



    return (
    <div className="vote">
    <ul>
          {getAnswers().filter(answer => answer.belongsToUser.id != localStorage.getItem('userId')).map(answer => (
            <div key={answer.id}>
              <button disabled = {userState(localStorage.getItem('userId'))} onClick = {() => {handleSendVoteMessage(answer.id)}}> {answer.description} </button>
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
