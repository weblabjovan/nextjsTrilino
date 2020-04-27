import { NextPage } from 'next';
import fetch from 'isomorphic-unfetch';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import Head from '../components/head';
import EmailVerificationView from '../views/EmailVerificationView';
import { setUpLinkBasic, defineLanguage } from '../lib/helpers/generalFunctions';
import { isDevEnvLogged } from '../lib/helpers/specificAdminFunctions';
import { getLanguage } from '../lib/language';



interface Props {
  userAgent?: string;
  verifyObject?: object;
  resolution?: number;
}


const EmailVerification : NextPage<Props> = ({ userAgent, verifyObject, resolution }) => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);

  return (
    <div>
      <Head title={dictionary['headTitleEmailVerification']} description={dictionary['headDescriptionEmailVerification']} />
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

EmailVerification.getInitialProps = async (ctx: any) => {
  const { req } = ctx;
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  const link = setUpLinkBasic(req.url);
  let verifyObject = { };
  let resolution = 0;

  try{
    const devLog = await isDevEnvLogged(ctx);

    if (!devLog) {
      ctx.res.writeHead(302, {Location: `/login?page=dev&stage=login`});
      ctx.res.end();
    }
  }catch(err){
    console.log(err);
    ctx.res.writeHead(302, {Location: `/?page=error&language=${link['queryObject']['language']}&error=1&root=emailVerification`});
    ctx.res.end();
  }

  

  if (link['queryObject']['type'] === 'partner') {
    try{
      const protocol = req.headers.host === 'localhost:3000' ? 'http://' : 'https://';
      const res = await fetch(`${protocol}${req.headers.host}/api/partners/get/?partner=${link['queryObject']['page']}&encoded=true&type=verification`);
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
    }catch(err){
      console.log(err);
      ctx.res.writeHead(302, {Location: `/?page=error&language=${link['queryObject']['language']}&error=1&root=emailVerification`});
      ctx.res.end();
    }
    
  }

  return { userAgent, verifyObject, resolution }
}

export default withRedux(EmailVerification)
