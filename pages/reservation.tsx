import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import { getSinglePartnerForReservation } from '../lib/helpers/specificPartnerFunctions';
import { isDevEnvLogged } from '../lib/helpers/specificAdminFunctions';
import { setUpLinkBasic } from '../lib/helpers/generalFunctions';
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
  let lang = 'sr'
  if (router.query['language'] !== undefined) {
    let stringLang = router.query['language'] as string;
    if (pages['language'].indexOf(stringLang) !== -1) {
      lang = stringLang;
    }
  }

  return (
    <div>
      <Head title="Trilino" description="Tilino, rodjendani za decu, slavlje za decu" />
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
  

  return { userAgent, partner: result['partner']}
}

export default withRedux(Reservation)
