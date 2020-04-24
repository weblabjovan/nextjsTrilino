import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col, Button, Alert } from 'reactstrap';
import { setUserLanguage, changeSingleUserField, registrateUser, loginUser } from '../actions/user-actions';
import { getLanguage } from '../lib/language';
import { isMobile, setCookie, setUpLinkBasic, errorExecute } from '../lib/helpers/generalFunctions';
import { isEmail, isNumeric, isEmpty, isPhoneNumber, isInputValueMalicious } from '../lib/helpers/validations';
import LoginScreen from '../components/user/LoginScreen';
import RegistrationScreen from '../components/user/RegistrationScreen';
import NavigationBar from '../components/navigation/navbar';
import Footer from '../components/navigation/footer';
import Loader from '../components/loader';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface MyProps {
  // using `interface` is also ok
  userLanguage: string;
  globalError: boolean;
  userRegistrateStart: boolean;
  userRegistrateError: boolean | object;
  userRegistrateSuccess: null | object;
  userLoginStart: boolean;
  userLoginError: boolean | object;
  userLoginSuccess: null | object;
  changeStage(stage: string):void;
  changeSingleUserField(field: string, value: any):void;
  setUserLanguage(language: string): string;
  registrateUser(data: object, link: object): void;
  loginUser(data: object, link: object): void;
  userAgent: string;
  path: string;
  stage: string;
  fullPath: string;
  lang: string;
  link: object;
};
interface MyState {
	language: string;
	dictionary: object;
	isMobile: boolean;
  logString: string;
  loader: boolean;
  loginTry: number;
  errorMessages: object;
  registrationConfirm: boolean;
  baseErrorMessage: string;
  logTry: number;
};

class UserLoginView extends React.Component <MyProps, MyState>{
	constructor(props){
    super(props);

    this.componentObjectBinding = this.componentObjectBinding.bind(this);

    const bindingFunctions = ['closeAlert', 'handleSend', 'validateRegistrationData', 'validateLoginData', 'sendRegistrationData', 'sendLoginData'];
    this.componentObjectBinding(bindingFunctions);
  }

  componentObjectBinding(array: Array<string>){
    array.map( item => {
      this[item] = this[item].bind(this);
    })
  }

	state: MyState = {
    language: this.props.lang.toUpperCase(),
    dictionary: getLanguage(this.props.lang),
    isMobile: isMobile(this.props.userAgent),
    logString: '',
    loader: false,
    loginTry: 0,
    errorMessages: { show: false, fields:{ firstName: false, lastName: false, email: false, phoneCode: false, phone: false, terms: false, logEmail: false, password: false , regDuplicate: false, baseError: false}},
    registrationConfirm: false,
    baseErrorMessage: '',
    logTry: 0,
  };

  validateRegistrationData(data: object){
  	const errorCopy = JSON.parse(JSON.stringify(this.state.errorMessages));
  	if (this.props.userRegistrateError) {
  		this.props.changeSingleUserField('userRegistrateError', false);
  	}
  	

  	if (isEmpty(data['firstName']) || isInputValueMalicious(data['lastName'])) {
      errorCopy['fields']['firstName'] = true;
    }else{
      errorCopy['fields']['firstName'] = false;
    }
    if (isEmpty(data['lastName']) || isInputValueMalicious(data['lastName'])) {
      errorCopy['fields']['lastName'] = true;
    }else{
      errorCopy['fields']['lastName'] = false;
    }
    if (!isEmail(data['email'])) {
      errorCopy['fields']['email'] = true;
    }else{
      errorCopy['fields']['email'] = false;
    }
    if (isEmpty(data['phoneCode'])) {
      errorCopy['fields']['phoneCode'] = true;
    }else{
      errorCopy['fields']['phoneCode'] = false;
    }
    if (!isPhoneNumber(data['phone'], 'sr')) {
      errorCopy['fields']['phone'] = true;
    }else{
      errorCopy['fields']['phone'] = false;
    }
    if (!data['terms']) {
      errorCopy['fields']['terms'] = true;
    }else{
      errorCopy['fields']['terms'] = false;
    }

    errorCopy['fields']['regDuplicate'] = false;

    let showVal = false;

    Object.keys(errorCopy.fields).forEach((key) => {
      if (errorCopy.fields[key] === true) {
        showVal = true;
      }
    })
    errorCopy['show'] = showVal;
    this.setState({errorMessages: errorCopy}, () => {
      this.sendRegistrationData(data);
    });
  }

