import React from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col, Button, Alert } from 'reactstrap';
import { changeSinglePartnerField, updateGeneralPartner } from '../../actions/partner-actions';
import { getLanguage } from '../../lib/language';
import { setUpLinkBasic } from '../../lib/helpers/generalFunctions';
import { prepareGeneralPartnerObject, validateTerms, setUpMainGeneralState, getGeneralOptionLabelByValue, getGeneralOptionByValue, generateString } from '../../lib/helpers/specificPartnerFunctions';
import genOptions from '../../lib/constants/generalOptions';
import PlainInput from '../form/input';
import PlainText from '../form/textField';
import RoomList from './general/RoomList';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style/style.scss';

interface MyProps {
  // using `interface` is also ok
  lang: string;
  partnerRooms: Array<object>;
  partnerGeneral: object;
  forActivation: boolean;
  activationAlert: boolean;
  activationProcessPercent: number;
  changeSinglePartnerField(field: string, value: any): any;
  updateGeneralPartner(param: string, data: object, link: object, auth: string): object;
  closeLoader(): void;
  openLoader(): void;
  token?: string | undefined;
  partnerGetStart: boolean;
	partnerGetError: object | boolean;
	partnerObject: null | object;
	loader: boolean;
	updateActionGeneralStart: boolean;
	updateActionGeneralError: object | boolean;
	updateActionGeneralSuccess: null | number;

};
interface MyState {
	dictionary: object;
	errorMessages: object;
	loader: boolean;
};

class GeneralScreen extends React.Component <MyProps, MyState>{

	constructor(props){
    super(props);

    this.componentObjectBinding = this.componentObjectBinding.bind(this);

    const bindingFunctions = ['handleInputChange', 'uniInputHandler', 'changePartnerRoomsInRedux', 'saveGeneral', 'changePartnerGeneralInRedux', 'closeAlert', 'validateSave', 'closeActivationAlert', 'changeDistrict'];
    this.componentObjectBinding(bindingFunctions);
  }

  componentObjectBinding(array){
    array.map( item => {
      this[item] = this[item].bind(this);
    })
  }

	state: MyState = {
    dictionary: getLanguage(this.props.lang),
    errorMessages: { show: false, response: {success: true, message: '', day:''}},
    loader: true,
  };

  componentDidUpdate(prevProps: MyProps, prevState:  MyState){
    if (prevProps.lang !== this.props.lang) {
      let dictionary = getLanguage(this.props.lang);
      this.setState({ dictionary });
    }

    if (!this.props.partnerGetStart && prevProps.partnerGetStart && !this.props.partnerGetError) {
    	if (this.props.partnerObject) {
    		if (this.props.partnerObject['general']) {
	    		const newGeneral = setUpMainGeneralState( this.props.partnerGeneral, this.props.partnerObject, this.props.lang);
	    		this.props.changeSinglePartnerField('partnerGeneral', newGeneral);
	    		this.setState({loader: false }, () => {
	    			this.props.closeLoader();
	    		});
	    	}
    	}
    }

    if (!this.props.updateActionGeneralStart && prevProps.updateActionGeneralStart && !this.props.updateActionGeneralError) {
    	if (this.props.partnerObject) {
    		if (this.props.partnerObject['general']) {
	    		this.setState({loader: false }, () => {
	    			this.props.closeLoader();
	    		});
	    	}
    	}
    }
  }

  handleInputChange(field, value){
     this.setState(prevState => ({
      ...prevState,
      [field]: value // No error here, but can't ensure that key is in StateKeys
    }));
  }

  uniInputHandler(value, field){
		if (field === 'roomNumber') {
			this.changePartnerRoomsInRedux(value.value);
		}else{
			this.changePartnerGeneralInRedux(field, value);
		}
  }

  changePartnerGeneralInRedux(field, value) {
  	const generalCopy = JSON.parse(JSON.stringify(this.props.partnerGeneral));
  	generalCopy[field] = value;
  	this.props.changeSinglePartnerField('partnerGeneral', generalCopy);
  }

  changeDistrict(value){
    const partnerCopy = JSON.parse(JSON.stringify(this.props.partnerObject));
    partnerCopy['district'] = value['value'];
    this.props.changeSinglePartnerField('partner', partnerCopy);
  }

