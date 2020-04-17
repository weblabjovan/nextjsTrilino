import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import { getLanguage } from '../lib/language';
import { defineLanguage, setUpLinkBasic } from '../lib/helpers/generalFunctions';
import { isDevEnvLogged } from '../lib/helpers/specificAdminFunctions';
import { isUserLogged } from '../lib/helpers/specificUserFunctions';
import Head from '../components/head';
import TermsView from '../views/TermsView';
import pages from '../lib/constants/pages';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface Props {
  userAgent?: string;
  userIsLogged: boolean;
}


const Terms : NextPage<Props> = ({ userAgent, userIsLogged }) => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);

  return (
    <div>
      <Head title={dictionary['headTitleTerms']} description={dictionary['headDescriptionTerms']} />
      <TermsView userAgent={userAgent} path={router.pathname} fullPath={ router.asPath } lang={ lang } userIsLogged={ userIsLogged } />
    </div>
  )
}

<<<<<<< HEAD
export default Terms;
=======
Terms.getInitialProps = async (ctx: any) => {
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
    ctx.res.writeHead(302, {Location: `/errorPage?language=${link['queryObject']['language']}&error=1&root=terms`});
    ctx.res.end();
  }
  return { userAgent, userIsLogged}
}

export default withRedux(Terms)
>>>>>>> parent of fda7ea9... serverless changes to fit free limit
