import React, { useState } from 'react';
import './style.css';
import Axios from 'axios'
import { Redirect } from 'react-router-dom';  

class Popup extends React.Component {  

    
        state = { roundQuantity: 0 }
        state = { gameName: '' }
    

      handleSubmit = () => {
     //   event.preventDefault();

    //    Axios.post('http://localhost:8080/game/create',null, { params: {
    //        gameName: this.state.gameName,
    //       rounds: this.state.roundQuantity,
    //       createdUserId: localStorage.getItem('userId')
    //      }}        
    //    )
    //    .then((response) => {
    //      localStorage.setItem('gameId', response.data.id)
          this.props.closePopup(this.state.gameName, this.state.roundQuantity);
      //    this.props.gameName(this.state.gameName); 
       //   this.props.roundQuantity(this.state.roundQuantity); 
        }  
      


      handleGameNameChange = event => {
        this.setState({ gameName: event.target.value });
      }

      handleRoundQuantityChange = event => {
        this.setState({ roundQuantity: event.target.value });
      }

      

  render() {  
return (  
    <div className='popup'>  
    <div className='popup\_inner'>  
    <h2> Create New Game </h2>
    <input placeholder="Enter rounds quantity" type="text" onChange={this.handleRoundQuantityChange}/>
    <input placeholder="Enter game name" type="text" onChange={this.handleGameNameChange}/>
    <div>
      <button onClick={this.handleSubmit}>Submit</button>
    </div>  
    </div>  
    </div> 
    
);  
}  
}  
export default Popup;