import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import { getLanguage } from '../lib/language';
import { setUpLinkBasic, defineLanguage, setCookie } from '../lib/helpers/generalFunctions';
import { isDevEnvLogged, isDevEnvLoggedOutsideCall } from '../lib/helpers/specificAdminFunctions';
import { validateRating } from '../lib/helpers/specificReservationFunctions';
import { isUserLogged, getUserToken, isUserLoggedOutsideCall } from '../lib/helpers/specificUserFunctions';
import Head from '../components/head';
import UserProfileView from '../views/UserProfileView';

interface Props {
  userAgent?: string;
  link?: object;
  token?: string | undefined;
  ratingShow?: null | object;
}


const UserProfile : NextPage<Props> = ({ userAgent, link, token, ratingShow }) => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);
  const passChange = router.query['passChange'] === 'true' ? true : false;
  const screens = ['reservation', 'message', 'logout', 'rating'];
  const screen = router.query['page'] ? screens.indexOf(router.query['page'].toString()) !== -1 ? router.query['page'].toString() : 'reservation' : 'reservation';


  return (
    <div>
      <Head title={dictionary['headTitleUserProfile']} description={dictionary['headDescriptionUserProfile']} />
      <UserProfileView 
        userAgent={userAgent} 
        path={router.pathname} 
        fullPath={ router.asPath } 
        lang={ lang }
        token={ token }
        screen={ screen }
        link={ link }
        ratingShow={ ratingShow }
        passChange={ passChange }
      />
    </div>
  )
}

UserProfile.getInitialProps = async (ctx: any) => {
  const { req } = ctx;
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  const link = setUpLinkBasic({path: ctx.asPath, host: req.headers.host});
  let token = '';
  let ratingShow = null;
  let devLog = null;
  let userLog = null;

  try{

    if (link['queryObject']['devAuth']) {
      devLog = await isDevEnvLoggedOutsideCall(ctx);
    }else{
      devLog = await isDevEnvLogged(ctx);
    }

    if (!devLog) {
      ctx.res.writeHead(302, {Location: `/login?page=dev&stage=login`});
      ctx.res.end();
    }

    if (link['queryObject']['userAuth']) {
      userLog = await isUserLoggedOutsideCall(ctx);

    }else{
      userLog = await isUserLogged(ctx);
    }

    if (!userLog) {
      if (link['queryObject']['page'] === 'rating' && link['queryObject']['item']) {
        ctx.res.writeHead(302, {Location: `/login?page=user&stage=login&language=${link['queryObject']['language']}&item=${link['queryObject']['item']}`});
        ctx.res.end();
      }else{
        ctx.res.writeHead(302, {Location: `/login?page=user&stage=login&language=${link['queryObject']['language']}`});
        ctx.res.end();
      }
    }

    token = link['queryObject']['userAuth'] ? link['queryObject']['userAuth'] : getUserToken(ctx);

    if (link['queryObject']['page'] === 'rating' && userLog) {
      const valid = await validateRating(ctx);
      const ratingValid = await valid.json();

      if (ratingValid) {
        if (!ratingValid['success']) {
          ctx.res.writeHead(302, {Location: `/?page=error&language=${link['queryObject']['language']}&error=1&root=userProfile`});
          ctx.res.end();
        }else{
          ratingShow = ratingValid['reservation'];
        }
      }
    }

  }catch(err){
    console.log(err);
    ctx.res.writeHead(302, {Location: `/?page=error&language=${link['queryObject']['language']}&error=1&root=userProfile`});
    ctx.res.end();
  }
  
  return { userAgent, link, token, ratingShow }
}

export default withRedux(UserProfile)