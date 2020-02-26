import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { withRedux } from '../lib/redux'
import Head from '../components/head';
import { getLanguage } from '../lib/language';
import { defineLanguage } from '../lib/helpers/generalFunctions';
import { isDevEnvLogged } from '../lib/helpers/specificAdminFunctions';
import ConfirmView from '../views/ConfirmView';
import pages from '../lib/constants/pages';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface Props {
  userAgent?: string;
}


const Confirm : NextPage<Props> = ({ userAgent }) => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);

  let error = false;
  let page = router.query['page'] as string;

  if (router.query['page'] === undefined || pages['confirm'].indexOf(page) === -1) {
  	error = true;
  }



  return (
    <div>
      <Head title={dictionary['headTitleConfirmation']} description={dictionary['headDescriptionConfirmation']}  />
      <ConfirmView 
      	userAgent={userAgent} 
      	router={router}
      	page={ router.query['page']}  
      	path={router.pathname} 
      	fullPath={ router.asPath } 
      	error={ error } 
      	lang={ lang } />
    </div>
  )
}

Confirm.getInitialProps = async (ctx: any) => {
  const { req } = ctx;
  const userAgent = navigator.userAgent;

  const devLog = await isDevEnvLogged(ctx);

  if (!devLog) {
    ctx.res.writeHead(302, {Location: `/devLogin`});
    ctx.res.end();
  }

  return { userAgent}
}

export default withRedux(Confirm)
