import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { withRedux } from '../lib/redux'
import Head from '../components/head';
import HomeView from '../views/HomeView'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface Props {
  userAgent?: string;
}


const Home : NextPage<Props> = ({ userAgent }) => {

  const router = useRouter();
  let lang = 'sr'
  if (router.asPath !== router.route) {
    lang = router.query['language'] as string;
  }

  return (
    <div>
      <Head title="Trilino" description="Tilino, rodjendani za decu, slavlje za decu" />
      <HomeView userAgent={userAgent} path={router.pathname} fullPath={ router.asPath } lang={ lang } />
    </div>
  )
}

Home.getInitialProps = async ({ req }) => {
  let userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  if (userAgent === undefined) {
    userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36';
  }
  
  return { userAgent}
}

export default withRedux(Home)
