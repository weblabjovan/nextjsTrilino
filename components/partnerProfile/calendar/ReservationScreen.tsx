import React from 'react';
import Select from 'react-select';
import moment from 'moment';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import CheckBox from '../../form/checkbox';
import PlainInput from '../../form/input';
import PlainText from '../../form/textField';
import Modal from '../../modals/ConfirmationModal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col, Button, Alert } from 'reactstrap';
import { getLanguage } from '../../../lib/language';
import { datePickerLang } from '../../../lib/language/dateLanguage';
import generalOptions from '../../../lib/constants/generalOptions';
import { deleteReservation } from '../../../actions/reservation-actions';
import { changeSinglePartnerField, getPartnerReservationTerms, savePartnerReservation, getPartnerReservations } from '../../../actions/partner-actions';
import { isFieldInObject, getGeneralOptionLabelByValue, getRoomsSelector, isFree, prepareReservationObjectForSave, setDateToDayStart, addDaysToDate, getFieldValueByRegId, getFieldValueByRegIdForObjects } from '../../../lib/helpers/specificPartnerFunctions';
import { setUpLinkBasic } from '../../../lib/helpers/generalFunctions';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-day-picker/lib/style.css';
import '../../../style/style.scss';

interface MyProps {
  // using `interface` is also ok
  lang: string;
  token: string;
  show: boolean;
  partnerObject: null | object;
  calendarDates: object;
  partnerRooms: Array<object>;
  partnerReservation: null | object;
  savePartnerReservationStart: boolean;
  savePartnerReservationError: object | boolean;
  savePartnerReservationSuccess: null | object;
  deleteReservationStart: boolean;
  deleteReservationError: object | boolean;
  deleteReservationSuccess: null | object;
  changeSinglePartnerField(field: string, value: any): any;
  getPartnerReservationTerms(link: object, data: object): any;
  reservationClose(output: boolean): void;
  savePartnerReservation(link: object, data: object, auth: string): any;
  deleteReservation(link: object, data: object, auth: string): any;
  getPartnerReservations(link: object, data: object): any;
  closeLoader(): void;
  openLoader(): void;
};

interface MyState {
  dictionary: object;
  loader: boolean;
  errorMessages: object;
  modal: boolean;
};

class ReservationScreen extends React.Component <MyProps, MyState>{

  constructor(props){
    super(props);

    this.componentObjectBinding = this.componentObjectBinding.bind(this);

    const bindingFunctions = [ 'handleInputChange', 'formatDate', 'handleBasicReservationValueChange', 'dateToString', 'handleCheckReservationChange', 'handleCateringReservationChange', 'handleDateChange', 'closeAlert', 'validateReservation', 'isDoublePermitted', 'isFoodReservationValid', 'handleReservationSave', 'handleRoomChange', 'toggleModal', 'activateDeleteReservation', 'calculatePrice', 'calculateTermPrice', 'calculateAnimationPrice', 'calculateFoodPrice', 'calculateDecorationPrice', 'calculateDeposit'];
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
    errorMessages: { show: false, fields:{ room: false, date: false, term: false, guest: false, double: false, foodNum: false, resDuplicate: false }},
    modal: false,
  };

  toggleModal(){
    this.setState({modal: !this.state.modal});
  }

  handleInputChange(field, value){
     this.setState(prevState => ({
      ...prevState,
      [field]: value // No error here, but can't ensure that key is in StateKeys
    }));
  }

  formatDate(date, format, locale) {
    if (this.props.lang === 'en') {
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    }
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  }

  dateToString(date: Date ){
    if (typeof date === 'string') {
      date = new Date(date);
    }
    if (this.props.lang === 'en') {
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    }
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  }

  handleDateChange(date: any){
    const partnerReservation = JSON.parse(JSON.stringify(this.props.partnerReservation));
    partnerReservation['date'] = date;
    partnerReservation['term'] = '';
    partnerReservation['from'] = '';
    partnerReservation['to'] = '';
    const link = setUpLinkBasic(window.location.href);
    this.props.getPartnerReservationTerms(link, {partner: partnerReservation['partner'], date: setDateToDayStart(date), room: partnerReservation['room']['value'], language: this.props.lang});
    this.props.changeSinglePartnerField('partnerReservation', partnerReservation);
  }