  changePartnerRoomsInRedux(num){
  	if (this.props.partnerRooms.length < parseInt(num)) {
  		const room = { name: '', size: null, capKids: null, capAdults: null, regId: generateString(12), terms:{ monday:[ {from: '', to: '', price: null }, ], tuesday:[ {from: '', to: '', price: null }, ], wednesday:[ {from: '', to: '', price: null }, ], thursday:[ {from: '', to: '', price: null }, ], friday:[ {from: '', to: '', price: null }, ], saturday:[ {from: '', to: '', price: null }, ], sunday:[ {from: '', to: '', price: null }, ] }
	    }
	    const roomsCopy = JSON.parse(JSON.stringify(this.props.partnerRooms));
      const generalCopy = JSON.parse(JSON.stringify(this.props.partnerGeneral));


	    const dif = parseInt(num) - this.props.partnerRooms.length;
	    for (var i = 0; i < dif; ++i) {
	    	roomsCopy.push(room);
	    }
      generalCopy['roomNumber'] = { value: roomsCopy.length, label: roomsCopy.length };
  		this.props.changeSinglePartnerField('partnerRooms', roomsCopy);
      this.props.changeSinglePartnerField('partnerGeneral', generalCopy);
  	}else if(this.props.partnerRooms.length === parseInt(num)){

  	}else{
  		const roomsCopy = JSON.parse(JSON.stringify(this.props.partnerRooms));
      const generalCopy = JSON.parse(JSON.stringify(this.props.partnerGeneral));
  		const dif = this.props.partnerRooms.length - parseInt(num);
  		for (var i = 0; i < dif; ++i) {
	    	roomsCopy.pop();
	    }
      generalCopy['roomNumber'] = { value: roomsCopy.length, label: roomsCopy.length };

      this.props.changeSinglePartnerField('partnerRooms', roomsCopy);
      this.props.changeSinglePartnerField('partnerGeneral', generalCopy);
  	}
  }

  closeAlert(){
    const errorCopy = JSON.parse(JSON.stringify(this.state.errorMessages));
    errorCopy['show'] = false;
    this.setState({errorMessages: errorCopy});
  }

  closeActivationAlert(){
    this.props.changeSinglePartnerField('activationAlert', false);
  }

  validateSave(){
  	const ends = { monday: this.props.partnerGeneral['mondayTo'], tuesday: this.props.partnerGeneral['tuesdayTo'], wednesday: this.props.partnerGeneral['wednesdayTo'], thursday: this.props.partnerGeneral['thursdayTo'], friday: this.props.partnerGeneral['fridayTo'], saturday: this.props.partnerGeneral['saturdayTo'], sunday: this.props.partnerGeneral['sundayTo'] };
  	const validation = validateTerms(this.props.partnerRooms, this.props.partnerGeneral['duration'], ends);

  	if (validation['result']['success']) {
  		this.saveGeneral();
  	}else{
  		const errorCopy = JSON.parse(JSON.stringify(this.state.errorMessages));
    	errorCopy['show'] = true;
    	errorCopy['response']['success'] = false;
    	errorCopy['response']['message'] = `${validation['result']['message']}`;
    	errorCopy['response']['day'] = `${validation['day']}`;
    	this.setState({ errorMessages: errorCopy });
  	}
  }

