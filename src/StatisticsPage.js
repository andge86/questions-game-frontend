import React, { useState, useEffect } from 'react';
import Axios from 'axios'
import { Redirect } from 'react-router-dom';
import './components/style.css';
import Popup from './components/Popup';

import {useSelector, useDispatch} from 'react-redux'

var Stomp = require('stompjs');
var SockJS = require('sockjs-client');

function StatisticsPage(props) {

  
 // const currentRound = useSelector(state => state.currentRound)


  const handleSendFinishRoundMessage = () => {
    props.data.stompClient.send("/app/finishRound", {}, JSON.stringify(
      {
        type: 'NEWFINISHROUND',
        finishRoundParams: {
          userId: sessionStorage.getItem('userId'),
          round: sessionStorage.getItem('round'),
          gameId: sessionStorage.getItem('gameId')
        }
      }
    ));
  }



    const renderVotesTableHeader = () => {
      var headers = ['id', 'answer', 'votes'];
      return headers.map((key, index) => {
        return <th key={index}>{key.toUpperCase()}</th>
      })
    }
  
    const renderVotesTable = () =>
    props.data.game.roundList.filter(round => round.roundPlace == sessionStorage.getItem('round'))[0].answers.map((answer, index) => {
        const { id, description, votesBelongToAnswer } = answer //destructuring
        return (
              <tr key={id}>
                <td>{id}</td>
                <td>{description}</td>
                <td> {votesBelongToAnswer.length} </td>
              </tr>
        )
      })


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
                  <td> {(userState(id)) ? "Checked statistics" : "Checking statistics..."} </td>
                </tr>
          )
        })
    
    
    
  
      
          const userState = (id) => {
            return (props.data.game.roundList.filter(round => round.roundPlace == sessionStorage.getItem('round'))[0].usersFinishedRound.find(user => user.id == id) == null) ? false : true
           }

      const nextRounduttonText = () => {
        if (userState(sessionStorage.getItem('userId'))) return "Waiting for others.."
        else if (props.data.game.rounds == sessionStorage.getItem('round')) return "Finish Game"
        else return "Next Round"
         }


    return (
        <div>
        <table id='votes'>
        <tbody>
          {<tr>{renderVotesTableHeader()}</tr>}
          {renderVotesTable()}
        </tbody>
      </table>
      <button disabled = {userState(sessionStorage.getItem('userId'))} onClick = {() => handleSendFinishRoundMessage()}> {nextRounduttonText()} </button>

      <table id='users'>
            <tbody>
              <tr>{renderUsersTableHeader()}</tr>
              {renderUsersTable()}
            </tbody>
      </table>

</div>
  );
 }

export default StatisticsPage;
