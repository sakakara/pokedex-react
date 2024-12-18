import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PokemonList from './components/PokemonList';
import PokemonDetailPage from './components/PokemonDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PokemonList />} />
        <Route path="/pokemon/:pokemonId" element={<PokemonDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
