import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import Head from '../components/head';
import AdminLoginView from '../views/AdminLoginView';
import { getLanguage } from '../lib/language';
import { defineLanguage } from '../lib/helpers/generalFunctions';

const AdminLogin : NextPage<{}> = () => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);

  return (
    <div>
      <Head title={dictionary['headTitleAdminLogin']} description={dictionary['headDescriptionAdminLogin']} />
      <AdminLoginView 
        path={router.pathname} 
        fullPath={ router.asPath } 
        lang={ lang }  
      />
    </div>
  )
}

export default withRedux(AdminLogin)
