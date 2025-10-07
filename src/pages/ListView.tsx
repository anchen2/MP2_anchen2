import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pokemon, fetchPinkPokemon } from '../api/pokemon';
import './ListView.css';
import { Link } from 'react-router-dom';

interface PokemonWithSprite extends Pokemon {
  sprite: string | null;
  types: string[];
}

function ListView() {
  const [pokemonList, setPokemonList] = useState<PokemonWithSprite[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [types, setTypes] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");


  useEffect(() => {
    async function loadPokemon() {
      const pinkPokemon = await fetchPinkPokemon();

      const withDetails = await Promise.all(
        pinkPokemon.map(async (p) => {
          try {
            const res = await axios.get(p.url);
            const sprite = res.data.sprites.front_default;
            const types = res.data.types.map((t: any) => t.type.name);
            return { ...p, sprite, types };
          } catch {
            return { ...p, sprite: null, types: [] };
          }
        })
      );

      setPokemonList(withDetails);

      const typeSet = new Set<string>();
      withDetails.forEach(p => p.types.forEach((t:string) => typeSet.add(t)));
      setTypes(Array.from(typeSet).sort());
    }

    loadPokemon();
  }, []);

  // const filteredPokemon = pokemonList.filter((p) =>
  //   p.name.toLowerCase().includes(search.toLowerCase()) &&
  //   (typeFilter === "" || p.types.includes(typeFilter))
  // );
  const filteredPokemon = pokemonList
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (typeFilter === "" || p.types.includes(typeFilter))
    )
    .sort((a, b) => {
      if (sortOrder === "asc") return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });

  const handleSortChange = (order: "asc" | "desc") => {
    setSortOrder(order);
  };




  return (
    <div className="pokemon-container">
      <h2 className="pokemon-title">Pink Pokémon</h2>

      <input
        className="pokemon-search"
        type="text"
        placeholder="search pokémon..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select className="pokemon-filter" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
        <option value="">all types...</option>
        {types.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <div className="checkbox-container">
        <label>
          <input
            type="checkbox"
            checked={sortOrder === "asc"}
            onChange={() => handleSortChange("asc")}
          />
          Ascending
        </label>
        <label>
          <input
            type="checkbox"
            checked={sortOrder === "desc"}
            onChange={() => handleSortChange("desc")}
          />
          Descending
        </label>
      </div>
     

      <div className="pokemon-grid">
        {filteredPokemon.map((p) => (
          <Link
            key={p.name}
            to={`/pokemon/${p.name}`}
            className="pokemon-card-link"
          >
          <div className="pokemon-card">
            {p.sprite ? (
              <img src={p.sprite} alt={p.name} className="pokemon-image" />
            ) : (
              <div className="pokemon-image-placeholder">No image</div>
            )}
            <p className="pokemon-name">{p.name}</p>
          </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ListView;
