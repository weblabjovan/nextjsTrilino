import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import { getLanguage } from '../lib/language';
import { getSinglePartnerForReservation } from '../lib/helpers/specificPartnerFunctions';
import { isDevEnvLogged } from '../lib/helpers/specificAdminFunctions';
import { setUpLinkBasic, defineLanguage, isLinkSecure, isWWWLink, setProperLink } from '../lib/helpers/generalFunctions';
import { isUserLogged, getUserToken } from '../lib/helpers/specificUserFunctions';
import Head from '../components/head';
import ReservationView from '../views/ReservationView';

interface Props {
  userAgent?: string;
  partner: object;
  token: string;
  link: object;
  userIsLogged: boolean;
}


const Reservation : NextPage<Props> = ({ userAgent, partner, token, link, userIsLogged }) => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);

  return (
    <div>
      <Head title={dictionary['headTitleReservation']} description={dictionary['headDescriptionReservation']} />
      <ReservationView
      	userAgent={userAgent} 
        router={ router } 
        path={router.pathname} 
        fullPath={ router.asPath } 
        lang={ lang }
        partner={ partner }
        token={ token }
        link={ link }
        userIsLogged={ userIsLogged }
      />
    </div>
  )
}

Reservation.getInitialProps = async (ctx) => {
  const { req } = ctx;
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  const link = setUpLinkBasic({path: ctx.asPath, host: req.headers.host});
  let result = { partner: null};
  let token = '';
  let userIsLogged = false;

  try{
    if (!isLinkSecure(link)) {
      ctx.res.writeHead(302, {Location: `https://${link['host']}${link['fullPath']}?${link['queryString']}`});
      ctx.res.end();
    }

    if (!isWWWLink(link)) {
      const properLink = setProperLink(link);
      ctx.res.writeHead(302, {Location: properLink});
      ctx.res.end();
    }

    const devLog = await isDevEnvLogged(ctx);

    if (!devLog) {
      ctx.res.writeHead(302, {Location: `/login?page=dev&stage=login`});
      ctx.res.end();
    }

    const partnerRes = await getSinglePartnerForReservation(ctx, true);
    if (partnerRes['status'] === 200) {
      result = await partnerRes.json();
      if (!result['partner']) {
        ctx.res.writeHead(302, {Location: `/?page=error&language=${link['queryObject']['language']}&error=1&root=reservation`});
        ctx.res.end();
      }else{
        if (!result['partner']['reservation']) {
          ctx.res.writeHead(302, {Location: `/?page=errorlanguage=${link['queryObject']['language']}&error=1&root=reservation`});
          ctx.res.end();
        }else{
          if (!result['partner']['reservation']['id']) {
            ctx.res.writeHead(302, {Location: `/?page=error&language=${link['queryObject']['language']}&error=1&root=reservation`});
            ctx.res.end();
          }
        }
      }
    }else{
      ctx.res.writeHead(302, {Location: `/?page=error&language=${link['queryObject']['language']}&error=1&root=reservation`});
      ctx.res.end();
    }

    const userLog = await isUserLogged(ctx);
    

    if (userLog) {
      token = getUserToken(ctx);
      userIsLogged = true;
    }

  }catch(err){
    console.log(err);
    ctx.res.writeHead(302, {Location: `/?page=error&language=${link['queryObject']['language']}&error=1&root=reservation`});
    ctx.res.end();
  }
  
  

  return { userAgent, partner: result['partner'], token, link, userIsLogged }
}

export default withRedux(Reservation)
