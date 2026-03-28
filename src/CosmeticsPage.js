import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CosmeticsPage() {
  const [cosmetics, setCosmetics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
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
    const fetchCosmetics = async () => {
      try {
        const response = await axios.get('https://fortnite-api.com/v2/cosmetics/br', {
          headers: { 'Authorization': process.env.REACT_APP_FORTNITE_API_KEY }
        });
        setCosmetics(response.data.data ?? []);
      } catch (error) {
        console.log('Failed to fetch cosmetics', error);
      }
      setLoading(false);
    };
    fetchCosmetics();
  }, []);

  const categories = ['all', 'outfit', 'pickaxe', 'glider', 'backpack', 'shoes', 'emote', 'wrap', 'contrail', 'loadingscreen', 'spray', 'toy', 'music'];

  const filtered = cosmetics.filter(item => {
    const matchesFilter = filter === 'all' || item.type?.value?.toLowerCase() === filter;
    const matchesSearch = item.name?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) return (
  <div className="spinner-container">
    <div className="spinner-large"></div>
  </div>
    );
  return (
    <div className="shop-page">
      <h2 className="shop-title">Cosmetics Browser</h2>

      {/* Search Bar */}
      <div className="cosmetics-search">
        <input
          type="text"
          placeholder="Search cosmetics..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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

      {/* Results Count */}
      <p className="cosmetics-count">Showing {filtered.length} items</p>

      {/* Cosmetics Grid */}
      <div className="shop-grid">
        {filtered.slice(0, 200).map((item, index) => {
          const image = item.images?.featured ?? item.images?.icon ?? null;
          return (
            <div
                key={index}
                className="shop-card"
                style={{ borderColor: getRarityColor(item.rarity?.value) }}
                >
                {image && (
                    <img src={image} alt={item.name} className="shop-img" />
                )}
                <div className="shop-card-info">
                    <p className="shop-item-name">{item.name}</p>
                    <p className="shop-item-type">{item.type?.displayValue ?? 'Unknown'}</p>
                    <p className="shop-item-type" style={{ color: getRarityColor(item.rarity?.value) }}>
                    {item.rarity?.displayValue ?? ''}
                    </p>
                </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CosmeticsPage;