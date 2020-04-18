import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from '../components/loader';
import { Container, Row, Col, Button } from 'reactstrap';
import { setUserLanguage } from '../actions/user-actions';
import { confirmReservationAfterPay } from '../actions/reservation-actions';
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
  confirmReservationStart: boolean;
  confirmReservationError: object | boolean;
  confirmReservationSuccess: null | object;
  confirmReservationAfterPay(link: object, data: object, auth: string): void;
  setUserDevice(userAgent: string): boolean;
  setUserLanguage(language: string): string;
  userAgent: string;
  path: string;
  fullPath: string;
  lang: string;
  link?: object;
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

class PaymentSuccessView extends React.Component <MyProps, MyState>{

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

    if (!this.props.confirmReservationStart && !prevProps.confirmReservationSuccess && this.props.confirmReservationSuccess) {
      this.setState({loader: false});
    }
  }

	componentDidMount(){
		this.props.setUserLanguage(this.props.lang);
    const token = getCookie('trilino-user-token');
    this.props.confirmReservationAfterPay(this.props.link, {id: this.props.link['queryObject']['reservation'], transId: this.props.paymentInfo['transId'], card: this.props.paymentInfo['card'], transDate: this.props.paymentInfo['transDate'], transAuth: this.props.paymentInfo['transAuth'], transProc: this.props.paymentInfo['transProc'], transMd: this.props.paymentInfo['transMd'], payment: this.props.paymentInfo['payment'], error: this.props.paymentInfo['error'], confirm: true, language: this.props.lang }, token);
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
              <Row>
                
                <Col xs='12'>
                  <div className="middle">
                    <h2>{this.state.dictionary['paymentPageTitleTrue']}</h2>
                  </div>
                </Col>
              </Row>

              {
                this.props.confirmReservationSuccess
                ?
                (
                  <Row className="paymentEnd">
                    <Col xs="12">
                      <h3>{this.state.dictionary['paymentPageSub']}</h3>
                    </Col>
                    <Col xs="12" sm="6">
                      <h4>{this.props.confirmReservationSuccess['reservationTitle']}</h4>
                      <p>{this.props.confirmReservationSuccess['partnerName']}</p>
                      <p>{this.props.confirmReservationSuccess['address']}</p>
                      <p>{this.props.confirmReservationSuccess['date']}</p>
                      <p>{this.props.confirmReservationSuccess['room']}</p>
                      <p>{this.props.confirmReservationSuccess['fullPrice']}</p>
                      <p>{this.props.confirmReservationSuccess['deposit']}</p>
                      <p>{this.props.confirmReservationSuccess['forTrilino']}</p>
                    </Col>
                    <Col xs="12" sm="6">
                      <h4>{this.props.confirmReservationSuccess['transactionTitle']}</h4>
                      <p>{this.props.confirmReservationSuccess['orderId']}</p>
                      <p>{this.props.confirmReservationSuccess['authCode']}</p>
                      <p>{this.props.confirmReservationSuccess['paymentStatus']}</p>
                      <p>{this.props.confirmReservationSuccess['transactionId']}</p>
                      <p>{this.props.confirmReservationSuccess['transactionDate']}</p>
                      <p>{this.props.confirmReservationSuccess['mdStatus']}</p>
                    </Col>
                    <Col xs="12">
                      <p className="remarkVAT">{this.state.dictionary['uniVAT']}</p>
                    </Col>
                  </Row>
                )
                :
                null
              }

              <Row>
                
                <Col xs='12'>
                  <div className="middle">
                    <p>{this.state.dictionary['paymentPageFinishTrue']}</p>
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
    		/>

    	</div>
    	
    ) 
  }
}

const mapStateToProps = (state) => ({
  userLanguage: state.UserReducer.language,
  globalError: state.UserReducer.globalError,

  confirmReservationStart: state.ReservationReducer.confirmReservationStart,
  confirmReservationError: state.ReservationReducer.confirmReservationError,
  confirmReservationSuccess: state.ReservationReducer.confirmReservationSuccess,
});


const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setUserLanguage,
    confirmReservationAfterPay,
  },
  dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(PaymentSuccessView)