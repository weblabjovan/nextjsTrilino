import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import { getLanguage } from '../lib/language';
import { setUpLinkBasic, defineLanguage } from '../lib/helpers/generalFunctions';
import Head from '../components/head';
import PartnerHelpView from '../views/PartnerHelpView';


const PartnerHelp : NextPage<{}> = () => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);

  return (
    <div>
      <Head title={dictionary['headTitlePartnerHelp']} description={dictionary['headDescriptionPartnerHelp']} />
      <PartnerHelpView   
      	path={router.pathname} 
      	fullPath={ router.asPath } 
      	lang={ lang }
      	section={ router.query['section'] } 
      />
    </div>
  )
}

export default withRedux(PartnerHelp)
