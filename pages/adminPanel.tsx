import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import { defineLanguage } from '../lib/helpers/generalFunctions';
import Head from '../components/head';
import AdminPanelView from '../views/AdminPanelView';
import { getLanguage } from '../lib/language';


const AdminPanel : NextPage<{}> = () => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);

  return (
    <div>
      <Head title={dictionary['headTitleAdminPanel']} description={dictionary['headDescriptionAdminPanel']} />
      <AdminPanelView 
        path={router.pathname} 
        fullPath={ router.asPath } 
        lang={ lang } 
      />
    </div>
  )
}

export default withRedux(AdminPanel)
