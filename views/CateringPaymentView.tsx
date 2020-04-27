import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from '../components/loader';
import { Container, Row, Col, Button } from 'reactstrap';
import { setUserLanguage } from '../actions/user-actions';
import { confirmCateringAfterPay } from '../actions/reservation-actions';
import { getLanguage } from '../lib/language';
import { isMobile, getCookie, errorExecute } from '../lib/helpers/generalFunctions';
import PlainInput from '../components/form/input';
import NavigationBar from '../components/navigation/navbar';
import Footer from '../components/navigation/footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface MyProps {
  // using `interface` is also ok
  userLanguage: string;
  globalError: boolean;
  confirmCateringStart: boolean;
  confirmCateringError: object | boolean;
  confirmCateringSuccess: null | object;
  confirmCateringAfterPay(link: object, data: object, auth: string): void;
  setUserDevice(userAgent: string): boolean;
  setUserLanguage(language: string): string;
  userAgent: string;
  path: string;
  fullPath: string;
  lang: string;
  link?: object;
  success: boolean;
  paymentInfo: object;
};
interface MyState {
	language: string;
	dictionary: object;
	isMobile: boolean;
  logString: string;
  alertOpen: boolean;
  loader: boolean;
};

class CateringPaymentView extends React.Component <MyProps, MyState>{

	state: MyState = {
    language: this.props.lang.toUpperCase(),
    dictionary: getLanguage(this.props.lang),
    isMobile: isMobile(this.props.userAgent),
    logString: '',
    alertOpen: false,
    loader: true,
  };

  componentDidUpdate(prevProps: MyProps, prevState:  MyState){ 
    errorExecute(window, this.props.globalError);

    if (!this.props.confirmCateringStart && !prevProps.confirmCateringSuccess && this.props.confirmCateringSuccess) {
      this.setState({loader: false});
    }
  }

	componentDidMount(){
		this.props.setUserLanguage(this.props.lang);
		if (this.props.success) {
			const token = getCookie('trilino-user-token');
			this.props.confirmCateringAfterPay(this.props.link, {id: this.props.link['queryObject']['catering'], confirm: true, transId: this.props.paymentInfo['transId'], transDate: this.props.paymentInfo['transDate'], transAuth: this.props.paymentInfo['transAuth'], transProc: this.props.paymentInfo['transProc'], transMd: this.props.paymentInfo['transMd'], payment: this.props.paymentInfo['payment'], language: this.props.lang }, token);
		}else{
			this.setState({loader: false});
		}
    
	}
	
  render() {
    return(
    	<div className="totalWrapper">
        <Loader  show={ this.state.loader } />
    		<NavigationBar 
    			isMobile={ this.state.isMobile } 
    			language={ this.state.language } 
          fullPath={ this.props.fullPath }
    			page={ this.props.path ? this.props.path : '' }
    			contact={ this.state.dictionary['navigationContact'] }
    			login={ this.state.dictionary['navigationLogin'] }
    			search={ this.state.dictionary['navigationSearch'] }
    			partnership={ this.state.dictionary['navigationPartnership'] }
    			faq={ this.state.dictionary['navigationFaq'] }
          terms={ this.state.dictionary['navigationTerms'] }
    		/>
    		<div className="registrationWrapper">
          <Container>
          	{
          		this.props.success
          		?
          		(
          			<Row>
	                <Col xs='12'>
	                  <div className="middle">
	                    <h2>{this.state.dictionary['paymentPageTitleTrue']}</h2>
	                  </div>
	                </Col>
	              </Row>
          		)
          		:
          		(
          			<Row>
	                <Col xs='12'>
	                  <div className="middle">
	                    <h2>{this.state.dictionary['paymentPageTitleFalse']}</h2>
	                  </div>
	                </Col>
	              </Row>
          		)
          	}
              

              {
              	this.props.success
              	?
                this.props.confirmCateringSuccess
                ?
                (
                  <Row className="paymentEnd">
                    <Col xs="12">
                      <h3>{this.state.dictionary['paymentPageSub']}</h3>
                    </Col>
                    <Col xs="12" sm="6">
                      <h4>{this.state.dictionary['paymentCateringSubCatering']}</h4>
                      <p>{this.props.confirmCateringSuccess['deliveryPartner']}</p>
                      <p>{this.props.confirmCateringSuccess['deliveryAddress']}</p>
                      <p>{this.props.confirmCateringSuccess['deliveryTime']}</p>
                      <p>{this.props.confirmCateringSuccess['deal']}</p>
                      <p>{this.props.confirmCateringSuccess['price']}</p>
                    </Col>
                    <Col xs="12" sm="6">
                      <h4>{this.state.dictionary['paymentCateringSubTransaction']}</h4>
                      <p>{this.props.confirmCateringSuccess['orderId']}</p>
                      <p>{this.props.confirmCateringSuccess['authCode']}</p>
                      <p>{this.props.confirmCateringSuccess['paymentStatus']}</p>
                      <p>{this.props.confirmCateringSuccess['transactionId']}</p>
                      <p>{this.props.confirmCateringSuccess['transactionDate']}</p>
                      <p>{this.props.confirmCateringSuccess['mdStatus']}</p>
                    </Col>
                    <Col xs="12">
                      <p className="remarkVAT">{this.state.dictionary['uniVAT']}</p>
                    </Col>
                  </Row>
                )
                :
                null
                :
                (
                	<Row className="paymentEnd">
                    <Col xs="12">
                      <h3>{this.state.dictionary['paymentCateringTextFail']}</h3>
                    </Col>
                  </Row>
                )
              }

              <Row>
                
                <Col xs='12'>
                  <div className="middle">
                    <p>{this.state.dictionary['paymentPageFinishUniversal']}</p>
                    <a href={`/userProfile?languege=${this.props.lang}`}>{this.state.dictionary['paymentPageLink']}</a>
                  </div>
                </Col>
              </Row>

              
            </Container>
            
          </div> 

		    <Footer 
    			isMobile={ this.state.isMobile } 
    			language={ this.state.language } 
    			page={ this.props.path ? this.props.path : '' }
    			contact={ this.state.dictionary['navigationContact'] }
    			login={ this.state.dictionary['navigationLogin'] }
    			search={ this.state.dictionary['navigationSearch'] }
    			partnership={ this.state.dictionary['navigationPartnership'] }
    			faq={ this.state.dictionary['navigationFaq'] }
          terms={ this.state.dictionary['navigationTerms'] }
          payment={ this.state.dictionary['navigationOnline'] }
          privacy={ this.state.dictionary['navigationPrivacy'] }
    		/>

    	</div>
    	
    ) 
  }
}

const mapStateToProps = (state) => ({
  userLanguage: state.UserReducer.language,
  globalError: state.UserReducer.globalError,

  confirmCateringStart: state.ReservationReducer.confirmCateringStart,
  confirmCateringError: state.ReservationReducer.confirmCateringError,
  confirmCateringSuccess: state.ReservationReducer.confirmCateringSuccess,

});


const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setUserLanguage,
    confirmCateringAfterPay,
  },
  dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(CateringPaymentView)