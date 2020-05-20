import React from 'react';
import { Button } from 'reactstrap';
import { getLanguage } from '../../lib/language';
import PlainInput from '../form/input';

interface MyProps {
  // using `interface` is also ok
  lang: string;
  handleSend(data: object, type: string): void;
  errorMessages: object;
};

interface MyState {
	dictionary: object;
	code: string;
	password: string;
	confirmation: string;
}

export default class PasswordScreen extends React.Component <MyProps, MyState>{

	constructor(props){
    super(props);

    this.componentObjectBinding = this.componentObjectBinding.bind(this);

    const bindingFunctions = ['handleInputChange', 'sendData'];
    this.componentObjectBinding(bindingFunctions);
  }

  componentObjectBinding(array){
    array.map( item => {
      this[item] = this[item].bind(this);
    })
  }

	state: MyState = {
    dictionary: getLanguage(this.props.lang),
		code: '',
		password: '',
		confirmation: '',
  };

  handleInputChange(field, value){
     this.setState(prevState => ({
      ...prevState,
      [field]: value // No error here, but can't ensure that key is in StateKeys
    }));
  }

  sendData(){
  	const { code, password, confirmation } = this.state;

  	this.props.handleSend({ code, password, confirmation }, 'newPassword');
  }

	
  render() {
    return(
    	<div className="logForm">
	    	<div className="title">
	    		<h3>{this.state.dictionary['userLoginRegTitle']}</h3>
	    		<p>{this.state.dictionary['userLoginRegDescription']}</p>
	    	</div>
    		
        <label>*{this.state.dictionary['uniSafetyCode']}</label>
    		<PlainInput 
          placeholder={this.state.dictionary['uniSafetyCode']} 
          onChange={(event) => this.handleInputChange('code', event.target.value)} 
          value={ this.state.code }
          type="text"
          className={`${this.props.errorMessages['fields']['code'] ? "borderWarrning" : ''} logInput`} 
        />

        <label>*{this.state.dictionary['uniPass']}</label>
    		<PlainInput 
          placeholder={this.state.dictionary['uniPass']} 
          onChange={(event) => this.handleInputChange('password', event.target.value)} 
          value={ this.state.password }
          type="password"
          className={`${this.props.errorMessages['fields']['password'] ? "borderWarrning" : ''} logInput`}
        />

        <label>*{this.state.dictionary['uniConfirmPass']}</label>
    		<PlainInput 
          placeholder={this.state.dictionary['uniConfirmPass']} 
          onChange={(event) => this.handleInputChange('confirmation', event.target.value)} 
          value={ this.state.confirmation }
          type="password"
          className={`${this.props.errorMessages['fields']['confirmation'] ? "borderWarrning" : ''} logInput`} 
        />

        <div className="middle">
					<Button color="success" onClick={ this.sendData }>{this.state.dictionary['uniSave']}</Button>
				</div>
    	</div>
    	
    ) 
  }
}