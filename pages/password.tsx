import { NextPage } from 'next';
import { useRouter } from 'next/router';
import fetch from 'isomorphic-unfetch';
import { isDevEnvLogged } from '../lib/helpers/specificAdminFunctions';
import { withRedux } from '../lib/redux';
import { getLanguage } from '../lib/language';
import Head from '../components/head';
import { setUpLinkBasic, defineLanguage } from '../lib/helpers/generalFunctions';
import PasswordView from '../views/PasswordView'
import pages from '../lib/constants/pages';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface Props {
  userAgent?: string;
  verifyObject?: object;
  error?: boolean;
}


const Password : NextPage<Props> = ({ userAgent, verifyObject, error }) => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);

  return (
    <div>
      <Head title={dictionary['headTitlePassword']} description={dictionary['headDescriptionPassword']} />
      <PasswordView 
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

Password.getInitialProps = async (ctx: any) => {
  const { req } = ctx;
	const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  const link = setUpLinkBasic(req.url);
	const protocol = req.headers.host === 'localhost:3000' ? 'http://' : 'https://';
	let verifyObject = { };
	let error = true;

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
        error = false;
      }
    }catch(err){
      console.log(err);
    }
		
	}
  
  return { userAgent, error, verifyObject }
}

export default withRedux(Password)
