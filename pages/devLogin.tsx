import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import { isDevEnvLogged } from '../lib/helpers/specificAdminFunctions';
import { setUpLinkBasic } from '../lib/helpers/generalFunctions';
import Head from '../components/head';
import LoginView from '../views/LoginView'
import pages from '../lib/constants/pages';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface Props {
  userAgent?: string;
  link?: null | object;
}


const DevLogin : NextPage<Props> = ({ userAgent, link }) => {

  const router = useRouter();
  let lang = 'sr'
  if (router.query['language'] !== undefined) {
    let stringLang = router.query['language'] as string;
    if (pages['language'].indexOf(stringLang) !== -1) {
      lang = stringLang;
    }
  }

  return (
    <div>
      <Head title="Trilino" description="Tilino, rodjendani za decu, slavlje za decu" />
      <LoginView userAgent={userAgent} path={router.pathname} fullPath={ router.asPath } lang={ lang } link={ link } />
    </div>
  )
}

DevLogin.getInitialProps = async (ctx: any) => {
  const { req } = ctx;
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;

  const devLog = await isDevEnvLogged(ctx);

  const link = setUpLinkBasic({path: ctx.asPath, host: req.headers.host});

  if (devLog) {
    ctx.res.writeHead(302, {Location: `/?language=sr`});
    ctx.res.end();
  }

  return { userAgent, link}
}

export default withRedux(DevLogin)
