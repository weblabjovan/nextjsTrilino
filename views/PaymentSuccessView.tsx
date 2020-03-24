import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from '../components/loader';
import { Container, Row, Col, Button } from 'reactstrap';
import { setUserLanguage } from '../actions/user-actions';
import { confirmReservationAfterPay } from '../actions/reservation-actions';
import { getLanguage } from '../lib/language';
import { isMobile, setCookie, unsetCookie, setUpLinkBasic } from '../lib/helpers/generalFunctions';
import PlainInput from '../components/form/input';
import NavigationBar from '../components/navigation/navbar';
import Footer from '../components/navigation/footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface MyProps {
  // using `interface` is also ok
  userLanguage: string;
  confirmReservationStart: boolean;
  confirmReservationError: object | boolean;
  confirmReservationSuccess: null | number;
  confirmReservationAfterPay(link: object, data: object, auth: string): void;
  setUserDevice(userAgent: string): boolean;
  setUserLanguage(language: string): string;
  userAgent: string;
  path: string;
  fullPath: string;
  lang: string;
  link?: object;
  token?: string | undefined;
  passChange: boolean;
  paymentInfo: object;
};
interface MyState {
	language: string;
	dictionary: object;
	isMobile: boolean;
  logString: string;
  alertOpen: boolean;
  loader: boolean;
  passwordChange: boolean;
};

class UserProfileView extends React.Component <MyProps, MyState>{

	state: MyState = {
    language: this.props.lang.toUpperCase(),
    dictionary: getLanguage(this.props.lang),
    isMobile: isMobile(this.props.userAgent),
    logString: '',
    alertOpen: false,
    loader: true,
    passwordChange: this.props.passChange,
  };

  componentDidUpdate(prevProps: MyProps, prevState:  MyState){ 
    if (!this.props.confirmReservationStart && !prevProps.confirmReservationSuccess && this.props.confirmReservationSuccess) {
      this.setState({loader: false});
    }
  }

	componentDidMount(){
		this.props.setUserLanguage(this.props.lang);
    this.props.confirmReservationAfterPay(this.props.link, {id: this.props.link['queryObject']['reservation'], transId: this.props.paymentInfo['transId'], card: this.props.paymentInfo['card'], transDate: this.props.paymentInfo['transDate'], transAuth: this.props.paymentInfo['transAuth'], transProc: this.props.paymentInfo['transProc'], transMd: this.props.paymentInfo['transMd'], payment: this.props.paymentInfo['payment'], error: this.props.paymentInfo['error'], confirm: true, language: this.props.lang }, this.props.token);
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
                    <h2>Čestitamo! Uspešno ste izvršili plaćanje</h2>
                    <p>{`Sve podatke u vezi sa ovom rezervacijom i izvršenom transakcijom možete pratiti na vašem korisničkom profilu u opciji REZERVACIJE (reg: ${this.props.link['queryObject']['reservation']}).`}</p>
                    <a href={`/userProfile?languege=${this.props.lang}`}>vaš korisnički profil</a>
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

export default connect(mapStateToProps, matchDispatchToProps)(UserProfileView)