  sendRegistrationData(data: object){
  	if (!this.state.errorMessages['show']) {
        this.setState({ loader: true }, () => {
         data['language'] = this.props.lang;
         data['origin'] = 'regpage';
        this.props.registrateUser(data, this.props.link);
      })
     }
  }

  validateLoginData(data: object){
  	const errorCopy = JSON.parse(JSON.stringify(this.state.errorMessages));
    if (!isEmail(data['email'])) {
      errorCopy['fields']['logEmail'] = true;
    }else{
      errorCopy['fields']['logEmail'] = false;
    }
    if (isEmpty(data['password'])) {
      errorCopy['fields']['password'] = true;
    }else{
      errorCopy['fields']['password'] = false;
    }

    errorCopy['fields']['baseError'] = false;

    let showVal = false;

    Object.keys(errorCopy.fields).forEach((key) => {
      if (errorCopy.fields[key] === true) {
        showVal = true;
      }
    })
    errorCopy['show'] = showVal;
    this.setState({errorMessages: errorCopy, baseErrorMessage: ''}, () => {
      this.sendLoginData(data);
    });

  }

  sendLoginData(data: object){
  	if (!this.state.errorMessages['show']) {
       this.setState({ loader: true }, () => {
         data['language'] = this.props.lang;
        this.props.loginUser(data, this.props.link);
      })
    }
  }

  handleSend(data: object, type: string){
  	if (type === 'registration') {
  		this.validateRegistrationData(data);
  	}

  	if (type === 'login') {
  		this.validateLoginData(data);
  	}
  }

  closeAlert(){
    const errorCopy = JSON.parse(JSON.stringify(this.state.errorMessages));
    errorCopy['show'] = false;
    this.setState({errorMessages: errorCopy});
  }

