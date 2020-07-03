import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../../lib/redux';
import { setUpLinkBasic, isLinkSecure } from '../../lib/helpers/generalFunctions';
import { isDevEnvLogged } from '../../lib/helpers/specificAdminFunctions';
import { getSinglePartner } from '../../lib/helpers/specificPartnerFunctions';
import { isUserLogged } from '../../lib/helpers/specificUserFunctions';
import LocationView from '../../views/LocationView';
import Head from '../../components/head';
import pages from '../../lib/constants/pages';

interface Props {
  userAgent?: string;
  partner?: object;
  userIsLogged: boolean;
}


const Location : NextPage<Props> = ({ userAgent, partner, userIsLogged }) => {

  const router = useRouter();
  let lang = 'sr';
  let date = 'null';
  if (router.query['language'] !== undefined) {
    let stringLang = router.query['language'] as string;
    if (pages['language'].indexOf(stringLang) !== -1) {
      lang = stringLang;
    }
  }

  if (router.query['date'] !== undefined) {
  	date = router.query['date'] as string;
  }

  return (
    <div>
      <Head title={ partner ? `Trilino - ${partner['name']}` : 'Trilino'} description={ partner ? `${partner['description']}` : ''} />
      <LocationView
      	userAgent={userAgent} 
        router={ router } 
        path={router.pathname} 
        fullPath={ router.asPath } 
        lang={ lang }
        partner={ partner }
        date={ date }
        userIsLogged={ userIsLogged }
      />
    </div>
  )
}

Location.getInitialProps = async (ctx: any) => {
  const { req } = ctx;
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  let result = { partner: null};
  let userIsLogged = false;

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

    const partnerRes = await getSinglePartner(ctx, true);
    if (partnerRes) {
      result = await partnerRes.json();

      if (!result['partner']) {
        ctx.res.writeHead(302, {Location: `/?language=sr`});
        ctx.res.end();
      }else{
        if (!result['partner']['terms']) {
          ctx.res.writeHead(302, {Location: `/?language=sr`});
          ctx.res.end();
        }
      }
    }else{
      ctx.res.writeHead(302, {Location: `/?language=sr`});
      ctx.res.end();
    }

    const userLog = await isUserLogged(ctx);

    if (userLog) {
      userIsLogged = true;
    }

  }catch(err){
    console.log(err);
  }
	


  return { userAgent, partner: result['partner'], userIsLogged }
}

export default withRedux(Location)
