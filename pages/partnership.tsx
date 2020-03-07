import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import { isDevEnvLogged } from '../lib/helpers/specificAdminFunctions';
import { defineLanguage } from '../lib/helpers/generalFunctions';
import { getLanguage } from '../lib/language';
import Head from '../components/head';
import PartnershipView from '../views/PartnershipView'
import pages from '../lib/constants/pages';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface Props {
  userAgent?: string;
}


const Partnership : NextPage<Props> = ({ userAgent }) => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);

  return (
    <div>
      <Head title={dictionary['headTitlePartnership']} description={dictionary['headDescriptionPartnership']}/>
      <PartnershipView userAgent={userAgent} path={router.pathname} fullPath={ router.asPath } lang={ lang } />
    </div>
  )
}

Partnership.getInitialProps = async (ctx: any) => {
  const { req } = ctx;
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;

 const devLog = await isDevEnvLogged(ctx);

  if (!devLog) {
    ctx.res.writeHead(302, {Location: `/devLogin`});
    ctx.res.end();
  }

  return { userAgent}
}

export default withRedux(Partnership)
