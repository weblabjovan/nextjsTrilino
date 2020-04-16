import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import { isDevEnvLogged } from '../lib/helpers/specificAdminFunctions';
import { isUserLogged } from '../lib/helpers/specificUserFunctions';
import { defineLanguage, setUpLinkBasic } from '../lib/helpers/generalFunctions';
import { getLanguage } from '../lib/language';
import Head from '../components/head';
import PartnershipView from '../views/PartnershipView';


const Partnership : NextPage<{}> = () => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);

  return (
    <div>
      <Head title={dictionary['headTitlePartnership']} description={dictionary['headDescriptionPartnership']}/>
      <PartnershipView  
        path={router.pathname} 
        fullPath={ router.asPath } 
        lang={ lang } 
      />
    </div>
  )
}

export default withRedux(Partnership);
