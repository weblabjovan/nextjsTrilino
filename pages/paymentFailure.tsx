import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import { getLanguage } from '../lib/language';
import { setUpLinkBasic, defineLanguage } from '../lib/helpers/generalFunctions';
import { getSingleReservation , isPaymentResponseValid } from '../lib/helpers/specificReservationFunctions';
import { getUserToken } from '../lib/helpers/specificUserFunctions';
import Head from '../components/head';
import PaymentFailureView from '../views/PaymentFailureView';
import parse from 'urlencoded-body-parser';
import pages from '../lib/constants/pages';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface Props {
  userAgent?: string;
  link?: object;
  token?: string | undefined;
  paymentInfo: object;
}


const PaymentFailure : NextPage<Props> = ({ userAgent, link, token, paymentInfo }) => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);
  const passChange = router.query['passChange'] === 'true' ? true : false;

  return (
    <div>
      <Head title={dictionary['headTitleUserProfile']} description={dictionary['headDescriptionUserProfile']} />
      <PaymentFailureView 
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

PaymentFailure.getInitialProps = async (ctx: any) => {
  const { req } = ctx;
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  const link = setUpLinkBasic({path: ctx.asPath, host: req.headers.host});
  const paymentInfo = { card: '-', transId: '-', transDate: '-', transAuth: '-', transProc: '-', transMd: '-', error: '-', payment: '-'};
  let token = '';

  try{
    
    token = getUserToken(ctx);

    const resOne = await getSingleReservation(ctx);
    if (resOne['status'] === 200) {
      const nestPayData = await parse(req);
      if (!isPaymentResponseValid(nestPayData, link['queryObject']['reservation'], req)) {
        ctx.res.writeHead(302, {Location: `/userProfile?language=${link['queryObject']['language']}`});
        ctx.res.end();
      }else{
        if (Object.keys(nestPayData).length) {
          paymentInfo['card'] = nestPayData['EXTRA.CARDBRAND'];
          paymentInfo['transId'] = nestPayData['TransId'];
          paymentInfo['transAuth'] = nestPayData['AuthCode'];
          paymentInfo['transDate'] = nestPayData['EXTRA.TRXDATE'];
          paymentInfo['transProc'] = nestPayData['ProcReturnCode'];
          paymentInfo['transMd'] = nestPayData['mdStatus'] ? nestPayData['mdStatus'] : '33';
          paymentInfo['error'] = nestPayData['ErrMsg'];
          paymentInfo['payment'] = nestPayData['Response'];
        }
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

export default withRedux(PaymentFailure)