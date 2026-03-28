import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import ShopPage from './ShopPage';
import CosmeticsPage from './CosmeticsPage';

function App() {
  {/* Setting Variables */}
  const [playerName, setPlayerName] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputType, setInputType] = useState('all');
  const [compareMode, setCompareMode] = useState(false);
  const [playerName2, setPlayerName2] = useState('');
  const [stats2, setStats2] = useState(null);
  const [loading2, setLoading2] = useState(false);
  const [page, setPage] = useState('stats');
  const [error, setError] = useState(null);
  const [error2, setError2] = useState(null);

  // Finding Player 1 From API
  const searchPlayer = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://fortnite-api.com/v2/stats/br/v2`,
        { 
          params: { name: playerName, image: 'all' },
          headers: { 'Authorization': process.env.REACT_APP_FORTNITE_API_KEY }
        }
      );
      setStats(response.data.data);
      setLoading(false);
    } catch (err) {
      console.log('setting error');
      setError('Player not found. Check the username and try again.');
      setStats(null);
      setLoading(false);
    }
  };

  // Finding Player 2 From API
  const searchPlayer2 = async () => {
    setLoading2(true);
    setError2(null);
    try {
      const response = await axios.get(
        `https://fortnite-api.com/v2/stats/br/v2`,
        { 
          params: { name: playerName2, image: 'all' },
          headers: { 'Authorization': process.env.REACT_APP_FORTNITE_API_KEY }
        }
      );
      setStats2(response.data.data);
      setLoading2(false);
    } catch (err) {
      console.log('setting error');
      setError2('Player not found. Check the username and try again.');
      setStats2(null);
      setLoading2(false);
    }
  };

  // Stating Gamemode Selections
  const getStats = (statsObj) => {
    if (!statsObj) return null;
    if (inputType === 'all') return statsObj.stats.all;
    if (inputType === 'gamepad') return statsObj.stats.gamepad;
    if (inputType === 'keyboardMouse') return statsObj.stats.keyboardMouse;
  };

  // Each Players Stats
  const currentStats = getStats(stats);
  const currentStats2 = getStats(stats2);

  // Winner Function
  const winner = (val1, val2, name1, name2) => {
    if (val1 == null || val2 == null) return 'N/A';
    if (val1 > val2) return name1;
    if (val2 > val1) return name2;
    return 'Tie';
  };

  // Difference Function
  const diff = (val1, val2) => {
    if (val1 == null || val2 == null) return 'N/A';
    return Math.abs(val1 - val2).toFixed(2);
  };

  // Stats Last Updated Timestamp
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('en-AU', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  };

  // Account Names
  const name1 = stats?.account?.name ?? 'Player 1';
  const name2 = stats2?.account?.name ?? 'Player 2';

  // Statistic Row Format
  const StatRow = ({ label, value }) => (
    <p><span>{label}</span><span>{value}</span></p>
  );

  // Statistic Card Format
  const statCard = (label, s) => (
    <div className="mode-card">
      <h3>{label}</h3>
      <div className="stat-section-header">Performance</div>
      <StatRow label="Wins" value={s?.wins ?? 'N/A'} />
      <StatRow label="Win Rate" value={`${s?.winRate?.toFixed(2) ?? 'N/A'}%`} />
      <StatRow label="Matches" value={s?.matches ?? 'N/A'} />
      <div className="stat-section-header">Combat</div>
      <StatRow label="Kills" value={s?.kills ?? 'N/A'} />
      <StatRow label="Deaths" value={s?.deaths ?? 'N/A'} />
      <StatRow label="KD" value={s?.kd?.toFixed(2) ?? 'N/A'} />
      <StatRow label="Kills / Match" value={s?.killsPerMatch ?? 'N/A'} />
      <div className="stat-section-header">Score</div>
      <StatRow label="Total Score" value={s?.score ?? 'N/A'} />
      <StatRow label="Score / Match" value={s?.scorePerMatch?.toFixed(2) ?? 'N/A'} />
      <div className="stat-section-header">Time</div>
      <StatRow label="Minutes Played" value={s?.minutesPlayed ?? 'N/A'} />
    </div>
  );

  // Compare Stat Card Format
  const compareStatCard = (playerStats, battlePassData) => (
    <div className="compare-player-card">
      <div className="stat-section-header">Battle Pass</div>
      <p><span>Level</span><span>{battlePassData?.level ?? 'N/A'}</span></p>
      <div className="stat-section-header">Performance</div>
      <p><span>Wins</span><span>{playerStats?.overall?.wins ?? 'N/A'}</span></p>
      <p><span>Win Rate</span><span>{playerStats?.overall?.winRate?.toFixed(2) ?? 'N/A'}%</span></p>
      <p><span>Matches</span><span>{playerStats?.overall?.matches ?? 'N/A'}</span></p>
      <div className="stat-section-header">Combat</div>
      <p><span>Kills</span><span>{playerStats?.overall?.kills ?? 'N/A'}</span></p>
      <p><span>Deaths</span><span>{playerStats?.overall?.deaths ?? 'N/A'}</span></p>
      <p><span>KD</span><span>{playerStats?.overall?.kd?.toFixed(2) ?? 'N/A'}</span></p>
      <p><span>Kills / Match</span><span>{playerStats?.overall?.killsPerMatch ?? 'N/A'}</span></p>
      <div className="stat-section-header">Score</div>
      <p><span>Total Score</span><span>{playerStats?.overall?.score ?? 'N/A'}</span></p>
      <p><span>Score / Match</span><span>{playerStats?.overall?.scorePerMatch?.toFixed(2) ?? 'N/A'}</span></p>
      <div className="stat-section-header">Time</div>
      <p><span>Minutes Played</span><span>{playerStats?.overall?.minutesPlayed ?? 'N/A'}</span></p>
    </div>
  );

  return (
    <div className="app">

      {/* Navigation */}
      <div className="nav-buttons">
        <button
          className={page === 'stats' ? 'active' : ''}
          onClick={() => setPage('stats')}
        >
          Stats
        </button>
        <button
          className={page === 'shop' ? 'active' : ''}
          onClick={() => setPage('shop')}
        >
          Item Shop
        </button>
        <button
          className={page === 'cosmetics' ? 'active' : ''}
          onClick={() => setPage('cosmetics')}
        >
          Cosmetics
        </button>
      </div>

      {/* Title */}
      <h1>FN Tracker</h1>

      {/* Stats Page */}
      {page === 'stats' && (
        <div>
          {/* Mode Toggle Switches */}
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

          {/* Player Search Bars */}
          {!compareMode ? (
            <div className="search-bar">
              <input
                type="text"
                placeholder="Enter username"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchPlayer()}
              />
              <br /><br />
              {/* Single player search button */}
              <button onClick={searchPlayer}>
                {loading ? <div className="spinner"></div> : 'Search'}
              </button>
              {error && console.log('error state:', error)}
              {error && <div className="error-message">{error}</div>}
            </div>
          ) : (
            <div className="compare-search">
              <div className="compare-search-player">
                <input
                  type="text"
                  placeholder="Enter Player 1 username"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchPlayer()}
                />
                <br /><br />
                {/* Compare player 1 search button */}
                <button onClick={searchPlayer}>
                  {loading ? <div className="spinner"></div> : 'Search Player 1'}
                </button>
                {error && console.log('error state:', error)}
                {error && <div className="error-message">{error}</div>}
              </div>
              <div className="compare-search-player">
                <input
                  type="text"
                  placeholder="Enter Player 2 username"
                  value={playerName2}
                  onChange={(e) => setPlayerName2(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchPlayer2()}
                />
                <br /><br />
                {/* Compare player 2 search button */}
                <button onClick={searchPlayer2}>
                  {loading2 ? <div className="spinner"></div> : 'Search Player 2'}
                </button>
                {error && console.log('error state:', error)}
                {error && <div className="error-message">{error}</div>}
              </div>
            </div>
          )}

          {/* Gamemode Selector Buttons */}
          <div className="input-buttons">
            <button className={inputType === 'all' ? 'active' : ''} onClick={() => setInputType('all')}>All</button>
            <button className={inputType === 'gamepad' ? 'active' : ''} onClick={() => setInputType('gamepad')}>Gamepad</button>
            <button className={inputType === 'keyboardMouse' ? 'active' : ''} onClick={() => setInputType('keyboardMouse')}>Keyboard & Mouse</button>
          </div>

          {/* Single Player View */}
          {!compareMode && stats && (
            <div className="results">

              {/* Player Profile Card */}
              <div className="profile">
                <h3>Player Profile</h3>
                <h2>{stats?.account?.name ?? 'N/A'}</h2>
                <p><span>Level</span><span>{stats?.battlePass?.level ?? 'N/A'}</span></p>
                <p><span>Progress To Next Level</span><span>{stats?.battlePass?.progress?.toFixed(1) ?? 'N/A'}%</span></p>
              </div>

              {/* Each Gamemode Statistic Card */}
              <div className="gamemodes">
                {statCard('Overall', currentStats?.overall)}
                {statCard('Solo', currentStats?.solo)}
                {statCard('Duo', currentStats?.duo)}
                {statCard('Squad', currentStats?.squad)}
              </div>

              {/* Last Updated Timestamp */}
              <div className="Updated">
                <br /><br />
                <p>Last Time Updated: {formatDate(currentStats?.overall?.lastModified)}</p>
              </div>
            </div>
          )}

          {/* Compare Player View */}
          {compareMode && stats && stats2 && (
            <div className="results">

              {/* Player Profile Cards */}
              <div className="profile-container">
                <div className="profile">
                  <h3>Player 1 Profile</h3>
                  <h2>{stats?.account?.name ?? 'N/A'}</h2>
                  <p><span>Level</span><span>{stats?.battlePass?.level ?? 'N/A'}</span></p>
                  <p><span>Progress To Next Level</span><span>{stats?.battlePass?.progress?.toFixed(1) ?? 'N/A'}%</span></p>
                </div>
                <div className="profile">
                  <h3>Player 2 Profile</h3>
                  <h2>{stats2?.account?.name ?? 'N/A'}</h2>
                  <p><span>Level</span><span>{stats2?.battlePass?.level ?? 'N/A'}</span></p>
                  <p><span>Progress To Next Level</span><span>{stats2?.battlePass?.progress?.toFixed(1) ?? 'N/A'}%</span></p>
                </div>
              </div>

              {/* Compare Stat Cards */}
              <div className="compare-results">

                {/* Player 1 Stat Card */}
                <div className="compare-player-card">
                  <h2>{name1}</h2>
                  {compareStatCard(currentStats, stats?.battlePass)}
                </div>

                {/* Difference Card */}
                <div className="compare-diff-card">
                  <h2>Difference</h2>
                  <div className="stat-section-header">Battle Pass</div>
                  <p><strong>Level:</strong> {winner(stats?.battlePass?.level, stats2?.battlePass?.level, name1, name2)} by {diff(stats?.battlePass?.level, stats2?.battlePass?.level)}</p>
                  <div className="stat-section-header">Performance</div>
                  <p><strong>Wins:</strong> {winner(currentStats?.overall?.wins, currentStats2?.overall?.wins, name1, name2)} by {diff(currentStats?.overall?.wins, currentStats2?.overall?.wins)}</p>
                  <p><strong>Win Rate:</strong> {winner(currentStats?.overall?.winRate, currentStats2?.overall?.winRate, name1, name2)} by {diff(currentStats?.overall?.winRate, currentStats2?.overall?.winRate)}%</p>
                  <p><strong>Matches:</strong> {winner(currentStats?.overall?.matches, currentStats2?.overall?.matches, name1, name2)} by {diff(currentStats?.overall?.matches, currentStats2?.overall?.matches)}</p>
                  <div className="stat-section-header">Combat</div>
                  <p><strong>Kills:</strong> {winner(currentStats?.overall?.kills, currentStats2?.overall?.kills, name1, name2)} by {diff(currentStats?.overall?.kills, currentStats2?.overall?.kills)}</p>
                  <p><strong>Deaths:</strong> {winner(currentStats?.overall?.deaths, currentStats2?.overall?.deaths, name1, name2)} by {diff(currentStats?.overall?.deaths, currentStats2?.overall?.deaths)}</p>
                  <p><strong>KD:</strong> {winner(currentStats?.overall?.kd, currentStats2?.overall?.kd, name1, name2)} by {diff(currentStats?.overall?.kd, currentStats2?.overall?.kd)}</p>
                  <p><strong>Kills / Match:</strong> {winner(currentStats?.overall?.killsPerMatch, currentStats2?.overall?.killsPerMatch, name1, name2)} by {diff(currentStats?.overall?.killsPerMatch, currentStats2?.overall?.killsPerMatch)}</p>
                  <div className="stat-section-header">Score</div>
                  <p><strong>Total Score:</strong> {winner(currentStats?.overall?.score, currentStats2?.overall?.score, name1, name2)} by {diff(currentStats?.overall?.score, currentStats2?.overall?.score)}</p>
                  <p><strong>Score / Match:</strong> {winner(currentStats?.overall?.scorePerMatch, currentStats2?.overall?.scorePerMatch, name1, name2)} by {diff(currentStats?.overall?.scorePerMatch, currentStats2?.overall?.scorePerMatch)}</p>
                  <div className="stat-section-header">Time</div>
                  <p><strong>Minutes Played:</strong> {winner(currentStats?.overall?.minutesPlayed, currentStats2?.overall?.minutesPlayed, name1, name2)} by {diff(currentStats?.overall?.minutesPlayed, currentStats2?.overall?.minutesPlayed)}</p>
                </div>

                {/* Player 2 Stat Card */}
                <div className="compare-player-card">
                  <h2>{name2}</h2>
                  {compareStatCard(currentStats2, stats2?.battlePass)}
                </div>

              </div>

              {/* Last Updated Timestamp */}
              <div className="Updated">
                <br /><br />
                <p>Last Time Updated: {formatDate(currentStats?.overall?.lastModified)}</p>
              </div>

            </div>
          )}
        </div>
      )}

      {/* Shop Page */}
      {page === 'shop' && <ShopPage />}

      {/* Cosmetics Page*/}
      {page === 'cosmetics' && <CosmeticsPage />}

    </div>
  );
}

export default App;