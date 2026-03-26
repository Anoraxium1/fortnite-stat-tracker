import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [playerName, setPlayerName] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const searchPlayer = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://fortnite-api.com/v2/stats/br/v2`,
        { 
          params: { name: playerName },
          headers: { 'Authorization': process.env.REACT_APP_FORTNITE_API_KEY }
        }
      );
      setStats(response.data.data);
      console.log(response.data.data)
    } catch (error) {
      console.log('Player not found');
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>Fortnite Stat Tracker</h1>
      <input
        type="text"
        placeholder="Enter username"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <br></br>
      <br></br>
      <button onClick={searchPlayer}>
        {loading ? 'Searching...' : 'Search'}
      </button>

      {stats && (
        <div>
          <h2>{stats.account.name}</h2>
          <h3>Overall Stats</h3>
          <p>Matches: {stats.stats.all.overall.matches}</p>
          <p>Wins: {stats.stats.all.overall.wins}</p>
          <p>Win Rate: {stats.stats.all.overall.winRate.toFixed(2)}%</p>
          <p>Kills: {stats.stats.all.overall.kills}</p>
          <p>Deaths: {stats.stats.all.overall.deaths}</p>
          <p>KD: {stats.stats.all.overall.kd.toFixed(2)}</p>
          <br></br>
          <h3>Current Season Stats</h3>
          <p>Battlepass Level: {stats.battlePass.level}</p>
          <p>Progress To Next Level: {stats.battlePass.progress ? stats.battlePass.progress.toFixed(2) : 'N/A'}%</p>
          
        </div>
      )}
    </div>
  );
}

export default App;