import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PlainInput from '../components/form/input';
import Loader from '../components/loader';
import Select from 'react-select';
import { Container, Row, Col, Button, Alert } from 'reactstrap';
import { setUserLanguage } from '../actions/user-actions';
import { registratePartner, loginPartner, changeSinglePartnerField } from '../actions/partner-actions';
import { getLanguage } from '../lib/language';
import { isMobile, setCookie } from '../lib/helpers/generalFunctions';
import { isEmail, isNumeric, isEmpty, isPib, isPhoneNumber, isInputValueMalicious } from '../lib/helpers/validations';
import NavigationBar from '../components/navigation/navbar';
import Footer from '../components/navigation/footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface MyProps {
  // using `interface` is also ok
  userLanguage: string;
  router: any;
  setUserLanguage(language: string): string;
  registratePartner(data: object): any;
  loginPartner(data: object): any;
  changeSinglePartnerField(field: string, value: any): any;
  userAgent: string;
  path: string;
  fullPath: string;
  lang: string;
  page: string;
  error: boolean;
  link: object;
  partnerRegStart: boolean;
  partnerRegError: object;
  partnerRegSuccess: any;
  partnerLoginStart: boolean;
  partnerLoginError: object | boolean;
  partnerLoginSuccess: null | object;
};

interface MyState {
	language: string;
	dictionary: object;
	isMobile: boolean;
  baseErrorMessage: string;
  name: string;
  taxNum: null | number;
  city: string | object;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  logTax: null | number;
  logPass: string;
  errorMessages: object;
  regBtnDisabled: boolean;
};

class PartnershipLoginView extends React.Component <MyProps, MyState>{

  constructor(props){
    super(props);

    this.componentObjectBinding = this.componentObjectBinding.bind(this);

    const bindingFunctions = ['handleRegistration', 'handleLogin', 'handleInputChange', 'handleNameChange', 'handleTaxChange', 'handleCityChange', 'handlePersonChange', 'handleEmailChange', 'handlePhoneChange', 'validateFormData', 'handlelogTaxChange', 'handleLogPassChange', 'closeAlert', 'sendRegistrationData', 'sendLoginData'];
    this.componentObjectBinding(bindingFunctions);
  }

  componentObjectBinding(array){
    array.map( item => {
      this[item] = this[item].bind(this);
    })
  }

	state: MyState = {
      language: this.props.lang.toUpperCase(),
      dictionary: getLanguage(this.props.lang),
      isMobile: isMobile(this.props.userAgent),
      baseErrorMessage: '',
      name: '',
      taxNum: null,
      city: '',
      contactPerson: '',
      contactEmail: '',
      contactPhone: '',
      logTax: null,
      logPass: '',
      errorMessages: { show: false, fields: {name: false, taxNum: false, city: false, contactPerson: false, contactEmail: false, contactPhone: false, logTax: false,  logPass: false, regDuplicate: false, baseError: false }},
      regBtnDisabled: false,
    };

  shouldComponentUpdate(nextProps: MyProps, nextState:  MyState){
    return true;
  }

  getSnapshotBeforeUpdate(prevProps: MyProps, prevState:  MyState){
    return null;
  }

  componentDidUpdate(prevProps: MyProps, prevState:  MyState){

      if (this.props.partnerLoginError && !prevProps.partnerLoginError && !this.props.partnerLoginStart) {
        const errorCopy = JSON.parse(JSON.stringify(this.state.errorMessages));
        errorCopy['show'] = true;
        errorCopy['fields']['baseError'] = true;
        this.setState({regBtnDisabled: false, errorMessages: errorCopy, baseErrorMessage: this.props.partnerLoginError['message'] });
      }

      if (this.props.partnerLoginSuccess && !prevProps.partnerLoginSuccess && !this.props.partnerLoginStart) {
        setCookie(this.props.partnerLoginSuccess['token'],'trilino-partner-token', 10);
        window.location.href = `${this.props.link["protocol"]}${this.props.link["host"]}/partnerProfile?language=${this.props.lang}`;
      }

      if (this.props.partnerRegSuccess && !prevProps.partnerRegSuccess) {
        this.props.router.push(`/confirm?language=${this.props.lang}&page=partner_registration`)
      }
      if ((this.props.partnerRegError['code'] && !prevProps.partnerRegError['code']) ) {
        this.setState({ regBtnDisabled: false });
      }
      if (this.props.partnerRegError['code'] === 2 && prevProps.partnerRegError['code'] !== 2) {
        const errorCopy = JSON.parse(JSON.stringify(this.state.errorMessages));
        errorCopy['show'] = true;
        errorCopy['fields']['regDuplicate'] = true;
        this.setState({ errorMessages: errorCopy });
      }
  }