  saveGeneral(){
  	this.props.openLoader();
    const link = setUpLinkBasic(window.location.href);
    const general = prepareGeneralPartnerObject(this.props.partnerGeneral, this.props.partnerRooms);
    const data = { language: this.props.lang, general, partner: this.props.partnerObject };
    this.setState({ errorMessages: { show: false, response: {success: true, message: '', day:''}} }, () => {
      this.props.updateGeneralPartner('_id', data, link, this.props.token);
    });
  }

	
  render() {
    return(
    	<div className="partnerProflePage general">

    			<Row>
    				<Col xs='12'>
    					<div className="pageHeader">
    						<h2>{this.state.dictionary['partnerProfileGeneralTitle']}</h2>
    						<p>{this.state.dictionary['partnerProfileGeneralDescription']}<a href={`/partnerHelp?language=${this.props.lang}&section=general`} target="_blank">{this.state.dictionary['uniPartnerProfileHelp']}</a></p>
    					</div>
    					
    				</Col>

            <Col xs='12'>
              <Alert color="success" isOpen={ this.props.activationAlert } toggle={this.closeActivationAlert} >
                <h3>{`${this.props.activationProcessPercent}${this.state.dictionary['uniPartnerProgressTitle']}`}</h3>
                <p>{this.state.dictionary['uniPartnerProgressDescription']} <a href={`/partnerHelp?language=${this.props.lang}&section=activation`} target="_blank"> {this.state.dictionary['uniPartnerProgressLink']}</a> </p>
              </Alert>
            </Col>
          </Row>

          <Row className="partnerSection">

            <Col xs='12'>
              <h4 className="middle">{this.state.dictionary['partnerProfileGeneralSubSpace']}</h4>
            </Col>

    				<Col xs='12'>
            	<label>{this.state.dictionary['partnerProfileGeneralItemDescription']}</label>
            	<PlainText
            		placeholder={this.state.dictionary['partnerProfileGeneralItemDescriptionPlaceholder']} 
            		onChange={(event) => this.uniInputHandler(event.target.value, 'description')} 
                value={this.props.partnerGeneral['description']}
                className="logInput"
                max={ 450 }
            	/>
            </Col>
            <Col xs='12' sm="6">
              <label>{this.state.dictionary['partnerProfileGeneralItemType']}</label>
              <Select 
                options={genOptions[`spaceType_${this.props.lang}`]} 
                value={ this.props.partnerGeneral['spaceType'] } 
                onChange={(val) => this.uniInputHandler(val, 'spaceType')} 
                instanceId="spaceTypeInput" 
                className="logInput" 
                placeholder={this.state.dictionary['partnerProfileGeneralItemTypePlaceholder']}/>
            </Col>
            <Col xs='12' sm="6">
            	<label>{this.state.dictionary['partnerProfileGeneralItemAddress']}</label>
            	<PlainInput
            		placeholder={this.state.dictionary['partnerProfileGeneralItemAddressPlaceholder']} 
            		onChange={(event) => this.uniInputHandler(event.target.value, 'address')} 
                value={this.props.partnerGeneral['address']}
                className="logInput"
                type="text"
            	/>
            </Col>

            <Col xs='12' sm="6">
              <label>{this.state.dictionary['partnerProfileGeneralItemCity']}</label>
              <PlainInput 
                placeholder={this.state.dictionary['partnerProfileGeneralItemSizePlaceholder']} 
                onChange={(event) => this.uniInputHandler(event.target.value, 'size')} 
                value={getGeneralOptionLabelByValue(genOptions['cities'], this.props.partnerObject['city'])} 
                disabled={ true }
                type="text"
                className="logInput" />
            </Col>
            <Col xs='12' sm="6">
              <label>{this.state.dictionary['partnerProfileGeneralItemQuarter']}</label>
              <Select 
                options={genOptions['quarter'][`${this.props.partnerObject['city']}`]} 
                value={ getGeneralOptionByValue(genOptions['quarter'][`${this.props.partnerObject['city']}`], this.props.partnerObject['district'])} 
                onChange={(val) => this.changeDistrict(val)} 
                instanceId="quarterInput" 
                className="logInput" 
                placeholder={this.state.dictionary['partnerProfileGeneralItemQuarterPlaceholder']}/>
            </Col>
            
            <Col xs='6' sm='3'>
            	<label>{this.state.dictionary['partnerProfileGeneralItemSize']}</label>
            	<PlainInput 
                placeholder={this.state.dictionary['partnerProfileGeneralItemSizePlaceholder']} 
                onChange={(event) => this.uniInputHandler(event.target.value, 'size')} 
                value={this.props.partnerGeneral['size']} 
                type="number"
                className="logInput" />
            </Col>
            <Col xs='6' sm='3'>
            	<label>{this.state.dictionary['partnerProfileGeneralItemPlaysize']}</label>
            	<PlainInput 
                placeholder={this.state.dictionary['partnerProfileGeneralItemPlaysizePlaceholder']} 
                onChange={(event) => this.uniInputHandler(event.target.value, 'playSize')} 
                value={this.props.partnerGeneral['playSize']} 
                type="number"
                className="logInput" />
            </Col>
             <Col xs='6' sm='3'>
            	<label>{this.state.dictionary['partnerProfileGeneralItemAgefrom']}</label>
            	<Select 
                options={genOptions['ages']} 
                value={ this.props.partnerGeneral['ageFrom'] } 
                onChange={(val) => this.uniInputHandler(val, 'ageFrom')} 
                instanceId="ageFromInput" 
                className="logInput" 
                placeholder={this.state.dictionary['partnerProfileGeneralItemAgefromPlaceholder']}/>
            </Col>
             <Col xs='6' sm='3'>
            	<label>{this.state.dictionary['partnerProfileGeneralItemAgeto']}</label>
            	<Select 
                options={genOptions['ages']} 
                value={ this.props.partnerGeneral['ageTo'] } 
                onChange={(val) => this.uniInputHandler(val, 'ageTo')} 
                instanceId="ageToInput" 
                className="logInput" 
                placeholder={this.state.dictionary['partnerProfileGeneralItemAgetoPlaceholder']}/>
            </Col>
          </Row>

          <Row className="partnerSection">
            <Col xs='12'>
            	<h4 className="middle">{this.state.dictionary['partnerProfileGeneralSubTimes']}</h4>
            </Col>

            <Col xs='6' sm="3" className="partnerDays">
            	<p className="middle">{this.state.dictionary['partnerProfileGeneralDaysMonday']}</p>
            	<Select 
                options={genOptions['times']} 
                value={ this.props.partnerGeneral['mondayFrom'] } 
                onChange={(val) => this.uniInputHandler(val, 'mondayFrom')} 
                instanceId="mondayFromInput" 
                className="logInput" 
                placeholder={this.state.dictionary['partnerProfileGeneralDaysFrom']}/>
                <Select 
                options={genOptions['times']} 
                value={ this.props.partnerGeneral['mondayTo'] } 
                onChange={(val) => this.uniInputHandler(val, 'mondayTo')} 
                instanceId="mondayToInput" 
                className="logInput" 
                placeholder={this.state.dictionary['partnerProfileGeneralDaysTo']}/>
            </Col>
            <Col xs='6' sm="3" className="partnerDays">
            	<p className="middle">{this.state.dictionary['partnerProfileGeneralDaysTuesday']}</p>
            	<Select 
                options={genOptions['times']} 
                value={ this.props.partnerGeneral['tuesdayFrom'] } 
                onChange={(val) => this.uniInputHandler(val, 'tuesdayFrom')} 
                instanceId="tuesdayFromInput" 
                className="logInput" 
                placeholder={this.state.dictionary['partnerProfileGeneralDaysFrom']}/>
                <Select 
                options={genOptions['times']} 
                value={ this.props.partnerGeneral['tuesdayTo'] } 
                onChange={(val) => this.uniInputHandler(val, 'tuesdayTo')} 
                instanceId="tuesdayToInput" 
                className="logInput" 
                placeholder={this.state.dictionary['partnerProfileGeneralDaysTo']}/>
            </Col>
            <Col xs='6' sm="3" className="partnerDays">
            	<p className="middle">{this.state.dictionary['partnerProfileGeneralDaysWednesday']}</p>
            	<Select 
                options={genOptions['times']} 
                value={ this.props.partnerGeneral['wednesdayFrom'] } 
                onChange={(val) => this.uniInputHandler(val, 'wednesdayFrom')} 
                instanceId="wednesdayFromInput" 
                className="logInput" 
                placeholder={this.state.dictionary['partnerProfileGeneralDaysFrom']}/>
                <Select 
                options={genOptions['times']} 
                value={ this.props.partnerGeneral['wednesdayTo'] } 
                onChange={(val) => this.uniInputHandler(val, 'wednesdayTo')} 
                instanceId="wednesdayToInput" 
                className="logInput" 
                placeholder={this.state.dictionary['partnerProfileGeneralDaysTo']}/>
            </Col>
            <Col xs='6' sm="3" className="partnerDays">
            	<p className="middle">{this.state.dictionary['partnerProfileGeneralDaysThursday']}</p>
            	<Select 
                options={genOptions['times']} 
                value={ this.props.partnerGeneral['thursdayFrom'] } 
                onChange={(val) => this.uniInputHandler(val, 'thursdayFrom')} 
                instanceId="thursdayFromInput" 
                className="logInput" 
                placeholder={this.state.dictionary['partnerProfileGeneralDaysFrom']}/>
                <Select 
                options={genOptions['times']} 
                value={ this.props.partnerGeneral['thursdayTo'] } 
                onChange={(val) => this.uniInputHandler(val, 'thursdayTo')} 
                instanceId="thursdayToInput" 
                className="logInput" 
                placeholder={this.state.dictionary['partnerProfileGeneralDaysTo']}/>
            </Col>
            <Col xs='6' sm="3" className="partnerDays">
            	<p className="middle">{this.state.dictionary['partnerProfileGeneralDaysFriday']}</p>
            	<Select 
                options={genOptions['times']} 
                value={ this.props.partnerGeneral['fridayFrom'] } 
                onChange={(val) => this.uniInputHandler(val, 'fridayFrom')} 
                instanceId="fridayFromInput" 
                className="logInput" 
                placeholder={this.state.dictionary['partnerProfileGeneralDaysFrom']}/>
                <Select 
                options={genOptions['times']} 
                value={ this.props.partnerGeneral['fridayTo'] } 
                onChange={(val) => this.uniInputHandler(val, 'fridayTo')} 
                instanceId="fridayToInput" 
                className="logInput" 
                placeholder={this.state.dictionary['partnerProfileGeneralDaysTo']}/>
            </Col>
            <Col xs='6' sm="3" className="partnerDays">
            	<p className="middle">{this.state.dictionary['partnerProfileGeneralDaysSatruday']}</p>
            	<Select 
                options={genOptions['times']} 
                value={ this.props.partnerGeneral['saturdayFrom'] } 
                onChange={(val) => this.uniInputHandler(val, 'saturdayFrom')} 
                instanceId="saturdayFromInput" 
                className="logInput" 
                placeholder={this.state.dictionary['partnerProfileGeneralDaysFrom']}/>
                <Select 
                options={genOptions['times']} 
                value={ this.props.partnerGeneral['saturdayTo'] } 
                onChange={(val) => this.uniInputHandler(val, 'saturdayTo')} 
                instanceId="saturdayToInput" 
                className="logInput" 
                placeholder={this.state.dictionary['partnerProfileGeneralDaysTo']}/>
            </Col>
            <Col xs='6' sm="3" className="partnerDays">
            	<p className="middle">{this.state.dictionary['partnerProfileGeneralDaysSunday']}</p>
            	<Select 
                options={genOptions['times']} 
                value={ this.props.partnerGeneral['sundayFrom'] } 
                onChange={(val) => this.uniInputHandler(val, 'sundayFrom')} 
                instanceId="sundayFromInput" 
                className="logInput" 
                placeholder={this.state.dictionary['partnerProfileGeneralDaysFrom']}/>
                <Select 
                options={genOptions['times']} 
                value={ this.props.partnerGeneral['sundayTo'] } 
                onChange={(val) => this.uniInputHandler(val, 'sundayTo')} 
                instanceId="sundayToInput" 
                className="logInput" 
                placeholder={this.state.dictionary['partnerProfileGeneralDaysTo']}/>
            </Col>
            
            	
          </Row>

          <Row className="partnerSection">

            <Col xs='12'>
            	<h4 className="middle">{this.state.dictionary['partnerProfileGeneralSubCharacteristics']}</h4>
            </Col>

             <Col xs='6' sm="3">
             	<label>{this.state.dictionary['partnerProfileGeneralItemParking']}</label>
            	<Select 
                options={genOptions[`dual_${this.props.lang}`]} 
                value={ this.props.partnerGeneral['parking'] } 
                onChange={(val) => this.uniInputHandler(val, 'parking')} 
                instanceId="parkingInput" 
                className="logInput" 
                placeholder={this.state.dictionary['partnerProfileGeneralItemParkingPlaceholder']}/>
            </Col>
            <Col xs='6' sm="3">
             	<label>{this.state.dictionary['partnerProfileGeneralItemYard']}</label>
            	<Select 
                options={genOptions[`dual_${this.props.lang}`]} 
                value={ this.props.partnerGeneral['yard'] } 
                onChange={(val) => this.uniInputHandler(val, 'yard')} 
                instanceId="yardInput" 
                className="logInput" 
                placeholder={this.state.dictionary['partnerProfileGeneralItemYardPlaceholder']}/>
            </Col>
            <Col xs='6' sm="3">
             	<label>{this.state.dictionary['partnerProfileGeneralItemBalcon']}</label>
            	<Select 
                options={genOptions[`dual_${this.props.lang}`]} 
                value={ this.props.partnerGeneral['balcon'] } 
                onChange={(val) => this.uniInputHandler(val, 'balcon')} 
                instanceId="balconInput" 
                className="logInput" 
                placeholder={this.state.dictionary['partnerProfileGeneralItemBalconPlaceholder']} />
            </Col>
            <Col xs='6' sm="3">
             	<label>{this.state.dictionary['partnerProfileGeneralItemPool']}</label>
            	<Select 
                options={genOptions[`dual_${this.props.lang}`]} 
                value={ this.props.partnerGeneral['pool'] } 
                onChange={(val) => this.uniInputHandler(val, 'pool')} 
                instanceId="poolInput" 
                className="logInput" 
                placeholder={this.state.dictionary['partnerProfileGeneralItemPoolPlaceholder']}/>
            </Col>

            <Col xs='6' sm="3">
             	<label>{this.state.dictionary['partnerProfileGeneralItemWifi']}</label>
            	<Select 
                options={genOptions[`dual_${this.props.lang}`]} 
                value={ this.props.partnerGeneral['wifi'] } 
                onChange={(val) => this.uniInputHandler(val, 'wifi')} 
                instanceId="wifiInput" 
                className="logInput" 
                placeholder={this.state.dictionary['partnerProfileGeneralItemWifiPlaceholder']}/>
            </Col>
            <Col xs='6' sm="3">
             	<label>{this.state.dictionary['partnerProfileGeneralItemAnimator']}</label>
            	<Select 
                options={genOptions[`dual_${this.props.lang}`]} 
                value={ this.props.partnerGeneral['animator'] } 
                onChange={(val) => this.uniInputHandler(val, 'animator')} 
                instanceId="animatorInput" 
                className="logInput" 
                placeholder={this.state.dictionary['partnerProfileGeneralItemAnimatorPlaceholder']}/>
            </Col>

            <Col xs='6' sm="3">
               <label>{this.state.dictionary['partnerProfileGeneralItemMovie']}</label>
              <Select 
                options={genOptions[`dual_${this.props.lang}`]} 
                value={ this.props.partnerGeneral['movie'] } 
                onChange={(val) => this.uniInputHandler(val, 'movie')} 
                instanceId="movieInput" 
                className="logInput" 
                placeholder={this.state.dictionary['partnerProfileGeneralItemMoviePlaceholder']}/>
            </Col>
            <Col xs='6' sm="3">
               <label>{this.state.dictionary['partnerProfileGeneralItemGaming']}</label>
              <Select 
                options={genOptions[`dual_${this.props.lang}`]} 
                value={ this.props.partnerGeneral['gaming'] } 
                onChange={(val) => this.uniInputHandler(val, 'gaming')} 
                instanceId="gamingInput" 
                className="logInput" 
                placeholder={this.state.dictionary['partnerProfileGeneralItemGamingPlaceholder']}/>
            </Col>

            <Col xs='6' sm="3">
             	<label>{this.state.dictionary['partnerProfileGeneralItemFood']}</label>
            	<Select 
                options={genOptions[`dual_${this.props.lang}`]} 
                value={ this.props.partnerGeneral['food'] } 
                onChange={(val) => this.uniInputHandler(val, 'food')} 
                instanceId="foodInput" 
                className="logInput" 
                placeholder={this.state.dictionary['partnerProfileGeneralItemFoodPlaceholder']}/>
            </Col>
            <Col xs='6' sm="3">
             	<label>{this.state.dictionary['partnerProfileGeneralItemDrink']}</label>
            	<Select 
                options={genOptions[`dual_${this.props.lang}`]} 
                value={ this.props.partnerGeneral['drink'] } 
                onChange={(val) => this.uniInputHandler(val, 'drink')} 
                instanceId="drinkInput" 
                className="logInput" 
                placeholder={this.state.dictionary['partnerProfileGeneralItemDrinkPlaceholder']}/>
            </Col>

            <Col xs='6' sm="3">
             	<label>{this.state.dictionary['partnerProfileGeneralItemSelffood']}</label>
            	<Select 
                options={genOptions[`dual_${this.props.lang}`]} 
                value={ this.props.partnerGeneral['selfFood'] } 
                onChange={(val) => this.uniInputHandler(val, 'selfFood')} 
                instanceId="selfFoodInput" 
                className="logInput" 
                placeholder={this.state.dictionary['partnerProfileGeneralItemSelffoodPlaceholder']}/>
            </Col>
            <Col xs='6' sm="3">
             	<label>{this.state.dictionary['partnerProfileGeneralItemSelfdrink']}</label>
            	<Select 
                options={genOptions[`dual_${this.props.lang}`]} 
                value={ this.props.partnerGeneral['selfDrink'] } 
                onChange={(val) => this.uniInputHandler(val, 'selfDrink')} 
                instanceId="selfDrinkInput" 
                className="logInput" 
                placeholder={this.state.dictionary['partnerProfileGeneralItemSelfdrinkPlaceholder']}/>
            </Col>

            <Col xs='6' sm="3">
               <label>{this.state.dictionary['partnerProfileGeneralItemSelfanimator']}</label>
              <Select 
                options={genOptions[`dual_${this.props.lang}`]} 
                value={ this.props.partnerGeneral['selfAnimator'] } 
                onChange={(val) => this.uniInputHandler(val, 'selfAnimator')} 
                instanceId="selfAnimatorInput" 
                className="logInput" 
                placeholder={this.state.dictionary['partnerProfileGeneralItemAnimatorPlaceholder']}/>
            </Col>
            <Col xs='6' sm="3">
               <label>{this.state.dictionary['partnerProfileGeneralItemSmoking']}</label>
              <Select 
                options={genOptions[`dual_${this.props.lang}`]} 
                value={ this.props.partnerGeneral['smoking'] } 
                onChange={(val) => this.uniInputHandler(val, 'smoking')} 
                instanceId="smokingInput" 
                className="logInput" 
                placeholder={this.state.dictionary['partnerProfileGeneralItemSmokingPlaceholder']}/>
            </Col>
          </Row>

          <Row className="partnerSection">

            <Col xs='12'>
            	<h4 className="middle">{this.state.dictionary['partnerProfileGeneralSubRooms']}</h4>
            </Col>
           
            <Col xs='6' sm='4'>
            	<label>{this.state.dictionary['partnerProfileGeneralItemDuration']}</label>
            	<Select 
                options={genOptions[`itemDuration_${this.props.lang}`]} 
                value={ this.props.partnerGeneral['duration'] } 
                onChange={(val) => this.uniInputHandler(val, 'duration')} 
                instanceId="durationInput" 
                className="logInput" 
                placeholder={this.state.dictionary['partnerProfileGeneralItemDurationPlaceholder']}/>
            </Col>

            <Col xs='6' sm='4'>
            	<label>{this.state.dictionary['partnerProfileGeneralItemCancelation']}</label>
            	<Select 
                options={genOptions[`cancel_${this.props.lang}`]} 
                value={ this.props.partnerGeneral['cancelation'] } 
                onChange={(val) => this.uniInputHandler(val, 'cancelation')} 
                instanceId="cancelationInput" 
                className="logInput" 
                placeholder={this.state.dictionary['partnerProfileGeneralItemCancelationPlaceholder']}/>
            </Col>

            <Col xs='6' sm='4'>
            	<label>{this.state.dictionary['partnerProfileGeneralItemRooms']}</label>
            	<Select 
                options={genOptions[`firstDeca`]} 
                value={ this.props.partnerGeneral['roomNumber'] } 
                onChange={(val) => this.uniInputHandler(val, 'roomNumber')} 
                instanceId="roomsInput" 
                className="logInput" 
                placeholder={this.state.dictionary['partnerProfileGeneralItemRoomsPlaceholder']}/>
            </Col>

            <Col xs='6' sm='4'>
              <label>{this.state.dictionary['partnerProfileGeneralDeposit']}</label>
              <Select 
                options={genOptions[`percentage`]} 
                value={ this.props.partnerGeneral['depositPercent'] } 
                onChange={(val) => this.uniInputHandler(val, 'depositPercent')} 
                instanceId="roomsInput" 
                className="logInput" 
                placeholder={this.state.dictionary['partnerProfileGeneralDepositPlaceholder']}/>
            </Col>

            <Col xs='6' sm='4'>
              <label>{this.state.dictionary['partnerProfileGeneralDepositReference']}</label>
              <Select 
                options={genOptions[`depositType_${this.props.lang}`]} 
                value={this.props.partnerGeneral['despositNumber'] ? getGeneralOptionByValue(genOptions[`depositType_${this.props.lang}`], this.props.partnerGeneral['despositNumber']['value']) : ''}
                onChange={(val) => this.uniInputHandler(val, 'despositNumber')} 
                instanceId="roomsInput" 
                className="logInput" 
                placeholder={this.state.dictionary['partnerProfileGeneralDepositReferencePlaceholder']}/>
            </Col>
            <Col xs='6' sm='4'>
              <label>Iznos minimalnog depozita</label>
              <PlainInput
                placeholder={this.state.dictionary['partnerProfileGeneralItemPricePlaceholder']} 
                onChange={(event) => this.uniInputHandler(event.target.value, 'minimalDeposit')} 
                value={this.props.partnerGeneral['minimalDeposit']}
                className="logInput"
                type="text"
              />
            </Col>
            <Col xs='6' sm='4'>
              <label>{this.state.dictionary['partnerProfileGeneralDouble']}</label>
              <Select 
                options={genOptions[`percentage`]} 
                value={ this.props.partnerGeneral['doubleDiscount'] } 
                onChange={(val) => this.uniInputHandler(val, 'doubleDiscount')} 
                instanceId="roomsInput" 
                className="logInput" 
                placeholder={this.state.dictionary['partnerProfileGeneralDoublePlaceholder']}/>
            </Col>
          </Row>
          <RoomList 
          	lang={this.props.lang}
          />

          <Alert color="danger" isOpen={ this.state.errorMessages["show"] } toggle={this.closeAlert} >
            <p>{ this.state.dictionary[`partnerProfileGeneralAlert_${this.state.errorMessages['response']['day']}`] } { this.state.dictionary[`partnerProfileGeneralAlert_${this.state.errorMessages['response']['message']}`] }</p>
          </Alert>

            

          <Row>
            <Col xs="12">
            	<div className="middle bigMarginSeparation">
								<Button color="success"  onClick={ this.validateSave } >{this.state.dictionary['partnerProfileGeneralSaveButton']}</Button>
							</div>
            </Col>
          </Row> 

          <Row>
            <Col xs="12">
            	<div className="remarks">
								<p>{ this.state.dictionary['partnerProfileGeneralRemark_1'] } </p>
                <p>{ this.state.dictionary['partnerProfileGeneralRemark_2'] } </p>
                <p>{ this.state.dictionary['partnerProfileGeneralRemark_3'] } </p>
							</div>
            </Col>
          </Row>     
    	</div>
    	
    ) 
  }
}

const mapStateToProps = (state) => ({
	partnerRooms: state.PartnerReducer.partnerRooms,
	partnerGetStart: state.PartnerReducer.partnerGetStart,
	partnerGetError: state.PartnerReducer.partnerGetError,
	partnerGeneral: state.PartnerReducer.partnerGeneral,
	partnerObject: state.PartnerReducer.partner,

  forActivation: state.PartnerReducer.forActivation,
  activationAlert: state.PartnerReducer.activationAlert,
  activationProcessPercent: state.PartnerReducer.activationProcessPercent,

	updateActionGeneralStart: state.PartnerReducer.updateActionGeneralStart,
	updateActionGeneralError: state.PartnerReducer.updateActionGeneralError,
	updateActionGeneralSuccess: state.PartnerReducer.updateActionGeneralSuccess,
});


const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
  	changeSinglePartnerField,
  	updateGeneralPartner,
  },
  dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(GeneralScreen)