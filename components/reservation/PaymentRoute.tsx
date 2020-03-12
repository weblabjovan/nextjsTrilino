import React from 'react';
import { Container, Row, Col, Button, Alert, Table } from 'reactstrap';
import LoginScreen from '../user/LoginScreen';
import RegistrationScreen from '../user/RegistrationScreen';
import PasswordScreen from '../user/PasswordScreen';
import { getLanguage } from '../../lib/language';

type MyProps = {
	handleSend(data: object, type: string): void;
	changeStage(stage: string): void;
	closeAlert(): void;
	stage: string;
	errorMessages: object;

  partner?: string;
  time?: string;
  date?: string;
  price?: number;
  deposit: number;
  lang: string;
  catering?:Array<object>; 
  addon?:Array<object>; 
  general?: object | null;
  mobile: boolean;
  // using `interface` is also ok
};
type MyState = {
  dictionary: object;
};


export default class PaymentRoute extends React.Component <MyProps, MyState> {

  state: MyState = {
    dictionary: getLanguage(this.props.lang),
  }

  render() {

    return (
        <Row className="paymentRoute">
        	{
        		this.props.stage === 'login'
        		?
        		<Col xs="12">
        			<h4 className="smallName">Rezervaciju mogu napraviti samo prijavljeni korisnici. Molimo vas prijavite se.</h4>
        			<Alert color="danger" isOpen={ this.props.errorMessages["show"] } toggle={ this.props.closeAlert } >
                <p hidden={ !this.props.errorMessages['fields']['logEmail']} >{ this.state.dictionary['userLoginAlertLogEmail'] }</p>
                <p hidden={ !this.props.errorMessages['fields']['password'] }>{ this.state.dictionary['userLoginAlertPassword'] }</p>
                <p hidden={ !this.props.errorMessages['fields']['baseError'] }>{ this.props.errorMessages['messages']['baseError'] }</p>
              </Alert>
	          	<LoginScreen
	          		lang={ this.props.lang }
	        			handleSend={ this.props.handleSend }
	        			errorMessages={ this.props.errorMessages}
	          	/>
	          	<div className="redirectLinks">
	          		<p>{ this.state.dictionary['userLoginLinksLog_1'] }<a id="loginRedirection" onClick={() => this.props.changeStage('registration')}>{ this.state.dictionary['userLoginLinksLog_2'] }</a>{this.state.dictionary['partnerLogThank']}</p>
	          	</div>
	          </Col>
	          :
	          null
        	}

        	{
        		this.props.stage === 'registration'
        		?
        		<Col xs="12">
        			<h4 className="smallName">Registrujte se kao novi korisnik i napravite rezervaciju.</h4>

        			<Alert color="danger" isOpen={ this.props.errorMessages["show"] } toggle={this.props.closeAlert} >
                <p hidden={ !this.props.errorMessages['fields']['firstName']} >{ this.state.dictionary['userLoginAlertFirst'] }</p>
                <p hidden={ !this.props.errorMessages['fields']['lastName']} >{ this.state.dictionary['userLoginAlertLast'] }</p>
                <p hidden={ !this.props.errorMessages['fields']['email']} >{ this.state.dictionary['userLoginAlertEmail'] }</p>
                <p hidden={ !this.props.errorMessages['fields']['phoneCode']} >{ this.state.dictionary['userLoginAlertPhonecode'] }</p>
                <p hidden={ !this.props.errorMessages['fields']['phone']} >{ this.state.dictionary['userLoginAlertPhone'] }</p>
                <p hidden={ !this.props.errorMessages['fields']['terms']} >{ this.state.dictionary['userLoginAlertTerms'] }</p>
                <p hidden={ !this.props.errorMessages['fields']['regDuplicate'] }>{ this.state.dictionary['userLoginAlertDouble'] }</p>
              </Alert>

	          	<RegistrationScreen
	          		lang={ this.props.lang }
	        			handleSend={ this.props.handleSend }
	        			errorMessages={ this.props.errorMessages}
	          	/>
	          	<div className="redirectLinks">
	          		<p>{ this.state.dictionary['userLoginLinksReg_1'] }<a id="loginRedirection" onClick={() => this.props.changeStage('login')}>{ this.state.dictionary['userLoginLinksReg_2'] }</a>{this.state.dictionary['partnerLogThank']}</p>
	          	</div>
	          </Col>
	          :
	          null
        	}


        	{
        		this.props.stage === 'password'
        		?
        		<Col xs="12">
        			<h4 className="smallName">Na email su vam poslati podaci za verifikaciju vaše registracije. Proverite vaš email, verifikujte registraciju i nastavite na plaćanje</h4>
        			<p className="additionalExplanation">{this.state.dictionary['passwordExplanation']}</p>

        			<Alert color="danger" isOpen={ this.props.errorMessages["show"] } toggle={this.props.closeAlert} >
                <p hidden={ !this.props.errorMessages['fields']['base']} >{ this.props.errorMessages['messages']['baseError'] }</p>
                <p hidden={ !this.props.errorMessages['fields']['code']} >{ this.state.dictionary['passwordAlertCode'] }</p>
                <p hidden={ !this.props.errorMessages['fields']['pass']} >{ this.state.dictionary['passwordAlertPass'] }</p>
                <p hidden={ !this.props.errorMessages['fields']['confirm']} >{ this.state.dictionary['passwordAlertConfirm'] }</p>
              </Alert>

	          	<PasswordScreen
	          		lang={ this.props.lang }
	        			handleSend={ this.props.handleSend }
	        			errorMessages={ this.props.errorMessages}
	          	/>
	          </Col>
	          :
	          null
        	}

        	{
        		this.props.stage === 'payment'
        		?
        		<Col xs="12">
        			<h4 className="smallName">Ovo je deo za plaćanje</h4>
        			
	          </Col>
	          :
	          null
        	}
          
        </Row>
      
    );
  }
}


