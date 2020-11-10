import React from 'react';
//import SockJsClient from 'react-stomp';

var Stomp = require('stompjs');
var SockJS = require('sockjs-client');


class Main extends React.Component{

    constructor(props) {
        super(props);
        this.state = { name: '' };
        this.state = { messages: []};
        
      }

      stompClient = null

 // state = { name: '' };
 // state = { messages: ['first']};
//  state = { stompClient: null };
 
componentDidMount(){this.connect()}

   connect() {
      var socket = new SockJS('http://localhost:8080/handler');
      socket.onopen = function() {
        console.log('open');
        socket.send('test');
    };
      var stompClient = Stomp.over(socket);
      stompClient.connect({}, (frame) => {
          stompClient.subscribe('/topic/greetings', (message) => {
            var { messages } = this.state;
            messages.push(JSON.parse(message.body).content);
            this.setState({ messages: messages}); }  )
          });
     
this.stompClient = stompClient;
  }

//callback = function(message){
//    var messages = this.state.messages
 //   messages.push(JSON.parse(message.body).content);
 //   this.setState({ messages: messages});   
//}
  
//   disconnect() {
//      if (stompClient !== null) {
//          stompClient.disconnect();
 //     }
//      setConnected(false);
//      console.log("Disconnected");
//  }


  
   sendName() {
    this.stompClient.send("/app/hello", {}, JSON.stringify({'name': this.state.name}));
  }
  
   showGreeting(message) {
      return (
          <div>{message}</div>
      )
  }
   
   renderMessages = () => {
    return this.state.messages.map((message, index) => {
        return <div id={index}>{message}</div>
     })
  }

  render() {
    return (
      <div>
          <h1>hello!!!</h1>
          <h2>
              {this.renderMessages()}
          </h2>
          <input type="text" onChange={(e) => {this.setState({ name: e.target.value })}} />
      <button onClick = {() => {this.sendName()}}> send </button>

      </div>
    );
  }
}


//<SockJsClient url='http://localhost:8080/handler' topics={['/topic/greetings']}
//onMessage={(msg) => { console.log(msg); }}
//ref={ (client) => { this.clientRef = client }} />

export default Main;