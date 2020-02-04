import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col, Button, Alert } from 'reactstrap';
import PlainInput from '../components/form/input';
import { setUserLanguage } from '../actions/user-actions';
import { adminLogin } from '../actions/admin-actions';
import { getLanguage } from '../lib/language';
import { isMobile, setUpLinkBasic, setCookie } from '../lib/helpers/generalFunctions';
import { isEmpty } from '../lib/helpers/validations';
import NavigationBar from '../components/navigation/navbar';
import Footer from '../components/navigation/footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface MyProps {
  // using `interface` is also ok
  userLanguage: string;
  adminLoginStart: boolean;
  adminLoginError: object | boolean;
  adminLoginSuccess: null | object;
  adminLogin(link: object, data: object): void;
  setUserDevice(userAgent: string): boolean;
  setUserLanguage(language: string): string;
  link: object;
  userAgent: string;
  path: string;
  fullPath: string;
  lang: string;
};
interface MyState {
	language: string;
	dictionary: object;
	isMobile: boolean;
	user: string;
	pass: string;
	errorMessages: object;
  loginTry: number;
};

class AdminLoginView extends React.Component <MyProps, MyState>{

	constructor(props){
    super(props);

    this.componentObjectBinding = this.componentObjectBinding.bind(this);

    const bindingFunctions = ['closeAlert', 'handleLogin', 'handleInputChange', 'handleLogin', 'sendLoginData', 'validateFormData'];
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
    user: '',
    pass: '',
    errorMessages: { show: false, fields: {user: false, pass: false }},
    loginTry: 0,
  };

  handleInputChange(field, value){
     this.setState(prevState => ({
      ...prevState,
      [field]: value // No error here, but can't ensure that key is in StateKeys
    }));
  }

  validateFormData(callback){
    const errorCopy = JSON.parse(JSON.stringify(this.state.errorMessages));

    if (isEmpty(this.state.user)) {
      errorCopy['fields']['user'] = true;
    }else{
      errorCopy['fields']['user'] = false;
    }
    if (isEmpty(this.state.pass)) {
      errorCopy['fields']['pass'] = true;
    }else{
      errorCopy['fields']['pass'] = false;
    }

    let showVal = false;

    Object.keys(errorCopy.fields).forEach((key) => {
      if (errorCopy.fields[key] === true) {
        showVal = true;
      }
    })
    errorCopy['show'] = showVal;

    this.setState({ errorMessages: errorCopy }, () => {
      callback();
    });
  }

  sendLoginData(){
  	if (!this.state.errorMessages['show']) {
  		const link = setUpLinkBasic(window.location.href);
  		const data = { user: this.state.user, pass: this.state.pass };
  		this.props.adminLogin(link, data);
  	}
  }

  handleLogin(){
  	this.validateFormData(this.sendLoginData);
  }

  closeAlert(){
    const errorCopy = JSON.parse(JSON.stringify(this.state.errorMessages));
    errorCopy['show'] = false;
    this.setState({errorMessages: errorCopy});
  }

  componentDidUpdate(prevProps: MyProps, prevState:  MyState){

    if (this.state.loginTry > 9) {
      window.location.href = `${this.props.link["protocol"]}${this.props.link["host"]}?language=${this.props.lang}`;
    }

    if (this.props.adminLoginError && !prevProps.adminLoginError && !this.props.adminLoginStart) {
      const loginTry = this.state.loginTry + 1;
      this.setState({ loginTry });
    }
  	if (this.props.adminLoginSuccess && !this.props.adminLoginStart && prevProps.adminLoginStart) {
  		setCookie(this.props.adminLoginSuccess['token'],'trilino-admin-token', 7);
      window.location.href = `${this.props.link["protocol"]}${this.props.link["host"]}/adminPanel?language=${this.props.lang}`;
  	}
  }

	componentDidMount(){
		this.props.setUserLanguage(this.props.lang);
	}
	
  render() {
    return(
    	<div className="totalWrapper">
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
  					<Row>
              <Col xs='12'>
                <Alert color="danger" isOpen={ this.state.errorMessages["show"] } toggle={this.closeAlert} >
                  <p hidden={ !this.state.errorMessages['fields']['user']} >Admin polje je obavezno, molimo vas upišite ime admina.</p>
                  <p hidden={ !this.state.errorMessages['fields']['pass']} >Pass polje je obavezno, molimo vas upišite admin lozinku.</p>
                </Alert>
              	<div className="box">
              		<h2>Admin prijava / Admin login</h2>
              		<p>Isključivo za administratore / Only for administrators</p>
    							<PlainInput 
                    placeholder="Admin" 
                    className={`${this.state.errorMessages['fields']['user'] ? "borderWarrning" : ''} logInput`} 
                    onChange={ (event) => { this.handleInputChange('user', event.target.value) } } 
                    value={this.state.user}
                    type="text" />

    							<PlainInput 
                    placeholder="Pass" 
                    className={`${this.state.errorMessages['fields']['pass'] ? "borderWarrning" : ''} logInput`} 
                    onChange={ (event) => { this.handleInputChange('pass', event.target.value) } } 
                    value={this.state.pass}
                    type="password" />

	  							<div className="middle">
	  								<Button color="success" onClick={this.handleLogin} >{this.state.dictionary['uniLogin']}</Button>
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
    		/>

    	</div>
    	
    ) 
  }
}

const mapStateToProps = (state) => ({
  userLanguage: state.UserReducer.language,

  adminLoginStart: state.AdminReducer.adminLoginStart,
  adminLoginError: state.AdminReducer.adminLoginError,
  adminLoginSuccess: state.AdminReducer.adminLoginSuccess,
});


const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setUserLanguage,
    adminLogin,
  },
  dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(AdminLoginView)