import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from '../components/loader';
import { Container, Row, Col, Button, Alert } from 'reactstrap';
import { setUserLanguage } from '../actions/user-actions';
import { adminBasicDevLogin } from '../actions/admin-actions';
import { getLanguage } from '../lib/language';
import { isMobile, setCookie, setUpLinkBasic, errorExecute } from '../lib/helpers/generalFunctions';
import PlainInput from '../components/form/input';
import NavigationBar from '../components/navigation/navbar';
import Footer from '../components/navigation/footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface MyProps {
  // using `interface` is also ok
  userLanguage: string;
  globalError: boolean;
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
  link: null | object;
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

class LoginView extends React.Component <MyProps, MyState>{

	state: MyState = {
      language: this.props.lang.toUpperCase(),
      dictionary: getLanguage(this.props.lang),
      isMobile: isMobile(this.props.userAgent),
      logString: '',
      alertOpen: false,
      loader: false,
      loginTry: 0,
    };

  handlelogPassChange(val){
    this.setState({ logString: val});
  }

  handleLogin(){
    if (this.state.logString) {
      this.setState({ loader: true}, () => {
        const link = setUpLinkBasic(window.location.href);
        this.props.adminBasicDevLogin(link, {pass: this.state.logString});
      })
    }
  }

  closeAlert(){
    this.setState({alertOpen: false});
  }

  componentDidUpdate(prevProps: MyProps, prevState:  MyState){ 
    if (this.state.loginTry > 9) {
      window.location.href = `${this.props.link["protocol"]}${this.props.link["host"]}?language=${this.props.lang}`;
    }

    errorExecute(window, this.props.globalError);

    if (this.props.adminBasicDevLoginError && !prevProps.adminBasicDevLoginError && !this.props.adminBasicDevLoginStart) {
      const loginTry = this.state.loginTry + 1;
      this.setState({ loginTry });
    }

    if (!this.props.adminBasicDevLoginStart && prevProps.adminBasicDevLoginStart && this.props.adminBasicDevLoginSuccess) {
      setCookie(this.props.devAuth,'trilino-dev-auth', 5);
      const link = setUpLinkBasic(window.location.href);
      window.location.href = `${link["protocol"]}${link["host"]}/?language=${this.props.lang}`;
    }

    if (!this.props.adminBasicDevLoginStart && prevProps.adminBasicDevLoginStart && this.props.adminBasicDevLoginError) {
      this.setState({alertOpen: true, loader: false});
    }
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
                  <Alert color="danger" isOpen={ this.state.alertOpen } toggle={() => this.closeAlert()} >
                    <p>Lozinka nije ispravna</p>
                  </Alert>

                  <div className="box">
                    <h2>Prijava za razvoj</h2>
                    <PlainInput 
                      placeholder="lozinka"
                      className={`logInput`} 
                      onChange={() => this.handlelogPassChange(event.target['value'])} 
                      value={this.state.logString}
                      type="password" />

                    <div className="middle">
                      <Button color="success" onClick={() => this.handleLogin()} >POŠALJI</Button>
                    </div>

              
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

export default connect(mapStateToProps, matchDispatchToProps)(LoginView)