import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Select from 'react-select';
import { Container, Row, Col, Button, Alert } from 'reactstrap';
import { getLanguage } from '../../lib/language';
import generalOptions from '../../lib/constants/generalOptions';
import { changeSinglePartnerField, updateCateringPartner } from '../../actions/partner-actions';
import {  getGeneralOptionLabelByValue, fillPickedOffers, isInArrayOfObjects, setCateringForBack, generateString } from '../../lib/helpers/specificPartnerFunctions';
import { setUpLinkBasic } from '../../lib/helpers/generalFunctions';
import { isNumeric } from '../../lib/helpers/validations';
import PlainInput from '../form/input';
import CateringDeal from './catering/CateringDeal';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style/style.scss';

interface MyProps {
  // using `interface` is also ok
  lang: string;
  token?: string | undefined;
	partnerObject: null | object;
  partnerGeneral: object;
  partnerCatering: Array<object>;
  forActivation: boolean;
  activationAlert: boolean;
  activationProcessPercent: number;
  updateCateringPartner(param: string, data: object, link: object, auth: string): object;
  changeSinglePartnerField(field: string, value: any): any;
  closeLoader(): void;
  openLoader(): void;
  updateActionCateringStart: boolean;
  updateActionCateringError: object | boolean;
  updateActionCateringSuccess: null | number;
};
interface MyState {
	dictionary: object;
	pickedOffers: object;
	loader: boolean;
	drinkName: string;
	drinkPrice: string;
	drinkScale: null | object;
  drinkType: null | object;
  drinkQuant: string;
  dealFor: null | object;
  dealPrice: string;
  dealMin: string;
  dealItem: string;
	errorMessages: object;
  errorDeals: boolean;
};

class FoodScreen extends React.Component <MyProps, MyState>{

	constructor(props){
    super(props);

    this.componentObjectBinding = this.componentObjectBinding.bind(this);

    const bindingFunctions = [ 'saveCatering', 'handleInputChange', 'addDrinkToTheList', 'addDrinkValidation', 'closeAlert', 'handleAddDrink', 'removeDrinkFromList', 'subIsInDom', 'changeDealField', 'addDeal', 'removeDeal', 'addDealItem', 'removeDealItem', 'isValideForSave', 'closeDealsAlert', 'closeActivationAlert'];
    this.componentObjectBinding(bindingFunctions);
  }

  componentObjectBinding(array){
    array.map( item => {
      this[item] = this[item].bind(this);
    })
  }

	state: MyState = {
    dictionary: getLanguage(this.props.lang),
    loader: false,
    pickedOffers: {},
    drinkName: '',
		drinkPrice: '',
		drinkScale: null,
    drinkQuant: '',
    drinkType: null,
    dealFor: null,
    dealPrice: '',
    dealMin: '',
    dealItem: '',
		errorMessages: { show: false, fields:{ drinkName: false, drinkPrice: false, drinkScale: false, drinkQuant: false, drinkType: false,  }},
    errorDeals: false,
  };


  addDrinkValidation(callback){
  	const errorCopy =  JSON.parse(JSON.stringify(this.state.errorMessages));
  	if (this.state.drinkName === '') {
  		errorCopy['fields']['drinkName'] = true;
  	}else{
  		errorCopy['fields']['drinkName'] = false;
  	}

  	if (this.state.drinkQuant === '' || !isNumeric(this.state.drinkQuant)) {
  		errorCopy['fields']['drinkQuant'] = true;
  	}else{
  		errorCopy['fields']['drinkQuant'] = false;
  	}

    if (this.state.drinkScale === null) {
      errorCopy['fields']['drinkScale'] = true;
    }else{
      errorCopy['fields']['drinkScale'] = false;
    }

    if (this.state.drinkPrice === '' || !isNumeric(this.state.drinkPrice)) {
      errorCopy['fields']['drinkPrice'] = true;
    }else{
      errorCopy['fields']['drinkPrice'] = false;
    }

    if (this.state.drinkType === null) {
      errorCopy['fields']['drinkType'] = true;
    }else{
      errorCopy['fields']['drinkType'] = false;
    }

  	let showVal = false;

    Object.keys(errorCopy['fields']).forEach((key) => {
      if (errorCopy['fields'][key] === true) {
        showVal = true;
      }
    })
    errorCopy['show'] = showVal;

    this.setState({errorMessages: errorCopy }, () => {
      callback();
    });
  }

