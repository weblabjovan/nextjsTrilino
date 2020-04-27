import React from 'react';
import { Container, Row, Col, Button, Alert, Table } from 'reactstrap';
import LoginScreen from '../user/LoginScreen';
import RegistrationScreen from '../user/RegistrationScreen';
import PasswordScreen from '../user/PasswordScreen';
import CheckBox from '../form/checkbox';
import { currencyFormat } from '../../lib/helpers/generalFunctions';
import { getLanguage } from '../../lib/language';

type MyProps = {
	handleSend(data: object, type: string): void;
	changeStage(stage: string): void;
  changePaymentReady(): void;
	closeAlert(): void;
  paymentFunction(): void;
	stage: string;
  readyToPay: boolean;
	errorMessages: object;
  trilino: number;

  partner?: string;
  address?: string;
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
        			<h4 className="smallName">{this.state.dictionary['reservationPaymentLoginTitle']}</h4>
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
        			<h4 className="smallName">{this.state.dictionary['reservationPaymentRegistrationTitle']}</h4>

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
        			<h4 className="smallName">{this.state.dictionary['reservationPaymentPasswordTitle']}</h4>
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
        		<Col xs="12" className="paymentStage">
              <Alert color="danger" isOpen={ this.props.errorMessages["show"] } toggle={ this.props.closeAlert } >
                <p hidden={ !this.props.errorMessages['fields']['readyToPay']} >{ this.state.dictionary['paymentStageAlert'] }</p>
              </Alert>
        			<Table>
                  <thead>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{"width": "30%"}}>{ this.state.dictionary['paymentStageVenue'] }</td>
                      <td>{this.props.partner}</td>
                    </tr>
                    <tr>
                      <td>{ this.state.dictionary['paymentStageAddress'] }</td>
                      <td>{this.props.address}</td>
                    </tr>
                     <tr>
                      <td>{ this.state.dictionary['paymentStageDate'] }</td>
                      <td>{`${this.props.date}, ${this.props.time}`}</td>
                    </tr>
                    <tr>
                      <td>{ this.state.dictionary['paymentStageRoom'] }</td>
                      <td>{this.props.general['room']}</td>
                    </tr>
                    <tr>
                      <td>{ this.state.dictionary['paymentStageGuest'] }</td>
                      <td>{this.props.general['name']}</td>
                    </tr>
                    <tr>
                      <td>{ this.state.dictionary['paymentStagePrice'] }</td>
                      <td>{`${currencyFormat(this.props.price)}`}</td>
                    </tr>
                    <tr>
                      <td>{ this.state.dictionary['paymentStageDeposit'] }</td>
                      <td>{`${currencyFormat(this.props.deposit)}`}</td>
                    </tr>
                  </tbody>
                </Table>

        			  <p>{`${ this.state.dictionary['paymentStageMsgWeb'] } ${currencyFormat(this.props.deposit)}`}</p>
                <p>{`${ this.state.dictionary['paymentStageMsgOnsite'] } ${currencyFormat(this.props.price - (this.props.deposit + this.props.trilino))}`}</p>
                <p>{this.props.trilino ? `${ this.state.dictionary['paymentStageMsgTrilino'] } ${currencyFormat(this.props.trilino)}` : ''}</p>

                <div className="middle marginSmall">
                  <a href={`/?page=terms&language=${this.props.lang}`} target="_blank">{`${this.state.dictionary['uniTerms']}/${this.state.dictionary['uniSalesTerms']}`}</a>
                </div>

                <CheckBox
                  disabled={ false }
                  checked={ this.props.readyToPay }
                  field="paymentReady"
                  onChange={ this.props.changePaymentReady }
                  label={ this.state.dictionary['paymentStageCheck'] }
                  orientation="back"
                />

                <div className="middle">
                  <Button color="success" onClick={ this.props.paymentFunction }>{ this.state.dictionary['paymentStageButton'] }</Button>
                </div>
                
	          </Col>
	          :
	          null
        	}
          
        </Row>
      
    );
  }
}


