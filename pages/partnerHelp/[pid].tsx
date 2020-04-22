import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { getLanguage } from '../../lib/language';
import {  defineLanguage } from '../../lib/helpers/generalFunctions';
import Head from '../../components/head';
import PartnerHelpView from '../../views/PartnerHelpView';


const PartnerHelp : NextPage<{}> = () => {

  const router = useRouter();
  const { pid } = router.query;
  const lang = defineLanguage(pid);
  const dictionary = getLanguage(lang);

  return (
    <div>
      <Head title={dictionary['headTitlePartnerHelp']} description={dictionary['headDescriptionPartnerHelp']} />
      <PartnerHelpView   
      	path={router.pathname} 
      	fullPath={ router.asPath } 
      	lang={ lang } 
      />
    </div>
  )
}

export default PartnerHelp;
