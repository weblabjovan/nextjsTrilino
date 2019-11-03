import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import Head from '../components/head';
import PartnershipLoginView from '../views/PartnershipLoginView';
import LinkClass from '../lib/classes/Link';
import pages from '../lib/constants/pages';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface Props {
  userAgent?: string;
  link?: null | object;
}


const PartnershipLogin : NextPage<Props> = ({ userAgent, link }) => {

  const router = useRouter();
  let lang = 'sr';

  if (router.query['language'] !== undefined) {
    let stringLang = router.query['language'] as string;
    if (pages['language'].indexOf(stringLang) !== -1) {
      lang = stringLang;
    }
  }

  let error = false;
  let page = router.query['page'] as string;

  if (router.query['page'] === undefined || pages['partnerLogin'].indexOf(page) === -1) {
    error = true;
  }

  return (
    <div>
      <Head title="Trilino" description="Tilino, rodjendani za decu, slavlje za decu" />
      <PartnershipLoginView 
        link={ link }
        userAgent={userAgent} 
        router={ router } 
        path={router.pathname} 
        fullPath={ router.asPath } 
        lang={ lang } 
        error={ error }
        page={ router.query['page']} />
    </div>
  )
}

PartnershipLogin.getInitialProps = async ({ req }) => {
  let link = null;
  if (req.headers.referer) {
    const linkClass = new LinkClass(req.headers.referer);
    link = linkClass.getParsedUrl();
  }

  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  return { userAgent, link}
}

export default withRedux(PartnershipLogin)
