import React from 'react';
import { Container, Row, Col, Table } from 'reactstrap';
import { getLanguage } from '../../lib/language';
import { getArrayObjectByFieldValue } from '../../lib/helpers/generalFunctions';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style/style.scss';

interface MyProps {
  // using `interface` is also ok
  lang: string;
  isMobile: boolean;
  show: boolean;
  close(): void;
  reservation: null | object;
};

interface MyState {
	dictionary: object;
};

export default class UserBill extends React.Component <MyProps, MyState>{

	constructor(props){
    super(props);

    this.componentObjectBinding = this.componentObjectBinding.bind(this);

    const bindingFunctions = ['toggleMobileOptions'];
    this.componentObjectBinding(bindingFunctions);
  }

  componentObjectBinding(array){
    array.map( item => {
      this[item] = this[item].bind(this);
    })
  }

	state: MyState = {
    dictionary: getLanguage(this.props.lang),
  };

  toggleMobileOptions(){
  	console.log()
  }

	
  render() {
    return(

    	<Container>
    		{
    			this.props.show
    			?
    			(
    				<div className="darkCover">
	    				<Row className="userBill">
	    					<Col xs="12">
                  <Row>
                    <Col xs="12">
                      <div className="close">
                        <label onClick={ this.props.close }></label>
                      </div>
                    </Col>
                  </Row>
	    					</Col>

			        	<Col xs="12">
                  <div className="billTable">
                    <div className="middle">
                      <h4>Detaljne informacije</h4>
                    </div>
                    
                    <Table>
                      <thead>
                        <tr>
                        </tr>
                      </thead>

                      <tbody>
                        <tr>
                          <td>{this.state.dictionary['paymentUserEmailPartnerName']}</td>
                          <td>{this.props.reservation['partnerObj'][0]['name']}</td>
                        </tr>
                        <tr>
                          <td>{this.state.dictionary['paymentUserEmailAddress']}</td>
                          <td>{this.props.reservation['partnerObj'][0]['general']['address']}</td>
                        </tr>
                        <tr>
                          <td>{this.state.dictionary['paymentUserEmailDate']}</td>
                          <td>{this.props.reservation['dateTime']}</td>
                        </tr>
                        <tr>
                          <td>{this.state.dictionary['paymentUserEmailRoom']}</td>
                          <td>{getArrayObjectByFieldValue(this.props.reservation['partnerObj'][0]['general']['rooms'], 'regId', this.props.reservation['room'])['name']}</td>
                        </tr>
                         <tr>
                          <td>{this.state.dictionary['paymentPartnerEmailCatering']}</td>
                          <td>{this.props.reservation['cateringString']}</td>
                        </tr>
                        <tr>
                          <td>{this.state.dictionary['paymentPartnerEmailDecoration']}</td>
                          <td>{this.props.reservation['decorationString']}</td>
                        </tr>
                        <tr>
                          <td>{this.state.dictionary['paymentPartnerEmailAddon']}</td>
                          <td>{this.props.reservation['addonString']}</td>
                        </tr>
                        <tr>
                          <td>Ukupna cena:</td>
                          <td>{this.props.reservation['price']}</td>
                        </tr>
                        <tr>
                          <td>Cena termina:</td>
                          <td>{this.props.reservation['termPrice']}</td>
                        </tr>
                        <tr>
                          <td>Cena keteringa:</td>
                          <td>{this.props.reservation['foodPrice']}</td>
                        </tr>
                         <tr>
                          <td>Cena dekoracije:</td>
                          <td>{this.props.reservation['decorationPrice']}</td>
                        </tr>
                        <tr>
                          <td>Cena dodatnih sadržaja:</td>
                          <td>{this.props.reservation['animationPrice']}</td>
                        </tr>
                        <tr>
                          <td>Deposit:</td>
                          <td>{this.props.reservation['deposit']}</td>
                        </tr>
                        <tr>
                          <td>Za uplatu na licu mesta:</td>
                          <td>Srediti kasnije</td>
                        </tr>
                         <tr>
                          <td>Za uplatu preko korisničkog profila:</td>
                          <td>Srediti kasnije</td>
                        </tr>
                        <tr>
                          <td>Rok za uplatu preko korisničkog profila:</td>
                          <td>Srediti kasnije</td>
                        </tr>
                         <tr>
                          <td>Tip uplate preko korisničkog profila:</td>
                          <td>Srediti kasnije</td>
                        </tr>
                        <tr>
                          <td>{this.state.dictionary['paymentUserEmailOrderId']}</td>
                          <td>{this.props.reservation['_id']}</td>
                        </tr>
                        <tr>
                          <td>{this.state.dictionary['paymentUserEmailAuthCode']}</td>
                          <td>{this.props.reservation['transactionAuthCode']}</td>
                        </tr>
                        <tr>
                          <td>{this.state.dictionary['paymentUserEmailPaymentStatus']}</td>
                          <td>{ this.props.reservation['confirmed'] ? this.state.dictionary['paymentUserEmailPaymentStatusTrue'] : this.state.dictionary['paymentUserEmailPaymentStatusFalse']}</td>
                        </tr>
                        <tr>
                          <td>{this.state.dictionary['paymentUserEmailTransactionId']}</td>
                          <td>{this.props.reservation['transactionId']}</td>
                        </tr>
                        <tr>
                          <td>{this.state.dictionary['paymentUserEmailTransactionDate']}</td>
                          <td>{this.props.reservation['transactionDate']}</td>
                        </tr>
                        <tr>
                          <td>{this.state.dictionary['paymentUserEmailMdStatus']}</td>
                          <td>{this.props.reservation['transactionMdStatus']}</td>
                        </tr>
                      </tbody>
                    </Table>
                    <p className="remarkVAT">{this.state.dictionary['uniVAT']}</p>
                  </div>    
                </Col>
			        </Row>
		        </div>
    			)
    			:
    			null
    		}
      </Container>
    ) 
  }
}