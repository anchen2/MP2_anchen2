import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pokemon, fetchPinkPokemon } from '../api/pokemon';
import './GalleryView.css';
import { Link } from 'react-router-dom';

interface PokemonWithSprite extends Pokemon {
  sprite: string | null;
  types: string[];
}

function GalleryView() {
  const [pokemonList, setPokemonList] = useState<PokemonWithSprite[]>([]);
  const [search] = useState("");
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

  // const handleSortChange = (order: "asc" | "desc") => {
  //   setSortOrder(order);
  // };




  return (
    <div className="pokemon-container">
      <h2 className="pokemon-title">Gallery</h2>

      

      <div className="pokemon-filter-buttons">
        <button
          className={`filter-button ${typeFilter === "" ? "active" : ""}`}
          onClick={() => setTypeFilter("")}
        >
          All Types
        </button>
        {types.map((t) => (
          <button
            key={t}
            className={`filter-button ${typeFilter === t ? "active" : ""}`}
            onClick={() => setTypeFilter(t)}
          >
            {t}
          </button>
        ))}
      </div>

      
     

      <div className="pokemon-grid1">
        {filteredPokemon.map((p) => (
          <Link
            key={p.name}
            to={`/pokemon/${p.name}`}
            className="pokemon-card-link"
          >
          <div key={p.name} className="pokemon-card1">
            {p.sprite ? (
              <img src={p.sprite} alt={p.name} className="pokemon-image1" />
            ) : (
              <div className="pokemon-image-placeholder1">{p.name}</div>
            )}
          </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default GalleryView;
