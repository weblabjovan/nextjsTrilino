import { NextPage } from 'next';
import { isDevEnvLogged } from '../lib/helpers/specificAdminFunctions';
import { isPartnerLogged, getPartnerToken } from '../lib/helpers/specificPartnerFunctions';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import { getLanguage } from '../lib/language';
import { setUpLinkBasic, defineLanguage } from '../lib/helpers/generalFunctions';
import Head from '../components/head';
import PartnerProfileView from '../views/PartnerProfileView';
import pages from '../lib/constants/pages';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface Props {
  userAgent?: string;
  link?: object;
  token?: string | undefined;
}


const PartnerProfile : NextPage<Props> = ({userAgent, link, token}) => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);

  return (
    <div>
      <Head title={dictionary['headTitlePartnerProfile']} description={dictionary['headDescriptionPartnerProfile']} />
      <PartnerProfileView 
      	userAgent={ userAgent }  
      	path={router.pathname} 
      	fullPath={ router.asPath } 
      	lang={ lang }
      	link={ link }
      	token={ token } />
    </div>
  )
}

PartnerProfile.getInitialProps = async (ctx: any) => {
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

    const partnerLog = await isPartnerLogged(ctx);
    link = setUpLinkBasic({path: ctx.asPath, host: req.headers.host});

    if (!partnerLog) {
      ctx.res.writeHead(302, {Location: `/partnershipLogin?language=${link['queryObject']['language']}&page=login`});
      ctx.res.end();
    }

    token = getPartnerToken(ctx);

  }catch(err){
    console.log(err);
  }


  return { userAgent, link, token }
}

export default withRedux(PartnerProfile)
