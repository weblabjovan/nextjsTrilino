import React from 'react';
import { Container, Row, Col, Table } from 'reactstrap';
import { getLanguage } from '../../lib/language';
import { getArrayObjectByFieldValue, currencyFormat } from '../../lib/helpers/generalFunctions';
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
                      <h4>{this.state.dictionary['userProfileBillTitle']}</h4>
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
                          <td>{this.state.dictionary['userProfileBillPhone']}</td>
                          <td>{this.props.reservation['partnerObj'][0]['contactPhone']}</td>
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
                          <td>{this.state.dictionary['userProfileBillTotalPrice']}</td>
                          <td>{currencyFormat(this.props.reservation['price'])}</td>
                        </tr>
                        <tr>
                          <td>{this.state.dictionary['userProfileBillTermPrice']}</td>
                          <td>{currencyFormat(this.props.reservation['termPrice'])}</td>
                        </tr>
                        <tr>
                          <td>{this.state.dictionary['userProfileBillCateringPrice']}</td>
                          <td>{currencyFormat(this.props.reservation['foodPrice'])}</td>
                        </tr>
                         <tr>
                          <td>{this.state.dictionary['userProfileBillDecorationPrice']}</td>
                          <td>{currencyFormat(this.props.reservation['decorationPrice'])}</td>
                        </tr>
                        <tr>
                          <td>{this.state.dictionary['userProfileBillAddonPrice']}</td>
                          <td>{currencyFormat(this.props.reservation['animationPrice'])}</td>
                        </tr>
                        <tr>
                          <td>{this.state.dictionary['userProfileBillDepositPrice']}</td>
                          <td>{currencyFormat(this.props.reservation['deposit'])}</td>
                        </tr>
                        <tr>
                          <td>{this.state.dictionary['userProfileBillOnsitePayment']}</td>
                          <td>{currencyFormat(this.props.reservation['price'] - this.props.reservation['trilinoPrice'] - this.props.reservation['deposit'])}</td>
                        </tr>
                         <tr>
                          <td>{this.state.dictionary['userProfileBillUserprofilPayment']}</td>
                          <td>{ `${currencyFormat(this.props.reservation['trilinoPrice'])} ${this.props.reservation['isTrilinoCateringPaid'] ? this.state.dictionary['userProfileBillPaid'] : ''}`}</td>
                        </tr>
                        <tr>
                          <td>{this.state.dictionary['userProfileBillUserprofilDeadline']}</td>
                          <td>{`${this.props.reservation['trilinoPaymentDeadline']} ${this.props.reservation['isTrilinoCateringPaid'] ? this.state.dictionary['userProfileBillPaid'] : ''}`}</td>
                        </tr>
                         <tr>
                          <td>{this.state.dictionary['userProfileBillUserprofilType']}</td>
                          <td>{`${this.props.reservation['trilinoCateringString']} ${this.props.reservation['isTrilinoCateringPaid'] ? this.state.dictionary['userProfileBillPaid'] : ''}`}</td>
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