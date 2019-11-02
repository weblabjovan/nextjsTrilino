import { NextPage } from 'next';
import fetch from 'isomorphic-unfetch';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import Head from '../components/head';
import EmailVerificationView from '../views/EmailVerificationView';
import pages from '../lib/constants/pages';
import { parseUrl } from '../lib/helpers/generalFunctions';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';



interface Props {
  userAgent?: string;
  verifyObject?: object;
  resolution?: number;
}


const EmailVerification : NextPage<Props> = ({ userAgent, verifyObject, resolution }) => {

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
      <EmailVerificationView 
      	userAgent={userAgent} 
      	router={router}
      	page={ router.query['page']}  
      	path={router.pathname} 
      	fullPath={ router.asPath } 
        type={router.query['type'] }
      	lang={ lang }
        verifyObject={ verifyObject }
        resolution={ resolution } />
    </div>
  )
}

EmailVerification.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  const parsedUrl = parseUrl(req.url);
  let verifyObject = { };
  let resolution = 0;

  if (parsedUrl['query']['type'] === 'partner') {
    const protocol = req.headers.host === 'localhost:3000' ? 'http://' : 'https://';
  	const res = await fetch(`${protocol}${req.headers.host}/api/partners/get/?partner=${parsedUrl['query']['page']}&encoded=true`);
  	verifyObject = await res.json();
  	if (verifyObject['success']) {
  		if (verifyObject['partner']['verified']) {
  			if (verifyObject['partner']['passProvided']) {
  				resolution = 3; //verified with password
  			}else{
  				resolution = 2; //verified without password
  			}
  		}else{
  			resolution = 1; //not verified
  		}
  		
  	}else{
  		resolution = 4; //error no provided id
  	}
  }

  

  return { userAgent, verifyObject, resolution }
}

export default withRedux(EmailVerification)
