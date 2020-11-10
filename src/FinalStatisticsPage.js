import React, { useState, useEffect } from 'react';
import Axios from 'axios'
import { Redirect } from 'react-router-dom';

function FinalStatisticsPage() {

  const [userStats, setUserStats] = useState(null)
  const [redirectToGamesPage, setRedirectToGamesPage] = useState(false)

  useEffect(() => {getGame()}, []);


  const getGame = () => {
    Axios.post('https://questions-game-app.herokuapp.com/game/statistics', null, {
      params: {
        gameId: localStorage.getItem('gameId')
      }
    }).then((response) => { setUserStats(response.data.userStats) });
  }



  if (redirectToGamesPage === true) {
    return <Redirect to="/GamesPage" />
  }

  

  const renderFinalStatisticsTableHeader = () => {
    var headers = ['id', 'name', 'votes', 'place'];
    return headers.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>
    })
  }

  const renderFinalStatisticsTable = () =>
  userStats.map((userStats, index) => {
      const { id, name, votes, place } = userStats //destructuring
      return (
            <tr key={id}>
              <td>{id}</td>
              <td>{name}</td>
              <td>{votes}</td>
              <td> {place} </td>
            </tr>
      )
    })

    if (userStats === null) {
      return <>Still loading...</>;
    }
else return (
    <div className="App">
<h2> Final Results: </h2>

<table id='statistics'>
            <tbody>
              {<tr>{renderFinalStatisticsTableHeader()}</tr>}
              {renderFinalStatisticsTable()}
            </tbody>
          </table>
<button onClick={() => { setRedirectToGamesPage(true) }}> Exit Game </button>
    </div>
  );
}

export default FinalStatisticsPage;
