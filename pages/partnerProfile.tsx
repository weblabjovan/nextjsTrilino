import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import { getLanguage } from '../lib/language';
import { defineLanguage } from '../lib/helpers/generalFunctions';
import Head from '../components/head';
import PartnerProfileView from '../views/PartnerProfileView';


const PartnerProfile : NextPage<{}> = () => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);

  return (
    <div>
      <Head title={dictionary['headTitlePartnerProfile']} description={dictionary['headDescriptionPartnerProfile']} />
      <PartnerProfileView  
      	path={router.pathname} 
      	fullPath={ router.asPath } 
      	lang={ lang }
      />
    </div>
  )
}

export default withRedux(PartnerProfile)
