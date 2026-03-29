import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import ShopPage from './ShopPage';
import CosmeticsPage from './CosmeticsPage';

function App() {
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
      setError('Player not found. Check the username and try again.');
      setStats(null);
      setLoading(false);
    }
  };

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
      setError2('Player not found. Check the username and try again.');
      setStats2(null);
      setLoading2(false);
    }
  };

  const getStats = (statsObj) => {
    if (!statsObj) return null;
    if (inputType === 'all') return statsObj.stats.all;
    if (inputType === 'gamepad') return statsObj.stats.gamepad;
    if (inputType === 'keyboardMouse') return statsObj.stats.keyboardMouse;
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

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('en-AU', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  };

  const name1 = stats?.account?.name ?? 'Player 1';
  const name2 = stats2?.account?.name ?? 'Player 2';

  const StatRow = ({ label, value }) => (
    <p><span>{label}</span><span>{value}</span></p>
  );

  const statCard = (label, s) => (
    <div className="mode-card">
      <h3>{label}</h3>
      <div className="stat-section-header">Performance</div>
      <StatRow label="Wins" value={s?.wins ?? 'N/A'} />
      <StatRow label="Win Rate" value={`${s?.winRate?.toFixed(2) ?? 'N/A'}%`} />
      <StatRow label="Matches" value={s?.matches ?? 'N/A'} />
      {s?.top3 != null && <StatRow label="Top 3" value={s.top3} />}
      {s?.top5 != null && <StatRow label="Top 5" value={s.top5} />}
      {s?.top6 != null && <StatRow label="Top 6" value={s.top6} />}
      {s?.top10 != null && <StatRow label="Top 10" value={s.top10} />}
      {s?.top12 != null && <StatRow label="Top 12" value={s.top12} />}
      {s?.top25 != null && <StatRow label="Top 25" value={s.top25} />}
      <div className="stat-section-header">Combat</div>
      <StatRow label="Kills" value={s?.kills ?? 'N/A'} />
      <StatRow label="Deaths" value={s?.deaths ?? 'N/A'} />
      <StatRow label="KD" value={s?.kd?.toFixed(2) ?? 'N/A'} />
      <StatRow label="Kills / Match" value={s?.killsPerMatch ?? 'N/A'} />
      <StatRow label="Players Outlived" value={s?.playersOutlived ?? 'N/A'} />
      <div className="stat-section-header">Score</div>
      <StatRow label="Total Score" value={s?.score ?? 'N/A'} />
      <StatRow label="Score / Match" value={s?.scorePerMatch?.toFixed(2) ?? 'N/A'} />
      <div className="stat-section-header">Time</div>
      <StatRow label="Minutes Played" value={s?.minutesPlayed ?? 'N/A'} />
    </div>
  );

  return (
    <div className="app">

      {/* Navigation */}
      <div className="nav-buttons">
        <button className={page === 'stats' ? 'active' : ''} onClick={() => setPage('stats')}>Stats</button>
        <button className={page === 'shop' ? 'active' : ''} onClick={() => setPage('shop')}>Item Shop</button>
        <button className={page === 'cosmetics' ? 'active' : ''} onClick={() => setPage('cosmetics')}>Cosmetics</button>
      </div>

      {/* Title */}
      <h1>FN Tracker</h1>

      {/* Stats Page */}
      {page === 'stats' && (
        <div>
          {/* Mode Toggle */}
          <div className="mode-toggle">
            <button className={!compareMode ? 'active' : ''} onClick={() => setCompareMode(false)}>Single Player</button>
            <button className={compareMode ? 'active' : ''} onClick={() => setCompareMode(true)}>Compare Players</button>
          </div>

          {/* Search Bars */}
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
              <button onClick={searchPlayer}>
                {loading ? <div className="spinner"></div> : 'Search'}
              </button>
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
                <button onClick={searchPlayer}>
                  {loading ? <div className="spinner"></div> : 'Search Player 1'}
                </button>
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
                <button onClick={searchPlayer2}>
                  {loading2 ? <div className="spinner"></div> : 'Search Player 2'}
                </button>
                {error2 && <div className="error-message">{error2}</div>}
              </div>
            </div>
          )}

          {/* Input Type Buttons */}
          <div className="input-buttons">
            <button className={inputType === 'all' ? 'active' : ''} onClick={() => setInputType('all')}>All</button>
            <button className={inputType === 'gamepad' ? 'active' : ''} onClick={() => setInputType('gamepad')}>Gamepad</button>
            <button className={inputType === 'keyboardMouse' ? 'active' : ''} onClick={() => setInputType('keyboardMouse')}>Keyboard & Mouse</button>
          </div>

          {/* Single Player View */}
          {!compareMode && stats && (
            <div className="results">
              <div className="profile">
                <h3>Player Profile</h3>
                <h2>{stats?.account?.name ?? 'N/A'}</h2>
                <p><span>Level</span><span>{stats?.battlePass?.level ?? 'N/A'}</span></p>
                <p><span>Progress To Next Level</span><span>{stats?.battlePass?.progress?.toFixed(1) ?? 'N/A'}%</span></p>
              </div>

              <div className="gamemodes">
                {statCard('Overall', currentStats?.overall)}
                {statCard('Solo', currentStats?.solo)}
                {statCard('Duo', currentStats?.duo)}
                {statCard('Squad', currentStats?.squad)}
                {statCard('LTM', currentStats?.ltm)}
              </div>

              <div className="Updated">
                <br /><br />
                <p>Last Time Updated: {formatDate(currentStats?.overall?.lastModified)}</p>
              </div>
            </div>
          )}

          {/* Compare Player View */}
          {compareMode && (stats || stats2) && (
            <div className="results">

              <div className="profile-container">
                {stats && (
                  <div className="profile">
                    <h3>Player 1 Profile</h3>
                    <h2>{stats?.account?.name ?? 'N/A'}</h2>
                    <p><span>Level</span><span>{stats?.battlePass?.level ?? 'N/A'}</span></p>
                    <p><span>Progress To Next Level</span><span>{stats?.battlePass?.progress?.toFixed(1) ?? 'N/A'}%</span></p>
                  </div>
                )}
                {stats2 && (
                  <div className="profile">
                    <h3>Player 2 Profile</h3>
                    <h2>{stats2?.account?.name ?? 'N/A'}</h2>
                    <p><span>Level</span><span>{stats2?.battlePass?.level ?? 'N/A'}</span></p>
                    <p><span>Progress To Next Level</span><span>{stats2?.battlePass?.progress?.toFixed(1) ?? 'N/A'}%</span></p>
                  </div>
                )}
              </div>

              <div className="compare-grid">

                <div className="compare-player-header">{stats ? name1 : ''}</div>
                <div className="compare-diff-header">Difference</div>
                <div className="compare-player-header">{stats2 ? name2 : ''}</div>

                <div className="compare-section-header">Battle Pass</div>
                <div className="compare-section-header">Battle Pass</div>
                <div className="compare-section-header">Battle Pass</div>

                <div className="compare-cell"><span>Level</span><span>{stats?.battlePass?.level ?? 'N/A'}</span></div>
                <div className="compare-cell-diff"><strong>Level:</strong> {winner(stats?.battlePass?.level, stats2?.battlePass?.level, name1, name2)} by {diff(stats?.battlePass?.level, stats2?.battlePass?.level)}</div>
                <div className="compare-cell"><span>Level</span><span>{stats2?.battlePass?.level ?? 'N/A'}</span></div>

                <div className="compare-section-header">Performance</div>
                <div className="compare-section-header">Performance</div>
                <div className="compare-section-header">Performance</div>

                <div className="compare-cell"><span>Wins</span><span>{currentStats?.overall?.wins ?? 'N/A'}</span></div>
                <div className="compare-cell-diff"><strong>Wins:</strong> {winner(currentStats?.overall?.wins, currentStats2?.overall?.wins, name1, name2)} by {diff(currentStats?.overall?.wins, currentStats2?.overall?.wins)}</div>
                <div className="compare-cell"><span>Wins</span><span>{currentStats2?.overall?.wins ?? 'N/A'}</span></div>

                <div className="compare-cell"><span>Win Rate</span><span>{currentStats?.overall?.winRate?.toFixed(2) ?? 'N/A'}%</span></div>
                <div className="compare-cell-diff"><strong>Win Rate:</strong> {winner(currentStats?.overall?.winRate, currentStats2?.overall?.winRate, name1, name2)} by {diff(currentStats?.overall?.winRate, currentStats2?.overall?.winRate)}%</div>
                <div className="compare-cell"><span>Win Rate</span><span>{currentStats2?.overall?.winRate?.toFixed(2) ?? 'N/A'}%</span></div>

                <div className="compare-cell"><span>Matches</span><span>{currentStats?.overall?.matches ?? 'N/A'}</span></div>
                <div className="compare-cell-diff"><strong>Matches:</strong> {winner(currentStats?.overall?.matches, currentStats2?.overall?.matches, name1, name2)} by {diff(currentStats?.overall?.matches, currentStats2?.overall?.matches)}</div>
                <div className="compare-cell"><span>Matches</span><span>{currentStats2?.overall?.matches ?? 'N/A'}</span></div>

                <div className="compare-cell"><span>Top 3</span><span>{currentStats?.overall?.top3 ?? 'N/A'}</span></div>
                <div className="compare-cell-diff"><strong>Top 3:</strong> {winner(currentStats?.overall?.top3, currentStats2?.overall?.top3, name1, name2)} by {diff(currentStats?.overall?.top3, currentStats2?.overall?.top3)}</div>
                <div className="compare-cell"><span>Top 3</span><span>{currentStats2?.overall?.top3 ?? 'N/A'}</span></div>

                <div className="compare-cell"><span>Top 5</span><span>{currentStats?.overall?.top5 ?? 'N/A'}</span></div>
                <div className="compare-cell-diff"><strong>Top 5:</strong> {winner(currentStats?.overall?.top5, currentStats2?.overall?.top5, name1, name2)} by {diff(currentStats?.overall?.top5, currentStats2?.overall?.top5)}</div>
                <div className="compare-cell"><span>Top 5</span><span>{currentStats2?.overall?.top5 ?? 'N/A'}</span></div>

                <div className="compare-cell"><span>Top 10</span><span>{currentStats?.overall?.top10 ?? 'N/A'}</span></div>
                <div className="compare-cell-diff"><strong>Top 10:</strong> {winner(currentStats?.overall?.top10, currentStats2?.overall?.top10, name1, name2)} by {diff(currentStats?.overall?.top10, currentStats2?.overall?.top10)}</div>
                <div className="compare-cell"><span>Top 10</span><span>{currentStats2?.overall?.top10 ?? 'N/A'}</span></div>

                <div className="compare-cell"><span>Top 25</span><span>{currentStats?.overall?.top25 ?? 'N/A'}</span></div>
                <div className="compare-cell-diff"><strong>Top 25:</strong> {winner(currentStats?.overall?.top25, currentStats2?.overall?.top25, name1, name2)} by {diff(currentStats?.overall?.top25, currentStats2?.overall?.top25)}</div>
                <div className="compare-cell"><span>Top 25</span><span>{currentStats2?.overall?.top25 ?? 'N/A'}</span></div>

                <div className="compare-section-header">Combat</div>
                <div className="compare-section-header">Combat</div>
                <div className="compare-section-header">Combat</div>

                <div className="compare-cell"><span>Kills</span><span>{currentStats?.overall?.kills ?? 'N/A'}</span></div>
                <div className="compare-cell-diff"><strong>Kills:</strong> {winner(currentStats?.overall?.kills, currentStats2?.overall?.kills, name1, name2)} by {diff(currentStats?.overall?.kills, currentStats2?.overall?.kills)}</div>
                <div className="compare-cell"><span>Kills</span><span>{currentStats2?.overall?.kills ?? 'N/A'}</span></div>

                <div className="compare-cell"><span>Deaths</span><span>{currentStats?.overall?.deaths ?? 'N/A'}</span></div>
                <div className="compare-cell-diff"><strong>Deaths:</strong> {winner(currentStats?.overall?.deaths, currentStats2?.overall?.deaths, name1, name2)} by {diff(currentStats?.overall?.deaths, currentStats2?.overall?.deaths)}</div>
                <div className="compare-cell"><span>Deaths</span><span>{currentStats2?.overall?.deaths ?? 'N/A'}</span></div>

                <div className="compare-cell"><span>KD</span><span>{currentStats?.overall?.kd?.toFixed(2) ?? 'N/A'}</span></div>
                <div className="compare-cell-diff"><strong>KD:</strong> {winner(currentStats?.overall?.kd, currentStats2?.overall?.kd, name1, name2)} by {diff(currentStats?.overall?.kd, currentStats2?.overall?.kd)}</div>
                <div className="compare-cell"><span>KD</span><span>{currentStats2?.overall?.kd?.toFixed(2) ?? 'N/A'}</span></div>

                <div className="compare-cell"><span>Kills / Match</span><span>{currentStats?.overall?.killsPerMatch ?? 'N/A'}</span></div>
                <div className="compare-cell-diff"><strong>Kills / Match:</strong> {winner(currentStats?.overall?.killsPerMatch, currentStats2?.overall?.killsPerMatch, name1, name2)} by {diff(currentStats?.overall?.killsPerMatch, currentStats2?.overall?.killsPerMatch)}</div>
                <div className="compare-cell"><span>Kills / Match</span><span>{currentStats2?.overall?.killsPerMatch ?? 'N/A'}</span></div>

                <div className="compare-cell"><span>Players Outlived</span><span>{currentStats?.overall?.playersOutlived ?? 'N/A'}</span></div>
                <div className="compare-cell-diff"><strong>Players Outlived:</strong> {winner(currentStats?.overall?.playersOutlived, currentStats2?.overall?.playersOutlived, name1, name2)} by {diff(currentStats?.overall?.playersOutlived, currentStats2?.overall?.playersOutlived)}</div>
                <div className="compare-cell"><span>Players Outlived</span><span>{currentStats2?.overall?.playersOutlived ?? 'N/A'}</span></div>

                <div className="compare-section-header">Score</div>
                <div className="compare-section-header">Score</div>
                <div className="compare-section-header">Score</div>

                <div className="compare-cell"><span>Total Score</span><span>{currentStats?.overall?.score ?? 'N/A'}</span></div>
                <div className="compare-cell-diff"><strong>Total Score:</strong> {winner(currentStats?.overall?.score, currentStats2?.overall?.score, name1, name2)} by {diff(currentStats?.overall?.score, currentStats2?.overall?.score)}</div>
                <div className="compare-cell"><span>Total Score</span><span>{currentStats2?.overall?.score ?? 'N/A'}</span></div>

                <div className="compare-cell"><span>Score / Match</span><span>{currentStats?.overall?.scorePerMatch?.toFixed(2) ?? 'N/A'}</span></div>
                <div className="compare-cell-diff"><strong>Score / Match:</strong> {winner(currentStats?.overall?.scorePerMatch, currentStats2?.overall?.scorePerMatch, name1, name2)} by {diff(currentStats?.overall?.scorePerMatch, currentStats2?.overall?.scorePerMatch)}</div>
                <div className="compare-cell"><span>Score / Match</span><span>{currentStats2?.overall?.scorePerMatch?.toFixed(2) ?? 'N/A'}</span></div>

                <div className="compare-section-header">Time</div>
                <div className="compare-section-header">Time</div>
                <div className="compare-section-header">Time</div>

                <div className="compare-cell"><span>Minutes Played</span><span>{currentStats?.overall?.minutesPlayed ?? 'N/A'}</span></div>
                <div className="compare-cell-diff"><strong>Minutes Played:</strong> {winner(currentStats?.overall?.minutesPlayed, currentStats2?.overall?.minutesPlayed, name1, name2)} by {diff(currentStats?.overall?.minutesPlayed, currentStats2?.overall?.minutesPlayed)}</div>
                <div className="compare-cell"><span>Minutes Played</span><span>{currentStats2?.overall?.minutesPlayed ?? 'N/A'}</span></div>

              </div>

              <div className="Updated">
                <br /><br />
                <p>{name1} Last Updated: {formatDate(currentStats?.overall?.lastModified)}</p>
                <p>{name2} Last Updated: {formatDate(currentStats2?.overall?.lastModified)}</p>
              </div>

            </div>
          )}
        </div>
      )}

      {/* Shop Page */}
      {page === 'shop' && <ShopPage />}

      {/* Cosmetics Page */}
      {page === 'cosmetics' && <CosmeticsPage />}

    </div>
  );
}

export default App;