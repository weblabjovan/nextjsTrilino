import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from '../components/loader';
import PlainInput from '../components/form/input';
import { Container, Row, Col, Button, Alert } from 'reactstrap';
import { setUserLanguage } from '../actions/user-actions';
import { changePasswordPartner, changeSinglePartnerField } from '../actions/partner-actions';
import { getLanguage } from '../lib/language';
import { isMobile } from '../lib/helpers/generalFunctions';
import { isEmpty, isMoreThan, isLessThan, isOfRightCharacter, isMatch } from '../lib/helpers/validations';
import NavigationBar from '../components/navigation/navbar';
import Footer from '../components/navigation/footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface MyProps {
  // using `interface` is also ok
  userLanguage: string;
  page: string;
  changeSinglePartnerField(field: string, value: any): any;
  changePasswordPartner(param: string, data: object): object;
  setUserLanguage(language: string): string;
  partnerPassChangeStart: boolean;
  partnerPassChangeError: boolean | object;
  partnerPassChangeSuccess: null | object;
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
  code: string;
  password: string;
  confirmation: string;
  errorMessages: object;
};

class EmailVerificationView extends React.Component <MyProps, MyState>{

	constructor(props){
    super(props);

    this.componentObjectBinding = this.componentObjectBinding.bind(this);

    const bindingFunctions = ['handleInputChange', 'handlePassChange', 'handleConfirmChange', 'handleCodeChange', 'sendPass', 'validatePassData', 'closeAlert', 'handleSavePassword' ];
    this.componentObjectBinding(bindingFunctions);
  }

	state: MyState = {
    language: this.props.lang.toUpperCase(),
    dictionary: getLanguage(this.props.lang),
    isMobile: isMobile(this.props.userAgent),
    baseErrorMessage: '',
    loader: false,
    update: false,
    code: '',
    password: '',
		confirmation: '',
    errorMessages: { show: false, fields: {pass: false, confirm: false, code: false, base: false }}
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

  handlePassChange(event){
    this.handleInputChange('password', event.target.value);
  }
  handleConfirmChange(event){
    this.handleInputChange('confirmation', event.target.value);
  }
  handleCodeChange(event){
    this.handleInputChange('code', event.target.value);
  }

  closeAlert(){
    const errorCopy = JSON.parse(JSON.stringify(this.state.errorMessages));
    errorCopy['show'] = false;
    this.setState({errorMessages: errorCopy});
  }

  validatePassData(callback){
  	this.props.changeSinglePartnerField('partnerPassChangeError', false);
  	const errorCopy = JSON.parse(JSON.stringify(this.state.errorMessages));

  	if (isEmpty(this.state.password) || !isMoreThan(this.state.password, 7) || !isLessThan(this.state.password, 17) || !isOfRightCharacter(this.state.password)) {
  		errorCopy['fields']['pass'] = true;
  	}else{
  		errorCopy['fields']['pass'] = false;
  	}

  	if(isEmpty(this.state.confirmation) || !isMatch(this.state.password, this.state.confirmation)){
  		errorCopy['fields']['confirm'] = true;
  	}else{
  		errorCopy['fields']['confirm'] = false;
  	}

  	if (isEmpty(this.state.code)) {
  		errorCopy['fields']['code'] = true;
  	}else{
  		errorCopy['fields']['code'] = false;
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
	  		const data = {
		  		id: this.props.page,
		  		code: this.state.code,
			    password: this.state.password,
					confirmation: this.state.confirmation,
		  	}
	  		this.props.changePasswordPartner('_id', data)
	  	});
  	}
  }

  handleSavePassword(){
  	this.validatePassData(this.sendPass);
  }

  componentDidUpdate(prevProps: MyProps, prevState:  MyState){
    if (this.props.partnerPassChangeSuccess && !prevProps.partnerPassChangeSuccess && !this.props.partnerPassChangeStart) {
    	this.setState({loader: false, update: true });
    }

    if (!this.props.partnerPassChangeStart && this.props.partnerPassChangeError && !prevProps.partnerPassChangeError) {
    	const errorCopy = JSON.parse(JSON.stringify(this.state.errorMessages));
    	errorCopy['show'] = true;
    	errorCopy['fields']['base'] = true;
    	this.setState({loader: false, errorMessages: errorCopy, baseErrorMessage: this.props.partnerPassChangeError['message'] });
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
    					(!this.props.error && !this.state.update) 
    					?
    					(
    						<Row>
		              <Col xs='12'>
	                  <Alert color="danger" isOpen={ this.state.errorMessages["show"] } toggle={this.closeAlert}  >
	                  	<p hidden={ !this.state.errorMessages['fields']['base'] } >{this.state.baseErrorMessage}</p>
	                  	<p hidden={ !this.state.errorMessages['fields']['code'] } >{this.state.dictionary['passwordAlertCode']}</p>
	                    <p hidden={ !this.state.errorMessages['fields']['pass'] } >{this.state.dictionary['passwordAlertPass']}.</p>
	                    <p hidden={ !this.state.errorMessages['fields']['confirm'] } >{this.state.dictionary['passwordAlertConfirm']}</p>
	                  </Alert>
		              	<div className="box">
		              		<h2>{this.state.dictionary['passwordTitle']}</h2>
		              		<p className="small">{this.state.dictionary['passwordExplanation']}</p>
		              		<PlainInput 
	                      placeholder={this.state.dictionary['uniSafetyCode']} 
	                      className={`${this.state.errorMessages['fields']['code'] ? "borderWarrning" : ''} logInput`} 
	                      onChange={this.handleCodeChange} 
	                      value={this.state.code}
	                      type="text"
	                      max={ 16 } />
	      							<PlainInput 
	                      placeholder={this.state.dictionary['uniPass']} 
	                      className={`${this.state.errorMessages['fields']['pass'] ? "borderWarrning" : ''} logInput`} 
	                      onChange={this.handlePassChange} 
	                      value={this.state.password}
	                      type="password"
	                      max={ 16 } />

	      							<PlainInput 
	                      placeholder={this.state.dictionary['uniConfirmPass']} 
	                      className={`${this.state.errorMessages['fields']['confirm'] ? "borderWarrning" : ''} logInput`} 
	                      onChange={this.handleConfirmChange} 
	                      value={this.state.confirmation}
	                      type="password"
	                      max={ 16 } />

											<div className="middle">
												<Button color="success" onClick={this.handleSavePassword} >{this.state.dictionary['uniSave']}</Button>
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
                      <h2 className="middle">{this.state.dictionary['passwordUpdateTitle']}</h2>
                      <p className="middle">{this.state.dictionary['passwordUpdateExplanation']}</p>
                      <div className="middle">
                        <Button color="success" href={`/partnershipLogin?language=${this.props.lang}&page=login`} >{this.state.dictionary['emailVerificationPartnerLogButton']}</Button>
                      </div>
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
                      <p className="middle">{this.state.dictionary['emailValidationPartnerErrorArticle']}</p>
                      <div className="middle">
                        <Button color="success" >{this.state.dictionary['emailVerificationPartnerErrorButton']}</Button>
                      </div>
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

  partnerPassChangeStart: state.PartnerReducer.partnerPassChangeStart,
  partnerPassChangeError: state.PartnerReducer.partnerPassChangeError,
  partnerPassChangeSuccess: state.PartnerReducer.partnerPassChangeSuccess,

});


const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setUserLanguage,
    changePasswordPartner,
    changeSinglePartnerField,
  },
  dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(EmailVerificationView)