import { Button, Snackbar } from '@mui/material';
import { useEffect, useState } from 'react';

export default function CookieConsent() {

  const [cookieConsent, setCookieConsent] = useState(true);
  useEffect(() => {
    if (localStorage.getItem('cookie-consent') !== 'agree') {
      setCookieConsent(false);
    }
  }, []);
  function agreeWithCookies() {
    localStorage.setItem('cookie-consent', 'agree');
    setCookieConsent(true);
  }
  return (
    <Snackbar
      open={!cookieConsent}
      message="O site utiliza cookies para armazenar informações sobre o clima e melhorar a sua experiência."
      action={(
        <Button
          aria-label="close"
          variant="contained"
          onClick={agreeWithCookies}
        >
            Ok, entendi
        </Button>
      )}
    />
  );
}
