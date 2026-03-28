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

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const response = await axios.get('https://fortnite-api.com/v2/shop', {
          headers: { 'Authorization': process.env.REACT_APP_FORTNITE_API_KEY }
        });
        setShopItems(response.data.data.entries ?? []);
        console.log('First item rarity:', response.data.data.entries[0]?.brItems?.[0]?.rarity?.value);
      } catch (error) {
        console.log('Failed to fetch shop', error);
      }
      setLoading(false);
    };
    fetchShop();
  }, []);

  const categories = ['all', 'outfit', 'pickaxe', 'glider', 'backpack', 'shoes', 'emote', 'wrap', 'bundle'];

  const filtered = shopItems.filter(entry => {
    if (filter === 'all') return true;
    const item = entry.brItems?.[0];
    const type = item?.type?.value?.toLowerCase() ?? '';
    return type.includes(filter);
  });

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

      {/* Shop Items Grid */}
      <div className="shop-grid">
        {filtered.map((entry, index) => {
          const item = entry.brItems?.[0];
          if (!item) return null;

          const rarityColor = getRarityColor(item.rarity?.value);

          const image =
            entry.newDisplayAsset?.renderImages?.[0]?.image ??
            item.images?.featured ??
            item.images?.icon ??
            null;

          return (
            <div
              key={index}
              className="shop-card"
              style={{ borderColor: rarityColor }}
            >
              {image && (
                <img src={image} alt={item.name} className="shop-img" />
              )}
              <div className="shop-card-info">
                <p className="shop-item-name">{item.name}</p>
                <p className="shop-item-type">{item.type?.displayValue ?? 'Unknown'}</p>
                <p className="shop-item-price" style={{ color: rarityColor }}>
                  {entry.finalPrice ? `${entry.finalPrice} V-Bucks` : 'Free'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ShopPage;