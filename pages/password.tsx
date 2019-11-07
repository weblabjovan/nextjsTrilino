import { NextPage } from 'next';
import { useRouter } from 'next/router';
import fetch from 'isomorphic-unfetch';
import { withRedux } from '../lib/redux';
import Head from '../components/head';
import { setUpLinkBasic } from '../lib/helpers/generalFunctions';
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

Password.getInitialProps = async ({ req }) => {
	const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  const link = setUpLinkBasic(req.url);
	const protocol = req.headers.host === 'localhost:3000' ? 'http://' : 'https://';
	let verifyObject = { };
	let error = true;

	if (link['queryObject']['type'] === 'partner') {
		const res = await fetch(`${protocol}${req.headers.host}/api/partners/get/?partner=${link['queryObject']['page']}&encoded=true`);
	  	verifyObject = await res.json();
		if (verifyObject['success']) {
			error = false;
		}
	}
	
  
  return { userAgent, error, verifyObject }
}

export default withRedux(Password)
