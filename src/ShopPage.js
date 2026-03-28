import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ShopPage() {
  const [shopItems, setShopItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const getRarityColor = (rarity) => {
    switch (rarity?.toLowerCase()) {
      case 'legendary': return '#f4a21e';
      case 'epic': return '#9d4dbb';
      case 'rare': return '#4d9dbb';
      case 'uncommon': return '#4dbb6b';
      case 'common': return '#8c8c8c';
      case 'icon series': return '#4dffd7';
      case 'marvel series': return '#ff3d3d';
      case 'dc series': return '#4d8cff';
      case 'star wars series': return '#ffe44d';
      case 'gaming legends series': return '#7b4dff';
      default: return '#00d4ff';
    }
  };

  const getRarityGradient = (rarity) => {
    switch (rarity?.toLowerCase()) {
      case 'legendary': return 'linear-gradient(160deg, #5c3d0e, #f4a21e44)';
      case 'epic': return 'linear-gradient(160deg, #2d1a3d, #9d4dbb44)';
      case 'rare': return 'linear-gradient(160deg, #0e2d3d, #4d9dbb44)';
      case 'uncommon': return 'linear-gradient(160deg, #0e3d1a, #4dbb6b44)';
      case 'common': return 'linear-gradient(160deg, #2a2a2a, #8c8c8c44)';
      case 'icon series': return 'linear-gradient(160deg, #0e3d35, #4dffd744)';
      case 'marvel series': return 'linear-gradient(160deg, #3d0e0e, #ff3d3d44)';
      case 'dc series': return 'linear-gradient(160deg, #0e1a3d, #4d8cff44)';
      case 'star wars series': return 'linear-gradient(160deg, #3d350e, #ffe44d44)';
      case 'gaming legends series': return 'linear-gradient(160deg, #1a0e3d, #7b4dff44)';
      default: return 'linear-gradient(160deg, #0e2d3d, #00d4ff44)';
    }
  };

  const getTileSize = (tileSize) => {
    switch (tileSize) {
      case 'Size_2_x_2': return 'tile-2x2';
      case 'Size_2_x_1': return 'tile-2x1';
      case 'Size_1_x_2': return 'tile-1x2';
      default: return 'tile-1x1';
    }
  };

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const response = await axios.get('https://fortnite-api.com/v2/shop', {
          headers: { 'Authorization': process.env.REACT_APP_FORTNITE_API_KEY }
        });
        setShopItems(response.data.data.entries ?? []);
      } catch (error) {
        console.log('Failed to fetch shop', error);
      }
      setLoading(false);
    };
    fetchShop();
  }, []);

  const categories = ['all', 'outfit', 'pickaxe', 'glider', 'backpack', 'shoe', 'emote', 'wrap', 'tracks', 'car', 'bundle'];

  const filtered = shopItems.filter(entry => {
    if (filter === 'all') return true;
    if (filter === 'bundle') return entry.bundle != null;
    if (filter === 'tracks') return entry.tracks?.length > 0;
    if (filter === 'car') return entry.cars?.length > 0;
    const item = entry.brItems?.[0];
    const type = item?.type?.value?.toLowerCase() ?? '';
    return type.includes(filter);
  });

  const getEntryDetails = (entry) => {
    // Tracks
    if (entry.tracks?.length > 0) {
      const track = entry.tracks[0];
      return {
        name: track.title ?? 'Unknown Track',
        image: track.albumArt ?? null,
        rarity: null,
      };
    }
    // Cars
    if (entry.cars?.length > 0) {
      const car = entry.cars[0];
      return {
        name: car.name ?? 'Unknown Car',
        image: car.images?.small ?? car.images?.large ?? null,
        rarity: car.rarity?.value ?? null,
      };
    }
    // Regular brItems
    const item = entry.brItems?.[0];
    return {
      name: item?.name ?? 'Unknown',
      image:
        entry.newDisplayAsset?.renderImages?.[0]?.image ??
        item?.images?.featured ??
        item?.images?.icon ??
        null,
      rarity: item?.rarity?.value ?? null,
    };
  };

  if (loading) return (
    <div className="spinner-container">
      <div className="spinner-large"></div>
    </div>
  );

  return (
    <div className="shop-page">
      <h2 className="shop-title">Item Shop</h2>

      {/* Category Filter */}
      <div className="input-buttons">
        {categories.map(cat => (
          <button
            key={cat}
            className={filter === cat ? 'active' : ''}
            onClick={() => setFilter(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Shop Sections */}
      {(() => {
        const sections = {};
        filtered.forEach(entry => {
          const sectionName = entry.layout?.name ?? 'Other';
          if (!sections[sectionName]) sections[sectionName] = [];
          sections[sectionName].push(entry);
        });

        return Object.entries(sections).map(([sectionName, entries]) => (
          <div key={sectionName} className="shop-section">
            <h3 className="shop-section-title">{sectionName}</h3>
            <div className="fn-shop-grid">
              {entries.map((entry, index) => {
                const { name, image, rarity } = getEntryDetails(entry);
                const rarityColor = getRarityColor(rarity);
                const rarityGradient = getRarityGradient(rarity);
                const tileClass = getTileSize(entry.tileSize);

                return (
                  <div
                    key={index}
                    className={`fn-shop-card ${tileClass}`}
                    style={{
                      background: rarityGradient,
                      borderColor: rarityColor,
                    }}
                  >
                    {image && (
                      <img src={image} alt={name} className="fn-shop-img" />
                    )}
                    <div className="fn-shop-overlay">
                      <p className="fn-shop-name">{name}</p>
                      <div className="fn-shop-price">
                        <img
                          src="https://fortnite-api.com/images/vbuck.png"
                          alt="vbucks"
                          className="vbuck-icon"
                        />
                        <span style={{ color: rarityColor }}>
                          {entry.finalPrice ?? 'Free'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ));
      })()}
    </div>
  );
}

export default ShopPage;