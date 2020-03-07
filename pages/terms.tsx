import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import { getLanguage } from '../lib/language';
import { defineLanguage } from '../lib/helpers/generalFunctions';
import Head from '../components/head';
import TermsView from '../views/TermsView';
import pages from '../lib/constants/pages';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface Props {
  userAgent?: string;
}


const Terms : NextPage<Props> = ({ userAgent }) => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);

  return (
    <div>
      <Head title={dictionary['headTitleTerms']} description={dictionary['headDescriptionTerms']} />
      <TermsView userAgent={userAgent} path={router.pathname} fullPath={ router.asPath } lang={ lang }  />
    </div>
  )
}

Terms.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  return { userAgent}
}

export default withRedux(Terms)
