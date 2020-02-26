import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import Head from '../components/head';
import AdminLoginView from '../views/AdminLoginView';
import pages from '../lib/constants/pages';
import { getLanguage } from '../lib/language';
import { setUpLinkBasic, defineLanguage } from '../lib/helpers/generalFunctions';
import { isDevEnvLogged, isAdminLogged } from '../lib/helpers/specificAdminFunctions';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface Props {
  userAgent?: string;
  link?: object;
  token?: string;
}


const AdminLogin : NextPage<Props> = ({ userAgent, link, token }) => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);

  return (
    <div>
      <Head title={dictionary['headTitleAdminLogin']} description={dictionary['headDescriptionAdminLogin']} />
      <AdminLoginView userAgent={userAgent} path={router.pathname} fullPath={ router.asPath } lang={ lang } link={ link } />
    </div>
  )
}

AdminLogin.getInitialProps = async (ctx: any ) => {
	const { req } = ctx;
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;

  const devLog = await isDevEnvLogged(ctx);

  if (!devLog) {
    ctx.res.writeHead(302, {Location: `/devLogin`});
    ctx.res.end();
  }

  const adminLog = await isAdminLogged(ctx);
  const link = setUpLinkBasic({path: ctx.asPath, host: req.headers.host});

  if (adminLog) {
    ctx.res.writeHead(302, {Location: `/adminPanel?language=${link['queryObject']['language']}`});
    ctx.res.end();
  }

  return { userAgent, link }
}

export default withRedux(AdminLogin)
