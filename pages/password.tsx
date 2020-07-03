import { NextPage } from 'next';
import { useRouter } from 'next/router';
import fetch from 'isomorphic-unfetch';
import { isDevEnvLogged } from '../lib/helpers/specificAdminFunctions';
import { withRedux } from '../lib/redux';
import { getLanguage } from '../lib/language';
import Head from '../components/head';
import { setUpLinkBasic, defineLanguage, isLinkSecure } from '../lib/helpers/generalFunctions';
import { isPartnerLogged } from '../lib/helpers/specificPartnerFunctions';
import { isUserLogged } from '../lib/helpers/specificUserFunctions';
import PasswordView from '../views/PasswordView';

interface Props {
  userAgent?: string;
  verifyObject?: object;
  error?: boolean;
}


const Password : NextPage<Props> = ({ userAgent, verifyObject, error }) => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);
  const change = router.query['change'] ? true : false;

  return (
    <div>
      <Head title={dictionary['headTitlePassword']} description={dictionary['headDescriptionPassword']} />
      <PasswordView 
      	error={ error }
      	verifyObject={ verifyObject }
      	userAgent={ userAgent }
      	path={router.pathname} 
      	fullPath={ router.asPath }
      	page={ router.query['page'] } 
        type={ router.query['type'] }
      	lang={ lang }
        change={ change } />
    </div>
  )
}

Password.getInitialProps = async (ctx: any) => {
  const { req } = ctx;
	const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  const link = setUpLinkBasic({path: ctx.asPath, host: req.headers.host});
	let verifyObject = { };
	let error = true;

  try{
    if (!isLinkSecure(link)) {
      ctx.res.writeHead(302, {Location: `https://${link['host']}${link['fullPath']}?${link['queryString']}`});
      ctx.res.end();
    }

    const devLog = await isDevEnvLogged(ctx);

    if (!devLog) {
      ctx.res.writeHead(302, {Location: `/login?page=dev&stage=login`});
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
  }catch(err){
    console.log(err);
  }



	if (link['queryObject']['type'] === 'partner') {
    try{
      const res = await fetch(`${link['protocol']}${req.headers.host}/api/partners/get/?partner=${link['queryObject']['page']}&encoded=true&type=verification`);
      verifyObject = await res.json();
      if (verifyObject['success']) {
        error = false;
      }
    }catch(err){
      console.log(err);
    }
		
	}

  if (link['queryObject']['type'] === 'user') {
    try{
      const res = await fetch(`${link['protocol']}${req.headers.host}/api/users/get/?user=${link['queryObject']['page']}&encoded=true&type=verification`);
      verifyObject = await res.json();
      if (verifyObject['success']) {
        error = false;
      }
    }catch(err){
      console.log(err);
      ctx.res.writeHead(302, {Location: `/?page=error&language=${link['queryObject']['language']}&error=1&root=paymentFailure`});
    ctx.res.end();
    }
    
  }
  
  return { userAgent, error, verifyObject }
}

export default withRedux(Password)
