import { NextPage } from 'next';
import fetch from 'isomorphic-unfetch';
import nextCookie from 'next-cookies';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import { parseUrl } from '../lib/helpers/generalFunctions';
import Head from '../components/head';
import PartnerProfileView from '../views/PartnerProfileView';
import pages from '../lib/constants/pages';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface Props {
  userAgent?: string;
}


const PartnerProfile : NextPage<Props> = ({userAgent}) => {

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
      <PartnerProfileView userAgent={ userAgent }  path={router.pathname} fullPath={ router.asPath } lang={ lang } />
    </div>
  )
}

PartnerProfile.getInitialProps = async (ctx: any) => {
	const { req } = ctx;
	const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
	const allCookies = nextCookie(ctx);
	const token = allCookies['trilino-partner-token'];
	const parsedUrl = parseUrl(ctx.asPath);

	try{
		const protocol = req.headers.host === 'localhost:3000' ? 'http://' : 'https://';
		const apiUrl = `${protocol}${req.headers.host}/api/partners/auth/`;
	  	const response = await fetch(apiUrl, {
		  credentials: 'include',
		  headers: {
		    Authorization: `${token}`
		  }
		});

		if (response.status !== 200) {
			ctx.res.writeHead(302, {Location: `/partnershipLogin?language=${parsedUrl['query']['language']}&page=login`});
			ctx.res.end();
		}
	}catch(err){
		ctx.res.writeHead(302, {Location: `/partnershipLogin?language=${parsedUrl['query']['page']}&page=login`});
		ctx.res.end();
	}

	

  return { userAgent }
}

export default withRedux(PartnerProfile)
