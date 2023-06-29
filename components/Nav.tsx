import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Nav() {
  const { pathname, push } = useRouter();
  const tabs: string[] = [
    '/',
    '/favoritas',
    '/recentes',
    '/buscar',
  ];
  const [current, setCurrent] = useState(tabs.indexOf(pathname));
  return (
    <BottomNavigation
      showLabels
      value={current}
      onChange={(_, newValue) => {
        setCurrent(newValue);
        push(tabs[newValue]);
      }}
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
    >
      <BottomNavigationAction label="Local" icon={<LocationOnIcon />} />
      <BottomNavigationAction label="Favoritas" icon={<FavoriteIcon />} />
      <BottomNavigationAction label="Recentes" icon={<RestoreIcon />} />
      <BottomNavigationAction label="Buscar" icon={<SearchIcon />} />
    </BottomNavigation>
  );
}
