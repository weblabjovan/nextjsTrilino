import { NextPage } from 'next';
import { isDevEnvLogged } from '../lib/helpers/specificAdminFunctions';
import { defineLanguage, setUpLinkBasic } from '../lib/helpers/generalFunctions';
import { isUserLogged } from '../lib/helpers/specificUserFunctions';
import { getLanguage } from '../lib/language';
import { useRouter } from 'next/router';
import { withReduxNoInit } from '../lib/reduxWithoutInit';
// import { withRedux } from '../lib/redux';
import Head from '../components/head';
import HomeView from '../views/HomeView';
import pages from '../lib/constants/pages';
// import MyCriptor from '../server/helpers/MyCriptor';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface Props {
  userAgent?: string;
  userIsLogged: boolean;
}


const Home : NextPage<Props> = ({ userAgent, userIsLogged }) => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  let error = false;
  const dictionary = getLanguage(lang);

  return (
    <div>
      <Head title={dictionary['headTitleIndex']} description={dictionary['headDescriptionIndex']} />
      <HomeView 
        userAgent={userAgent} 
        path={router.pathname} 
        fullPath={ router.asPath } 
        lang={ lang } 
        router={ router } 
        error={ error }
        userIsLogged={ userIsLogged } />
    </div>
  )
}

<<<<<<< HEAD
export default withReduxNoInit(Home)
=======
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
    ctx.res.writeHead(302, {Location: `/errorPage?language=${link['queryObject']['language']}&error=1&root=home`});
    ctx.res.end();
  }
  
  return { userAgent, userIsLogged }
}

export default withRedux(Home)
>>>>>>> parent of fda7ea9... serverless changes to fit free limit