  handleRoomChange(value: any) {
    const partnerReservation = JSON.parse(JSON.stringify(this.props.partnerReservation));
    partnerReservation['room'] = value;
    partnerReservation['double'] = false;
    partnerReservation['term'] = '';
    partnerReservation['from'] = '';
    partnerReservation['to'] = '';
    partnerReservation['termPrice'] = 0;
    partnerReservation['animationPrice'] = 0;
    partnerReservation['decorationPrice'] = 0;
    partnerReservation['foodPrice'] = 0;
    partnerReservation['price'] = 0;
    partnerReservation['deposit'] = 0;
    const link = setUpLinkBasic(window.location.href);
    const date = setDateToDayStart(partnerReservation['date']);
    this.props.getPartnerReservationTerms(link, {partner: partnerReservation['partner'], date, room: partnerReservation['room']['value'], language: this.props.lang});
    this.props.changeSinglePartnerField('partnerReservation', partnerReservation);
  }

  handleBasicReservationValueChange(field: string, value: any){
    const partnerReservation = JSON.parse(JSON.stringify(this.props.partnerReservation));
    if (field === 'double' || field === 'showPrice') {
      partnerReservation[field] = !partnerReservation[field];
      partnerReservation['termPrice'] = this.calculatePrice(partnerReservation)['termPrice'];
      partnerReservation['animationPrice'] = this.calculatePrice(partnerReservation)['animationPrice'];
      partnerReservation['decorationPrice'] = this.calculatePrice(partnerReservation)['decorationPrice'];
      partnerReservation['foodPrice'] = this.calculatePrice(partnerReservation)['foodPrice'];
      partnerReservation['price'] = this.calculatePrice(partnerReservation)['price'];
      partnerReservation['deposit'] = this.calculatePrice(partnerReservation)['deposit'];
    }else if(field === 'term'){
      partnerReservation[field] = value;
      partnerReservation['from'] = partnerReservation['terms'][value['value']]['from'];
      partnerReservation['to'] = partnerReservation['terms'][value['value']]['to'];
      partnerReservation['termPrice'] = this.calculatePrice(partnerReservation)['termPrice'];
      partnerReservation['animationPrice'] = this.calculatePrice(partnerReservation)['animationPrice'];
      partnerReservation['decorationPrice'] = this.calculatePrice(partnerReservation)['decorationPrice'];
      partnerReservation['foodPrice'] = this.calculatePrice(partnerReservation)['foodPrice'];
      partnerReservation['price'] = this.calculatePrice(partnerReservation)['price'];
      partnerReservation['deposit'] = this.calculatePrice(partnerReservation)['deposit'];
    }else{
      partnerReservation[field] = value;
    }
    
    this.props.changeSinglePartnerField('partnerReservation', partnerReservation);
  }

  handleCheckReservationChange(objField: string, regId: string){
    const partnerReservation = JSON.parse(JSON.stringify(this.props.partnerReservation));
    partnerReservation[objField][regId] ? partnerReservation[objField][regId] = false : partnerReservation[objField][regId] = true;
    partnerReservation['termPrice'] = this.calculatePrice(partnerReservation)['termPrice'];
    partnerReservation['animationPrice'] = this.calculatePrice(partnerReservation)['animationPrice'];
    partnerReservation['decorationPrice'] = this.calculatePrice(partnerReservation)['decorationPrice'];
    partnerReservation['foodPrice'] = this.calculatePrice(partnerReservation)['foodPrice'];
    partnerReservation['price'] = this.calculatePrice(partnerReservation)['price'];
    partnerReservation['deposit'] = this.calculatePrice(partnerReservation)['deposit'];

    this.props.changeSinglePartnerField('partnerReservation', partnerReservation);
  }

  handleCateringReservationChange(regId: string, value: number){
    const partnerReservation = JSON.parse(JSON.stringify(this.props.partnerReservation));
    partnerReservation['food'][regId] = value;
    partnerReservation['termPrice'] = this.calculatePrice(partnerReservation)['termPrice'];
    partnerReservation['animationPrice'] = this.calculatePrice(partnerReservation)['animationPrice'];
    partnerReservation['decorationPrice'] = this.calculatePrice(partnerReservation)['decorationPrice'];
    partnerReservation['foodPrice'] = this.calculatePrice(partnerReservation)['foodPrice'];
    partnerReservation['price'] = this.calculatePrice(partnerReservation)['price'];
    partnerReservation['deposit'] = this.calculatePrice(partnerReservation)['deposit'];

    this.props.changeSinglePartnerField('partnerReservation', partnerReservation);
  }

