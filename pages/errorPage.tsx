import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import { defineLanguage } from '../lib/helpers/generalFunctions';
import { getLanguage } from '../lib/language';
import Head from '../components/head';
import ErrorPageView from '../views/ErrorPageView';


const Error : NextPage<{}> = () => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);
  const error = router.query['error'] ? router.query['error'].toString() : '1';

  return (
    <div>
      <Head title={dictionary['headTitleErrorPage']} description={dictionary['headDescriptionErrorPage']}  />
      <ErrorPageView 
        path={router.pathname} 
        fullPath={ router.asPath } 
        error={ error }
        lang={ lang }
      />
    </div>
  )
}

export default withRedux(Error)
