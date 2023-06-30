import '@/styles/global.css';
import type { AppProps } from 'next/app';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Nav from '@/components/Nav';
import { Provider } from 'react-redux';
import { store } from '../redux/store';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
      <Nav />
    </Provider>
  );
}
