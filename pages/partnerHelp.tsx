import { NextPage } from 'next';
import { isDevEnvLogged } from '../lib/helpers/specificAdminFunctions';
import { isPartnerLogged, getPartnerToken } from '../lib/helpers/specificPartnerFunctions';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import { getLanguage } from '../lib/language';
import { setUpLinkBasic, defineLanguage } from '../lib/helpers/generalFunctions';
import Head from '../components/head';
import PartnerHelpView from '../views/PartnerHelpView';
import pages from '../lib/constants/pages';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface Props {
  userAgent?: string;
  token?: string | undefined;
}


const PartnerHelp : NextPage<Props> = ({userAgent, token}) => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);

  return (
    <div>
      <Head title={dictionary['headTitlePartnerHelp']} description={dictionary['headDescriptionPartnerHelp']} />
      <PartnerHelpView 
      	userAgent={ userAgent }  
      	path={router.pathname} 
      	fullPath={ router.asPath } 
      	lang={ lang }
      	section={ router.query['section'] }
      	token={ token } />
    </div>
  )
}

PartnerHelp.getInitialProps = async (ctx: any) => {
	const { req } = ctx;
	const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;

  const devLog = await isDevEnvLogged(ctx);

  if (!devLog) {
    ctx.res.writeHead(302, {Location: `/devLogin`});
    ctx.res.end();
  }

  const partnerLog = await isPartnerLogged(ctx);
  const link = setUpLinkBasic({path: ctx.asPath, host: req.headers.host});

  if (!partnerLog) {
    ctx.res.writeHead(302, {Location: `/partnershipLogin?language=${link['queryObject']['language']}&page=login`});
    ctx.res.end();
  }

	const token = getPartnerToken(ctx);

  return { userAgent, token }
}

export default withRedux(PartnerHelp)
