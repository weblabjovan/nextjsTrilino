import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import { getLanguage } from '../lib/language';
import { defineLanguage } from '../lib/helpers/generalFunctions';
import Head from '../components/head';
import UserProfileView from '../views/UserProfileView';


const UserProfile : NextPage<{}> = () => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);
  const passChange = router.query['passChange'] === 'true' ? true : false;

  return (
    <div>
      <Head title={dictionary['headTitleUserProfile']} description={dictionary['headDescriptionUserProfile']} />
      <UserProfileView  
        path={router.pathname} 
        fullPath={ router.asPath } 
        lang={ lang }
        passChange={ passChange }
      />
    </div>
  )
}

export default withRedux(UserProfile);