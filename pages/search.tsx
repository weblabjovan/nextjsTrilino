import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import Head from '../components/head';
import SearchView from '../views/SearchView';
import { getLanguage } from '../lib/language';
import { setUpLinkBasic, defineLanguage } from '../lib/helpers/generalFunctions';
import { isDevEnvLogged } from '../lib/helpers/specificAdminFunctions';
import { isPartnerLogged, getPartners } from '../lib/helpers/specificPartnerFunctions';
import { isUserLogged } from '../lib/helpers/specificUserFunctions';
import pages from '../lib/constants/pages';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface Props {
  userAgent?: string;
  link?: null | object;
  query?: object;
  partners?: Array<object>;
  userIsLogged: boolean;
}


const Search : NextPage<Props> = ({ userAgent, query, partners, userIsLogged }) => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);

  return (
    <div>
      <Head title={dictionary['headTitleSearch']} description={dictionary['headDescriptionSearch']} />
      <SearchView 
        userAgent={userAgent} 
        router={ router } 
        path={router.pathname} 
        fullPath={ router.asPath } 
        lang={ lang }
        partners={ partners }
        userIsLogged={ userIsLogged }
        date={ query['date'] ? query['date'] : null }
        district={ query['district'] ? query['district'] : null }
        city={ query['city'] ? query['city'] : null } />
    </div>
  )
}

Search.getInitialProps = async (ctx: any) => {
  const { req } = ctx;
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  let partners = [];
  let userIsLogged = false;

  try{
    const devLog = await isDevEnvLogged(ctx);

    if (!devLog) {
      ctx.res.writeHead(302, {Location: `/devLogin`});
      ctx.res.end();
    }

    const response = await getPartners(ctx);
    if (response['status'] === 200) {
      const re = await response.json();
      partners = re['partners']
    }else{
      ctx.res.writeHead(302, {Location: `/?language=sr`});
      ctx.res.end();
    }

    const userLog = await isUserLogged(ctx);

    if (userLog) {
      userIsLogged = true;
    }

  }catch(err){
    console.log(err)
  }

  return { userAgent, query: ctx['query'], partners, userIsLogged }
}

export default withRedux(Search)
