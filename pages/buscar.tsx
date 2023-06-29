import { Paper, IconButton, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { FormEvent, useState } from 'react';
import WeatherDisplay from '@/components/WeatherDisplay';
import Weather from 'types/weather';

export default function Search() {
  const [weather, setWeather] = useState<Weather|object>({});
  const [inputValue, setInputValue] = useState('');
  function searchWeather(event: FormEvent) {
    event.preventDefault();   
    fetch(`/api/weather?query=${inputValue}&mode=search`)
      .then((response) => response.json())
      .then((data) => {
        setWeather(data);
        setInputValue('');
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
      <WeatherDisplay data={weather} loading={loading} />
    </>
  );
}
