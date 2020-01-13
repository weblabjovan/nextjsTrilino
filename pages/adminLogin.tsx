import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import fetch from 'isomorphic-unfetch';
import nextCookie from 'next-cookies';
import Head from '../components/head';
import AdminLoginView from '../views/AdminLoginView';
import pages from '../lib/constants/pages';
import { setUpLinkBasic } from '../lib/helpers/generalFunctions';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface Props {
  userAgent?: string;
  link?: object;
  token?: string;
}


const AdminLogin : NextPage<Props> = ({ userAgent, link, token }) => {

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
      <AdminLoginView userAgent={userAgent} path={router.pathname} fullPath={ router.asPath } lang={ lang } link={ link } />
    </div>
  )
}

AdminLogin.getInitialProps = async (ctx: any ) => {
	const { req } = ctx;
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  const allCookies = nextCookie(ctx);
  const token = allCookies['trilino-admin-token'];
  const link = setUpLinkBasic({path: ctx.asPath, host: req.headers.host});

  try{
    const apiUrl = `${link["protocol"]}${link["host"]}/api/admin/auth/`;
      const response = await fetch(apiUrl, {
      credentials: 'include',
      headers: {
        Authorization: `${token}`
      }
    });


    if (response.status === 200) {
      ctx.res.writeHead(302, {Location: `/adminPanel?language=${link['queryObject']['language']}`});
      ctx.res.end();
    }
  }catch(err){
    ctx.res.end();
  }

  return { userAgent, link }
}

export default withRedux(AdminLogin)
