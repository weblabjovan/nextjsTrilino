import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from '../../components/head';
import { getLanguage } from '../../lib/language';
import { defineLanguage } from '../../lib/helpers/generalFunctions';
import ConfirmView from '../../views/ConfirmView';


const Confirm : NextPage<{}> = ({}) => {

  const router = useRouter();
  const { pid } = router.query;
  const lang = defineLanguage(pid);
  const dictionary = getLanguage(lang);

  return (
    <div>
      <Head title={dictionary['headTitleConfirmation']} description={dictionary['headDescriptionConfirmation']}  />
      <ConfirmView 
      	path={router.pathname} 
      	fullPath={ router.asPath } 
      	lang={ lang } />
    </div>
  )
}

export default Confirm;
