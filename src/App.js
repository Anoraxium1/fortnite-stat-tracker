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
          params: { name: playerName, image: 'all' },
          headers: { 'Authorization': process.env.REACT_APP_FORTNITE_API_KEY }
        }
      );
      setStats(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.log('Player not found');
    }
    setLoading(false);
  };

  return (
    <div className="app">
      <h1>Fortnite Stat Tracker</h1>

      <div className="search-bar"> 
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
      </div>

      {stats && (
        <div className="results">

          <div className="profile"> 
            {stats.image && (
              <img src={stats.image} alt="player" className="profile-img" />
            )}
            <h2>{stats.account.name}</h2>
            <p>Level: {stats.battlePass.level}</p>
          </div>

          <div className="gamemodes">
            <div className="mode-card">
              <h3>Solo</h3>
              <p>Matches: {stats.stats.all.solo?.matches ?? 'N/A'}</p>
              <p>Wins: {stats.stats.all.solo?.wins ?? 'N/A'}</p>
              <p>Win Rate: {stats.stats.all.solo?.winRate?.toFixed(2) ?? 'N/A'}%</p>
              <p>Kills: {stats.stats.all.solo?.kills ?? 'N/A'}</p>
              <p>Deaths: {stats.stats.all.solo?.deaths ?? 'N/A'}</p>
              <p>KD: {stats.stats.all.solo?.kd?.toFixed(2) ?? 'N/A'}</p>
            </div>

            <div className="mode-card">
              <h3>Duo</h3>
              <p>Matches: {stats.stats.all.duo?.matches ?? 'N/A'}</p>
              <p>Wins: {stats.stats.all.duo?.wins ?? 'N/A'}</p>
              <p>Win Rate: {stats.stats.all.duo?.winRate?.toFixed(2) ?? 'N/A'}%</p>
              <p>Kills: {stats.stats.all.duo?.kills ?? 'N/A'}</p>
              <p>Deaths: {stats.stats.all.duo?.deaths ?? 'N/A'}</p>
              <p>KD: {stats.stats.all.duo?.kd?.toFixed(2) ?? 'N/A'}</p>
            </div>

            <div className="mode-card">
              <h3>Squad</h3>
              <p>Matches: {stats.stats.all.squad?.matches ?? 'N/A'}</p>
              <p>Wins: {stats.stats.all.squad?.wins ?? 'N/A'}</p>
              <p>Win Rate: {stats.stats.all.squad?.winRate?.toFixed(2) ?? 'N/A'}%</p>
              <p>Kills: {stats.stats.all.squad?.kills ?? 'N/A'}</p>
              <p>Deaths: {stats.stats.all.squad?.deaths ?? 'N/A'}</p>
              <p>KD: {stats.stats.all.squad?.kd?.toFixed(2) ?? 'N/A'}</p>
            </div>

            <div className="mode-card">
              <h3>Overall</h3>
              <p>Matches: {stats.stats.all.overall?.matches ?? 'N/A'}</p>
              <p>Wins: {stats.stats.all.overall?.wins ?? 'N/A'}</p>
              <p>Win Rate: {stats.stats.all.overall?.winRate?.toFixed(2) ?? 'N/A'}%</p>
              <p>Kills: {stats.stats.all.overall?.kills ?? 'N/A'}</p>
              <p>Deaths: {stats.stats.all.overall?.deaths ?? 'N/A'}</p>
              <p>KD: {stats.stats.all.overall?.kd?.toFixed(2) ?? 'N/A'}</p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default App;