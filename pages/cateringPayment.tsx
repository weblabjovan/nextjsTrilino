import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import { getLanguage } from '../lib/language';
import { setUpLinkBasic, defineLanguage } from '../lib/helpers/generalFunctions';
import { getUserToken } from '../lib/helpers/specificUserFunctions';
import { getSingleCatering , isPaymentResponseValid } from '../lib/helpers/specificReservationFunctions';
import parse from 'urlencoded-body-parser';
import Head from '../components/head';
import CateringPaymentView from '../views/CateringPaymentView';
import pages from '../lib/constants/pages';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface Props {
  userAgent?: string;
  link?: object;
  paymentInfo: object;
}


const CateringPayment : NextPage<Props> = ({ userAgent, link, paymentInfo }) => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);
  const success = router.query['result'] === 'success' ? true : false;

  return (
    <div>
      <Head title={dictionary['headTitleCateringPayment']} description={dictionary['headDescriptionCateringPayment']} />
      <CateringPaymentView 
        userAgent={userAgent} 
        path={router.pathname} 
        fullPath={ router.asPath } 
        lang={ lang }
        link={ link }
        success={ success }
        paymentInfo={ paymentInfo }
      />
    </div>
  )
}

CateringPayment.getInitialProps = async (ctx: any) => {
  const { req } = ctx;
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  const link = setUpLinkBasic({path: ctx.asPath, host: req.headers.host});
  const paymentInfo = { card: '', transId: '', transDate: '', transAuth: '', transProc: '', transMd: '', error: '', payment: ''};
  try{
    
    const resOne = await getSingleCatering(ctx);
    if (resOne['status'] === 200) {
      const nestPayData = await parse(req);
      
      if (!isPaymentResponseValid(nestPayData, link['queryObject']['catering'], req, 'catering')) {
        ctx.res.writeHead(302, {Location: `/errorPage?language=${link['queryObject']['language']}&error=1&root=cateringPayment`});
        ctx.res.end();
      }else{
        paymentInfo['card'] = nestPayData['EXTRA.CARDBRAND'];
        paymentInfo['transId'] = nestPayData['TransId'];
        paymentInfo['transAuth'] = nestPayData['AuthCode'] ? nestPayData['AuthCode'] : '-';
        paymentInfo['transDate'] = nestPayData['EXTRA.TRXDATE'];
        paymentInfo['transProc'] = nestPayData['ProcReturnCode'];
        paymentInfo['transMd'] = nestPayData['mdStatus'] ? nestPayData['mdStatus'] : '-';
        paymentInfo['payment'] = nestPayData['Response'];
      }
    }else{
      ctx.res.writeHead(302, {Location: `/errorPage?language=${link['queryObject']['language']}&error=1&root=cateringPayment`});
    ctx.res.end();
    }
  }catch(err){
    console.log(err);
    ctx.res.writeHead(302, {Location: `/errorPage?language=${link['queryObject']['language']}&error=1&root=cateringPayment`});
    ctx.res.end();
  }
  
  return { userAgent, link, paymentInfo }
}

export default withRedux(CateringPayment)