	componentDidMount(){
    if (this.props.error) {
      this.props.router.push(`/partnershipLogin?language=${this.props.lang}&page=error`);
    }
		this.props.setUserLanguage(this.props.lang);
	}

  validateFormData(callback){
    const errorCopy = JSON.parse(JSON.stringify(this.state.errorMessages))
    if (this.props.page === 'register') {
      if (isEmpty(this.state.name) || isInputValueMalicious(this.state.name)) {
        errorCopy['fields']['name'] = true;
      }else{
        errorCopy['fields']['name'] = false;
      }
      if (!isPib(this.state.taxNum, 'sr')) {
        errorCopy['fields']['taxNum'] = true;
      }else{
        errorCopy['fields']['taxNum'] = false;
      }
      if (isEmpty(this.state.city) || isInputValueMalicious(this.state.city)) {
        errorCopy['fields']['city'] = true;
      }else{
        errorCopy['fields']['city'] = false;
      }
      if (isEmpty(this.state.contactPerson) || isInputValueMalicious(this.state.contactPerson)) {
        errorCopy['fields']['contactPerson'] = true;
      }else{
        errorCopy['fields']['contactPerson'] = false;
      }
      if (!isEmail(this.state.contactEmail)) {
        errorCopy['fields']['contactEmail'] = true;
      }else{
        errorCopy['fields']['contactEmail'] = false;
      }
      if (!isPhoneNumber(this.state.contactPhone, 'sr')) {
        errorCopy['fields']['contactPhone'] = true;
      }else{
        errorCopy['fields']['contactPhone'] = false;
      }

      errorCopy['fields']['regDuplicate'] = false;
    }

    if (this.props.page === 'login') {
      this.props.changeSinglePartnerField('partnerLoginError', false);
      if (isEmpty(this.state.logPass)) {
        errorCopy['fields']['logPass'] = true;
      }else{
        errorCopy['fields']['logPass'] = false;
      }
      if (!isPib(this.state.logTax, 'sr')) {
        errorCopy['fields']['logTax'] = true;
      }else{
        errorCopy['fields']['logTax'] = false;
      }

      errorCopy['fields']['baseError'] = false;
    }

    let showVal = false;

    Object.keys(errorCopy.fields).forEach((key) => {
      if (errorCopy.fields[key] === true) {
        showVal = true;
      }
    })
    errorCopy['show'] = showVal;
    this.setState({errorMessages: errorCopy, baseErrorMessage: ''}, () => {
      callback();
    });
  }

  sendLoginData(){
     if (!this.state.errorMessages['show']) {
       this.setState({ regBtnDisabled: true }, () => {
         const data = {
          taxNum: this.state.logTax,
          password: this.state.logPass,
        }
        this.props.loginPartner(data);
      })
     }
   }

  handleLogin(){
    this.validateFormData(this.sendLoginData);
  }

   sendRegistrationData(){
     if (!this.state.errorMessages['show']) {
       this.setState({ regBtnDisabled: true }, () => {
         const data = {
          name: this.state.name,
          taxNum: this.state.taxNum,
          city: this.state.city['value'] ? this.state.city['value'] : '',
          contactPerson: this.state.contactPerson,
          contactEmail: this.state.contactEmail,
          contactPhone: this.state.contactPhone,

        }
        this.props.registratePartner(data);
      })
     }
   }

  handleRegistration(){
    this.validateFormData(this.sendRegistrationData);
    
  }

  handleInputChange(field, value){
     this.setState(prevState => ({
      ...prevState,
      [field]: value // No error here, but can't ensure that key is in StateKeys
    }));
  }

  handleNameChange(event){
    this.handleInputChange('name', event.target.value);
  }
  handleTaxChange(event){
    this.handleInputChange('taxNum', event.target.value);
  }
  handleCityChange(value){
    this.handleInputChange('city', value);
  }
  handlePersonChange(event){
    this.handleInputChange('contactPerson', event.target.value);
  }
  handleEmailChange(event){
    this.handleInputChange('contactEmail', event.target.value);
  }
  handlePhoneChange(event){
    this.handleInputChange('contactPhone', event.target.value);
  }
  handlelogTaxChange(event){
    this.handleInputChange('logTax', event.target.value);
  }
  handleLogPassChange(event){
    this.handleInputChange('logPass', event.target.value);
  }

