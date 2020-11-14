import React, { useState } from 'react';
import Axios from 'axios'
import { Redirect } from 'react-router-dom';

function LoginPage() {

  const [username, setUsername] = useState('')
  const [redirectToGamePage, setRedirectToGamePage] = useState(false)


const register = () => {
  Axios.post(window.$endpoint + '/user', {name: username})
  .then((response) => {localStorage.setItem('userId', response.data.id)})
}


const logInToGame = () => {
  register();
  setRedirectToGamePage(true);
}

const isLogInButtonDisabled = () => {
  if (username.length > 0) {return false}
  else {return true}
}


if(redirectToGamePage===true){
  return <Redirect to="/GamesPage" />
}

  return (
    <div className="App">
<div className="registration">
<h1>Registration</h1>
<input placeholder="Enter your name" type="text" onChange={(e) => {setUsername(e.target.value)}}/>
<button disabled = {isLogInButtonDisabled()} onClick={logInToGame}> Log In </button> 
</div>
    </div>
  );
}

export default LoginPage;
