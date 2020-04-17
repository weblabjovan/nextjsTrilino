import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import { isDevEnvLogged } from '../lib/helpers/specificAdminFunctions';
import { isUserLogged } from '../lib/helpers/specificUserFunctions';
import { defineLanguage, setUpLinkBasic } from '../lib/helpers/generalFunctions';
import { getLanguage } from '../lib/language';
import Head from '../components/head';
import PartnershipView from '../views/PartnershipView'
import pages from '../lib/constants/pages';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface Props {
  userAgent?: string;
  userIsLogged: boolean;
}


const Partnership : NextPage<Props> = ({ userAgent, userIsLogged }) => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);

  return (
    <div>
      <Head title={dictionary['headTitlePartnership']} description={dictionary['headDescriptionPartnership']}/>
      <PartnershipView userAgent={userAgent} path={router.pathname} fullPath={ router.asPath } lang={ lang } userIsLogged={ userIsLogged } />
    </div>
  )
}

Partnership.getInitialProps = async (ctx: any) => {
  const { req } = ctx;
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  const link = setUpLinkBasic({path: ctx.asPath, host: req.headers.host});
  let userIsLogged = false;

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
    ctx.res.writeHead(302, {Location: `/errorPage?language=${link['queryObject']['language']}&error=1&root=partnership`});
    ctx.res.end();
  }

 

  return { userAgent, userIsLogged }
}

export default withRedux(Partnership)
