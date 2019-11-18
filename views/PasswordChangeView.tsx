import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from '../components/loader';
import PlainInput from '../components/form/input';
import { Container, Row, Col, Button, Alert } from 'reactstrap';
import { setUserLanguage } from '../actions/user-actions';
import { changePasswordRequestPartner, changeSinglePartnerField } from '../actions/partner-actions';
import { getLanguage } from '../lib/language';
import { isMobile, setUpLinkBasic } from '../lib/helpers/generalFunctions';
import { isEmpty, isPib, isEmail } from '../lib/helpers/validations';
import NavigationBar from '../components/navigation/navbar';
import Footer from '../components/navigation/footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface MyProps {
  // using `interface` is also ok
  userLanguage: string;
  page: string;
  changeSinglePartnerField(field: string, value: any): any;
  changePasswordRequestPartner(param: string, data: object, link: object): object;
  setUserLanguage(language: string): string;
  partnerPassChangeRequestStart: boolean;
  partnerPassChangeRequestError: boolean | object;
  partnerPassChangeRequestSuccess: null | object;
  userAgent: string;
  path: string;
  fullPath: string;
  lang: string;
  verifyObject: object;
  error: boolean;
};
interface MyState {
	language: string;
	dictionary: object;
	isMobile: boolean;
	baseErrorMessage: string;
  loader: boolean;
  update: boolean;
  taxNum: number | null;
  email: string;
  errorMessages: object;
};

class EmailVerificationView extends React.Component <MyProps, MyState>{

	constructor(props){
    super(props);

    this.componentObjectBinding = this.componentObjectBinding.bind(this);

    const bindingFunctions = ['handleInputChange', 'handleTaxnumChange', 'handleEmailChange', 'sendPass', 'validatePassData', 'closeAlert', 'handleSavePassword' ];
    this.componentObjectBinding(bindingFunctions);
  }

	state: MyState = {
    language: this.props.lang.toUpperCase(),
    dictionary: getLanguage(this.props.lang),
    isMobile: isMobile(this.props.userAgent),
    baseErrorMessage: '',
    loader: false,
    update: false,
    taxNum: null,
		email: '',
    errorMessages: { show: false, fields: {taxNum: false, email: false, base: false }}
  };

  componentObjectBinding(array){
    array.map( item => {
      this[item] = this[item].bind(this);
    })
  }

  handleInputChange(field, value){
     this.setState(prevState => ({
      ...prevState,
      [field]: value // No error here, but can't ensure that key is in StateKeys
    }));
  }

  handleTaxnumChange(event){
    this.handleInputChange('taxNum', event.target.value);
  }
  handleEmailChange(event){
    this.handleInputChange('email', event.target.value);
  }

  closeAlert(){
    const errorCopy = JSON.parse(JSON.stringify(this.state.errorMessages));
    errorCopy['show'] = false;
    this.setState({errorMessages: errorCopy});
  }

