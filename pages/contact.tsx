import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import { defineLanguage } from '../lib/helpers/generalFunctions';
import { getLanguage } from '../lib/language';
import Head from '../components/head';
import ContactView from '../views/ContactView';

const Contact : NextPage<{}> = () => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);

  return (
    <div>
      <Head title={dictionary['headTitlePartnership']} description={dictionary['headDescriptionPartnership']}/>
      <ContactView  
        path={router.pathname} 
        fullPath={ router.asPath } 
        lang={ lang } 
       />
    </div>
  )
}

export default withRedux(Contact)
