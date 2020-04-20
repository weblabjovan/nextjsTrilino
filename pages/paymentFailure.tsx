import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import { getLanguage } from '../lib/language';
import { setUpLinkBasic, defineLanguage } from '../lib/helpers/generalFunctions';
import { getSingleReservation } from '../lib/helpers/specificReservationFunctions';
import { isPaymentResponseValid } from '../server/helpers/validations';
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
  paymentInfo: object;
}


const PaymentFailure : NextPage<Props> = ({ userAgent, link, paymentInfo }) => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);

  return (
    <div>
      <Head title={dictionary['headTitlePaymentFailure']} description={dictionary['headDescriptionPaymentFailure']} />
      <PaymentFailureView 
        userAgent={userAgent} 
        path={router.pathname} 
        fullPath={ router.asPath } 
        lang={ lang }
        link={ link }
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

  try{

    const resOne = await getSingleReservation(ctx);
    if (resOne['status'] === 200) {
      const nestPayData = await parse(req);
      if (!isPaymentResponseValid(nestPayData, link['queryObject']['reservation'], req, 'reservation')) {
        ctx.res.writeHead(302, {Location: `/?page=error&language=${link['queryObject']['language']}&error=1&root=paymentFailure`});
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
      ctx.res.writeHead(302, {Location: `/?page=error&language=${link['queryObject']['language']}&error=1&root=paymentFailure`});
    ctx.res.end();
    }

  }catch(err){
    console.log(err);
    ctx.res.writeHead(302, {Location: `/?page=error&language=${link['queryObject']['language']}&error=1&root=paymentFailure`});
    ctx.res.end();
  }
  
  return { userAgent, link, paymentInfo }
}

export default withRedux(PaymentFailure)