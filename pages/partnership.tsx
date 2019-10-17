import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { withRedux } from '../lib/redux'
import Head from '../components/head';
import PartnershipView from '../views/PartnershipView'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface Props {
  userAgent?: string;
}


const Partnership : NextPage<Props> = ({ userAgent }) => {

  const router = useRouter();
  let lang = 'sr'
  if (router.asPath !== router.route) {
  	lang = router.query['language'] as string;
  }

  return (
    <div>
      <Head title="Trilino" description="Tilino, rodjendani za decu, slavlje za decu" />
      <PartnershipView userAgent={userAgent} path={router.pathname} fullPath={ router.asPath } lang={ lang } />
    </div>
  )
}

Partnership.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  return { userAgent}
}

export default withRedux(Partnership)
