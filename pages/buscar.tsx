import { Paper, IconButton, InputBase, Typography, Container, Autocomplete, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import WeatherDisplay from '@/components/WeatherDisplay';
import Weather from 'types/weather';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import FmdBadIcon from '@mui/icons-material/FmdBad';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from 'redux/store';
import { addRecent } from 'redux/reducers/recentsReducer';
import RestoreIcon from '@mui/icons-material/Restore';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

export default function Search({ previousQueried }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [weather, setWeather] = useState<Weather|object>({});
  const [inputValue, setInputValue] = useState('');
  const [notSearched, setNotSearched] = useState(true);
  const [error, setError] = useState('');
  const [loadedFromQuery, setLoadedFromQuery] = useState(false);
  const { query } = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const recents = useAppSelector((state) => state.recentsReducer.value);
  const searchWeather = useCallback(function searchWeather(event: FormEvent|null, otherQuery?: string) {
    if (event) event.preventDefault();
    fetch(`/api/weather?query=${otherQuery || inputValue}&mode=search`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) return setError(data.error.message);
        dispatch(addRecent((data as Weather).location.name));
        setError('');
        setWeather(data);
        setInputValue('');
        setNotSearched(false);
      });
  }, [dispatch, inputValue]);
  useEffect(() => {
    if (query.query && !loadedFromQuery) {
      searchWeather(null, query.query as string);
      setLoadedFromQuery(true);
    }
  }, [searchWeather, query, loadedFromQuery]);
  const loading = !(weather as Weather).current;
  return (
    <>
      <Paper onSubmit={searchWeather} variant="elevation" sx={{ position: 'fixed', margin: '2rem', left: 0, right: 0, display: 'flex' }} component="form">
        <Autocomplete
          freeSolo
          disableClearable
          options={recents.slice(0, 5)}
          sx={{ width: '100%' }}
          value={inputValue}
          onChange={(event, newValue: string) => {
            setInputValue(newValue);
            searchWeather(event, newValue);
          }}
          renderOption={(props, option) => (
            <Box component="li" sx={{ display: 'flex', gap: '0.5rem' }} {...props}>
              <RestoreIcon />
              <Typography>{option}</Typography>
            </Box>
          )}
          renderInput={(params) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { InputLabelProps, InputProps, ...rest} = params;
            return (
              <InputBase
                {...params.InputProps}
                {...rest}
                onChange={({ target: { value } }) => {
                  setInputValue(value);
                }}
                placeholder="Digite o nome de uma cidade"
                sx={{ width: '100%', marginLeft: '1rem', height: '100%' }}
              />
            );
          }}
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
      { (notSearched && !error && !previousQueried) && (
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

export function getServerSideProps({ query }: GetServerSidePropsContext) {
  return {
    props: {
      previousQueried: !!query.query,
    }
  };
}