  closeAlert(){
    const errorCopy = JSON.parse(JSON.stringify(this.state.errorMessages));
    errorCopy['show'] = false;
    this.setState({errorMessages: errorCopy});
  }
	
  render() {

  	const options = [
      { value: '1', label: 'Beograd' },
      { value: '2', label: 'Novi sad' },
      { value: '3', label: 'Niš' }
    ];

    return(
    	<div className="totalWrapper">
        <Loader  show={ this.state.regBtnDisabled } />
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
    		/>
    		
    			{this.props.page === 'register'
    			?
    			<div className="registrationWrapper">
    				<Container>
    					<Row>
			              <Col xs='12'>
                      <Alert color="danger" isOpen={ this.state.errorMessages["show"] } toggle={this.closeAlert} >
                        <p hidden={ !this.state.errorMessages['fields']['name']} >{ this.state.dictionary['partnerRegAlertName'] }</p>
                        <p hidden={ !this.state.errorMessages['fields']['taxNum']} >{ this.state.dictionary['partnerRegAlertTax'] }</p>
                        <p hidden={ !this.state.errorMessages['fields']['city']} >{ this.state.dictionary['partnerRegAlertCity'] }</p>
                        <p hidden={ !this.state.errorMessages['fields']['contactPerson']} >{ this.state.dictionary['partnerRegAlertPerson'] }</p>
                        <p hidden={ !this.state.errorMessages['fields']['contactEmail']} >{ this.state.dictionary['partnerRegAlertEmail'] }</p>
                        <p hidden={ !this.state.errorMessages['fields']['contactPhone']} >{ this.state.dictionary['partnerRegAlertPhone'] }</p>
                        <p hidden={ !this.state.errorMessages['fields']['regDuplicate'] }>{ this.state.dictionary['partnerRegAlertDuplicate'] }</p>
                      </Alert>
			              	<div className="box">
			              		<h2>{this.state.dictionary['partnerRegTitle']}</h2>
			              		<p>{this.state.dictionary['partnerRegExplanation']}</p>
          							<PlainInput 
                          placeholder={ this.state.dictionary['partnerRegName'] } 
                          onChange={this.handleNameChange} 
                          value={this.state.name} 
                          className={`${this.state.errorMessages['fields']['name'] ? "borderWarrning" : ''} logInput`} />

          							<PlainInput 
                          placeholder={ this.state.dictionary['partnerRegTax'] } 
                          onChange={this.handleTaxChange} 
                          value={this.state.taxNum} 
                          className={`${this.state.errorMessages['fields']['taxNum'] ? "borderWarrning" : ''} logInput`} />

          							<Select 
                          options={options} 
                          value={ this.state.city } 
                          onChange={this.handleCityChange} 
                          instanceId="homeCity" 
                          className="logInput" 
                          styles={{ container: (provided, state) => ({ ...provided, border: this.state.errorMessages['fields']['city'] ? "1px solid red" : "#ccc" })}}
                          placeholder={ this.state.dictionary['uniCity'] }/>

          							<PlainInput 
                          placeholder={ this.state.dictionary['partnerRegContactPerson'] } 
                          onChange={this.handlePersonChange} 
                          value={this.state.contactPerson} 
                          className={`${this.state.errorMessages['fields']['contactPerson'] ? "borderWarrning" : ''} logInput`} />

          							<PlainInput 
                          placeholder={ this.state.dictionary['partnerRegContactEmail'] } 
                          onChange={this.handleEmailChange} 
                          value={this.state.contactEmail} 
                          className={`${this.state.errorMessages['fields']['contactEmail'] ? "borderWarrning" : ''} logInput`}
                          type="email" />

          							<PlainInput 
                          placeholder={ this.state.dictionary['partnerRegContactPhone'] } 
                          onChange={this.handlePhoneChange} 
                          value={this.state.contactPhone} 
                          className={`${this.state.errorMessages['fields']['contactPhone'] ? "borderWarrning" : ''} logInput`} 
                          type="tel" />

    							<div className="middle marginSmall">
    								<a href="/">{this.state.dictionary['uniTerms']}</a>
    							</div>

    							<div className="middle">
    								<Button color="success" disabled={ this.state.regBtnDisabled } onClick={this.handleRegistration} >{this.state.dictionary['uniRegister']}</Button>
    							</div>

    							
			              	</div>
			              	<div className="middle">
			              		<p>{this.state.dictionary['partnerRegFinalWarning']} <a id="loginRedirection" href={`/partnershipLogin?language=${this.props.lang}&page=login`}>{this.state.dictionary['uniLogin']}</a>{this.state.dictionary['partnerLogThank']}</p>
			              		
			              	</div>
			              </Col>
			            </Row>
    				</Container>
    				
    			</div> 
    			: null
    			}

    			{this.props.page === 'login'
    			?
    			<div className="registrationWrapper">
    				<Container>
    					<Row>
			              <Col xs='12'>
                      <Alert color="danger" isOpen={ this.state.errorMessages["show"] } toggle={this.closeAlert} >
                        <p hidden={ !this.state.errorMessages['fields']['logTax']} >{ this.state.dictionary['partnerRegAlertTax'] }</p>
                        <p hidden={ !this.state.errorMessages['fields']['logPass']} >{ this.state.dictionary['partnerLogAlertPass'] }</p>
                        <p hidden={ !this.state.errorMessages['fields']['baseError']} >{this.state.baseErrorMessage}</p>
                      </Alert>
			              	<div className="box">
			              		<h2>{this.state.dictionary['partnerLogTitle']}</h2>
			              		<p>{this.state.dictionary['partnerLogExplanation']}</p>
          							<PlainInput 
                          placeholder={this.state.dictionary['partnerRegTax']} 
                          className={`${this.state.errorMessages['fields']['logTax'] ? "borderWarrning" : ''} logInput`} 
                          onChange={this.handlelogTaxChange} 
                          value={this.state.logTax}
                          type="text" />

          							<PlainInput 
                          placeholder={this.state.dictionary['uniPass']} 
                          className={`${this.state.errorMessages['fields']['logPass'] ? "borderWarrning" : ''} logInput`} 
                          onChange={this.handleLogPassChange} 
                          value={this.state.logPass}
                          type="password"
                          max={ 22 } />

    							<div className="middle marginSmall">
    								<a href="/">{this.state.dictionary['uniForgotPass']}</a>
    							</div>

    							<div className="middle">
    								<Button color="success" disabled={ this.state.regBtnDisabled } onClick={this.handleLogin} >{this.state.dictionary['uniLogin']}</Button>
    							</div>

    							
			              	</div>
			              	<div className="middle">
			              		<p>{this.state.dictionary['partnerLogFinalWarning']}<a id="registrationRedirection" href={`/partnershipLogin?language=${this.props.lang}&page=register`}>{this.state.dictionary['uniRegister']}</a>{this.state.dictionary['partnerLogThank']}</p>
			              		
			              	</div>
			              	
			              </Col>
			            </Row>
    				</Container>
    				
    			</div> 
    			: null
    			}

          {
            this.props.page === 'error' 
            ? 
            (
              <div className="confirmRegistration">
                <Row>
                  <Col xs='12'>
                    <h2 className="middle">Error</h2>
                    <p className="middle">You are trying to reach page that does not exist. Please go back or go to Home page.</p>
                  </Col>
                </Row>
              </div>
            ) : null
          }

		    <Footer 
    			isMobile={ this.state.isMobile } 
    			language={ this.state.language } 
    			page={ this.props.path ? this.props.path : '' }
    			contact={ this.state.dictionary['navigationContact'] }
    			login={ this.state.dictionary['navigationLogin'] }
    			search={ this.state.dictionary['navigationSearch'] }
    			partnership={ this.state.dictionary['navigationPartnership'] }
    			faq={ this.state.dictionary['navigationFaq'] }
    		/>

    	</div>
    	
    ) 
  }
}

const mapStateToProps = (state) => ({
  userLanguage: state.UserReducer.language,

  partnerRegStart: state.PartnerReducer.partnerRegStart,
  partnerRegError: state.PartnerReducer.partnerRegError,
  partnerRegSuccess: state.PartnerReducer.partnerRegSuccess,

  partnerLoginStart: state.PartnerReducer.partnerLoginStart,
  partnerLoginError: state.PartnerReducer.partnerLoginError,
  partnerLoginSuccess: state.PartnerReducer.partnerLoginSuccess,

});


const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setUserLanguage,
    registratePartner,
    loginPartner,
    changeSinglePartnerField,
  },
  dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(PartnershipLoginView)