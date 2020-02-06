import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import Head from '../components/head';
import SearchView from '../views/SearchView';
import { setUpLinkBasic } from '../lib/helpers/generalFunctions';
import { isDevEnvLogged } from '../lib/helpers/specificAdminFunctions';
import { isPartnerLogged, getPartners } from '../lib/helpers/specificPartnerFunctions';
import pages from '../lib/constants/pages';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface Props {
  userAgent?: string;
  link?: null | object;
  query?: object;
  partners?: Array<object>;
}


const Search : NextPage<Props> = ({ userAgent, query, partners }) => {

  const router = useRouter();
  let lang = 'sr';

  if (router.query['language'] !== undefined) {
    let stringLang = router.query['language'] as string;
    if (pages['language'].indexOf(stringLang) !== -1) {
      lang = stringLang;
    }
  }

  return (
    <div>
      <Head title="Trilino" description="Tilino, rodjendani za decu, slavlje za decu" />
      <SearchView 
        userAgent={userAgent} 
        router={ router } 
        path={router.pathname} 
        fullPath={ router.asPath } 
        lang={ lang }
        partners={ partners }
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

  return { userAgent, query: ctx['query'], partners }
}

export default withRedux(Search)
