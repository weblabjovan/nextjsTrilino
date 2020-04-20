import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import { setUpLinkBasic, defineLanguage } from '../lib/helpers/generalFunctions';
import { isDevEnvLogged, isAdminLogged, getAdminToken } from '../lib/helpers/specificAdminFunctions';
import Head from '../components/head';
import AdminPanelView from '../views/AdminPanelView';
import { getLanguage } from '../lib/language';
import pages from '../lib/constants/pages';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface Props {
  userAgent?: string;
  link?: object;
  token?: string | undefined;
}


const Login : NextPage<Props> = ({ userAgent, token, link }) => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);

  return (
    <div>
      <Head title={dictionary['headTitleAdminPanel']} description={dictionary['headDescriptionAdminPanel']} />
      <AdminPanelView userAgent={userAgent} path={router.pathname} fullPath={ router.asPath } lang={ lang } token={token} link={ link } />
    </div>
  )
}

Login.getInitialProps = async (ctx: any) => {
  const { req } = ctx;
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  let token = '';
  const link = setUpLinkBasic({path: ctx.asPath, host: req.headers.host});

  try{
    const devLog = await isDevEnvLogged(ctx);

    if (!devLog) {
      ctx.res.writeHead(302, {Location: `/devLogin`});
      ctx.res.end();
    }

    const adminLog = await isAdminLogged(ctx);
    
    if (!adminLog) {
      ctx.res.writeHead(302, {Location: `/adminLogin?language=${link['queryObject']['language']}`});
      ctx.res.end();
    }

    token = getAdminToken(ctx);
  }catch(err){
    console.log(err);
    ctx.res.writeHead(302, {Location: `/?page=error&language=${link['queryObject']['language']}&error=1&root=adminPanel`});
    ctx.res.end();
  }

  return { userAgent, link, token }
}

export default withRedux(Login)
