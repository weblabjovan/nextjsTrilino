import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import { setUpLinkBasic, defineLanguage } from '../lib/helpers/generalFunctions';
import { isDevEnvLogged } from '../lib/helpers/specificAdminFunctions';
import { getLanguage } from '../lib/language';
import Head from '../components/head';
import ErrorPageView from '../views/ErrorPageView';
import pages from '../lib/constants/pages';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface Props {
  userAgent?: string;
}


const Error : NextPage<Props> = ({ userAgent }) => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);
  const error = router.query['error'] ? router.query['error'].toString() : '1';

  return (
    <div>
      <Head title={dictionary['headTitleErrorPage']} description={dictionary['headDescriptionErrorPage']}  />
      <ErrorPageView 
        userAgent={userAgent} 
        path={router.pathname} 
        fullPath={ router.asPath } 
        error={ error }
        lang={ lang }
      />
    </div>
  )
}

Error.getInitialProps = async (ctx: any) => {
  const { req } = ctx;
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;

  try{
    const devLog = await isDevEnvLogged(ctx);

    if (!devLog) {
      ctx.res.writeHead(302, {Location: `/devLogin`});
      ctx.res.end();
    }

  }catch(err){
    console.log(err)
  }

  
  return { userAgent }
}

export default withRedux(Error)
