import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import Head from '../components/head';
import { getLanguage } from '../lib/language';
import PartnershipLoginView from '../views/PartnershipLoginView';
import { setUpLinkBasic, defineLanguage } from '../lib/helpers/generalFunctions';
import { isDevEnvLogged } from '../lib/helpers/specificAdminFunctions';
import { isPartnerLogged } from '../lib/helpers/specificPartnerFunctions';
import pages from '../lib/constants/pages';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface Props {
  userAgent?: string;
  link?: null | object;
}


const PartnershipLogin : NextPage<Props> = ({ userAgent, link }) => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);

  let error = false;
  let page = router.query['page'] as string;
  const dictionary = getLanguage(lang);

  if (router.query['page'] === undefined || pages['partnerLogin'].indexOf(page) === -1) {
    error = true;
  }

  return (
    <div>
      <Head title={dictionary['headTitlePartnershipLogin']} description={dictionary['headDescriptionPartnershipLogin']} />
      <PartnershipLoginView 
        link={ link }
        userAgent={userAgent} 
        router={ router } 
        path={router.pathname} 
        fullPath={ router.asPath } 
        lang={ lang } 
        error={ error }
        page={ router.query['page']} />
    </div>
  )
}

PartnershipLogin.getInitialProps = async (ctx: any) => {
  const { req } = ctx;
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  const link = setUpLinkBasic({path: ctx.asPath, host: req.headers.host});

  try{

    const devLog = await isDevEnvLogged(ctx);

    if (!devLog) {
      ctx.res.writeHead(302, {Location: `/devLogin`});
      ctx.res.end();
    }

    const partnerLog = await isPartnerLogged(ctx);

    if (partnerLog) {
      ctx.res.writeHead(302, {Location: `/partnerProfile?language=${link['queryObject']['language']}`});
      ctx.res.end();
    }

  }catch(err){
    console.log(err);
    ctx.res.writeHead(302, {Location: `/?page=error&language=${link['queryObject']['language']}&error=1&root=partnershipLogin`});
    ctx.res.end();
  }

  

  return { userAgent, link}
}

export default withRedux(PartnershipLogin)
