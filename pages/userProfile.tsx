import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import { getLanguage } from '../lib/language';
import { setUpLinkBasic, defineLanguage } from '../lib/helpers/generalFunctions';
import { isDevEnvLogged } from '../lib/helpers/specificAdminFunctions';
import { isUserLogged, getUserToken } from '../lib/helpers/specificUserFunctions';
import Head from '../components/head';
import UserProfileView from '../views/UserProfileView';
import pages from '../lib/constants/pages';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface Props {
  userAgent?: string;
  link?: object;
  token?: string | undefined;
}


const UserProfile : NextPage<Props> = ({ userAgent, link, token }) => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);
  const passChange = router.query['passChange'] === 'true' ? true : false;

  return (
    <div>
      <Head title={dictionary['headTitleUserProfile']} description={dictionary['headDescriptionUserProfile']} />
      <UserProfileView 
        userAgent={userAgent} 
        path={router.pathname} 
        fullPath={ router.asPath } 
        lang={ lang }
        token={ token }
        link={ link }
        passChange={ passChange }
      />
    </div>
  )
}

UserProfile.getInitialProps = async (ctx: any) => {
  const { req } = ctx;
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  let link = { };
  let token = '';

  try{
    const devLog = await isDevEnvLogged(ctx);

    if (!devLog) {
      ctx.res.writeHead(302, {Location: `/devLogin`});
      ctx.res.end();
    }

    const userLog = await isUserLogged(ctx);
    link = setUpLinkBasic({path: ctx.asPath, host: req.headers.host});

    if (!userLog) {
      ctx.res.writeHead(302, {Location: `/login?language=${link['queryObject']['language']}&page=login`});
      ctx.res.end();
    }

    token = getUserToken(ctx);

  }catch(err){
    console.log(err)
  }

  

  
  return { userAgent, link, token }
}

export default withRedux(UserProfile)