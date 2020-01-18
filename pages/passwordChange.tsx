import { NextPage } from 'next';
import { useRouter } from 'next/router';
import fetch from 'isomorphic-unfetch';
import { isDevEnvLogged } from '../lib/helpers/specificAdminFunctions';
import { withRedux } from '../lib/redux';
import Head from '../components/head';
import { setUpLinkBasic } from '../lib/helpers/generalFunctions';
import PasswordChangeView from '../views/PasswordChangeView'
import pages from '../lib/constants/pages';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface Props {
  userAgent?: string;
  verifyObject?: object;
  error?: boolean;
}


const PasswordChange : NextPage<Props> = ({ userAgent, verifyObject, error }) => {

  const router = useRouter();
  let lang = 'sr'
  if (router.query['language'] !== undefined) {
    let stringLang = router.query['language'] as string;
    if (pages['language'].indexOf(stringLang) !== -1) {
      lang = stringLang;
    }
  }

  if (router.query['page'] !== 'partner' && router.query['page'] !== 'user') {
  	error = true;
  }

  return (
    <div>
      <Head title="Trilino" description="Tilino, rodjendani za decu, slavlje za decu" />
      <PasswordChangeView 
      	error={ error }
      	verifyObject={ verifyObject }
      	userAgent={ userAgent }
      	path={router.pathname} 
      	fullPath={ router.asPath }
      	page={ router.query['page'] } 
      	lang={ lang } />
    </div>
  )
}

PasswordChange.getInitialProps = async (ctx: any) => {
  const { req } = ctx;
	const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  const link = setUpLinkBasic(req.url);
	const protocol = req.headers.host === 'localhost:3000' ? 'http://' : 'https://';
	let verifyObject = { };
	let error = false;

  const devLog = await isDevEnvLogged(ctx);

  if (!devLog) {
    ctx.res.writeHead(302, {Location: `/devLogin`});
    ctx.res.end();
  }

	if (link['queryObject']['type'] === 'partner') {
		try{
			const res = await fetch(`${protocol}${req.headers.host}/api/partners/get/?partner=${link['queryObject']['page']}&encoded=true`);
		  verifyObject = await res.json();
			if (verifyObject['success']) {
				error = true;
			}
		}catch(err){
			console.log(err);
		}
		
	}
	
  
  return { userAgent, error, verifyObject }
}

export default withRedux(PasswordChange)
