import Axios from 'axios';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Redirect } from 'react-router-dom';

import './components/style.css';
import Popup from './components/Popup';


var Stomp = require('stompjs');
var SockJS = require('sockjs-client');

function GamesPage() {

  const [gamesList, setGamesList] = useState(null)
  const [gameAdded, setGameAdded] = useState(null)
  const [buttonText, setButtonText] = useState('Join')
  const [isCreatted, setIsCreated] = useState(false)
  const [isJoined, setIsJoined] = useState(false)
  const [gameIdState, setGameIdState] = useState(0)
  const [redirectToQuestionAnswerPage, setRedirectToQuestionAnswerPage] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  const [stompClient, setStompClient] = useState(null)

  // let stompClient2 = null;



  useEffect(() => {
    getGamesList();
    connect();
  }, []);



  const getGamesList = () => {
    Axios.get(window.$endpoint + '/game/list')
      .then((response) => { setGamesList(response.data); })
  }


  const connect = () => {
    var socket = new SockJS(window.$endpoint + '/handler');
    let stompClient = Stomp.over(socket);
    stompClient.connect({}, (frame) => {
      stompClient.subscribe('/topic/greetings', (message) => {

        if (JSON.parse(message.body).type == 'JOINGAME') {
          // setButtonText('Joined') 
          // localStorage.setItem('gameId', JSON.parse(message.body).game.id)
          getGamesList()
        }

        else if (JSON.parse(message.body).type == 'STARTGAME'
          && JSON.parse(message.body).game.id == sessionStorage.getItem('gameId')) {
          setRedirectToQuestionAnswerPage(true);
          stompClient.disconnect();

        }
        else if (JSON.parse(message.body).type == 'NEWGAME') {
          if (JSON.parse(message.body).game.createdGameUser.id == sessionStorage.getItem('userId')) {
            // setIsJoined(true)
            // setButtonText('Joined') 
            sessionStorage.setItem('gameId', JSON.parse(message.body).game.id)
          }

          getGamesList();

        }
      }
      )
    });
    setStompClient(stompClient);
  }


  const submitPopup = (gameName, roundQuantity) => {
    handleNewGameMessage(gameName, roundQuantity);
    setShowPopup(false)
  }


  const handleNewGameMessage = (gameName, roundQuantity) => {
    stompClient.send("/app/newGame", {}, JSON.stringify({
      type: 'NEWGAME',
      gameParams: {
        name: gameName,
        rounds: roundQuantity,
        createdUserId: sessionStorage.getItem('userId')
      }
    }));
    setIsCreated(true)
    setIsJoined(true)
  }

  const handleJoinMessage = (gameId) => {
    stompClient.send("/app/joinGame", {}, JSON.stringify({
      type: 'JOINGAME',
      joinGameParams: {
        gameId: gameId,
        userId: sessionStorage.getItem('userId')
      }
    }));
    setIsJoined(true);
    sessionStorage.setItem('gameId', gameId)
  }

  const handleStartGameMessage = (gameId) => {
    stompClient.send("/app/startGame", {}, JSON.stringify({
      type: 'STARTGAME',
      startGameParams: {
        gameId: gameId,
        //    userId: localStorage.getItem('userId')
        //     state: "ACTIVE"
      }
    }));
  };


  const renderActionButton = (createdGameUserId, gameId, state) => {
    if (createdGameUserId == sessionStorage.getItem('userId') && state == 'NEW') {
      return (<button id={gameId} onClick={() => { handleStartGameMessage(gameId) }} > Start </button>)
    }
    else if (state == 'FINISHED')
      return null
    else if (gameId == sessionStorage.getItem('gameId')) {
      return (<button id={gameId} disabled='true'> Joined </button>)
    }
    else if (state == 'NEW' && (sessionStorage.getItem('gameId') == null || sessionStorage.getItem('gameId') == "")) {
      return (<button id={gameId} onClick={() => { handleJoinMessage(gameId) }}> Join </button>)
    }
    else if (isJoined === true || state == 'ACTIVE') {
      return (<button id={gameId} disabled='true'> Join </button>)
    }
  }


  const renderTableData = () =>
    gamesList.map((game, index) => {
      const { id, name, rounds, usersBelongToGame, createdGameUser, state } = game //destructuring
      return (
        <tr key={id}>
          <td>{name}</td>
          <td>{rounds}</td>
          <td>{usersBelongToGame.length}</td>
          <td>{createdGameUser.name}</td>
          <td>{state}</td>
          <td>{renderActionButton(createdGameUser.id, id, state)}</td>
        </tr>
      )
    })


  const renderNewTableData = () =>
    gamesList.map((game, index) => {
      const { id, name, rounds, usersBelongToGame, createdGameUser, state } = game //destructuring
      return (

        <div key={id} className="ListTable">
          <p></p>

          <div><b>Game: </b> {name} </div>
          <div><b>Created by: </b>{createdGameUser.name}</div>
          <div><b>State: </b> {state} </div>
          <div><b>Rounds: </b> {rounds} </div>
          <div> <b>Joined players: </b> {usersBelongToGame.length} </div>
          <div>{renderActionButton(createdGameUser.id, id, state)}</div>
        </div>
      )
    })


  const renderTableHeader = () => {
    var headers = ['name', 'rounds', 'users', 'createdBy', 'state', 'action'];
    return headers.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>
    })
  }






  if (redirectToQuestionAnswerPage === true) {
    return <Redirect to="/GameFlowPage" />
  }



  if (gamesList === null) {

    return <>Still loading...</>;
  }
  else {
    return (

      <div className="App">
        <div>
          <h1 id='title'>All Games List</h1>
          <button onClick={() => { setShowPopup(true) }}>Create New Game</button>

          {renderNewTableData()}

          {showPopup ? <Popup closePopup={submitPopup.bind(this)} /> : null}
        </div>
      </div>
    );
  }
}
export default GamesPage;

