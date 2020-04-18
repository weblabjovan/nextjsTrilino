import React from 'react';
import { Button } from 'reactstrap';
import { getLanguage } from '../../lib/language';
import PlainInput from '../form/input';
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
	email: string;
	password: string;
};

export default class LoginScreen extends React.Component <MyProps, MyState>{

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
		email: '',
		password: '',
  };

  handleInputChange(field, value){
     this.setState(prevState => ({
      ...prevState,
      [field]: value // No error here, but can't ensure that key is in StateKeys
    }));
  }

  sendData(){
  	const { email, password } = this.state;
  	this.props.handleSend({ email, password }, 'login');
  }

	
  render() {
    return(
    	<div className="logForm">
    		<div className="title">
    			<h3>{this.state.dictionary['userLoginLogTitle']}</h3>
    			<p>{this.state.dictionary['userLoginLogDescription']}</p>
    		</div>
    		
        <label>{this.state.dictionary['userLoginRegEmailLabel']}</label>
    		<PlainInput 
          placeholder={this.state.dictionary['userLoginRegEmailPlaceholder']} 
          onChange={(event) => this.handleInputChange('email', event.target.value)} 
          value={ this.state.email }
          type="text"
          className={`${this.props.errorMessages['fields']['logEmail'] ? "borderWarrning" : ''} logInput`} 
        />

        <label>{this.state.dictionary['userLoginLogPasswordLabel']}</label>
    		<PlainInput 
          placeholder={this.state.dictionary['userLoginLogPasswordPlaceholder']} 
          onChange={(event) => this.handleInputChange('password', event.target.value)} 
          value={ this.state.password }
          type="password"
          className={`${this.props.errorMessages['fields']['password'] ? "borderWarrning" : ''} logInput`} 
        />  

        <div className="middle marginSmall">
          <a href={`/passwordChange?language=${this.props.lang}&page=user`} target="_blank">{this.state.dictionary['uniForgotPass']}</a>
        </div>

        <div className="middle">
					<Button color="success" onClick={ this.sendData }>{this.state.dictionary['uniLogin']}</Button>
				</div>
    	</div>
    	
    ) 
  }
}