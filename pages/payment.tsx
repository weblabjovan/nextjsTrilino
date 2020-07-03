import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withRedux } from '../lib/redux';
import { getLanguage } from '../lib/language';
import { setUpLinkBasic, defineLanguage, getOrgHead, isLinkSecure } from '../lib/helpers/generalFunctions';
import { getSingleReservation, getSingleCatering } from '../lib/helpers/specificReservationFunctions';
import { isPaymentResponseValid } from '../server/helpers/validations';
import parse from 'urlencoded-body-parser';
import Head from '../components/head';
import PaymentOrganization from '../organizations/PaymentOrganization';

interface Props {
  userAgent?: string;
  link?: object;
  paymentInfo: object;
  success: boolean;
}


const Payment : NextPage<Props> = ({ userAgent, link, paymentInfo, success }) => {

  const router = useRouter();
  let lang = defineLanguage(router.query['language']);
  const dictionary = getLanguage(lang);
  const page = router.query['page'] ? router.query['page'].toString() : '';
  const orgHead = getOrgHead('payment', page);

  return (
    <div>
      <Head title={dictionary[orgHead['title']]} description={dictionary[orgHead['description']]}  />
      <PaymentOrganization 
        userAgent={userAgent} 
        path={router.pathname} 
        fullPath={ router.asPath } 
        lang={ lang }
        link={ link }
        page={ page }
        paymentInfo={ paymentInfo }
        cateringSuccess={ success }
      />
    </div>
  )
}

Payment.getInitialProps = async (ctx: any) => {
  const { req } = ctx;
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  const link = setUpLinkBasic({path: ctx.asPath, host: req.headers.host});
  const paymentInfo = { card: '', transId: '', transDate: '', transAuth: '', transProc: '', transMd: '', error: '', payment: ''};
  let success = false;
  try{
    if (!isLinkSecure(link)) {
      ctx.res.writeHead(302, {Location: `https://${link['host']}${link['fullPath']}?${link['queryString']}`});
      ctx.res.end();
    }

  	if (link['queryObject']['page'] === 'closed') {
      
  	}else{
  		let resOne = { status: 500 };
	    if (link['queryObject']['page'] === 'cateringSuccess') {
	    	success = link['queryObject']['result'] === 'success' ? true : false;
	    	resOne = await getSingleCatering(ctx);
	    }else{
	    	resOne = await getSingleReservation(ctx);
	    }
	    
	    if (resOne['status'] === 200) {
	      const nestPayData = await parse(req);
	      const paymentId = link['queryObject']['page'] === 'cateringSuccess' ? link['queryObject']['catering'] : link['queryObject']['reservation'];
	      const paymentType = link['queryObject']['page'] === 'cateringSuccess' ? 'catering' : 'reservation';

	      if (!isPaymentResponseValid(nestPayData, paymentId, req, paymentType)) {
	        ctx.res.writeHead(302, {Location: `/?page=error&language=${link['queryObject']['language']}&error=1&root=payment`});
	        ctx.res.end();
	      }else{
	        paymentInfo['card'] = nestPayData['EXTRA.CARDBRAND'];
	        paymentInfo['transId'] = nestPayData['TransId'];
	        paymentInfo['transAuth'] = nestPayData['AuthCode'] ? nestPayData['AuthCode'] : '-';
	        paymentInfo['transDate'] = nestPayData['EXTRA.TRXDATE'];
	        paymentInfo['transProc'] = nestPayData['ProcReturnCode'];
	        paymentInfo['transMd'] = nestPayData['mdStatus'] ? nestPayData['mdStatus'] : '-';
	        paymentInfo['error'] = nestPayData['ErrMsg'] ? nestPayData['ErrMsg'] : '-';
	        paymentInfo['payment'] = nestPayData['Response'];
	      }
	    }else{
	      ctx.res.writeHead(302, {Location: `/?page=error&language=${link['queryObject']['language']}&error=1&root=payment`});
	      ctx.res.end();
	    }
  	}
  }catch(err){
    console.log(err);
    ctx.res.writeHead(302, {Location: `/?page=error&language=${link['queryObject']['language']}&error=1&root=payment`});
    ctx.res.end();
  }
  
  return { userAgent, link, paymentInfo, success }
}

export default withRedux(Payment)