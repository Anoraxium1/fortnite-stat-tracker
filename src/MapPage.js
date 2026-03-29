import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MapPage() {
    const [map, setMap] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPois, setShowPois] = useState(true);
    const [selectedPoi, setSelectedPoi] = useState(null);

    const fetchMap = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                'https://fortnite-api.com/v1/map'
            );
            setMap(response.data.data);
        } catch (error) {
            console.log('Failed to fetch map', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMap();
    }, []);

    if (loading) {
        return (
            <div className="spinner-container">
                <div className="spinner-large"></div>
            </div>
        );
    }

    return (
        <div className="map-page">
            <h2 className="map-title">Fortnite Map</h2>

            {/* Buttons */}
            <div className="map-buttons">
                <button onClick={() => setShowPois(true)}>Show POIs</button>
                <button onClick={() => setShowPois(false)}>Hide POIs</button>
            </div>

            {/* Map + Markers */}
            <div className="map-container">
                <img
                    src={showPois ? map?.images?.pois : map?.images?.blank}
                    alt="map"
                    className="map-image"
                />

                {/* OPTIONAL: POI markers on map */}
                {showPois && map?.pois?.map((poi) => (
                    <div
                        key={poi.id}
                        className="poi-marker"
                        style={{
                            left: `${poi.location.x * 100}%`,
                            top: `${poi.location.y * 100}%`
                        }}
                        onClick={() => setSelectedPoi(poi)}
                    >
                        📍
                    </div>
                ))}
            </div>

            {/* POI List */}
            <div className="poi-list">
                <h3>Locations</h3>
                {map?.pois?.map((poi) => (
                    <div
                        key={poi.id}
                        className="poi-item"
                        onClick={() => setSelectedPoi(poi)}
                    >
                        {poi.name}
                    </div>
                ))}
            </div>

            {/* Selected POI Details */}
            {selectedPoi && (
                <div className="poi-details">
                    <h3>{selectedPoi.name}</h3>
                    <p><strong>ID:</strong> {selectedPoi.id}</p>
                    <p><strong>X:</strong> {selectedPoi.location.x}</p>
                    <p><strong>Y:</strong> {selectedPoi.location.y}</p>
                    <button onClick={() => setSelectedPoi(null)}>Close</button>
                </div>
            )}
        </div>
    );
}

export default MapPage;