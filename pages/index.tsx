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
      <HomeView userAgent={userAgent} query={router.query} lang={ lang } />
    </div>
  )
}

Home.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  return { userAgent}
}

export default withRedux(Home)
