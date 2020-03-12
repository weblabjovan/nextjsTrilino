import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from '../components/loader';
import { Container, Row, Col, Button, Alert } from 'reactstrap';
import { setUserLanguage } from '../actions/user-actions';
import { adminBasicDevLogin } from '../actions/admin-actions';
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
  adminBasicDevLoginStart: boolean;
  adminBasicDevLoginError: object | boolean;
  adminBasicDevLoginSuccess: null | number;
  devAuth: string;
  adminBasicDevLogin(link: object, data: object):void;
  setUserDevice(userAgent: string): boolean;
  setUserLanguage(language: string): string;
  userAgent: string;
  path: string;
  fullPath: string;
  lang: string;
  link?: object;
  token?: string | undefined;
};
interface MyState {
	language: string;
	dictionary: object;
	isMobile: boolean;
  logString: string;
  alertOpen: boolean;
  loader: boolean;
  loginTry: number;
};

class UserProfileView extends React.Component <MyProps, MyState>{

	state: MyState = {
    language: this.props.lang.toUpperCase(),
    dictionary: getLanguage(this.props.lang),
    isMobile: isMobile(this.props.userAgent),
    logString: '',
    alertOpen: false,
    loader: false,
    loginTry: 0,
  };

  logout() {
    unsetCookie('trilino-user-token');
    window.location.href = `${this.props.link["protocol"]}${this.props.link["host"]}/login?language=${this.props.lang}`;
  }

  componentDidUpdate(prevProps: MyProps, prevState:  MyState){ 

  }

	componentDidMount(){
		this.props.setUserLanguage(this.props.lang);
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
                  <div className="box">
                    <h2>Ovo je stranica user profila</h2>
                    <button onClick={() => { this.logout() }}>Odjavi se</button>
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

  adminBasicDevLoginStart: state.AdminReducer.adminBasicDevLoginStart,
  adminBasicDevLoginError: state.AdminReducer.adminBasicDevLoginError,
  adminBasicDevLoginSuccess: state.AdminReducer.adminBasicDevLoginSuccess,

  devAuth: state.AdminReducer.devAuth,
});


const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setUserLanguage,
    adminBasicDevLogin,
  },
  dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(UserProfileView)