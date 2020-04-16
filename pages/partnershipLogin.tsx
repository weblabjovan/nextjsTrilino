import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import Head from '../components/head';
import { getLanguage } from '../lib/language';
import PartnershipLoginView from '../views/PartnershipLoginView';
import { defineLanguage } from '../lib/helpers/generalFunctions';
import pages from '../lib/constants/pages';


const PartnershipLogin : NextPage<{}> = () => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);

  let error = false;
  let page = router.query['page'] as string;
  const dictionary = getLanguage(lang);

  if (router.query['page'] === undefined || pages['partnerLogin'].indexOf(page) === -1) {
    error = true;
  }

  return (
    <div>
      <Head title={dictionary['headTitlePartnershipLogin']} description={dictionary['headDescriptionPartnershipLogin']} />
      <PartnershipLoginView  
        path={router.pathname} 
        fullPath={ router.asPath } 
        lang={ lang } 
        error={ error }
        page={ router.query['page']} />
    </div>
  )
}

export default withRedux(PartnershipLogin)
