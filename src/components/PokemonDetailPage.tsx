import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

type PokemonDetail = {
  name: string;
  species: { name: string };
  height: number;
  weight: number;
  abilities: { ability: { name: string } }[];
  sprites: { front_default: string };
};

type SpeciesDetail = {
  flavor_text_entries: { language: { name: string }; flavor_text: string }[];
  names: { language: { name: string }; name: string }[];
};

type AbilityDetail = {
  effect_entries: { language: { name: string }; effect: string }[];
};

const PokemonDetailPage = () => {
  const { pokemonId } = useParams<{ pokemonId: string }>();
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [species, setSpecies] = useState<SpeciesDetail | null>(null);
  const [abilities, setAbilities] = useState<{ name: string, frenchEffect: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        const pokemonResponse = await axios.get<PokemonDetail>(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        setPokemon(pokemonResponse.data);

        const speciesResponse = await axios.get<SpeciesDetail>(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
        setSpecies(speciesResponse.data);

        const abilitiesData = await Promise.all(
          pokemonResponse.data.abilities.map(async (ability) => {
            const abilityResponse = await axios.get<AbilityDetail>(`https://pokeapi.co/api/v2/ability/${ability.ability.name}`);
            const frenchEffect = abilityResponse.data.effect_entries.find((entry) => entry.language.name === 'en')?.effect || 'No French description available';
            return { name: ability.ability.name, frenchEffect };
          })
        );
        setAbilities(abilitiesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Pokémon details:', error);
        setLoading(false);
      }
    };

    if (pokemonId) {
      fetchPokemonDetails();
    }
  }, [pokemonId]);

  if (loading) return <div>Chargement...</div>;

  if (!pokemon || !species) return <div>Impossible de charger la description</div>;

  const frenchName = species.names.find((name) => name.language.name === 'fr')?.name || pokemon.name;
  const frenchDescription = species.flavor_text_entries.find((entry) => entry.language.name === 'fr')?.flavor_text || '';

  return (
    <div>
      <h1>{frenchName}</h1>
      <img src={pokemon.sprites.front_default} alt={frenchName} width={200} height={200} />
      <p>{frenchDescription}</p>
      <p><strong>Taille:</strong> {pokemon.height / 10} m</p>
      <p><strong>Poids:</strong> {pokemon.weight / 10} kg</p>
      <h3>Technique:</h3>
      <ul>
        {abilities.map((ability, index) => (
          <li key={index}>
            <strong>{ability.name}:</strong> {ability.frenchEffect}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PokemonDetailPage;