  componentDidUpdate(prevProps: MyProps, prevState:  MyState){ 
    errorExecute(window, this.props.globalError);
    
  	if (this.state.logTry > 9) {
      window.location.href = `${this.props.link["protocol"]}${this.props.link["host"]}?language=${this.props.lang}`;
    }

  	if (this.props.userRegistrateError['code'] === 2 && prevProps.userRegistrateError['code'] !== 2) {
      const errorCopy = JSON.parse(JSON.stringify(this.state.errorMessages));
      errorCopy['show'] = true;
      errorCopy['fields']['regDuplicate'] = true;
      this.setState({ errorMessages: errorCopy, loader: false });
    }

    if (this.props.userLoginError && !prevProps.userLoginError && !this.props.userLoginStart) {
      const logTry = this.state.logTry + 1;
      const errorCopy = JSON.parse(JSON.stringify(this.state.errorMessages));
      errorCopy['show'] = true;
      errorCopy['fields']['baseError'] = true;

      this.setState({loader: false, logTry, errorMessages: errorCopy, baseErrorMessage: this.props.userLoginError['message'] });
    }

    if (this.props.userLoginSuccess && !prevProps.userLoginSuccess && !this.props.userLoginStart) {
      setCookie(this.props.userLoginSuccess['token'],'trilino-user-token', 10);
      window.location.href = `${this.props.link["protocol"]}${this.props.link["host"]}/userProfile?language=${this.props.lang}`;
    }

    if (!this.props.userRegistrateStart && this.props.userRegistrateSuccess && !prevProps.userRegistrateSuccess) {
    	this.setState({registrationConfirm: true, loader: false});
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
    		<div className="userWrapper">
          <Container>
          	<Row>
          		<Col xs="12">
          			<Alert color="danger" isOpen={ this.state.errorMessages["show"] } toggle={this.closeAlert} >
                  <p hidden={ !this.state.errorMessages['fields']['firstName']} >{ this.state.dictionary['userLoginAlertFirst'] }</p>
                  <p hidden={ !this.state.errorMessages['fields']['lastName']} >{ this.state.dictionary['userLoginAlertLast'] }</p>
                  <p hidden={ !this.state.errorMessages['fields']['email']} >{ this.state.dictionary['userLoginAlertEmail'] }</p>
                  <p hidden={ !this.state.errorMessages['fields']['phoneCode']} >{ this.state.dictionary['userLoginAlertPhonecode'] }</p>
                  <p hidden={ !this.state.errorMessages['fields']['phone']} >{ this.state.dictionary['userLoginAlertPhone'] }</p>
                  <p hidden={ !this.state.errorMessages['fields']['terms']} >{ this.state.dictionary['userLoginAlertTerms'] }</p>
                  <p hidden={ !this.state.errorMessages['fields']['logEmail']} >{ this.state.dictionary['userLoginAlertLogEmail'] }</p>
                  <p hidden={ !this.state.errorMessages['fields']['password'] }>{ this.state.dictionary['userLoginAlertPassword'] }</p>
                  <p hidden={ !this.state.errorMessages['fields']['regDuplicate'] }>{ this.state.dictionary['userLoginAlertDouble'] }</p>
                  <p hidden={ !this.state.errorMessages['fields']['baseError'] }>{this.state.baseErrorMessage}</p>
                </Alert>
          		</Col>
          	</Row>
            <Row>
            	<Col xs="12">
            			{
            				this.props.stage === 'registration' && !this.state.registrationConfirm
            				?
            				<div className="box">
	            				<RegistrationScreen
			            			lang={ this.props.lang }
			            			handleSend={ this.handleSend }
			            			errorMessages={ this.state.errorMessages}
			            		/>
			            	</div>
		            		:
		            		this.props.stage === 'registration' && this.state.registrationConfirm
		            		?
		            		<div className="regConfirmation">
		            			<div className="middle">
		            				<h3>{ this.state.dictionary['userLoginRegConfirmTitle'] }</h3>
		            				<p>{ this.state.dictionary['userLoginRegConfirmDescription'] }</p>
		            				<p>{ this.state.dictionary['userLoginRegConfirmEmail'] }</p>
		            			</div>
		            			
		            		</div>
		            		:
		            		<div className="box">
			            		<LoginScreen
			            			lang={ this.props.lang }
			            			handleSend={ this.handleSend }
			            			errorMessages={ this.state.errorMessages}
			            		/>
		            		</div>
            			}
            	</Col>
            </Row>

            <Row>
            	<Col xs="12">
            		<div className="middle logLinks">
            			{
            				this.props.stage === 'registration' && !this.state.registrationConfirm
            				?
            				<p >{ this.state.dictionary['userLoginLinksReg_1'] }<a id="regRedirection" onClick={() => this.props.changeStage('login')}>{ this.state.dictionary['userLoginLinksReg_2'] }</a>{this.state.dictionary['partnerLogThank']}</p>
		            		:
		            		this.props.stage === 'login'
		            		?
		            		<p>{ this.state.dictionary['userLoginLinksLog_1'] }<a id="loginRedirection" onClick={() => this.props.changeStage('registration')}>{ this.state.dictionary['userLoginLinksLog_2'] }</a>{this.state.dictionary['partnerLogThank']}</p>
		            		:
		            		null
            			}
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

  userRegistrateStart: state.UserReducer.userRegistrateStart,
  userRegistrateError: state.UserReducer.userRegistrateError,
  userRegistrateSuccess: state.UserReducer.userRegistrateSuccess,

  userLoginStart: state.UserReducer.userLoginStart,
  userLoginError: state.UserReducer.userLoginError,
  userLoginSuccess: state.UserReducer.userLoginSuccess,
});


const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setUserLanguage,
    changeSingleUserField,
    registrateUser,
    loginUser,
  },
  dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(UserLoginView)