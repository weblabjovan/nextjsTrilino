import { NextPage } from 'next';
import { defineLanguage } from '../lib/helpers/generalFunctions';
import { getLanguage } from '../lib/language';
import { useRouter } from 'next/router';
import { withReduxNoInit } from '../lib/reduxWithoutInit';
// import { withRedux } from '../lib/redux';
import Head from '../components/head';
import HomeView from '../views/HomeView';


const Home : NextPage<{}> = () => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);

  return (
    <div>
      <Head title={dictionary['headTitleIndex']} description={dictionary['headDescriptionIndex']} />
      <HomeView  
        path={router.pathname} 
        fullPath={ router.asPath } 
        lang={ lang }  
       />
    </div>
  )
}

export default withReduxNoInit(Home)
