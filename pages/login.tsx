import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import { defineLanguage } from '../lib/helpers/generalFunctions';
import { getLanguage } from '../lib/language';
import Head from '../components/head';
import UserLoginView from '../views/UserLoginView';


const Login : NextPage<{}> = () => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);
  const page = router.query['page'] ? router.query['page'] : 'login';

  return (
    <div>
      <Head title={dictionary['headTitleLogin']} description={dictionary['headDescriptionLogin']}  />
      <UserLoginView  
        path={router.pathname} 
        fullPath={ router.asPath } 
        page={ page }
        lang={ lang }
      />
    </div>
  )
}

export default withRedux(Login)
