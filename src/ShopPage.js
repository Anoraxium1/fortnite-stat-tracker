import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ShopPage() {
  const [shopItems, setShopItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [timeLeft, setTimeLeft] = useState('');

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

  // Shop reset countdown
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const reset = new Date();
      reset.setUTCHours(24, 0, 0, 0);
      const diff = reset - now;
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

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

  const categories = ['all', 'outfit', 'pickaxe', 'glider', 'backpack', 'shoe', 'emote', 'wrap', 'tracks', 'instruments', 'car', 'lego', 'bundle'];

  const filtered = shopItems.filter(entry => {
    if (filter === 'all') return true;
    if (filter === 'bundle') return entry.bundle != null;
    if (filter === 'tracks') return entry.tracks?.length > 0;
    if (filter === 'car') return entry.cars?.length > 0;
    if (filter === 'instruments') return entry.instruments?.length > 0;
    if (filter === 'lego') return entry.legoKits?.length > 0;
    const item = entry.brItems?.[0];
    const type = item?.type?.value?.toLowerCase() ?? '';
    return type.includes(filter);
  });

  const getEntryDetails = (entry) => {
    if (entry.tracks?.length > 0) {
      const track = entry.tracks[0];
      return {
        name: track.title ?? 'Unknown Track',
        subtitle: track.artist ?? '',
        image: track.albumArt ?? null,
        rarity: null,
      };
    }
    if (entry.cars?.length > 0) {
      const car = entry.cars[0];
      return {
        name: car.name ?? 'Unknown Car',
        subtitle: car.type?.displayValue ?? '',
        image: car.images?.large ?? car.images?.small ?? null,
        rarity: car.rarity?.value ?? null,
      };
    }
    if (entry.instruments?.length > 0) {
      const instrument = entry.instruments[0];
      return {
        name: instrument.name ?? 'Unknown Instrument',
        subtitle: instrument.type?.displayValue ?? '',
        image: instrument.images?.large ?? instrument.images?.small ?? null,
        rarity: instrument.rarity?.value ?? null,
      };
    }
    if (entry.legoKits?.length > 0) {
      const lego = entry.legoKits[0];
      return {
        name: lego.name ?? 'Unknown Kit',
        subtitle: lego.type?.displayValue ?? '',
        image: lego.images?.large ?? lego.images?.wide ?? lego.images?.small ?? null,
        rarity: null,
      };
    }
    if (entry.bundle != null) {
      return {
        name: entry.bundle.name ?? 'Bundle',
        subtitle: entry.bundle.info ?? '',
        image: entry.bundle.image ?? null,
        rarity: null,
      };
    }
    const item = entry.brItems?.[0];
    return {
      name: item?.name ?? 'Unknown',
      subtitle: item?.type?.displayValue ?? '',
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
      <div className="shop-header">
        <h2 className="shop-title">Item Shop</h2>
        <div className="shop-timer">
          <span>Resets in </span>
          <span className="shop-timer-value">{timeLeft}</span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="input-buttons" style={{ flexWrap: 'wrap' }}>
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
                const { name, subtitle, image, rarity } = getEntryDetails(entry);
                const rarityColor = getRarityColor(rarity);
                const rarityGradient = getRarityGradient(rarity);

                return (
                  <div
                    key={index}
                    className="fn-shop-card"
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
                      {subtitle && <p className="fn-shop-subtitle">{subtitle}</p>}
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