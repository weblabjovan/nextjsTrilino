import React from 'react';
import { Button } from 'reactstrap';
import { getLanguage } from '../../lib/language';
import PlainInput from '../form/input';
import CheckBox from '../form/checkbox';
import Select from 'react-select';
import genOptions from '../../lib/constants/generalOptions';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style/style.scss';

interface MyProps {
  // using `interface` is also ok
  lang: string;
  handleSend(data: object, type: string): void;
  errorMessages: object;
};

interface MyState {
	dictionary: object;
	firstName: string;
	lastName: string;
	email: string;
  phoneCode: null | object;
	phone: number | string;
	terms: boolean;
};

export default class RegistrationScreen extends React.Component <MyProps, MyState>{

	constructor(props){
    super(props);

    this.componentObjectBinding = this.componentObjectBinding.bind(this);

    const bindingFunctions = ['handleInputChange', 'handleCheckBox', 'sendData'];
    this.componentObjectBinding(bindingFunctions);
  }

  componentObjectBinding(array){
    array.map( item => {
      this[item] = this[item].bind(this);
    })
  }

	state: MyState = {
    dictionary: getLanguage(this.props.lang),
		firstName: '',
		lastName: '',
		email: '',
    phoneCode: null,
		phone: '',
		terms: false,
  };

  handleInputChange(field, value){
     this.setState(prevState => ({
      ...prevState,
      [field]: value // No error here, but can't ensure that key is in StateKeys
    }));
  }

  handleCheckBox(){
  	this.setState({terms: !this.state.terms });
  }

  sendData(){
  	const { firstName, lastName, email, phone, terms, phoneCode } = this.state;

  	this.props.handleSend({ firstName, lastName, email, phone, terms, phoneCode: phoneCode ? phoneCode['value'] : '' }, 'registration');
  }

	
  render() {
    return(
    	<div className="logForm">
	    	<div className="title">
	    		<h3>{this.state.dictionary['userLoginRegTitle']}</h3>
	    		<p>{this.state.dictionary['userLoginRegDescription']}</p>
	    	</div>
    		
        <label>{this.state.dictionary['userLoginRegFirstLabel']}</label>
    		<PlainInput 
          placeholder={this.state.dictionary['userLoginRegFirstPlaceholder']} 
          onChange={(event) => this.handleInputChange('firstName', event.target.value)} 
          value={ this.state.firstName }
          type="text"
          className={`${this.props.errorMessages['fields']['firstName'] ? "borderWarrning" : ''} logInput`} 
        />

        <label>{this.state.dictionary['userLoginRegLastLabel']}</label>
    		<PlainInput 
          placeholder={this.state.dictionary['userLoginRegLastPlaceholder']} 
          onChange={(event) => this.handleInputChange('lastName', event.target.value)} 
          value={ this.state.lastName }
          type="text"
          className={`${this.props.errorMessages['fields']['lastName'] ? "borderWarrning" : ''} logInput`}
        />

        <label>{this.state.dictionary['userLoginRegEmailLabel']}</label>
    		<PlainInput 
          placeholder={this.state.dictionary['userLoginRegEmailPlaceholder']} 
          onChange={(event) => this.handleInputChange('email', event.target.value)} 
          value={ this.state.email }
          type="text"
          className={`${this.props.errorMessages['fields']['email'] ? "borderWarrning" : ''} logInput`} 
        />

        <label style={{ 'display': 'block'}}>{this.state.dictionary['userLoginRegPhoneLabel']}</label>
        <Select 
          options={genOptions['phoneCodes']} 
          value={ this.state.phoneCode } 
          onChange={(val) => this.handleInputChange('phoneCode', val)} 
          instanceId="phoneCodeInput" 
          className={`${this.props.errorMessages['fields']['email'] ? "borderWarrning" : ''} logInput short`} 
          placeholder={this.state.dictionary['userLoginRegPhonecodePlaceholder']}
        />
    		<PlainInput 
          placeholder={this.state.dictionary['userLoginRegPhonePlaceholder']} 
          onChange={(event) => this.handleInputChange('phone', event.target.value)} 
          value={ this.state.phone }
          type="text"
          className={`${this.props.errorMessages['fields']['phone'] ? "borderWarrning" : ''} logInput long`}
        />

        <CheckBox
	        disabled={ false }
	        checked={ this.state.terms }
	        label={ this.state.dictionary['partnerRegTerms']  }
	        field="terms"
	        onChange={ this.handleCheckBox }
	        orientation="back"
	      />

				<div className="middle marginSmall">
					<a href={`/?page=terms&language=${this.props.lang}`} target="_blank">{this.state.dictionary['uniTerms']}</a>
				</div>

        <div className="middle">
					<Button color="success" onClick={ this.sendData }>{this.state.dictionary['uniRegister']}</Button>
				</div>
    	</div>
    	
    ) 
  }
}