  addDrinkToTheList(){
    if (!this.state.errorMessages['show']) {
      const partnerCatering =  JSON.parse(JSON.stringify(this.props.partnerCatering));
      const drink = { name: this.state.drinkName, quantity:this.state.drinkQuant, scale:this.state.drinkScale['value'], price: this.state.drinkPrice, type: this.state.drinkType['value'] };
      partnerCatering['drinkCard'].push(drink);

      this.setState({drinkName: '', drinkPrice: '', drinkQuant: '', drinkScale: null, drinkType: null}, () => {
        this.props.changeSinglePartnerField('partnerCatering', partnerCatering);
      })
    }
  }

  handleAddDrink(){
  	this.addDrinkValidation(this.addDrinkToTheList);
  }

  handleInputChange(field, value){
     this.setState(prevState => ({
      ...prevState,
      [field]: value // No error here, but can't ensure that key is in StateKeys
    }));
  }

  removeDrinkFromList(target: any){
  	const index = target.getAttribute('data-item');
  	const partnerCatering = JSON.parse(JSON.stringify(this.props.partnerCatering));
  	partnerCatering['drinkCard'].splice(index, 1);
  	this.props.changeSinglePartnerField('partnerCatering', partnerCatering);
  }

  closeAlert(){
    const errorCopy = JSON.parse(JSON.stringify(this.state.errorMessages));
    errorCopy['show'] = false;
    this.setState({errorMessages: errorCopy});
  }

  closeActivationAlert(){
    this.props.changeSinglePartnerField('activationAlert', false);
  }

  closeDealsAlert(){
    this.setState({errorDeals: false});
  }

  subIsInDom(type: string): boolean {
    const id = `sub_${type}`;
    const sub = document.getElementById(id);
    if (sub === null) {
      return false;
    }

    return true;
  }

  changeDealField(index: number, field: string, value: any): void {
    const partnerCatering = JSON.parse(JSON.stringify(this.props.partnerCatering));
    partnerCatering['deals'][index][field] = value;
    this.props.changeSinglePartnerField('partnerCatering', partnerCatering);
  }

  addDeal(): void {
    const partnerCatering = JSON.parse(JSON.stringify(this.props.partnerCatering));
    const deal = { type: '', price: '', min: null, items: [], currentItem: '', regId: generateString(12)};
    partnerCatering['deals'].push(deal);
    this.props.changeSinglePartnerField('partnerCatering', partnerCatering);
  }

  removeDeal(index: number): void {
    const partnerCatering = JSON.parse(JSON.stringify(this.props.partnerCatering));
    partnerCatering['deals'].splice(index, 1);
    this.props.changeSinglePartnerField('partnerCatering', partnerCatering);
  }

  addDealItem(index: number): void {
    const partnerCatering = JSON.parse(JSON.stringify(this.props.partnerCatering));
    if (partnerCatering['deals'][index]['currentItem']) {
      partnerCatering['deals'][index]['items'].push(partnerCatering['deals'][index]['currentItem']);
      partnerCatering['deals'][index]['currentItem'] = '';
      this.props.changeSinglePartnerField('partnerCatering', partnerCatering);
    }
  }

  removeDealItem(dealIndex: number, itemIndex: number): void {
    const partnerCatering = JSON.parse(JSON.stringify(this.props.partnerCatering));
    partnerCatering['deals'][dealIndex]['items'].splice(itemIndex, 1);
    this.props.changeSinglePartnerField('partnerCatering', partnerCatering);
  }

  isValideForSave(){
    const partnerCatering = JSON.parse(JSON.stringify(this.props.partnerCatering));
    for (var i = 0; i < partnerCatering['deals'].length; ++i) {
      if (!partnerCatering['deals'][i]['type'] && !partnerCatering['deals'][i]['price'] && !partnerCatering['deals'][i]['min'] && !partnerCatering['deals'][i]['items'].length) {

      }else{
        if (!partnerCatering['deals'][i]['type'] || !partnerCatering['deals'][i]['price'] || !partnerCatering['deals'][i]['min'] || !partnerCatering['deals'][i]['items'].length || !isNumeric(partnerCatering['deals'][i]['price']) || !isNumeric(partnerCatering['deals'][i]['min'])) {
        return false;
        }
      }
    }

    return true;
  }

