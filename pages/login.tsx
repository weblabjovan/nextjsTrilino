import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import { setUpLinkBasic, defineLanguage, getOrgHead } from '../lib/helpers/generalFunctions';
import { isDevEnvLogged, isAdminLogged } from '../lib/helpers/specificAdminFunctions';
import { isUserLogged } from '../lib/helpers/specificUserFunctions';
import { isPartnerLogged } from '../lib/helpers/specificPartnerFunctions';
import { getLanguage } from '../lib/language';
import Head from '../components/head';
import LoginOrganization from '../organizations/LoginOrganization';

interface Props {
  userAgent?: string;
  link: object;
  userIsLogged: boolean;
}


const Login : NextPage<Props> = ({ userAgent, link, userIsLogged }) => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);
  const page = router.query['page'] ? router.query['page'].toString() : 'user';
  const stage = router.query['stage'] ? router.query['stage'].toString() : 'login';
  const orgHead = getOrgHead('login', page);

  return (
    <div>
      <Head title={dictionary[orgHead['title']]} description={dictionary[orgHead['description']]}  />
      <LoginOrganization 
        userAgent={userAgent} 
        path={router.pathname} 
        fullPath={ router.asPath } 
        userIsLogged={ userIsLogged }
        page={ page }
        lang={ lang }
        link={ link }
        stage={ stage }
      />
    </div>
  )
}

Login.getInitialProps = async (ctx: any) => {
  const { req } = ctx;
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  const link = setUpLinkBasic({path: ctx.asPath, host: req.headers.host});
  let userIsLogged = false;

  try{
    const devLog = await isDevEnvLogged(ctx);

    

    

    if (link['queryObject']['page'] === 'dev') {
      if (devLog) {
        ctx.res.writeHead(302, {Location: `/?language=${link['queryObject']['language']}`});
        ctx.res.end();
      }
    }else{
      if (!devLog) {
        ctx.res.writeHead(302, {Location: `/login?page=dev&stage=login`});
        ctx.res.end();
      }
    }


    if (link['queryObject']['page'] === 'user') {
      const userLog = await isUserLogged(ctx);
      userIsLogged = userLog;
      if (userLog) {
        ctx.res.writeHead(302, {Location: `/userProfile?language=${link['queryObject']['language']}`});
        ctx.res.end();
      }
    }

    if (link['queryObject']['page'] === 'partner') {
      const partnerLog = await isPartnerLogged(ctx);
      if (partnerLog) {
        ctx.res.writeHead(302, {Location: `/partnerProfile?language=${link['queryObject']['language']}`});
        ctx.res.end();
      }
    }

    if (link['queryObject']['page'] === 'admin') {
      const adminLog = await isAdminLogged(ctx);
      if (adminLog) {
        ctx.res.writeHead(302, {Location: `/adminPanel?language=${link['queryObject']['language']}`});
        ctx.res.end();
      }
    }
    
  }catch(err){
    console.log(err);
    ctx.res.writeHead(302, {Location: `/?page=error&language=${link['queryObject']['language']}&error=1&root=login`});
    ctx.res.end();
  }

  
  return { userAgent, link, userIsLogged }
}

export default withRedux(Login)