  isFoodReservationValid(){
    for(let key in this.props.partnerReservation['food']){
      if (this.props.partnerReservation['food'][key]) {
        const min = getFieldValueByRegId(this.props.partnerObject['catering']['deals'], key, 'min');
        if (parseInt(this.props.partnerReservation['food'][key]) < parseInt(min)) {
          return false;
        }
      }
    }

    return true;
  }

  isDoublePermitted(){
    if (this.props.partnerReservation['double']) {
      if (this.props.partnerReservation['term']) {
        const val = this.props.partnerReservation['term']['value'];
        if (this.props.partnerReservation['terms'][val + 1]) {
          const from = moment(`2020-02-08 ${this.props.partnerReservation['terms'][val + 1]['from']}`, "YYYY-MM-DD HH:mm");
          const lastTo = moment(`2020-02-08 ${this.props.partnerReservation['terms'][val]['to']}`, "YYYY-MM-DD HH:mm");
          const lastDiff =  moment.duration(from.diff(lastTo)).asHours();
          if (lastDiff > 0.5) {
            return true;
          }
        }else{
          return true;
        }
      }
    }

    return false;
  }

  validateReservation(callback){
    const errorCopy = JSON.parse(JSON.stringify(this.state.errorMessages));
    this.props.changeSinglePartnerField('savePartnerReservationError', false);
    if (!this.props.partnerReservation['room']) {
      errorCopy['fields']['room'] = true;
    }else{
      errorCopy['fields']['room'] = false;
    }

    if (!this.props.partnerReservation['date']) {
      errorCopy['fields']['date'] = true;
    }else{
      errorCopy['fields']['date'] = false;
    }

    if (!this.props.partnerReservation['term']) {
      errorCopy['fields']['term'] = true;
    }else{
      errorCopy['fields']['term'] = false;
    }

    if (!this.props.partnerReservation['guest']) {
      errorCopy['fields']['guest'] = true;
    }else{
      errorCopy['fields']['guest'] = false;
    }

    if (!this.isFoodReservationValid()) {
      errorCopy['fields']['foodNum'] = true;
    }else{
      errorCopy['fields']['foodNum'] = false;
    }

    if (this.isDoublePermitted()) {
      errorCopy['fields']['double'] = true;
    }else{
      errorCopy['fields']['double'] = false;
    }

    errorCopy['fields']['resDuplicate'] = false;

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

  handleReservationSave(){
    if (!this.state.errorMessages['show']) {
      this.props.openLoader();
      const link = setUpLinkBasic(window.location.href);
      const data = {language: this.props.lang, reservation: prepareReservationObjectForSave(this.props.partnerReservation), type: 'partner'}
      this.props.savePartnerReservation(link, data, this.props.token);
    }
  }

  closeAlert(){
    const errorCopy = JSON.parse(JSON.stringify(this.state.errorMessages));
    errorCopy['show'] = false;
    this.setState({errorMessages: errorCopy});
  }

  activateDeleteReservation(){
    this.props.openLoader();
    const link = setUpLinkBasic(window.location.href);
    const data = {id: this.props.partnerReservation['id'], partner: this.props.partnerReservation['partner'], language: this.props.lang };
    this.props.deleteReservation(link, data, this.props.token);
  }

  calculatePrice(base: object){
    const partnerReservation = JSON.parse(JSON.stringify(base));

    const termPrice = partnerReservation['showPrice'] ? this.calculateTermPrice(partnerReservation) : 0;
    const animationPrice = partnerReservation['showPrice'] ? this.calculateAnimationPrice(partnerReservation) : 0;
    const decorationPrice = partnerReservation['showPrice'] ? this.calculateDecorationPrice(partnerReservation) : 0;
    const foodPrice = partnerReservation['showPrice'] ? this.calculateFoodPrice(partnerReservation) : 0;
    const price = termPrice+animationPrice+decorationPrice+foodPrice;
    const deposit = partnerReservation['showPrice'] ? this.calculateDeposit(termPrice, price) : 0;

    return {termPrice, animationPrice, foodPrice, decorationPrice, price, deposit};
  }

  calculateDeposit(termPrice: number, price: number){
    const depositFactor = isFieldInObject(this.props.partnerObject, 'depositPercent', 'general') ? (this.props.partnerObject['general']['depositPercent']/100) : 1;
    const full = isFieldInObject(this.props.partnerObject, 'despositNumber', 'general') ? this.props.partnerObject['general']['despositNumber'] === '1' ? true : false : false;
    if (full) {
      return (price * depositFactor);
    }

    return (termPrice * depositFactor);
  }

  calculateTermPrice(reservation: object){
    const doubleFactor = isFieldInObject(this.props.partnerObject, 'doubleDiscount', 'general') ? (1 - this.props.partnerObject['general']['doubleDiscount']/100) : 1;

    let termPrice = reservation['term'] ? reservation['terms'][reservation['term']['value']]['price'] : 0;
    if (reservation['double']) {
      termPrice = reservation['terms'][reservation['term']['value'] + 1] ? termPrice + (reservation['terms'][reservation['term']['value'] + 1]['price'] * doubleFactor) : termPrice;
    }

    return termPrice;
  }

  calculateAnimationPrice(reservation: object){
    let price = 0;

    for(let key in reservation['animation']){
      if (reservation['animation'][key]) {
        const p = getFieldValueByRegId(this.props.partnerObject['contentAddon'], key, 'price');
        price = price + parseInt(p);
      }
    }

    return price;
  }

  calculateFoodPrice(reservation: object){
    let price = 0;

    for(let key in reservation['food']){
      if (reservation['food'][key]) {
        const p = getFieldValueByRegId(this.props.partnerObject['catering']['deals'], key, 'price');
        price = price + (parseInt(p)*parseInt(reservation['food'][key]));
      }
    }
    return price;
  }

  calculateDecorationPrice(reservation: object){
    let price = 0;

    for(let key in reservation['decoration']){
      if (reservation['decoration'][key]) {
        const p = getFieldValueByRegIdForObjects(this.props.partnerObject['decoration'], key, 'price');
        price = price + parseInt(p);
      }
    }

    return price;
  }

  
  componentDidUpdate(prevProps: MyProps, prevState:  MyState){
    if (prevProps.lang !== this.props.lang) {
      let dictionary = getLanguage(this.props.lang);
      this.setState({ dictionary });
    }

    if (this.props.savePartnerReservationSuccess && prevProps.savePartnerReservationStart && !this.props.savePartnerReservationStart) {
      const link = setUpLinkBasic(window.location.href);
      this.props.getPartnerReservations(link, {type: 'partner', language: this.props.lang, partner: this.props.partnerReservation['partner'], room: this.props.partnerReservation['room']['value'], dates: this.props.calendarDates});
      this.props.reservationClose(false);
    }

    if (this.props.savePartnerReservationError['code'] === 2 && prevProps.savePartnerReservationError['code'] !== 2) {
      const errorCopy = JSON.parse(JSON.stringify(this.state.errorMessages));
      errorCopy['show'] = true;
      errorCopy['fields']['resDuplicate'] = true;
      this.setState({ errorMessages: errorCopy }, () => {
        this.props.closeLoader();
      });
    }

    if (!this.props.deleteReservationStart && prevProps.deleteReservationStart && !this.props.deleteReservationError && this.props.deleteReservationSuccess) {
      const link = setUpLinkBasic(window.location.href);
      this.props.getPartnerReservations(link, {type: 'partner', language: this.props.lang, partner: this.props.partnerReservation['partner'], room: this.props.partnerReservation['room']['value'], dates: this.props.calendarDates});
      this.toggleModal();
      this.props.reservationClose(false);
    }

  }

  
  render() {
    return(
      this.props.show
      ?
      (<div className="darkCover" >
        <Modal
          isOpen={ this.state.modal }
          title={this.state.dictionary['partnerProfileReservationModalTitle']}
          text={this.state.dictionary['partnerProfileReservationModalText']}
          buttonColor="danger"
          buttonText={this.state.dictionary['partnerProfileReservationModalButtonText']}
          toggle={ this.toggleModal }
          clickFunction={ this.activateDeleteReservation }
        />
        <div className="reservationScreen">
          <span className="icon closeIt absol" onClick={() => this.props.reservationClose(false)} ></span>
          <Container fluid>
            <Row>
              <Col xs="12">
                <h3>{this.state.dictionary['partnerProfileReservationTitle']}</h3>
              </Col>
              <Col xs="12" sm="6" className="borderOnSm">
                <Row>
                  <Col xs="12" sm="6" lg="4">
                    <label className="itemLabel">{this.state.dictionary['partnerProfileReservationRoom']}</label>
                    <Select 
                      options={getRoomsSelector(this.props.partnerRooms)} 
                      value={ this.props.partnerReservation['room'] } 
                      onChange={(val) => this.handleRoomChange(val)} 
                      isDisabled={ !this.props.partnerReservation['edit'] }
                      instanceId="resRoomInput" 
                      className="logInput" 
                      placeholder={this.state.dictionary['partnerProfileReservationRoomPlaceHolder']}/>
                  </Col>
                  <Col xs="12" sm="6" lg="4">
                    <label className="itemLabel">{this.state.dictionary['partnerProfileReservationDate']}</label>
                    <DayPickerInput 
                      value={ this.dateToString(this.props.partnerReservation['date']) }
                      formatDate={ this.formatDate }
                      placeholder={this.state.dictionary['partnerProfileReservationDatePlaceHolder']}
                      onDayChange= { (date) => this.handleDateChange(date) }
                      format="dd/mm/yyyy"
                      hideOnDayClick={ true }
                      keepFocus={ false }
                      inputProps={{ disabled: !this.props.partnerReservation['edit'] }}
                      dayPickerProps={{
                        disabledDays: {
                            before: new Date(),
                            after: addDaysToDate(null, 180),
                        },
                        todayButton: datePickerLang[this.props.lang]['today'],
                        selectedDays: [ this.props.partnerReservation['date'] ],
                        weekdaysShort: datePickerLang[this.props.lang]['daysShort'],
                        months: datePickerLang[this.props.lang]['months']
                      }}
                     />
                  </Col>

                  <Col xs="12" sm="6" lg="4">
                    <label className="itemLabel">{this.state.dictionary['partnerProfileReservationTerm']}</label>
                    <Select 
                      options={this.props.partnerReservation['options']} 
                      value={ this.props.partnerReservation['term'] } 
                      onChange={(val) => this.handleBasicReservationValueChange('term', val)} 
                      instanceId="resTermInput" 
                      className="logInput" 
                      isDisabled={ !this.props.partnerReservation['edit'] }
                      placeholder={this.state.dictionary['partnerProfileReservationTermPlaceHolder']}/>
                  </Col>

                  <Col xs="12" sm="6" lg="4">
                    <label className="itemLabel">{this.state.dictionary['partnerProfileReservationUser']}</label>
                    <PlainInput 
                      placeholder={this.state.dictionary['partnerProfileReservationUserPlaceHolder']} 
                      disabled={ true }
                      onChange={(event) => this.handleBasicReservationValueChange('userName', event.target.value)} 
                      value={this.props.partnerReservation['userName']} 
                      className="logInput" 
                      type="text" />
                  </Col>
                  <Col xs="12" sm="6" lg="4">
                  <label className="itemLabel">{this.state.dictionary['partnerProfileReservationName']}</label>
                    <PlainInput 
                      placeholder={this.state.dictionary['partnerProfileReservationNamePlaceHolder']} 
                      onChange={(event) => this.handleBasicReservationValueChange('guest', event.target.value)} 
                      value={this.props.partnerReservation['guest']} 
                      disabled={ !this.props.partnerReservation['edit'] }
                      className="logInput" 
                      type="text" />
                  </Col>
                  <Col xs="12" sm="6" lg="4">
                    <label className="itemLabel"></label>
                    <CheckBox
                      disabled={ !this.props.partnerReservation['edit'] }
                      checked={ this.props.partnerReservation['double'] }
                      field="double"
                      label={this.state.dictionary['partnerProfileReservationDouble']}
                      onChange={ () => this.handleBasicReservationValueChange('double', 'toggle') }
                    />
                  </Col>

                  <Col xs="12">
                    <label className="itemLabel">{this.state.dictionary['partnerProfileReservationComment']}</label>
                    <PlainText
                      placeholder={this.state.dictionary['partnerProfileReservationCommentPlaceHolder']}
                      onChange={(event) => this.handleBasicReservationValueChange('comment', event.target.value)} 
                      value={this.props.partnerReservation['comment']}
                      disabled={ !this.props.partnerReservation['edit'] }
                      className="logInput"
                    />
                  </Col>
                </Row>

                <Row className="mobileHide">
                  <Col xs="12" sm="6">
                    <label className="itemLabel"></label>
                    <CheckBox
                      disabled={ !this.props.partnerReservation['edit'] }
                      checked={ this.props.partnerReservation['showPrice'] }
                      field="showPrice"
                      label={this.state.dictionary['partnerProfileReservationShowPrice']}
                      onChange={ () => this.handleBasicReservationValueChange('showPrice', 'toggle') }
                    />
                  </Col>
                  <Col xs="12" sm="6">
                    <ul>
                      <li>{this.state.dictionary['partnerProfileReservationPrice']} <span className="textHighlightGrey">{`${this.props.partnerReservation['price']}rsd`}</span></li>
                      <li>{this.state.dictionary['partnerProfileReservationDeposit']} <span className="textHighlightGrey">{`${this.props.partnerReservation['deposit']}rsd`}</span></li>
                    </ul>
                  </Col>
                </Row>

                {
                  this.props.partnerReservation['edit']
                  ?
                  (
                    <Row className="mobileHide">
                      <Col xs="12">
                        <Alert color="danger" isOpen={ this.state.errorMessages["show"] } toggle={this.closeAlert} >
                          <p hidden={!this.state.errorMessages['fields']['room']}>{this.state.dictionary['partnerProfileReservationAlertRoom']}</p>
                          <p hidden={!this.state.errorMessages['fields']['date']}>{this.state.dictionary['partnerProfileReservationAlertDate']}</p>
                          <p hidden={!this.state.errorMessages['fields']['term']}>{this.state.dictionary['partnerProfileReservationAlertTerm']}</p>
                          <p hidden={!this.state.errorMessages['fields']['guest']}>{this.state.dictionary['partnerProfileReservationAlertGuest']}</p>
                          <p hidden={!this.state.errorMessages['fields']['double']}>{this.state.dictionary['partnerProfileReservationAlertDouble']}</p>
                          <p hidden={!this.state.errorMessages['fields']['resDuplicate']}>{this.state.dictionary['partnerProfileReservationAlertBaseDuplicate']}</p>
                          <p hidden={!this.state.errorMessages['fields']['foodNum']}>{this.state.dictionary['partnerProfileReservationAlertFoodNumber']}</p>
                        </Alert>
                      </Col>
                      <Col xs="12">
                        <div className="middle">
                          <Button color="success" onClick={ () => this.validateReservation(this.handleReservationSave) }>{this.state.dictionary['partnerProfileReservationSave']}</Button>
                        </div>
                      </Col>
                    </Row> 
                  )
                  :
                  null
                }

                {
                  !this.props.partnerReservation['edit'] && this.props.partnerReservation['type'] === 'partner'
                  ?
                  (
                    <Row className="mobileHide">
                      
                      <Col xs="12">
                        <div className="middle">
                          <Button color="danger" onClick={ () => this.toggleModal() }>{this.state.dictionary['partnerProfileReservationDelete']}</Button>
                        </div>
                      </Col>
                    </Row> 
                  )
                  :
                  null
                }

              </Col>


              <Col xs="12" sm="6">
                <Row>
                  <Col xs="12" className="pickSection">
                    <div className="middle">
                      <h5>{this.state.dictionary['partnerProfileReservationCateringSub']}</h5>
                    </div>
                      {
                        isFieldInObject(this.props.partnerObject, 'deals','catering')
                        ?
                        this.props.partnerObject['catering']['deals'].length
                        ?
                        this.props.partnerObject['catering']['deals'].map( (deal, index) => {
                          return(
                            <Row key={`resCateringKey_${index}`} className="nestedRow">
                              <Col xs="12" sm="8" lg="9">
                                <p className="classicPar">{`${this.state.dictionary['partnerProfileReservationCateringPackage']} ${index + 1} - ${getGeneralOptionLabelByValue(generalOptions['dealType_'+this.props.lang], deal['type'])}  - ${this.state.dictionary['partnerProfileReservationCateringPerperson']} ${deal['price']}rsd - ${this.state.dictionary['partnerProfileReservationCateringMin']} ${deal['min']} ${this.state.dictionary['partnerProfileReservationCateringPerson']}`}</p>
                              </Col>
                              <Col xs="12" sm="4" lg="3">

                                <PlainInput 
                                  placeholder={this.state.dictionary['partnerProfileReservationCateringNum']} 
                                  onChange={(event) => this.handleCateringReservationChange(deal['regId'], event.target.value)} 
                                  value={this.props.partnerReservation['food'][deal['regId']] === undefined ? null : this.props.partnerReservation['food'][deal['regId']]} 
                                  disabled={ !this.props.partnerReservation['edit'] }
                                  className="logInput" 
                                  type="number" />
                              </Col>
                            </Row>
                           )
                        })
                        :
                        <p className="fadedPrev">{this.state.dictionary['partnerProfileReservationCateringEmpty']}</p>
                        :
                        <p className="fadedPrev">{this.state.dictionary['partnerProfileReservationCateringEmpty']}</p>
                      }
                  </Col>

                   <Col xs="12" className="pickSection">
                    <div className="middle">
                      <h5>{this.state.dictionary['partnerProfileReservationAddonSub']}</h5>
                    </div>
                      {
                        isFieldInObject(this.props.partnerObject, 'contentAddon')
                        ?
                        this.props.partnerObject['contentAddon'].length
                        ?
                        this.props.partnerObject['contentAddon'].map( (addon, index) => {
                          return(
                            <Row key={`resAddonKey_${index}`} className="nestedRow">
                              
                              <Col xs="2" lg="1">
                                <CheckBox
                                  disabled={ !this.props.partnerReservation['edit'] }
                                  checked={ this.props.partnerReservation['animation'][addon['regId']] === undefined ? false : this.props.partnerReservation['animation'][addon['regId']] }
                                  field={addon['regId']}
                                  onChange={ () => this.handleCheckReservationChange('animation', addon['regId']) }
                                />
                              </Col>
                              <Col xs="10" lg="11">
                                <p>{`${addon['name']}  - ${addon['price']}rsd`}</p>
                                <label className="adonComment">{`${addon['comment']}`}</label>
                              </Col>
                            </Row>
                           )
                        })
                        :
                        <p className="fadedPrev">{this.state.dictionary['partnerProfileReservationAddonEmpty']}</p>
                        :
                        <p className="fadedPrev">{this.state.dictionary['partnerProfileReservationAddonEmpty']}</p>
                      }
                  </Col>

                  <Col xs="12" className="pickSection">
                    <div className="middle">
                      <h5>{this.state.dictionary['partnerProfileReservationDecorationSub']}</h5>
                    </div>
                    <Row>
                      {
                        isFieldInObject(this.props.partnerObject, 'decoration')
                        ?
                        Object.keys(this.props.partnerObject['decoration']).length
                        ?
                        Object.keys(this.props.partnerObject['decoration']).map( (key, index) => {
                          const decor = this.props.partnerObject['decoration'][key];
                          return(
                            <Col xs="12" sm="6" key={`resDecorKey_${index}`}>
                              <Row className="nestedRow">
                                <Col xs="2" lg="2">
                                  <CheckBox
                                    disabled={ !this.props.partnerReservation['edit'] }
                                    checked={ this.props.partnerReservation['decoration'][decor['regId']] === undefined ? false : this.props.partnerReservation['decoration'][decor['regId']] }
                                    field={decor['regId']}
                                    onChange={ () => this.handleCheckReservationChange('decoration', decor['regId']) }
                                  />
                                </Col>
                                <Col xs="10" lg="10">
                                  <p>{`${generalOptions['decorType'][decor['value'].toString()]['name_'+this.props.lang]}  - ${ isFree(decor['price']) ? 'besplatno' : decor['price']+'rsd'}`}</p>
                                </Col>
                                
                              </Row>
                            </Col>
                           )
                        })
                        :
                        <p className="fadedPrev">{this.state.dictionary['partnerProfileReservationDecorationEmpty']}</p>
                        :
                        <p className="fadedPrev">{this.state.dictionary['partnerProfileReservationDecorationEmpty']}</p>
                      }
                    </Row>
                  </Col>

                </Row>

                <Row className="mobileShow">
                  <Col xs="12" sm="6">
                    <label className="itemLabel"></label>
                    <CheckBox
                      disabled={ !this.props.partnerReservation['edit'] }
                      checked={ this.props.partnerReservation['showPrice'] }
                      field="showPrice"
                      label={this.state.dictionary['partnerProfileReservationShowPrice']}
                      onChange={ () => this.handleBasicReservationValueChange('showPrice', 'toggle') }
                    />
                  </Col>
                  <Col xs="12" sm="6">
                    <ul>
                      <li>{this.state.dictionary['partnerProfileReservationPrice']} <span className="textHighlightGrey">{`${this.props.partnerReservation['price']}rsd`}</span></li>
                      <li>{this.state.dictionary['partnerProfileReservationDeposit']} <span className="textHighlightGrey">{`${this.props.partnerReservation['deposit']}rsd`}</span></li>
                    </ul>
                  </Col>
                </Row>

                {
                  this.props.partnerReservation['edit']
                  ?
                  (
                    <Row className="mobileShow">
                      <Col xs="12">
                        <Alert color="danger" isOpen={ this.state.errorMessages["show"] } toggle={this.closeAlert} >
                          <p hidden={!this.state.errorMessages['fields']['room']}>{this.state.dictionary['partnerProfileReservationAlertRoom']}</p>
                          <p hidden={!this.state.errorMessages['fields']['date']}>{this.state.dictionary['partnerProfileReservationAlertDate']}</p>
                          <p hidden={!this.state.errorMessages['fields']['term']}>{this.state.dictionary['partnerProfileReservationAlertTerm']}</p>
                          <p hidden={!this.state.errorMessages['fields']['guest']}>{this.state.dictionary['partnerProfileReservationAlertGuest']}</p>
                          <p hidden={!this.state.errorMessages['fields']['double']}>{this.state.dictionary['partnerProfileReservationAlertDouble']}</p>
                          <p hidden={!this.state.errorMessages['fields']['resDuplicate']}>{this.state.dictionary['partnerProfileReservationAlertBaseDuplicate']}</p>
                          <p hidden={!this.state.errorMessages['fields']['foodNum']}>{this.state.dictionary['partnerProfileReservationAlertFoodNumber']}</p>
                        </Alert>
                      </Col>
                      <Col xs="12">
                        <div className="middle">
                          <Button color="success" onClick={ () => this.validateReservation(this.handleReservationSave) }>{this.state.dictionary['partnerProfileReservationSave']}</Button>
                        </div>
                      </Col>
                    </Row> 
                  )
                  :
                  null
                }


                {
                  !this.props.partnerReservation['edit'] && this.props.partnerReservation['type'] === 'partner'
                  ?
                  (
                    <Row className="mobileShow">
                      
                      <Col xs="12">
                        <div className="middle">
                          <Button color="danger" onClick={ () => this.validateReservation(this.handleReservationSave) }>{this.state.dictionary['partnerProfileReservationDelete']}</Button>
                        </div>
                      </Col>
                    </Row> 
                  )
                  :
                  null
                }

                
              </Col>
            </Row>
            
          </Container>
        </div>
      </div>)
      :
      null
    ) 
  }
}

const mapStateToProps = (state) => ({
  partnerObject: state.PartnerReducer.partner,
  partnerReservation: state.PartnerReducer.partnerReservation,
  partnerRooms: state.PartnerReducer.partnerRooms,

  savePartnerReservationStart: state.PartnerReducer.savePartnerReservationStart,
  savePartnerReservationError: state.PartnerReducer.savePartnerReservationError,
  savePartnerReservationSuccess: state.PartnerReducer.savePartnerReservationSuccess,

  deleteReservationStart: state.ReservationReducer.deleteReservationStart,
  deleteReservationError: state.ReservationReducer.deleteReservationError,
  deleteReservationSuccess: state.ReservationReducer.deleteReservationSuccess,
});


const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
    changeSinglePartnerField,
    getPartnerReservationTerms,
    savePartnerReservation,
    getPartnerReservations,
    deleteReservation,
  },
  dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(ReservationScreen)