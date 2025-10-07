import axios from "axios";
import { useState } from "react";

export interface Pokemon {
  name: string;
  url: string;
}

export async function fetchPinkPokemon(): Promise<Pokemon[]> {
  try {
    const response = await axios.get("https://pokeapi.co/api/v2/pokemon-color/pink/");
    const list = response.data?.pokemon_species ?? [];
    return list.map((p: any) => ({ name: p.name, url: `https://pokeapi.co/api/v2/pokemon/${p.name}/` }));
} catch (error) {
    console.error("Error fetching pink Pokémon:", error);
    return [];
  }
}

export async function fetchAllTypes(): Promise<string[]> {
  try {
    const response = await axios.get("https://pokeapi.co/api/v2/type/");
    return response.data.results.map((type: any) => type.name);
  } catch (error) {
    console.error("Error fetching Pokémon types:", error);
    return [];
  }
}

export async function filterByPink(type: string): Promise<Pokemon[]> {
  try {
    const pinkPokemon = await fetchPinkPokemon();
    if (!type) return pinkPokemon;

    const response = await axios.get(`https://pokeapi.co/api/v2/type/${type}/`);
    const typePokemon = response.data.pokemon.map((p: any) => p.pokemon.name);

    const filtered = pinkPokemon.filter(p => typePokemon.includes(p.name));
    return filtered;
  } catch (error) {
    console.error("Error filtering pink Pokémon by type:", error);
    return [];
  }
}



export {};
