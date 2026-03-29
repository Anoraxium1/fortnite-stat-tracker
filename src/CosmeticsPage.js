import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function CosmeticsPage() {
  const [cosmetics, setCosmetics] = useState({
    br: [],
    tracks: [],
    instruments: [],
    cars: [],
    lego: [],
    legoKits: [],
    beans: [],
  });
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [filter, setFilter] = useState('br');
  const [subFilter, setSubFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState(null);

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

  useEffect(() => {
    const fetchCosmetics = async () => {
      try {
        const response = await axios.get('https://fortnite-api.com/v2/cosmetics', {
          headers: { 'Authorization': process.env.REACT_APP_FORTNITE_API_KEY }
        });
        const data = response.data.data;
        setCosmetics({
          br: data.br ?? [],
          tracks: data.tracks ?? [],
          instruments: data.instruments ?? [],
          cars: data.cars ?? [],
          lego: data.lego ?? [],
          legoKits: data.legoKits ?? [],
          beans: data.beans ?? [],
        });
      } catch (error) {
        console.log('Failed to fetch cosmetics', error);
      }
      setLoading(false);
    };
    fetchCosmetics();
  }, []);

  // API search for BR items
  const searchBR = useCallback(async (query) => {
    if (!query) {
      setSearchResults(null);
      return;
    }
    setSearchLoading(true);
    try {
      const response = await axios.get('https://fortnite-api.com/v2/cosmetics/br/search/all', {
        headers: { 'Authorization': process.env.REACT_APP_FORTNITE_API_KEY },
        params: {
          name: query,
          matchMethod: 'contains',
          language: 'en',
          ...(subFilter !== 'all' && { type: subFilter })
        }
      });
      setSearchResults(response.data.data ?? []);
    } catch (error) {
      setSearchResults([]);
    }
    setSearchLoading(false);
  }, [subFilter]);

  // Debounce search
  useEffect(() => {
    if (filter !== 'br') return;
    const timer = setTimeout(() => {
      searchBR(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search, filter, searchBR]);

  const categories = ['br', 'tracks', 'instruments', 'cars', 'lego', 'legoKits', 'beans'];

  const categoryLabels = {
    br: 'Battle Royale',
    tracks: 'Jam Tracks',
    instruments: 'Instruments',
    cars: 'Cars',
    lego: 'Lego',
    legoKits: 'Lego Kits',
    beans: 'Beans',
  };

  const brSubCategories = ['all', 'outfit', 'backpack', 'pickaxe', 'glider', 'shoe', 'emote', 'wrap', 'contrail', 'loadingscreen', 'spray', 'toy', 'music'];

  const getItems = () => {
    // Use API search results for BR if searching
    if (filter === 'br' && search && searchResults !== null) {
      return { items: searchResults.slice(0, 200), total: searchResults.length };
    }

    let items = cosmetics[filter] ?? [];

    if (filter === 'br' && subFilter !== 'all') {
      items = items.filter(item => item.type?.value?.toLowerCase() === subFilter);
    }

    if (filter !== 'br' && search) {
      items = items.filter(item => {
        const name = (item.name ?? item.title ?? '').toLowerCase();
        return name.includes(search.toLowerCase());
      });
    }

    return { items: items.slice(0, 200), total: items.length };
  };

  const getCardDetails = (item) => {
    switch (filter) {
      case 'tracks':
        return {
          name: item.title ?? 'Unknown Track',
          subtitle: item.artist ?? '',
          extra: `${item.bpm ?? '?'} BPM`,
          image: item.albumArt ?? null,
          rarity: null,
        };
      case 'instruments':
        return {
          name: item.name ?? 'Unknown',
          subtitle: item.type?.displayValue ?? '',
          extra: item.rarity?.displayValue ?? '',
          image: item.images?.large ?? item.images?.small ?? null,
          rarity: item.rarity?.value ?? null,
        };
      case 'cars':
        return {
          name: item.name ?? 'Unknown',
          subtitle: item.type?.displayValue ?? '',
          extra: item.rarity?.displayValue ?? '',
          image: item.images?.large ?? item.images?.small ?? null,
          rarity: item.rarity?.value ?? null,
        };
      case 'lego':
        return {
          name: item.cosmeticId ?? 'Unknown',
          subtitle: '',
          extra: '',
          image: item.images?.large ?? item.images?.wide ?? item.images?.small ?? null,
          rarity: null,
        };
      case 'legoKits':
        return {
          name: item.name ?? 'Unknown',
          subtitle: item.type?.displayValue ?? '',
          extra: '',
          image: item.images?.large ?? item.images?.wide ?? item.images?.small ?? null,
          rarity: null,
        };
      case 'beans':
        return {
          name: item.name ?? 'Unknown',
          subtitle: item.gender ?? '',
          extra: '',
          image: item.images?.large ?? item.images?.small ?? null,
          rarity: null,
        };
      default:
        return {
          name: item.name ?? 'Unknown',
          subtitle: item.type?.displayValue ?? '',
          extra: item.rarity?.displayValue ?? '',
          image: item.images?.featured ?? item.images?.icon ?? null,
          rarity: item.rarity?.value ?? null,
        };
    }
  };

  const { items: filtered, total } = getItems();

  if (loading) return (
    <div className="spinner-container">
      <div className="spinner-large"></div>
    </div>
  );

  return (
    <div className="shop-page">
      <h2 className="shop-title">Cosmetics Browser</h2>

      {/* Main Category Filter */}
      <div className="input-buttons" style={{ flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat}
            className={filter === cat ? 'active' : ''}
            onClick={() => { setFilter(cat); setSubFilter('all'); setSearch(''); setSearchResults(null); }}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* BR Sub Category Filter */}
      {filter === 'br' && (
        <div className="input-buttons" style={{ flexWrap: 'wrap' }}>
          {brSubCategories.map(cat => (
            <button
              key={cat}
              className={subFilter === cat ? 'active' : ''}
              onClick={() => { setSubFilter(cat); setSearch(''); setSearchResults(null); }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Search Bar */}
      <div className="cosmetics-search">
        <input
          type="text"
          placeholder={`Search ${categoryLabels[filter]}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Results Count */}
      <p className="cosmetics-count">
        {searchLoading ? 'Searching...' : `Showing ${filtered.length} of ${total} items`}
      </p>

      {/* Cosmetics Grid */}
      {searchLoading ? (
        <div className="spinner-container">
          <div className="spinner-large"></div>
        </div>
      ) : (
        <div className="fn-shop-grid">
          {filtered.map((item, index) => {
            const { name, subtitle, extra, image, rarity } = getCardDetails(item);
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
                  {extra && <p className="fn-shop-subtitle">{extra}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CosmeticsPage;