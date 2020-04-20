import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import { setUpLinkBasic, defineLanguage } from '../lib/helpers/generalFunctions';
import { isDevEnvLogged } from '../lib/helpers/specificAdminFunctions';
import { isUserLogged, getUserToken } from '../lib/helpers/specificUserFunctions';
import { getLanguage } from '../lib/language';
import Head from '../components/head';
import UserLoginView from '../views/UserLoginView';
import pages from '../lib/constants/pages';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface Props {
  userAgent?: string;
  link?: object;
}


const Login : NextPage<Props> = ({ userAgent, link }) => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);
  const page = router.query['page'] ? router.query['page'] : 'login';

  return (
    <div>
      <Head title={dictionary['headTitleLogin']} description={dictionary['headDescriptionLogin']}  />
      <UserLoginView 
        userAgent={userAgent} 
        path={router.pathname} 
        fullPath={ router.asPath } 
        page={ page }
        lang={ lang }
        link={ link }
      />
    </div>
  )
}

Login.getInitialProps = async (ctx: any) => {
  const { req } = ctx;
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  const link = setUpLinkBasic({path: ctx.asPath, host: req.headers.host});

  try{
    const devLog = await isDevEnvLogged(ctx);

    if (!devLog) {
      ctx.res.writeHead(302, {Location: `/devLogin`});
      ctx.res.end();
    }

    const userLog = await isUserLogged(ctx);

    if (userLog) {
      ctx.res.writeHead(302, {Location: `/userProfile?language=${link['queryObject']['language']}`});
      ctx.res.end();
    }
  }catch(err){
    console.log(err);
    ctx.res.writeHead(302, {Location: `/?page=error&language=${link['queryObject']['language']}&error=1&root=login`});
    ctx.res.end();
  }

  
  return { userAgent, link }
}

export default withRedux(Login)