  saveCatering(){
    if (this.isValideForSave()) {
      this.props.openLoader();
      const link = setUpLinkBasic(window.location.href);
      const catering = setCateringForBack(this.props.partnerCatering);
      const data = { language: this.props.lang, catering, partner: this.props.partnerObject };
      this.props.updateCateringPartner('_id', data, link, this.props.token);
    }else{
      this.setState({ errorDeals: true });
    }
  }

  
  componentDidUpdate(prevProps: MyProps, prevState:  MyState){
    if (prevProps.lang !== this.props.lang) {
      let dictionary = getLanguage(this.props.lang);
      this.setState({ dictionary });
    }

    if (this.props.partnerObject && !prevProps.partnerObject) {
    	if (this.props.partnerObject['catering']) {
	    		this.setState({loader: false }, () => {
	    			this.props.closeLoader();
	    		});
    	}else{
    		this.props.closeLoader();
    	}
    }

    if (!this.props.updateActionCateringStart && prevProps.updateActionCateringStart && !this.props.updateActionCateringError) {
    	if (this.props.partnerObject) {
    		if (this.props.partnerObject['catering']) {
	    		this.setState({loader: false }, () => {
	    			this.props.closeLoader();
	    		});
	    	}
    	}
    }
  }

  componentDidMount(){
  	
  }

	
  render() {
    return(
    	<div className="partnerProflePage food">
        <Container fluid>
          <Row>
            <Col xs="12">
              <div className="pageHeader">
                <h2>{this.state.dictionary['partnerProfileCateringTitle']}</h2>
                <p>{this.state.dictionary['partnerProfileCateringDescription']}<a href={`/partnerHelp?language=${this.props.lang}&section=catering`} target="_blank">{this.state.dictionary['uniPartnerProfileHelp']}</a></p>
              </div>
            </Col>

            <Col xs='12'>
              <Alert color="success" isOpen={ this.props.activationAlert } toggle={this.closeActivationAlert} >
                <h3>{`${this.props.activationProcessPercent}${this.state.dictionary['uniPartnerProgressTitle']}`}</h3>
                <p>{this.state.dictionary['uniPartnerProgressDescription']} <a href={`/partnerHelp?language=${this.props.lang}&section=activation`} target="_blank"> {this.state.dictionary['uniPartnerProgressLink']}</a> </p>
              </Alert>
            </Col>

          </Row>

          <Row>
            <Col xs="12">
              <h4>{this.state.dictionary['partnerProfileCateringDealsSub']}</h4>
            </Col>
          </Row>

          <Row>
            <Col xs="12">
              {
               this.props.partnerCatering['deals'].map( (deal, index) => {
                 return(
                   <CateringDeal
                    key={`cateringDeal_${index}`}
                    lang={ this.props.lang }
                    index={ index }
                    type={ deal['type'] }
                    price={ deal['price'] }
                    min={ deal['min'] }
                    currentItem={ deal['currentItem'] }
                    items={ deal['items'] }
                    changeDealField={ this.changeDealField }
                    removeDeal={ this.removeDeal }
                    addDealItem={ this.addDealItem }
                    removeDealItem={ this.removeDealItem }
                   />
                  )
               })
              }
            </Col>

            <Col xs="12">
              <div className="middle">
                <button className="buttonAdd" onClick={ this.addDeal }>{this.state.dictionary['partnerProfileCateringDealsAddDealButton']}</button>
              </div>
            </Col>
          </Row>

          

          <Row className="drinkCard">
          	<Col xs="12">
          		<h4>{this.state.dictionary['partnerProfileCateringCardSub']}</h4>
              <Alert color="danger" isOpen={ this.state.errorMessages["show"] } toggle={this.closeAlert} >
                <p hidden={ !this.state.errorMessages['fields']['drinkName']} >{this.state.dictionary['partnerProfileCateringCardAlertName']}</p>
                <p hidden={ !this.state.errorMessages['fields']['drinkQuant']} >{this.state.dictionary['partnerProfileCateringCardAlertQuant']}</p>
                <p hidden={ !this.state.errorMessages['fields']['drinkScale']} >{this.state.dictionary['partnerProfileCateringCardAlertScale']}</p>
                <p hidden={ !this.state.errorMessages['fields']['drinkPrice']} >{this.state.dictionary['partnerProfileCateringCardAlertPrice']}</p>
                <p hidden={ !this.state.errorMessages['fields']['drinkType']} >{this.state.dictionary['partnerProfileCateringCardAlertType']}</p>
              </Alert>
          	</Col>

          	<Col xs="12" lg="5" className="mainCard">
          		<div className="drinkList">
                <div className="middle">
                  <p className="sub-sm">{this.state.dictionary['partnerProfileCateringCardDisplayInfo']}</p>
                </div>
                {
                  isInArrayOfObjects('type', '1', this.props.partnerCatering['drinkCard'])
                  ?
                  <h6>{this.state.dictionary['partnerProfileCateringCardNonPillar']}</h6>
                  :
                  null
                }
                {
                  this.props.partnerCatering['drinkCard'].map( (drink, index) => {
                    return(
                        drink['type'] === '1'
                        ?
                        <div className="item" key={`drinkKey_${index}`}>
                          <span data-item={index} onClick={(event) => this.removeDrinkFromList(event.target)}></span>
                          <label>{`${drink['name']}, ${drink['quantity']} ${getGeneralOptionLabelByValue(generalOptions['drinkScale'], drink['scale'].toString())} - ${drink['price']} rsd`}</label>
                        </div>
                        :
                        null
                     )
                  })
                }

                {
                  isInArrayOfObjects('type', '2', this.props.partnerCatering['drinkCard'])
                  ?
                  <h6>{this.state.dictionary['partnerProfileCateringCardAlcoPillar']}</h6>
                  :
                  null
                }
                {
                  this.props.partnerCatering['drinkCard'].map( (drink, index) => {
                    return(
                        drink['type'] === '2'
                        ?
                        <div className="item" key={`drinkKey_${index}`}>
                          <span data-item={index} onClick={(event) => this.removeDrinkFromList(event.target)}></span>
                          <label>{`${drink['name']}, ${drink['quantity']} ${getGeneralOptionLabelByValue(generalOptions['drinkScale'], drink['scale'].toString())} - ${drink['price']} rsd`}</label>
                        </div>
                        :
                        null
                     )
                  })
                }

                {
                  isInArrayOfObjects('type', '3', this.props.partnerCatering['drinkCard'])
                  ?
                  <h6>{this.state.dictionary['partnerProfileCateringCardHotPillar']}</h6>
                  :
                  null
                }
                {
                  this.props.partnerCatering['drinkCard'].map( (drink, index) => {
                    return(
                        drink['type'] === '3'
                        ?
                        <div className="item" key={`drinkKey_${index}`}>
                          <span data-item={index} onClick={(event) => this.removeDrinkFromList(event.target)}></span>
                          <label>{`${drink['name']}, ${drink['quantity']} ${getGeneralOptionLabelByValue(generalOptions['drinkScale'], drink['scale'].toString())} - ${drink['price']} rsd`}</label>
                        </div>
                        :
                        null
                     )
                  })
                }

                {
                  !this.props.partnerCatering['drinkCard'].length
                  ?
                  <h6 className="fadedPrev">{this.state.dictionary['partnerProfileCateringCardEmpty']}</h6>
                  :
                  null
                }
      						
		        	</div>

          	</Col>
            <Col xs="12" lg="7" className="drinkForm">
              <Row className="mainForm">
                <Col xs="12">
                  <div className="middle">
                    <p className="sub-sm">{this.state.dictionary['partnerProfileCateringCardFormInfo']}</p>
                  </div>
                </Col>
               
                <Col xs="12" sm="6">
                  <label>{this.state.dictionary['partnerProfileCateringCardFormName']}</label>
                  <PlainInput 
                    placeholder=""
                    value={ this.state.drinkName }
                    onChange={ (event) => this.handleInputChange('drinkName', event.target.value) }
                    type="text"
                    className={`${this.state.errorMessages['fields']['drinkName'] ? "borderWarrning" : ''} logInput`} />
                </Col>
                <Col xs="4" sm="3">
                  <label>{this.state.dictionary['partnerProfileCateringCardFormQuant']}</label>
                  <PlainInput 
                    placeholder="" 
                    value={ this.state.drinkQuant }
                    onChange={ (event) => this.handleInputChange('drinkQuant', event.target.value) }
                    type="number"
                    className={`${this.state.errorMessages['fields']['drinkQuant'] ? "borderWarrning" : ''} logInput`} />
                </Col>
                <Col xs='4' sm="3">
                 <label>{this.state.dictionary['partnerProfileCateringCardFormScale']}</label>
                  <Select 
                    options={generalOptions[`drinkScale`]} 
                    value={ this.state.drinkScale } 
                    onChange={(val) => this.handleInputChange('drinkScale', val)} 
                    instanceId="scaleInput" 
                    className="logInput" 
                    styles={{ container: (provided, state) => ({ ...provided, border: this.state.errorMessages['fields']['drinkScale'] ? "1px solid red" : "#ccc" })}}
                    placeholder=""/>
                </Col>
                <Col xs="4" sm="4">
                  <label>{this.state.dictionary['partnerProfileCateringCardFormPrice']}</label>
                   <PlainInput 
                    placeholder=""
                    value={ this.state.drinkPrice }
                    onChange={ (event) => this.handleInputChange('drinkPrice', event.target.value) }
                    type="number"
                    className={`${this.state.errorMessages['fields']['drinkPrice'] ? "borderWarrning" : ''} logInput`} />
                </Col>
                <Col xs='12' sm="8">
                 <label>{this.state.dictionary['partnerProfileCateringCardFormType']}</label>
                  <Select 
                    options={generalOptions[`drinkType_${this.props.lang}`]} 
                    value={ this.state.drinkType } 
                    onChange={(val) => this.handleInputChange('drinkType', val)} 
                    instanceId="typeInput" 
                    className="logInput" 
                    styles={{ container: (provided, state) => ({ ...provided, border: this.state.errorMessages['fields']['drinkType'] ? "1px solid red" : "#ccc" })}}
                    placeholder=""/>
                </Col>
                <Col xs="12">
                  <div className="middle">
                    <button className="buttonAdd" onClick={ this.handleAddDrink }>{this.state.dictionary['partnerProfileCateringCardFormButton']}</button>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>


          <Row>
            <Col xs="12">
              <Alert color="danger" isOpen={ this.state.errorDeals } toggle={this.closeDealsAlert} >
                <p hidden={ !this.state.errorDeals} >{this.state.dictionary['partnerProfileCateringDealsAlert']}</p>
              </Alert>
            </Col>
          </Row> 

          

          <Row>
            <Col xs="12">
            	<div className="middle bigMarginSeparation">
								<Button color="success" onClick={ this.saveCatering } >{this.state.dictionary['partnerProfileCateringSaveButton']}</Button>
							</div>
            </Col>
          </Row> 

          <Row>
            <Col xs="12">
            	<div className="remarks">
								<p>{ this.state.dictionary['partnerProfileGeneralRemark'] } </p>
							</div>
            </Col>
          </Row> 
          
        </Container>    
    	</div>
    	
    ) 
  }
}

const mapStateToProps = (state) => ({
	partnerObject: state.PartnerReducer.partner,
	partnerCatering: state.PartnerReducer.partnerCatering,

  forActivation: state.PartnerReducer.forActivation,
  activationAlert: state.PartnerReducer.activationAlert,
  activationProcessPercent: state.PartnerReducer.activationProcessPercent,

	updateActionCateringStart: state.PartnerReducer.updateActionCateringStart,
  updateActionCateringError: state.PartnerReducer.updateActionCateringError,
  updateActionCateringSuccess: state.PartnerReducer.updateActionCateringSuccess,
});


const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
  	changeSinglePartnerField,
  	updateCateringPartner,
  },
  dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(FoodScreen)