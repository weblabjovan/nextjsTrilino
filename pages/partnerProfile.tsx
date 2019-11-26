import { NextPage } from 'next';
import fetch from 'isomorphic-unfetch';
import nextCookie from 'next-cookies';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import { setUpLinkBasic } from '../lib/helpers/generalFunctions';
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
	const allCookies = nextCookie(ctx);
	const token = allCookies['trilino-partner-token'];
	const link = setUpLinkBasic({path: ctx.asPath, host: req.headers.host});

	try{
		const apiUrl = `${link["protocol"]}${link["host"]}/api/partners/auth/?language=${link['queryObject']['language']}`;
	  	const response = await fetch(apiUrl, {
		  credentials: 'include',
		  headers: {
		    Authorization: `${token}`
		  }
		});

		if (response.status !== 200) {
			ctx.res.writeHead(302, {Location: `/partnershipLogin?language=${link['queryObject']['language']}&page=login`});
			ctx.res.end();
		}
	}catch(err){
		ctx.res.writeHead(302, {Location: `/partnershipLogin?language=${link['queryObject']['language']}&page=login`});
		ctx.res.end();
	}

	

  return { userAgent, link, token }
}

export default withRedux(PartnerProfile)