  validatePassData(callback){
  	this.props.changeSinglePartnerField('partnerPassChangeRequestError', false);
  	const errorCopy = JSON.parse(JSON.stringify(this.state.errorMessages));

  	if (isEmpty(this.state.email) || !isEmail(this.state.email)) {
  		errorCopy['fields']['email'] = true;
  	}else{
  		errorCopy['fields']['email'] = false;
  	}

  	if (isEmpty(this.state.taxNum) || !isPib(this.state.taxNum, 'sr')) {
  		errorCopy['fields']['taxNum'] = true;
  	}else{
  		errorCopy['fields']['taxNum'] = false;
  	}

  	errorCopy['fields']['base'] = false;

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

  sendPass(){
  	if (!this.state.errorMessages['show']) {
  		this.setState({ loader: true }, () => {
        const link = setUpLinkBasic(window.location.href);
	  		const data = {
	  			taxNum: this.state.taxNum,
	  			email: this.state.email,
          language: this.props.lang,
		  	}
	  		this.props.changePasswordRequestPartner('_id', data, link);
	  	});
  	}
  }

  handleSavePassword(){
  	this.validatePassData(this.sendPass);
  }

  componentDidUpdate(prevProps: MyProps, prevState:  MyState){
    if (this.props.partnerPassChangeRequestSuccess && !prevProps.partnerPassChangeRequestSuccess && !this.props.partnerPassChangeRequestStart) {
    	this.setState({loader: false, update: true });
    }

    if (!this.props.partnerPassChangeRequestStart && this.props.partnerPassChangeRequestError && !prevProps.partnerPassChangeRequestError) {
    	const errorCopy = JSON.parse(JSON.stringify(this.state.errorMessages));
    	errorCopy['show'] = true;
    	errorCopy['fields']['base'] = true;
    	this.setState({loader: false, errorMessages: errorCopy, baseErrorMessage: this.props.partnerPassChangeRequestError['message'] });
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
    		/>
    		<div className="registrationWrapper">
    				<Container>
    				{
    					(!this.props.error && !this.state.update && this.props.page === 'partner') 
    					?
    					(
    						<Row>
		              <Col xs='12'>
	                  <Alert color="danger" isOpen={ this.state.errorMessages["show"] } toggle={this.closeAlert}  >
	                  	<p hidden={ !this.state.errorMessages['fields']['base'] } >{this.state.baseErrorMessage}</p>
	                  	<p hidden={ !this.state.errorMessages['fields']['taxNum'] } >{this.state.dictionary['partnerRegAlertTax']}</p>
	                  	<p hidden={ !this.state.errorMessages['fields']['email'] } >{this.state.dictionary['partnerRegAlertEmail']}</p>
	                  </Alert>
		              	<div className="box">
		              		<h2>{this.state.dictionary['passwordRequestTitle']}</h2>
		              		<p className="small">{this.state.dictionary['passwordRequestExplanation']}</p>
		              		<PlainInput 
	                      placeholder={this.state.dictionary['partnerRegTax']}
	                      className={`${this.state.errorMessages['fields']['taxNum'] ? "borderWarrning" : ''} logInput`} 
	                      onChange={this.handleTaxnumChange} 
	                      value={this.state.taxNum}
	                      type="text" />

	      							<PlainInput 
	                      placeholder={this.state.dictionary['partnerRegContactEmail']} 
	                      className={`${this.state.errorMessages['fields']['email'] ? "borderWarrning" : ''} logInput`} 
	                      onChange={this.handleEmailChange} 
	                      value={this.state.email}
	                      type="email" />

											<div className="middle">
												<Button color="success" onClick={this.handleSavePassword} >{this.state.dictionary['uniSend']}</Button>
											</div>

		              	</div>

		              </Col>
		            </Row>
    					)
    					: 
    					(!this.props.error && this.state.update) 
    					? 
    					(
                <div className="confirmRegistration">
                  <Row>
                    <Col xs='12'>
                      <h2 className="middle">{this.state.dictionary['passwordUpdateRequestTitle']}</h2>
                      <p className="middle">{this.state.dictionary['passwordUpdateRequestExplanation']}</p>
                    </Col>
                  </Row>
                </div>
              )
              :
              this.props.error 
              ? 
              (
                <div className="confirmRegistration">
                  <Row>
                    <Col xs='12'>
                      <h2 className="middle">{this.state.dictionary['emailVerificationPartnerErrorTitle']}</h2>
                      <p className="middle">{this.state.dictionary['passwordUpdateRequestError']}</p>
                    </Col>
                  </Row>
                </div>
              ) 
              : 
              null
    				}
    					
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
    		/>

    	</div>
    	
    ) 
  }
}

const mapStateToProps = (state) => ({
  userLanguage: state.UserReducer.language,

  partnerPassChangeRequestStart: state.PartnerReducer.partnerPassChangeRequestStart,
  partnerPassChangeRequestError: state.PartnerReducer.partnerPassChangeRequestError,
  partnerPassChangeRequestSuccess: state.PartnerReducer.partnerPassChangeRequestSuccess,

});


const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setUserLanguage,
    changePasswordRequestPartner,
    changeSinglePartnerField,
  },
  dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(EmailVerificationView)