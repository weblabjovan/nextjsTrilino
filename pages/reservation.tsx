import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import { getLanguage } from '../lib/language';
import { getSinglePartnerForReservation } from '../lib/helpers/specificPartnerFunctions';
import { isDevEnvLogged } from '../lib/helpers/specificAdminFunctions';
import { setUpLinkBasic, defineLanguage } from '../lib/helpers/generalFunctions';
import Head from '../components/head';
import ReservationView from '../views/ReservationView';
import pages from '../lib/constants/pages';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface Props {
  userAgent?: string;
  partner: object;
}


const Reservation : NextPage<Props> = ({ userAgent, partner }) => {

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
      />
    </div>
  )
}

Reservation.getInitialProps = async (ctx) => {
  const { req } = ctx;
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  let result = { partner: null};

  try{
    const devLog = await isDevEnvLogged(ctx);

    if (!devLog) {
      ctx.res.writeHead(302, {Location: `/devLogin`});
      ctx.res.end();
    }

    const partnerRes = await getSinglePartnerForReservation(ctx, true);
    if (partnerRes['status'] === 200) {
      result = await partnerRes.json();
      if (!result['partner']) {
        ctx.res.writeHead(302, {Location: `/?language=sr`});
        ctx.res.end();
      }else{
        if (!result['partner']['reservation']) {
          ctx.res.writeHead(302, {Location: `/?language=sr`});
          ctx.res.end();
        }else{
          if (!result['partner']['reservation']['id']) {
            ctx.res.writeHead(302, {Location: `/?language=sr`});
            ctx.res.end();
          }
        }
      }
    }else{
      ctx.res.writeHead(302, {Location: `/?language=sr`});
      ctx.res.end();
    }
  }catch(err){
    console.log(err);
  }
  
  

  return { userAgent, partner: result['partner']}
}

export default withRedux(Reservation)
