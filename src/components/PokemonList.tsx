import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

type Pokemon = {
  name: string;
  url: string;
  image: string;
  nameInFrench: string;
  id: number;
};

const PokemonList = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [nextUrl, setNextUrl] = useState<string | null>('https://pokeapi.co/api/v2/pokemon?limit=20');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'id'>('asc');

  const fetchPokemons = async (url: string) => {
    setLoading(true);
    try {
      const response = await axios.get(url);
      const pokemonData = await Promise.all(
        response.data.results.map(async (pokemon: { name: string; url: string }) => {
          const pokemonDetails = await axios.get(pokemon.url);
          const sprite = pokemonDetails.data.sprites.front_default;
          const speciesDetails = await axios.get(pokemonDetails.data.species.url);
          const nameInFrench = speciesDetails.data.names.find((name: { language: { name: string }; name: string }) => name.language.name === 'fr')?.name || pokemon.name;
          const id = pokemonDetails.data.id;
          return { name: pokemon.name, url: pokemon.url, image: sprite, nameInFrench, id };
        })
      );
      setPokemons((prev) => {
        const updatedPokemons = [...prev, ...pokemonData];
        const uniquePokemons = updatedPokemons.filter((value, index, self) =>
          index === self.findIndex((t) => t.id === value.id)
        );
        return uniquePokemons;
      });
      setNextUrl(response.data.next);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pokemons:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (nextUrl) {
      fetchPokemons(nextUrl);
    }
  }, [nextUrl]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const bottom = event.currentTarget.scrollHeight === event.currentTarget.scrollTop + event.currentTarget.clientHeight;
    if (bottom && !loading && nextUrl) {
      fetchPokemons(nextUrl);
    }
  };

  const handleSortChange = (type: 'name' | 'id') => {
    if (type === 'name') {
      setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortOrder('id');
    }
  };

  const sortedPokemons = [...pokemons].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.nameInFrench.localeCompare(b.nameInFrench);
    } else if (sortOrder === 'desc') {
      return b.nameInFrench.localeCompare(a.nameInFrench);
    } else {
      return a.id - b.id;
    }
  });

  return (
    <div onScroll={handleScroll} style={{ overflowY: 'auto', height: '100vh' }}>
      <h1>Liste des pokémons</h1>
      <div>
        <button onClick={() => handleSortChange('name')}>
          Trier par nom ({sortOrder === 'asc' ? 'croissant' : 'décroissant'})
        </button>
        <button onClick={() => handleSortChange('id')}>
          Trier par numéro
        </button>
      </div>
      <ul style={{ padding: 0, listStyleType: 'none' }}>
        {sortedPokemons.map((pokemon, index) => (
          <li key={pokemon.id} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
            <Link to={`/pokemon/${pokemon.name}`} style={{ textDecoration: 'none', color: 'black' }}>
              <img src={pokemon.image} alt={pokemon.nameInFrench} width={50} height={50} style={{ marginRight: '10px' }} />
              {pokemon.nameInFrench}
            </Link>
          </li>
        ))}
      </ul>
      {loading && <div>Chargement de pokémons...</div>}
    </div>
  );
};

export default PokemonList;
