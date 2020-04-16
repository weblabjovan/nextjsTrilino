import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import { getLanguage } from '../lib/language';
import { defineLanguage } from '../lib/helpers/generalFunctions';
import Head from '../components/head';
import TermsView from '../views/TermsView';


const Terms : NextPage<{}> = () => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);

  return (
    <div>
      <Head title={dictionary['headTitleTerms']} description={dictionary['headDescriptionTerms']} />
      <TermsView 
        path={router.pathname} 
        fullPath={ router.asPath } 
        lang={ lang } 
      />
    </div>
  )
}

export default Terms;
