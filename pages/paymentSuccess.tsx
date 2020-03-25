import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import { getLanguage } from '../lib/language';
import { setUpLinkBasic, defineLanguage } from '../lib/helpers/generalFunctions';
import { isDevEnvLogged } from '../lib/helpers/specificAdminFunctions';
import { isUserLogged, getUserToken } from '../lib/helpers/specificUserFunctions';
import { getSingleReservation , isPaymentResponseValid } from '../lib/helpers/specificReservationFunctions';
import parse from 'urlencoded-body-parser';
import Head from '../components/head';
import PaymentSuccessView from '../views/PaymentSuccessView';
import pages from '../lib/constants/pages';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface Props {
  userAgent?: string;
  link?: object;
  token?: string | undefined;
  paymentInfo: object;
}


const PaymentSuccess : NextPage<Props> = ({ userAgent, link, token, paymentInfo }) => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);
  const passChange = router.query['passChange'] === 'true' ? true : false;

  return (
    <div>
      <Head title={dictionary['headTitleUserProfile']} description={dictionary['headDescriptionUserProfile']} />
      <PaymentSuccessView 
        userAgent={userAgent} 
        path={router.pathname} 
        fullPath={ router.asPath } 
        lang={ lang }
        token={ token }
        link={ link }
        passChange={ passChange }
        paymentInfo={ paymentInfo }
      />
    </div>
  )
}

PaymentSuccess.getInitialProps = async (ctx: any) => {
  const { req } = ctx;
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  const link = setUpLinkBasic({path: ctx.asPath, host: req.headers.host});
  const paymentInfo = { card: '', transId: '', transDate: '', transAuth: '', transProc: '', transMd: '', error: '', payment: ''};
  let token = '';
  console.log('checking my console....')
  try{
    // const devLog = await isDevEnvLogged(ctx);

    // if (!devLog) {
    //   ctx.res.writeHead(302, {Location: `/devLogin`});
    //   ctx.res.end();
    // }
    // const userLog = await isUserLogged(ctx);

    // token = getUserToken(ctx);

    const resOne = await getSingleReservation(ctx);
    if (resOne['status'] === 200) {
      const nestPayData = await parse(req);
      if (!isPaymentResponseValid(nestPayData, link['queryObject']['reservation'])) {
        console.log(nestPayData);
        ctx.res.writeHead(302, {Location: `/userProfile?language=${link['queryObject']['language']}`});
        ctx.res.end();
      }else{
        paymentInfo['card'] = nestPayData['EXTRA.CARDBRAND'];
        paymentInfo['transId'] = nestPayData['TransId'];
        paymentInfo['transAuth'] = nestPayData['AuthCode'];
        paymentInfo['transDate'] = nestPayData['EXTRA.TRXDATE'];
        paymentInfo['transProc'] = nestPayData['ProcReturnCode'];
        paymentInfo['transMd'] = nestPayData['mdStatus'] ? nestPayData['mdStatus'] : '33';
        paymentInfo['payment'] = nestPayData['Response'];
      }
    }else{
      ctx.res.writeHead(302, {Location: `/errorPage?language=${link['queryObject']['language']}`});
      ctx.res.end();
    }
  }catch(err){
    console.log(err)
  }

  

  
  return { userAgent, link, token, paymentInfo }
}

export default withRedux(PaymentSuccess)