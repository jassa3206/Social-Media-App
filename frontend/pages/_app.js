import { UserProvider } from '../context/UserContext';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import "../styles/Globals.css"

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const noLayoutRoutes = ['/']; // Add routes here that don't require the layout

  const isNoLayout = noLayoutRoutes.includes(router.pathname);

  return (
    <UserProvider>
      {isNoLayout ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </UserProvider>
  );
}

export default MyApp;
