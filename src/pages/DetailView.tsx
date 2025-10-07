import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchPinkPokemon, Pokemon } from '../api/pokemon';
import axios from 'axios';
import "./DetailView.css";

interface PokemonInfo {
  name: string;
  sprite: string | null;
  types: string[];
  generation: string;
  habitat: string;
  abilities: string[];
}

function DetailView() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as { list: PokemonInfo[]; index: number } | undefined;
  
  const [pokemon, setPokemon] = useState<PokemonInfo | null>(state ? state.list[state.index] : null);
  const [pinkList, setPinkList] = useState<PokemonInfo[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    async function loadPinkPokemon() {
      let list: Pokemon[] = [];
      try {
        list = await fetchPinkPokemon(); 
      } catch (error) {
        console.error("Error fetching pink Pokémon:", error);
      }

      const withDetails: PokemonInfo[] = await Promise.all(
        list.map(async (p) => {
          try {
            const res = await axios.get(p.url);
            const species = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${p.name}/`);
            return {
              name: res.data.name,
              sprite: res.data.sprites?.front_default ?? null,
              types: res.data.types?.map((t: any) => t.type.name) ?? [],
              generation: species.data.generation?.name ?? "unknown",
              habitat: species.data.habitat?.name ?? "unknown",
              abilities: res.data.abilities?.map((a: any) => a.ability.name) ?? [],
            };
          } catch {
            return {
              name: p.name,
              sprite: null,
              types: [],
              generation: "unknown",
              habitat: "unknown",
              abilities: [],
            };
          }
        })
      );

      setPinkList(withDetails);

      const index = withDetails.findIndex((p) => p.name.toLowerCase() === id?.toLowerCase());
      setCurrentIndex(index >= 0 ? index : 0);
      setPokemon(index >= 0 ? withDetails[index] : withDetails[0]);
    }

    if (!state && id) {
      loadPinkPokemon();
    } else if (state) {
      setPinkList(state.list);
      setCurrentIndex(state.index);
      setPokemon(state.list[state.index]);
    }
  }, [id, state]);

  const nextPokemon = () => {
    if (!pinkList.length) return;
    const nextIndex = (currentIndex + 1) % pinkList.length;
    setCurrentIndex(nextIndex);
    setPokemon(pinkList[nextIndex]);
    navigate(`/pokemon/${pinkList[nextIndex].name}`, { state: { list: pinkList, index: nextIndex } });
  };

  const prevPokemon = () => {
    if (!pinkList.length) return;
    const prevIndex = (currentIndex - 1 + pinkList.length) % pinkList.length;
    setCurrentIndex(prevIndex);
    setPokemon(pinkList[prevIndex]);
    navigate(`/pokemon/${pinkList[prevIndex].name}`, { state: { list: pinkList, index: prevIndex } });
  };

  if (!pokemon) return <h3>No Pokémon data available.</h3>;

  return (
    <div className="detail-view">
      <h1 className="pokemon-name">{pokemon.name}</h1>
      {pokemon.sprite ? (
        <img src={pokemon.sprite} alt={pokemon.name} className="pokemon-image2" />
      ) : (
        <div className="pokemon-image-placeholder2">{pokemon.name}</div>
      )}
      <div className="pokemon-info">
        <p><strong>Type(s):</strong> {pokemon.types.join(", ") || "none"}</p>
        <p><strong>Generation:</strong> {pokemon.generation}</p>
        <p><strong>Habitat:</strong> {pokemon.habitat}</p>
        <p><strong>Abilities:</strong> {pokemon.abilities.join(", ") || "none"}</p>
      </div>

      {pinkList.length > 1 && (
        <div className="navigation-buttons">
          <button onClick={prevPokemon}> &lt; </button>
          <button onClick={nextPokemon}> &gt; </button>
        </div>
      )}
    </div>
  );
}

export default DetailView;