import { NextPage } from 'next';
import { isDevEnvLogged } from '../lib/helpers/specificAdminFunctions';
import { defineLanguage, setUpLinkBasic, getOrgPageName, getOrgHead } from '../lib/helpers/generalFunctions';
import { isUserLogged } from '../lib/helpers/specificUserFunctions';
import { getLanguage } from '../lib/language';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import Head from '../components/head';
import HomeOrganization from '../organizations/HomeOrganization';
// import MyCriptor from '../server/helpers/MyCriptor';
interface Props {
  userAgent?: string;
  userIsLogged: boolean;
}

const Home : NextPage<Props> = ({ userAgent, userIsLogged }) => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);
  const error = router.query['error'] ? router.query['error'].toString() : '';
  const page = router.query['page'] ? router.query['page'].toString() : '';
  const orgHead = getOrgHead('home', page);

  return (
    <div>
      <Head title={dictionary[orgHead['title']]} description={dictionary[orgHead['description']]} />
      <HomeOrganization 
        userAgent={userAgent} 
        path={router.pathname} 
        fullPath={ router.asPath } 
        lang={ lang } 
        userIsLogged={ userIsLogged }
        page={getOrgPageName('home', page)}
        error={ error }
       />
    </div>
  )
}

Home.getInitialProps = async (ctx: any) => {
  const { req } = ctx;
   let userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
   const link = setUpLinkBasic({path: ctx.asPath, host: req.headers.host});
   let userIsLogged = false;

   // const myCriptor = new MyCriptor();


  if (userAgent === undefined) {
    userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36';
  }

  try{
    const devLog = await isDevEnvLogged(ctx);

    if (!devLog) {
      ctx.res.writeHead(302, {Location: `/devLogin`});
      ctx.res.end();
    }

    const userLog = await isUserLogged(ctx);

    if (userLog) {
      userIsLogged = true;
    }
  }catch(err){
    console.log(err);
    ctx.res.writeHead(302, {Location: `/?page=error&language=${link['queryObject']['language']}&error=1&root=home`});
    ctx.res.end();
  }
  
  return { userAgent, userIsLogged }
}

export default withRedux(Home)
