import '@/styles/global.css';
import type { AppProps } from 'next/app';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Nav from '@/components/Nav';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Head>
        <title>Clima</title>
        <link rel="icon" href="/favicon.webp" />
      </Head>
      <Component {...pageProps} />
      <Nav />
    </Provider>
  );
}
