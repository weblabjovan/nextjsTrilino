import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { withRedux } from '../lib/redux'
import Head from '../components/head';
import { getLanguage } from '../lib/language';
import { defineLanguage, setUpLinkBasic } from '../lib/helpers/generalFunctions';
import ConfirmView from '../views/ConfirmView';
import pages from '../lib/constants/pages';


const Confirm : NextPage<{}> = () => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);

  let error = false;
  let page = router.query['page'] as string;

  if (router.query['page'] === undefined || pages['confirm'].indexOf(page) === -1) {
  	error = true;
  }

  return (
    <div>
      <Head title={dictionary['headTitleConfirmation']} description={dictionary['headDescriptionConfirmation']}  />
      <ConfirmView  
      	page={ router.query['page']}  
      	path={router.pathname} 
      	fullPath={ router.asPath } 
      	error={ error } 
      	lang={ lang } />
    </div>
  )
}

export default withRedux(Confirm)
