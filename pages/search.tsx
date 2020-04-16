import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import Head from '../components/head';
import SearchView from '../views/SearchView';
import { getLanguage } from '../lib/language';
import { defineLanguage } from '../lib/helpers/generalFunctions';


const Search : NextPage<{}> = () => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);

  return (
    <div>
      <Head title={dictionary['headTitleSearch']} description={dictionary['headDescriptionSearch']} />
      <SearchView 
        path={router.pathname} 
        fullPath={ router.asPath } 
        lang={ lang }
      />
    </div>
  )
}

export default withRedux(Search)
