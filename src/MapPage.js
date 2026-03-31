import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MapPage() {
  const [map, setMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPois, setShowPois] = useState(true);
  const [selectedPoi, setSelectedPoi] = useState(null);
  const [poiListOpen, setPoiListOpen] = useState(false);

  useEffect(() => {
    const fetchMap = async () => {
      try {
        const response = await axios.get('https://fortnite-api.com/v1/map', {
          headers: { 'Authorization': process.env.REACT_APP_FORTNITE_API_KEY }
        });
        setMap(response.data.data);
      } catch (error) {
        console.log('Failed to fetch map', error);
      }
      setLoading(false);
    };
    fetchMap();
  }, []);

  if (loading) return (
    <div className="spinner-container">
      <div className="spinner-large"></div>
    </div>
  );

  return (
    <div className="map-page">
      <h2 className="map-title">Fortnite Map</h2>

      {/* Toggle Buttons */}
      <div className="input-buttons">
        <button className={showPois ? 'active' : ''} onClick={() => setShowPois(true)}>Show POIs</button>
        <button className={!showPois ? 'active' : ''} onClick={() => setShowPois(false)}>Hide POIs</button>
      </div>

      {/* Map Layout */}
      <div className="map-layout">

        {/* Sidebar POI List */}
        <div className="poi-sidebar">
          <div className="poi-list-header" onClick={() => setPoiListOpen(!poiListOpen)}>
            <h3 className="poi-list-title">Locations ({map?.pois?.length ?? 0})</h3>
            <span className="poi-list-arrow">{poiListOpen ? '▲' : '▼'}</span>
          </div>
          {poiListOpen && (
            <div className="poi-grid">
              {map?.pois?.map((poi) => (
                <div
                  key={poi.id}
                  className={`poi-item ${selectedPoi?.id === poi.id ? 'poi-item-selected' : ''}`}
                  onClick={() => setSelectedPoi(selectedPoi?.id === poi.id ? null : poi)}
                >
                  {poi.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Map + Markers */}
        <div className="map-container">
          <img
            src={showPois ? map?.images?.pois : map?.images?.blank}
            alt="Fortnite Map"
            className="map-image"
          />
          {showPois && map?.pois?.map((poi) => (
            <div
              key={poi.id}
              className={`poi-marker ${selectedPoi?.id === poi.id ? 'poi-marker-selected' : ''}`}
              style={{
                left: `${(poi.location.x + 135000) / 270000 * 100}%`,
                top: `${(135000 - poi.location.y) / 270000 * 100}%`,
              }}
              onClick={() => setSelectedPoi(selectedPoi?.id === poi.id ? null : poi)}
              title={poi.name}
            >
              📍
              {selectedPoi?.id === poi.id && (
                <div className="poi-tooltip">{poi.name}</div>
              )}
            </div>
          ))}
        </div>

        {/* Right spacer to keep map centered */}
        <div className="poi-sidebar"></div>

      </div>
    </div>
  );
}

export default MapPage;