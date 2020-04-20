import { NextPage } from 'next';
import { useRouter } from 'next/router';
import fetch from 'isomorphic-unfetch';
import { isDevEnvLogged } from '../lib/helpers/specificAdminFunctions';
import { withRedux } from '../lib/redux';
import { getLanguage } from '../lib/language';
import Head from '../components/head';
import { setUpLinkBasic, defineLanguage } from '../lib/helpers/generalFunctions';
import { isPartnerLogged } from '../lib/helpers/specificPartnerFunctions';
import { isUserLogged } from '../lib/helpers/specificUserFunctions';
import PasswordChangeView from '../views/PasswordChangeView'
import pages from '../lib/constants/pages';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface Props {
  userAgent?: string;
  verifyObject?: object;
  error?: boolean;
}


const PasswordChange : NextPage<Props> = ({ userAgent, verifyObject, error }) => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);

  if (router.query['page'] !== 'partner' && router.query['page'] !== 'user') {
  	error = true;
  }

  return (
    <div>
      <Head title={dictionary['headTitlePasswordChange']} description={dictionary['headDescriptionPasswordChange']}  />
      <PasswordChangeView 
      	error={ error }
      	verifyObject={ verifyObject }
      	userAgent={ userAgent }
      	path={router.pathname} 
      	fullPath={ router.asPath }
      	page={ router.query['page'] } 
      	lang={ lang } />
    </div>
  )
}

PasswordChange.getInitialProps = async (ctx: any) => {
  const { req } = ctx;
	const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  const link = setUpLinkBasic(req.url);
	const protocol = req.headers.host === 'localhost:3000' ? 'http://' : 'https://';
	let verifyObject = { };
	let error = false;

  try{
    const devLog = await isDevEnvLogged(ctx);

    if (!devLog) {
      ctx.res.writeHead(302, {Location: `/devLogin`});
      ctx.res.end();
    }

    const partnerLog = await isPartnerLogged(ctx);
    if (partnerLog) {
      ctx.res.writeHead(302, {Location: `/partnerProfile?language=${link['queryObject']['language']}`});
      ctx.res.end();
    }

    const userLog = await isUserLogged(ctx);
    if (userLog) {
      ctx.res.writeHead(302, {Location: `/userProfile?language=${link['queryObject']['language']}`});
      ctx.res.end();
    }

    if (link['queryObject']['type'] === 'partner') {
      const res = await fetch(`${protocol}${req.headers.host}/api/partners/get/?partner=${link['queryObject']['page']}&encoded=true&type=verification`);
      verifyObject = await res.json();
      if (verifyObject['success']) {
        error = true;
      }
      
    }

    if (link['queryObject']['type'] === 'user') {
      const res = await fetch(`${protocol}${req.headers.host}/api/users/get/?user=${link['queryObject']['page']}&encoded=true&type=verification`);
      verifyObject = await res.json();
      if (verifyObject['success']) {
        error = false;
      }
    }
  }catch(err){
    console.log(err);
    ctx.res.writeHead(302, {Location: `/?page=error&language=${link['queryObject']['language']}&error=1&root=paymentFailure`});
    ctx.res.end();
  }

  return { userAgent, error, verifyObject }
}

export default withRedux(PasswordChange)
