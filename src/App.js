import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [playerName, setPlayerName] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputType, setInputType] = useState('all');

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

  const getStats = () => {
    if (!stats) return null;
    if (inputType === 'all') return stats.stats.all;
    if (inputType === 'gamepad') return stats.stats.gamepad;
    if (inputType === 'keyboardMouse') return stats.stats.keyboardMouse;
  }

  const currentStats = getStats();

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
            <p>Progress: {stats.battlePass.progress?.toFixed(1) ?? 'N/A'}%</p>
          </div>

          <div className="input-buttons">
            <button
              className={inputType === 'all' ? 'active' : ''}
              onClick={() => setInputType('all')}
            >
              All
            </button>
            <button 
              className={inputType === 'gamepad' ? 'active' : ''}
              onClick={() => setInputType('gamepad')}
            >
              Gamepad
            </button>
            <button 
              className={inputType === 'keyboardMouse' ? 'active' : ''}
              onClick={() => setInputType('keyboardMouse')}
            >
              Keyboard & Mouse
            </button>
          </div>

          <div className="gamemodes">
            <div className="mode-card">
              <h3>Overall</h3>
              <p>Matches: {currentStats?.overall?.matches ?? 'N/A'}</p>
              <p>Wins: {currentStats?.overall?.wins ?? 'N/A'}</p>
              <p>Win Rate: {currentStats?.overall?.winRate?.toFixed(2) ?? 'N/A'}%</p>
              <p>Kills: {currentStats?.overall?.kills ?? 'N/A'}</p>
              <p>Deaths: {currentStats?.overall?.deaths ?? 'N/A'}</p>
              <p>KD: {currentStats?.overall?.kd?.toFixed(2) ?? 'N/A'}</p>
            </div>

            <div className="mode-card">
              <h3>Solo</h3>
              <p>Matches: {currentStats?.solo?.matches ?? 'N/A'}</p>
              <p>Wins: {currentStats?.solo?.wins ?? 'N/A'}</p>
              <p>Win Rate: {currentStats?.solo?.winRate?.toFixed(2) ?? 'N/A'}%</p>
              <p>Kills: {currentStats?.solo?.kills ?? 'N/A'}</p>
              <p>Deaths: {currentStats?.solo?.deaths ?? 'N/A'}</p>
              <p>KD: {currentStats?.solo?.kd?.toFixed(2) ?? 'N/A'}</p>
            </div>

            <div className="mode-card">
              <h3>Duo</h3>
              <p>Matches: {currentStats?.duo?.matches ?? 'N/A'}</p>
              <p>Wins: {currentStats?.duo?.wins ?? 'N/A'}</p>
              <p>Win Rate: {currentStats?.duo?.winRate?.toFixed(2) ?? 'N/A'}%</p>
              <p>Kills: {currentStats?.duo?.kills ?? 'N/A'}</p>
              <p>Deaths: {currentStats?.duo?.deaths ?? 'N/A'}</p>
              <p>KD: {currentStats?.duo?.kd?.toFixed(2) ?? 'N/A'}</p>
            </div>

            <div className="mode-card">
              <h3>Squad</h3>
              <p>Matches: {currentStats?.squad?.matches ?? 'N/A'}</p>
              <p>Wins: {currentStats?.squad?.wins ?? 'N/A'}</p>
              <p>Win Rate: {currentStats?.squad?.winRate?.toFixed(2) ?? 'N/A'}%</p>
              <p>Kills: {currentStats?.squad?.kills ?? 'N/A'}</p>
              <p>Deaths: {currentStats?.squad?.deaths ?? 'N/A'}</p>
              <p>KD: {currentStats?.squad?.kd?.toFixed(2) ?? 'N/A'}</p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default App;