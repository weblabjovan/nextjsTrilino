import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import { isDevEnvLogged } from '../lib/helpers/specificAdminFunctions';
import { setUpLinkBasic , defineLanguage} from '../lib/helpers/generalFunctions';
import { getLanguage } from '../lib/language';
import Head from '../components/head';
import LoginView from '../views/LoginView';


const DevLogin : NextPage<{}> = () => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);

  return (
    <div>
      <Head title={dictionary['headTitleDevLogin']} description={dictionary['headDescriptionDevLogin']} />
      <LoginView 
        path={router.pathname} 
        fullPath={ router.asPath } 
        lang={ lang }  
       />
    </div>
  )
}

export default withRedux(DevLogin)
