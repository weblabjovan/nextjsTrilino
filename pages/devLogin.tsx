import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import { isDevEnvLogged } from '../lib/helpers/specificAdminFunctions';
import { setUpLinkBasic , defineLanguage} from '../lib/helpers/generalFunctions';
import { getLanguage } from '../lib/language';
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
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);

  return (
    <div>
      <Head title={dictionary['headTitleDevLogin']} description={dictionary['headDescriptionDevLogin']} />
      <LoginView userAgent={userAgent} path={router.pathname} fullPath={ router.asPath } lang={ lang } link={ link } />
    </div>
  )
}

DevLogin.getInitialProps = async (ctx: any) => {
  const { req } = ctx;
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  const link = setUpLinkBasic({path: ctx.asPath, host: req.headers.host});

  try{
    const devLog = await isDevEnvLogged(ctx);

    if (devLog) {
      ctx.res.writeHead(302, {Location: `/?language=sr`});
      ctx.res.end();
    }
  }catch(err){
    console.log(err);
    ctx.res.writeHead(302, {Location: `/?page=error&language=${link['queryObject']['language']}&error=1&root=devLogin`});
    ctx.res.end();
  }

  

  return { userAgent, link}
}

export default withRedux(DevLogin)
