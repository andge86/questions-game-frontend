import Axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import './components/style.css';  
import Popup from './components/Popup';  


var Stomp = require('stompjs');
var SockJS = require('sockjs-client');

function GamesPage() {

    const [gamesList, setGamesList] = useState(null)
    const [stompClient, setStompClient] = useState(null)



    useEffect(() => {
        connect();  
    }, []);



    const connect = () => {
        var socket = new SockJS('http://localhost:8080/handler');
        let stompClient = Stomp.over(socket);
        stompClient.connect({}, (frame) => {
            stompClient.subscribe('/topic/greetings', (message) => {
               if (JSON.parse(message.body).type == 'GAMES'){
                 setGamesList(JSON.parse(message.body).info);
             } 
           }  
             )
            });
            setStompClient(stompClient);
      }

      const sendGetGamesMessage = () => {
        stompClient.send("/app/hello", {}, JSON.stringify({type: 'GAMES', info: null}));
      }



return(


)


}
export default GamesPage;
