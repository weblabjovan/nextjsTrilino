import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import fetch from 'isomorphic-unfetch';
import nextCookie from 'next-cookies';
import Head from '../components/head';
import PartnershipLoginView from '../views/PartnershipLoginView';
import { setUpLinkBasic } from '../lib/helpers/generalFunctions';
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

PartnershipLogin.getInitialProps = async (ctx: any) => {
  const { req } = ctx;
  
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  const allCookies = nextCookie(ctx);
  const token = allCookies['trilino-partner-token'];
  const link = setUpLinkBasic({path: ctx.asPath, host: req.headers.host});

  
  try{
    const apiUrl = `${link["protocol"]}${link["host"]}/api/partners/auth/?language=${link['queryObject']['language']}`;
      const response = await fetch(apiUrl, {
      credentials: 'include',
      headers: {
        Authorization: `${token}`
      }
    });

    if (response.status === 200) {
      ctx.res.writeHead(302, {Location: `/partnerProfile?language=${link['queryObject']['language']}`});
      ctx.res.end();
    }
  }catch(err){
    ctx.res.end();
  }

  return { userAgent, link}
}

export default withRedux(PartnershipLogin)
