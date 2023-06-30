import { Paper, IconButton, InputBase, Typography, Container } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { FormEvent, useState } from 'react';
import WeatherDisplay from '@/components/WeatherDisplay';
import Weather from 'types/weather';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

export default function Search() {
  const [weather, setWeather] = useState<Weather|object>({});
  const [inputValue, setInputValue] = useState('');
  const [notSearched, setNotSearched] = useState(true);
  function searchWeather(event: FormEvent) {
    event.preventDefault();   
    fetch(`/api/weather?query=${inputValue}&mode=search`)
      .then((response) => response.json())
      .then((data) => {
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
      { notSearched ? (
        <Container sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h1" fontSize="2rem" sx={{ display: 'flex', alignItems: 'center' }}>
            <TravelExploreIcon sx={{ marginRight: '0.5rem', fontSize: '2rem' }} />
            Olá! Para onde você quer ir?
          </Typography>
        </Container>
      ) : (
        <WeatherDisplay data={weather} loading={loading} />
      ) }
    </>
  );
}
