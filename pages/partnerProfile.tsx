import { NextPage } from 'next';
import { isDevEnvLogged } from '../lib/helpers/specificAdminFunctions';
import { isPartnerLogged, getPartnerToken } from '../lib/helpers/specificPartnerFunctions';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import { getLanguage } from '../lib/language';
import { setUpLinkBasic, defineLanguage } from '../lib/helpers/generalFunctions';
import Head from '../components/head';
import PartnerProfileView from '../views/PartnerProfileView';

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
  const link = setUpLinkBasic({path: ctx.asPath, host: req.headers.host});
  let token = '';

  try{

    const devLog = await isDevEnvLogged(ctx);

    if (!devLog) {
      ctx.res.writeHead(302, {Location: `/login?page=dev&stage=login`});
      ctx.res.end();
    }

    const partnerLog = await isPartnerLogged(ctx);
    
    if (!partnerLog) {
      // ctx.res.writeHead(302, {Location: `/login?page=partner&stage=loginlanguage=${link['queryObject']['language']}&page=login`});
      // ctx.res.end();
    }

    token = getPartnerToken(ctx);

  }catch(err){
    console.log(err);
    ctx.res.writeHead(302, {Location: `/?page=error&language=${link['queryObject']['language']}&error=1&root=partnerProfile`});
    ctx.res.end();
  }


  return { userAgent, link, token }
}

export default withRedux(PartnerProfile)
