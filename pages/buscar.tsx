import { Paper, IconButton, InputBase, Typography, Container } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { FormEvent, useState } from 'react';
import WeatherDisplay from '@/components/WeatherDisplay';
import Weather from 'types/weather';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import FmdBadIcon from '@mui/icons-material/FmdBad';

export default function Search() {
  const [weather, setWeather] = useState<Weather|object>({});
  const [inputValue, setInputValue] = useState('');
  const [notSearched, setNotSearched] = useState(true);
  const [error, setError] = useState('');
  function searchWeather(event: FormEvent) {
    event.preventDefault();   
    fetch(`/api/weather?query=${inputValue}&mode=search`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) return setError(data.error.message);
        setError('');
        setWeather(data);
        setInputValue('');
        setNotSearched(false);
      });
  }
  const loading = !(weather as Weather).current;
  return (
    <>
      <Paper onSubmit={searchWeather} variant="elevation" sx={{ position: 'fixed', margin: '2rem', left: 0, right: 0, display: 'flex' }} component="form">
        <InputBase
          placeholder="Digite o nome de uma cidade"
          sx={{ width: '100%', marginLeft: '1rem' }}
          value={inputValue}
          onChange={({ target: { value } }) => setInputValue(value)}
        />
        <IconButton type="submit" sx={{ p: '10px' }} aria-label="busca">
          <SearchIcon />
        </IconButton>
      </Paper>
      { error && (
        <Container sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h1" fontSize="2rem" sx={{ display: 'flex', alignItems: 'center' }}>
            <FmdBadIcon sx={{ marginRight: '0.5rem', fontSize: '2rem' }} />
            Localização não encontrada
          </Typography>
        </Container>
      ) }
      { (notSearched && !error) && (
        <Container sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h1" fontSize="2rem" sx={{ display: 'flex', alignItems: 'center' }}>
            <TravelExploreIcon sx={{ marginRight: '0.5rem', fontSize: '2rem' }} />
            Olá! Para onde você quer ir?
          </Typography>
        </Container>
      ) }
      { (!notSearched && !error) && (
        <WeatherDisplay data={weather} loading={loading} />
      ) }
    </>
  );
}
