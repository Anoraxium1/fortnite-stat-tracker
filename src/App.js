import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [playerName, setPlayerName] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputType, setInputType] = useState('all');
  const [compareMode, setCompareMode] = useState(false);
  const [playerName2, setPlayerName2] = useState('');
  const [stats2, setStats2] = useState(null);
  const [loading2, setLoading2] = useState(false);

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

  const searchPlayer2 = async () => {
    setLoading2(true);
    try {
      const response = await axios.get(
        'https://fortnite-api.com/v2/stats/br/v2',
        {
          params: { name: playerName2, image: 'all' },
          headers: { 'Authorization': process.env.REACT_APP_FORTNITE_API_KEY }
        }
      );
      setStats2(response.data.data);
    } catch (error) {
      console.log('Player 2 not found');
    }
    setLoading2(false);
  };

  const getStats = (statsObj) => {
    if (!stats) return null;
    if (inputType === 'all') return stats.stats.all;
    if (inputType === 'gamepad') return stats.stats.gamepad;
    if (inputType === 'keyboardMouse') return stats.stats.keyboardMouse;
  };

  const currentStats = getStats(stats);
  const currentStats2 = getStats(stats2);

  const winner = (val1, val2, name1, name2) => {
    if (val1 == null || val2 == null) return 'N/A';
    if (val1 > val2) return name1;
    if (val2 > val1) return name2;
    return 'Tie';
  };

  const diff = (val1, val2) => {
    if (val1 == null || val2 == null) return 'N/A';
    return Math.abs(val1 - val2).toFixed(2);
  };

  const name1 = stats?.account?.name ?? 'Player 1';
  const name2 = stats2?.account?.name ?? 'Player 2';

  return (
    <div className="app">
      <h1>Fortnite Stat Tracker</h1>

      <div className="mode-toggle">
        <button
          className={!compareMode ? 'active' : ''}
          onClick={() => setCompareMode(false)}
        >
          Single Player
        </button>
        <button
          className={compareMode ? 'active' : ''}
          onClick={() => setCompareMode(true)}
        >
          Compare Players
        </button>
      </div>

      {!compareMode ? (
        <div className="search-bar">
          <input
            type="text"
            placeholder="Enter username"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <br /><br />
          <button onClick={searchPlayer}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      ) : (
        <div className="compare-search">
          <div className="compare-search-player">
            <input
              type="text"
              placeholder="Enter Player 1 username"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
            <br /><br />
            <button onClick={searchPlayer}>
              {loading ? 'Searching...' : 'Search Player 1'}
            </button>
          </div>
          <div className="compare-search-player">
            <input
              type="text"
              placeholder="Enter Player 2 username"
              value={playerName2}
              onChange={(e) => setPlayerName2(e.target.value)}
            />
            <br /><br />
            <button onClick={searchPlayer2}>
              {loading2 ? 'Searching...' : 'Search Player 2'}
            </button>
          </div>
        </div>
      )}

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

      {!compareMode && stats && (
        <div className="results">
          <div className="profile">
            {stats.image && (
              <img src={stats.image} alt="player" className="profile-img" />
            )}
            <h2>{stats.account.name}</h2>
            <p>Level: {stats.battlePass.level}</p>
            <p>Progress: {stats.battlePass.progress?.toFixed(1) ?? 'N/A'}%</p>
          </div>
          
          <div className="gamemodes">
            <div className="mode-card">
              <h3>Overall</h3>
              <p>Wins: {currentStats?.overall?.wins ?? 'N/A'}</p>
              <p>Win Rate: {currentStats?.overall?.winRate?.toFixed(2) ?? 'N/A'}%</p>
              <p>Kills: {currentStats?.overall?.kills ?? 'N/A'}</p>
              <p>Deaths: {currentStats?.overall?.deaths ?? 'N/A'}</p>
              <p>KD: {currentStats?.overall?.kd?.toFixed(2) ?? 'N/A'}</p>
              <p>Kills Per Match: {currentStats?.overall?.killsPerMatch ?? 'N/A'}</p>
              <p>Matches: {currentStats?.overall?.matches ?? 'N/A'}</p>
              <p>Total Score: {currentStats?.overall?.score ?? 'N/A'}</p>
              <p>Score Per Match: {currentStats?.overall?.scorePerMatch?.toFixed(2) ?? 'N/A'}</p>
              <p>Minutes Played: {currentStats?.overall?.minutesPlayed ?? 'N/A'}</p>
            </div>

            <div className="mode-card">
              <h3>Solo</h3>
              <p>Wins: {currentStats?.solo?.wins ?? 'N/A'}</p>
              <p>Win Rate: {currentStats?.solo?.winRate?.toFixed(2) ?? 'N/A'}%</p>
              <p>Kills: {currentStats?.solo?.kills ?? 'N/A'}</p>
              <p>Deaths: {currentStats?.solo?.deaths ?? 'N/A'}</p>
              <p>KD: {currentStats?.solo?.kd?.toFixed(2) ?? 'N/A'}</p>
              <p>Kills Per Match: {currentStats?.solo?.killsPerMatch ?? 'N/A'}</p>
              <p>Matches: {currentStats?.solo?.matches ?? 'N/A'}</p>
              <p>Total Score: {currentStats?.solo?.score ?? 'N/A'}</p>
              <p>Score Per Match: {currentStats?.solo?.scorePerMatch?.toFixed(2) ?? 'N/A'}</p>
              <p>Minutes Played: {currentStats?.solo?.minutesPlayed ?? 'N/A'}</p>
            </div>

            <div className="mode-card">
              <h3>Duo</h3>
              <p>Wins: {currentStats?.duo?.wins ?? 'N/A'}</p>
              <p>Win Rate: {currentStats?.duo?.winRate?.toFixed(2) ?? 'N/A'}%</p>
              <p>Kills: {currentStats?.duo?.kills ?? 'N/A'}</p>
              <p>Deaths: {currentStats?.duo?.deaths ?? 'N/A'}</p>
              <p>KD: {currentStats?.duo?.kd?.toFixed(2) ?? 'N/A'}</p>
              <p>Kills Per Match: {currentStats?.duo?.killsPerMatch ?? 'N/A'}</p>
              <p>Matches: {currentStats?.duo?.matches ?? 'N/A'}</p>
              <p>Total Score: {currentStats?.duo?.score ?? 'N/A'}</p>
              <p>Score Per Match: {currentStats?.duo?.scorePerMatch?.toFixed(2) ?? 'N/A'}</p>
              <p>Minutes Played: {currentStats?.duo?.minutesPlayed ?? 'N/A'}</p>
            </div>

            <div className="mode-card">
              <h3>Squad</h3>
              <p>Wins: {currentStats?.squad?.wins ?? 'N/A'}</p>
              <p>Win Rate: {currentStats?.squad?.winRate?.toFixed(2) ?? 'N/A'}%</p>
              <p>Kills: {currentStats?.squad?.kills ?? 'N/A'}</p>
              <p>Deaths: {currentStats?.squad?.deaths ?? 'N/A'}</p>
              <p>KD: {currentStats?.squad?.kd?.toFixed(2) ?? 'N/A'}</p>
              <p>Kills Per Match: {currentStats?.squad?.killsPerMatch ?? 'N/A'}</p>
              <p>Matches: {currentStats?.squad?.matches ?? 'N/A'}</p>
              <p>Total Score: {currentStats?.squad?.score ?? 'N/A'}</p>
              <p>Score Per Match: {currentStats?.squad?.scorePerMatch?.toFixed(2) ?? 'N/A'}</p>
              <p>Minutes Played: {currentStats?.squad?.minutesPlayed ?? 'N/A'}</p>
            </div>
          </div>

          <div className="Modified">
            <br /><br />
            <p1>Time Last Modified: {currentStats?.overall?.lastModified ?? 'N/A'}</p1>
          </div>
        </div>
      )}

      {compareMode && stats && stats2 && (
        <div className="compare-results">
          <div className="compare-player-card">
            <h2>{name1}</h2>
            <p>Level: {stats.battlePass.level}</p>
            <p>Wins: {currentStats?.overall?.wins ?? 'N/A'}</p>
            <p>Win Rate: {currentStats?.overall?.winRate?.toFixed(2) ?? 'N/A'}%</p>
            <p>Kills: {currentStats?.overall?.kills ?? 'N/A'}</p>
            <p>Deaths: {currentStats?.overall?.deaths ?? 'N/A'}</p>
            <p>KD: {currentStats?.overall?.kd?.toFixed(2) ?? 'N/A'}</p>
            <p>Matches: {currentStats?.overall?.matches ?? 'N/A'}</p>
            <p>Score Per Match: {currentStats?.overall?.scorePerMatch?.toFixed(2) ?? 'N/A'}</p>
          </div>

          <div className="compare-diff-card">
            <h2>Difference</h2>
            <p><strong>Wins:</strong> {winner(currentStats?.overall?.wins, currentStats2?.overall?.wins, name1, name2)} by {diff(currentStats?.overall?.wins, currentStats2?.overall?.wins)}</p>
            <p><strong>Win Rate:</strong> {winner(currentStats?.overall?.winRate, currentStats2?.overall?.winRate, name1, name2)} by {diff(currentStats?.overall?.winRate, currentStats2?.overall?.winRate)}%</p>
            <p><strong>Kills:</strong> {winner(currentStats?.overall?.kills, currentStats2?.overall?.kills, name1, name2)} by {diff(currentStats?.overall?.kills, currentStats2?.overall?.kills)}</p>
            <p><strong>Deaths:</strong> {winner(currentStats?.overall?.deaths, currentStats2?.overall?.deaths, name1, name2)} by {diff(currentStats?.overall?.deaths, currentStats2?.overall?.deaths)}</p>
            <p><strong>KD:</strong> {winner(currentStats?.overall?.kd, currentStats2?.overall?.kd, name1, name2)} by {diff(currentStats?.overall?.kd, currentStats2?.overall?.kd)}</p>
            <p><strong>Matches:</strong> {winner(currentStats?.overall?.matches, currentStats2?.overall?.matches, name1, name2)} by {diff(currentStats?.overall?.matches, currentStats2?.overall?.matches)}</p>
            <p><strong>Score/Match:</strong> {winner(currentStats?.overall?.scorePerMatch, currentStats2?.overall?.scorePerMatch, name1, name2)} by {diff(currentStats?.overall?.scorePerMatch, currentStats2?.overall?.scorePerMatch)}</p>
          </div>

          <div className="compare-player-card">
            <h2>{name2}</h2>
            <p>Level: {stats2.battlePass.level}</p>
            <p>Wins: {currentStats2?.overall?.wins ?? 'N/A'}</p>
            <p>Win Rate: {currentStats2?.overall?.winRate?.toFixed(2) ?? 'N/A'}%</p>
            <p>Kills: {currentStats2?.overall?.kills ?? 'N/A'}</p>
            <p>Deaths: {currentStats2?.overall?.deaths ?? 'N/A'}</p>
            <p>KD: {currentStats2?.overall?.kd?.toFixed(2) ?? 'N/A'}</p>
            <p>Matches: {currentStats2?.overall?.matches ?? 'N/A'}</p>
            <p>Score Per Match: {currentStats2?.overall?.scorePerMatch?.toFixed(2) ?? 'N/A'}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;