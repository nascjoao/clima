import { IconButton, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import { AppDispatch, useAppSelector } from 'redux/store';
import RestoreIcon from '@mui/icons-material/Restore';
import ClearIcon from '@mui/icons-material/Clear';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { removeRecent } from '../redux/reducers/recentsReducer';

export default function Recents() {
  const recents = useAppSelector((state) => state.recentsReducer.value);
  const dispatch = useDispatch<AppDispatch>();
  function removeItem(event: React.MouseEvent, item: string) {
    event.preventDefault();
    dispatch(removeRecent(item));
  }
  return (
    <List
      sx={{
        width: '100%',
        position: 'relative',
        overflow: 'auto',
        maxHeight: 'calc(100vh - 3.5rem)'
      }}
      subheader={<h1 />}
    >
      <ListSubheader component="h1">Buscas recentes</ListSubheader>
      <ul style={{ padding: '0 2rem' }}>
        {recents.map((item) => (
          <Link href={`/buscar?query=${item}`} key={item}>
            <ListItem
              sx={{ '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }, borderRadius: '5px' }}
              secondaryAction={
                <IconButton onClick={(event) => removeItem(event, item)} edge="end" aria-label="excluir">
                  <ClearIcon />
                </IconButton>
              }
            >
              <ListItemIcon><RestoreIcon /></ListItemIcon>
              <ListItemText primary={item} />
            </ListItem>
          </Link>
        ))}
      </ul>
    </List>
  );
}
