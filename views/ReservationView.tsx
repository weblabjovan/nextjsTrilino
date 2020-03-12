import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from '../components/loader';
import { IreservationGeneral } from '../lib/constants/interfaces';
import { Container, Row, Col, Button, Alert } from 'reactstrap';
import { setUserLanguage, changeSingleUserField, loginUser, registrateUser, changePasswordUser } from '../actions/user-actions';
import { changeSingleReservationField } from '../actions/reservation-actions';
import { getLanguage } from '../lib/language';
import { isMobile, setUpLinkBasic, setCookie, getArrayObjectByFieldValue, getObjectFieldByFieldValue, isTrilinoCatering } from '../lib/helpers/generalFunctions';
import { isDateDifferenceValid } from '../lib/helpers/specificReservationFunctions';
import { isEmail, isNumeric, isEmpty, isPhoneNumber, isInputValueMalicious, isMoreThan, isLessThan, isOfRightCharacter, isMatch } from '../lib/helpers/validations';
import genOptions from '../lib/constants/generalOptions';
import PlainInput from '../components/form/input';
import CheckBox from '../components/form/checkbox';
import InfoFix from '../components/reservation/InfoFix';
import ResStep from '../components/reservation/ResStep';
import PaymentRoute from '../components/reservation/PaymentRoute';
import NavigationBar from '../components/navigation/navbar';
import Footer from '../components/navigation/footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface MyProps {
  // using `interface` is also ok
  reservationAdditional: object;
  reservationCatering: object;
  reservationGeneral: IreservationGeneral;
  userLanguage: string;
  userLoginStart: boolean;
  userLoginError: boolean | object;
  userLoginSuccess: null | object;
  userRegistrateStart: boolean;
  userRegistrateError: boolean | object;
  userRegistrateSuccess: null | object;
  userPassChangeStart: boolean;
  userPassChangeError: boolean | object;
  userPassChangeSuccess: null | number;
  setUserLanguage(language: string): string;
  changeSingleReservationField(field: string, value: any): void;
  changeSingleUserField(field: string, value: any): void;
  loginUser(data: object, link: object): void;
  registrateUser(data: object, link: object): void;
  changePasswordUser(param: string, data: object, link: object): object;
  userAgent: string;
  path: string;
  router: object;
  fullPath: string;
  lang: string;
  partner: object;
  token: string;
  link: object;
};
interface MyState {
	language: string;
  logTry: number;
	dictionary: object;
	isMobile: boolean;
  alertOpen: boolean;
  loader: boolean;
  step: number;
  sections: object;
  errors: object;
  info: object;
  price: object;
  paymentRouteErrors: object;
  paymentRouteStage: string;
};

class ReservationView extends React.Component <MyProps, MyState>{

  constructor(props){
    super(props);

    this.componentObjectBinding = this.componentObjectBinding.bind(this);

    const bindingFunctions = [ 'uniInputHandler', 'checkTheBox', 'toggleSteps', 'calculateStepHeight', 'openNextSection', 'validateSection', 'generalSectionValidation', 'closeAlert', 'changeCateringNumber', 'cateringSectionValidation', 'setGeneral', 'setCatering', 'setAddon', 'checkingAddonBox', 'checkingDecorationBox', 'refreshInfoHeight', 'checkDouble', 'handleLogDataSend', 'changePaymentRouteStage', 'validateRegistrationData', 'validateLoginData', 'validatePasswordData', 'sendLoginData', 'sendRegistrationData', 'closePaymentRouteAlert', 'sendUserPass'];
    this.componentObjectBinding(bindingFunctions);
  }

  componentObjectBinding(array){
    array.map( item => {
      this[item] = this[item].bind(this);
    })
  }

	state: MyState = {
      language: this.props.lang.toUpperCase(),
      logTry: 0,
      dictionary: getLanguage(this.props.lang),
      isMobile: isMobile(this.props.userAgent),
      alertOpen: false,
      loader: false,
      step: 1,
      sections: {'1': {active: true, clickable: false }, '2': {active: false, clickable: false }, '3': {active: false, clickable: false }, '4': {active: false, clickable: false } },
      errors: {flag: false, fields: { }},
      info: { general: {name: '', room:'', adultsNum: 0, kidsNum: 0 }, catering: [], addon: []},
      price: {total: this.props.partner['reservation']['term']['price'], term: this.props.partner['reservation']['term']['price'], catering: 0, addon: 0, deposit: this.props.partner['reservation']['term']['price'] * (parseInt(this.props.partner['general']['depositPercent'])/100), trilinoCatering: 0 },
      paymentRouteErrors: { show: false, 
        fields:{ firstName: false, lastName: false, email: false, phoneCode: false, phone: false, terms: false, logEmail: false, password: false , regDuplicate: false, baseError: false, code: false, pass: false, confirm: false, base: false },
        messages:{ baseError: ''}
      },
      paymentRouteStage: this.props.token ? 'payment' : 'login',
    };
  

  validateSection(section: number){
    if (section === 1) {
      this.generalSectionValidation()
    }

    if (section === 2) {
      this.cateringSectionValidation();
    }

    if (section === 3) {
      this.setAddon();
    }
  }



  cateringSectionValidation(){
    const errorsCopy = JSON.parse(JSON.stringify(this.state.errors));
    const objCopy = JSON.parse(JSON.stringify(this.props.reservationCatering));
    errorsCopy['fields'] = {};
    errorsCopy['flag'] = false;

    if (isDateDifferenceValid(48, this.props.router['query']['date'], this.props.router['query']['from'])) {
      Object.keys(objCopy).map(key => {
        if (!isEmpty(objCopy[key]['num'])) {
          if (!isNumeric(objCopy[key]['num'])) {
            errorsCopy['flag'] = true;
            errorsCopy['fields']['catering'] = true;
            errorsCopy['fields'][objCopy[key]['regId']] = true;
          }else{
            if (parseInt(objCopy[key]['num']) < objCopy[key]['min']) {
              errorsCopy['flag'] = true;
              errorsCopy['fields']['catering'] = true;
              errorsCopy['fields'][objCopy[key]['regId']] = true;
            }
          }
        }
      });
    }else{
      Object.keys(objCopy).map(key => {
        if (!isEmpty(objCopy[key]['num'])) {
          errorsCopy['flag'] = true;
          errorsCopy['fields']['cateringTime'] = true;
        }
      });
    }

    this.setState({ errors: errorsCopy}, () => {
      if (!this.state.errors['flag']) {
        this.setCatering();
        this.openNextSection(2);
      }
    });
  }

  generalSectionValidation(){
    const errorsCopy = JSON.parse(JSON.stringify(this.state.errors));
    const objCopy = JSON.parse(JSON.stringify(this.props.reservationGeneral));
    errorsCopy['fields'] = {};
    errorsCopy['flag'] = false;

    if (isEmpty(objCopy['name'])) {
      errorsCopy['flag'] = true;
      errorsCopy['fields']['generalName'] = true;
    }

    if (isEmpty(objCopy['adultsNum']) || !isNumeric(objCopy['adultsNum'])) {
      errorsCopy['flag'] = true;
      errorsCopy['fields']['generalAdults'] = true;
    }

    if (parseInt(objCopy['adultsNum']) > this.props.partner['reservation']['capAdults']) {
      errorsCopy['flag'] = true;
      errorsCopy['fields']['generalAdutsSize'] = true;
    }

    if (isEmpty(objCopy['kidsNum']) || !isNumeric(objCopy['kidsNum'])) {
      errorsCopy['flag'] = true;
      errorsCopy['fields']['generalKids'] = true;
    }

    if (parseInt(objCopy['kidsNum']) > this.props.partner['reservation']['capKids']) {
      errorsCopy['flag'] = true;
      errorsCopy['fields']['generalKidsSize'] = true;
    }

    this.setState({ errors: errorsCopy}, () => {
      if (!this.state.errors['flag']) {
        this.setGeneral();
        this.openNextSection(1);
      }
    });
  }

  setAddon(){
    const priceCopy = JSON.parse(JSON.stringify(this.state.price));
    const infoCopy = JSON.parse(JSON.stringify(this.state.info));
    const additionalCopy = JSON.parse(JSON.stringify(this.props.reservationAdditional));
    const decorationCopy = JSON.parse(JSON.stringify(this.props.partner['decoration']));
    const addonCopy = JSON.parse(JSON.stringify(this.props.partner['contentAddon']));

    const arr = []
    let num = 0;
    Object.keys(additionalCopy).map( key => {
      if (additionalCopy[key]['check']) {
        if (additionalCopy[key]['section'] === 'decoration') {
          const item = getObjectFieldByFieldValue(decorationCopy, 'regId', key);
          if (item) {
            num = num + parseInt(item['price']);
            arr.push({name: genOptions['decorType'][item['value'].toString()][`name_${this.props.lang}`], total: item['price']});
          }
        }

        if (additionalCopy[key]['section'] === 'addon') {
          const match = getArrayObjectByFieldValue(addonCopy, 'regId', key);
          if (match) {
            num = num + parseInt(match['price']);
            arr.push({name:match['name'], total: match['price']});
          }
        }
      }
    })

    infoCopy['addon'] = arr;
    priceCopy['addon'] = num;
    priceCopy['total'] = priceCopy['term'] + priceCopy['catering'] + priceCopy['addon'];
    priceCopy['deposit'] = this.props.partner['general']['despositNumber'] === '1' ? (priceCopy['total'] - priceCopy['trilinoCatering']) * (parseInt(this.props.partner['general']['depositPercent'])/100) : priceCopy['term'] * (parseInt(this.props.partner['general']['depositPercent'])/100);
    priceCopy['deposit'] = this.props.partner['general']['minimalDeposit'] ?  priceCopy['deposit'] < parseInt(this.props.partner['general']['minimalDeposit']) ? parseInt(this.props.partner['general']['minimalDeposit']) : priceCopy['deposit'] : priceCopy['deposit'];
    this.setState({ info: infoCopy, price: priceCopy }, () => {
      this.refreshInfoHeight();
    });

    this.openNextSection(3);
  }

  setCatering(){
    const priceCopy = JSON.parse(JSON.stringify(this.state.price));
    const infoCopy = JSON.parse(JSON.stringify(this.state.info));
    const cateringCopy = JSON.parse(JSON.stringify(this.props.reservationCatering));
    if (Object.keys(cateringCopy).length) {
      const arr = [];
      let num = 0;
      let trilino = 0;
      Object.keys(cateringCopy).map(key => {
        if (!isEmpty(cateringCopy[key]['num'])) {
          if (isTrilinoCatering(key)) {
            trilino = trilino + (parseInt(cateringCopy[key]['num']) * cateringCopy[key]['price']);
          }
          num = num + (parseInt(cateringCopy[key]['num']) * cateringCopy[key]['price']);
          arr.push({name:cateringCopy[key]['name'], quantity: parseInt(cateringCopy[key]['num']), total: parseInt(cateringCopy[key]['num']) * cateringCopy[key]['price']});
        }
      })
      infoCopy['catering'] = arr;
      priceCopy['catering'] = num;
      priceCopy['trilinoCatering'] = trilino;
      priceCopy['total'] = priceCopy['term'] + priceCopy['catering'] + priceCopy['addon'];

      priceCopy['deposit'] = this.props.partner['general']['despositNumber'] === '1' ? (priceCopy['total'] - priceCopy['trilinoCatering']) * (parseInt(this.props.partner['general']['depositPercent'])/100) : priceCopy['term'] * (parseInt(this.props.partner['general']['depositPercent'])/100);
      priceCopy['deposit'] = this.props.partner['general']['minimalDeposit'] ?  priceCopy['deposit'] < parseInt(this.props.partner['general']['minimalDeposit']) ? parseInt(this.props.partner['general']['minimalDeposit']) : priceCopy['deposit'] : priceCopy['deposit'];

      this.setState({ info: infoCopy, price: priceCopy},() => {
        this.refreshInfoHeight();
      });
    }
  }

  setGeneral(){
    const priceCopy = JSON.parse(JSON.stringify(this.state.price));
    const infoCopy = JSON.parse(JSON.stringify(this.state.info));
    const resCopy = JSON.parse(JSON.stringify(this.props.partner['reservation']));
    const generalCopy = JSON.parse(JSON.stringify(this.props.reservationGeneral));

    infoCopy['general']['name'] = generalCopy['name'];
    infoCopy['general']['room'] = resCopy['name'];
    infoCopy['general']['adultsNum'] = generalCopy['adultsNum'];
    infoCopy['general']['kidsNum'] = generalCopy['kidsNum'];

    if (generalCopy['double']) {
      priceCopy['term'] = (this.props.partner['isReadyForDouble']['price'] + priceCopy['term']) * ((100 - parseInt(this.props.partner['general']['doubleDiscount']))/100);
    }

    priceCopy['total'] = priceCopy['term'] + priceCopy['catering'] + priceCopy['addon'];
    priceCopy['deposit'] = this.props.partner['general']['despositNumber'] === '1' ? priceCopy['total'] * (parseInt(this.props.partner['general']['depositPercent'])/100) : priceCopy['term'] * (parseInt(this.props.partner['general']['depositPercent'])/100);
    priceCopy['deposit'] = this.props.partner['general']['minimalDeposit'] ?  priceCopy['deposit'] < parseInt(this.props.partner['general']['minimalDeposit']) ? parseInt(this.props.partner['general']['minimalDeposit']) : priceCopy['deposit'] : priceCopy['deposit'];

    this.setState({ info: infoCopy, price: priceCopy});
  }

  openNextSection(step: number){
    const selectionsCopy = JSON.parse(JSON.stringify(this.state.sections));
    const nextStep = step + 1;
    selectionsCopy[step.toString()] = {active: false, clickable: true };
    selectionsCopy[nextStep.toString()] = {active: true, clickable: false };
    this.setState({sections: selectionsCopy}, () => {
      this.toggleSteps(nextStep);
    })
  }

  toggleSteps(step: number) {
    if (this.state.sections[step.toString()]['clickable'] || this.state.sections[step.toString()]['active']) {
      this.setState({ step }, () => {
        const elem = document.getElementById(`step_${step}`);
        const res = document.getElementById(`resStep_${step}`);
        const forms = [];
        for (var i = 1; i < 5; ++i) {
          if (i !== step) {
            forms.push(document.getElementById(`step_${i}`));
          }
        }

        elem.style.height = this.calculateStepHeight(step);
        forms.map(form => {
          form.style.height = '0px';
        })
        const time = true ? 600 : 1;
        setTimeout(() => {

          forms.map(form => {
            form.style.overflow = 'hidden';
          })
          res.scrollIntoView({ behavior: "smooth", block: "start", inline: "start"});
        }, time);
        
      })
    }
  }

  calculateStepHeight(step: number){
    if (!this.state.isMobile) {
      if (step === 1) {
        return '225px';
      }
      if (step === 2) {
        let items = 0;
        const rows = this.props.partner['catering']['deals'].length;
        this.props.partner['catering']['deals'].map(deal => {
          items = items + deal['items'].length;
        })
        const rowHeight = ((items/2) * 25);
        const safty = rows > 1 ? (rows * 15) : 60;
        const height = (125 * rows) + (55 * rows) + rowHeight + (rows * 35) + safty;
        return `${height}px`;
      }

      if (step === 3) {
        const rows = Object.keys(this.props.partner['decoration']).length  + this.props.partner['contentAddon'].length;
        const height = 150 + (rows * 100);
        return `${height}px`;
      }

      if (step === 4) {
        return '650px';
      }
    }else{
      if (step === 1) {
        return '350px';
      }

      if (step === 2) {
        let items = 0;
        const rows = this.props.partner['catering']['deals'].length;
        this.props.partner['catering']['deals'].map(deal => {
          items = items + deal['items'].length;
        })
        const rowHeight = items * 25;
        const safty = rows > 1 ? (rows * 15) : 50;
        const height = (125 * rows) + (85 * rows) + rowHeight + (rows * 35) + safty;
        return `${height}px`;
      }

      if (step === 3) {
        const rows = Object.keys(this.props.partner['decoration']).length  + this.props.partner['contentAddon'].length;
        const height = 150 + (rows * 95);
        return `${height}px`;
      }

      if (step === 4) {
        return '760px';
      }
    }
  }

  changeCateringNumber(num: string, regId: string, index: number){
    const cateringCopy = JSON.parse(JSON.stringify(this.props.reservationCatering));

    if (cateringCopy[regId]) {
      cateringCopy[regId]['num'] = num;
    }else{
      const dealsCopy = JSON.parse(JSON.stringify(this.props.partner['catering']['deals']));
      const cateringItem = getArrayObjectByFieldValue(dealsCopy, 'regId', regId);
      if (cateringItem) {
        delete cateringItem['items'];
        cateringItem['num'] = num;
        cateringCopy[regId] = cateringItem;
        if (!cateringItem['name']) {
          cateringItem['name'] = `${this.state.dictionary['reservationFormCateringPartnerDeal']} ${index + 1}`;
        }
      }
    }

    this.props.changeSingleReservationField('reservationCatering', cateringCopy);
  }

  checkingDecorationBox(item: any){
    const field = item.getAttribute('data-field');
    this.checkTheBox(field, 'decoration')

  }

  checkingAddonBox(item: any){
    const field = item.getAttribute('data-field');
    this.checkTheBox(field, 'addon')

  }

  checkDouble(){
    const generalCopy = JSON.parse(JSON.stringify(this.props.reservationGeneral));
    generalCopy['double'] = !generalCopy['double'];
    this.props.changeSingleReservationField('reservationGeneral', generalCopy);
  }

  checkTheBox(field: string, type: string){
    const additionalCopy = JSON.parse(JSON.stringify(this.props.reservationAdditional));
    if (additionalCopy[field]) {
      delete additionalCopy[field];
    }else{
      additionalCopy[field] = {check: true, section: type};
    }

    this.props.changeSingleReservationField('reservationAdditional', additionalCopy);
  }

  uniInputHandler(value: any, field: string, object: string){
    const objCopy = JSON.parse(JSON.stringify(this.props[object]));
    objCopy[field] = value;
    this.props.changeSingleReservationField(object, objCopy);
  }

  closeAlert(){
    const errorsCopy = JSON.parse(JSON.stringify(this.state.errors));
    errorsCopy['flag'] = false;
    this.setState({errors: errorsCopy});
  }

  refreshInfoHeight(){
    const elem = document.getElementById(`additional_2`);
    const base = this.state.isMobile && elem.offsetWidth < 500 ? 300 : 340;
    const line = this.state.isMobile ? 30 : 35;
    const add = (this.state.info['catering'].length + this.state.info['addon'].length) * line;

    elem.style.height = `${base + add}px`;
  }



////////////////////////////////// PAYMENT ROUTE FUNCTIONS ////////////////////////////////////

  validateRegistrationData(data: object){
    const errorCopy = JSON.parse(JSON.stringify(this.state.paymentRouteErrors));
    if (this.props.userRegistrateError) {
      this.props.changeSingleUserField('userRegistrateError', false);
    }
    

    if (isEmpty(data['firstName']) || isInputValueMalicious(data['lastName'])) {
      errorCopy['fields']['firstName'] = true;
    }else{
      errorCopy['fields']['firstName'] = false;
    }
    if (isEmpty(data['lastName']) || isInputValueMalicious(data['lastName'])) {
      errorCopy['fields']['lastName'] = true;
    }else{
      errorCopy['fields']['lastName'] = false;
    }
    if (!isEmail(data['email'])) {
      errorCopy['fields']['email'] = true;
    }else{
      errorCopy['fields']['email'] = false;
    }
    if (isEmpty(data['phoneCode'])) {
      errorCopy['fields']['phoneCode'] = true;
    }else{
      errorCopy['fields']['phoneCode'] = false;
    }
    if (!isPhoneNumber(data['phone'], 'sr')) {
      errorCopy['fields']['phone'] = true;
    }else{
      errorCopy['fields']['phone'] = false;
    }
    if (!data['terms']) {
      errorCopy['fields']['terms'] = true;
    }else{
      errorCopy['fields']['terms'] = false;
    }

    errorCopy['fields']['regDuplicate'] = false;

    let showVal = false;

    Object.keys(errorCopy.fields).forEach((key) => {
      if (errorCopy.fields[key] === true) {
        showVal = true;
      }
    })
    errorCopy['show'] = showVal;
    this.setState({paymentRouteErrors: errorCopy}, () => {
      this.sendRegistrationData(data);
    });

  }

  sendRegistrationData(data: object){
    if (!this.state.paymentRouteErrors['show']) {
        this.setState({ loader: true }, () => {
         data['language'] = this.props.lang;
         data['origin'] = 'reservation';
        this.props.registrateUser(data, this.props.link);
      })
     }
  }

  validateLoginData(data: object){
    const errorCopy = JSON.parse(JSON.stringify(this.state.paymentRouteErrors));
    if (!isEmail(data['email'])) {
      errorCopy['fields']['logEmail'] = true;
    }else{
      errorCopy['fields']['logEmail'] = false;
    }
    if (isEmpty(data['password'])) {
      errorCopy['fields']['password'] = true;
    }else{
      errorCopy['fields']['password'] = false;
    }

    errorCopy['fields']['baseError'] = false;
    errorCopy['messages']['baseError'] = '';

    let showVal = false;

    Object.keys(errorCopy.fields).forEach((key) => {
      if (errorCopy.fields[key] === true) {
        showVal = true;
      }
    })
    errorCopy['show'] = showVal;
    this.setState({ paymentRouteErrors: errorCopy }, () => {
      this.sendLoginData(data);
    });
  }

  sendLoginData(data: object){
    if (!this.state.paymentRouteErrors['show']) {
       this.setState({ loader: true }, () => {
         data['language'] = this.props.lang;
        this.props.loginUser(data, this.props.link);
      })
    }
  }

  validatePasswordData(data: object){
    const errorCopy = JSON.parse(JSON.stringify(this.state.paymentRouteErrors));

    if (isEmpty(data['password']) || !isMoreThan(data['password'], 7) || !isLessThan(data['password'], 17) || !isOfRightCharacter(data['password'])) {
      errorCopy['fields']['pass'] = true;
    }else{
      errorCopy['fields']['pass'] = false;
    }
    if(isEmpty(data['confirmation']) || !isMatch(data['password'], data['confirmation'])){
      errorCopy['fields']['confirm'] = true;
    }else{
      errorCopy['fields']['confirm'] = false;
    }
    if (isEmpty(data['code'])) {
      errorCopy['fields']['code'] = true;
    }else{
      errorCopy['fields']['code'] = false;
    }

    errorCopy['fields']['base'] = false;
    let showVal = false;

    Object.keys(errorCopy.fields).forEach((key) => {
      if (errorCopy.fields[key] === true) {
        showVal = true;
      }
    })
    errorCopy['show'] = showVal;
    this.setState({paymentRouteErrors: errorCopy }, () => {
      this.sendUserPass(data);
    });
  }

  sendUserPass(data: object){
    if (!this.state.paymentRouteErrors['show']) {
      this.setState({ loader: true }, () => {
        const dataForSend = {
          id: this.props.userRegistrateSuccess['page'],
          code: data['code'],
          password: data['password'],
          confirmation: data['confirmation'],
          language: this.props.lang,
          token: true,
        }

         this.props.changePasswordUser('_id', dataForSend, this.props.link);
      });
    }
  }


  handleLogDataSend(data: object, type: string){
    if (type === 'registration') {
      this.validateRegistrationData(data);
    }

    if (type === 'login') {
      this.validateLoginData(data);
    }

    if (type === 'newPassword') {
      this.validatePasswordData(data);
    }
  }

  changePaymentRouteStage(stage: string){
    const paymentRouteErrors = { show: false, 
        fields:{ firstName: false, lastName: false, email: false, phoneCode: false, phone: false, terms: false, logEmail: false, password: false , regDuplicate: false, baseError: false, code: false, pass: false, confirm: false, base: false },
        messages:{ baseError: ''}
      };
    this.setState({ paymentRouteStage: stage, paymentRouteErrors });
  }

  closePaymentRouteAlert(){
    const errorCopy = JSON.parse(JSON.stringify(this.state.paymentRouteErrors));
    errorCopy['show'] = false;
    this.setState({paymentRouteErrors: errorCopy});
  }

  componentDidUpdate(prevProps: MyProps, prevState:  MyState){ 
    if (this.state.logTry > 9) {
      window.location.href = `${this.props.link["protocol"]}${this.props.link["host"]}?language=${this.props.lang}`;
    }

    if (this.props.userLoginError && !prevProps.userLoginError && !this.props.userLoginStart) {
      const logTry = this.state.logTry + 1;
      const errorCopy = JSON.parse(JSON.stringify(this.state.paymentRouteErrors));
      errorCopy['show'] = true;
      errorCopy['fields']['baseError'] = true;
      errorCopy['messages']['baseError'] = this.props.userLoginError['message'];

      this.setState({loader: false, logTry, paymentRouteErrors: errorCopy });
    }

    if (this.props.userLoginSuccess && !prevProps.userLoginSuccess && !this.props.userLoginStart) {
      setCookie(this.props.userLoginSuccess['token'],'trilino-user-token', 10);
      this.setState({ loader: false, paymentRouteStage: 'payment'});
    }

    if (this.props.userRegistrateError['code'] === 2 && prevProps.userRegistrateError['code'] !== 2) {
      const errorCopy = JSON.parse(JSON.stringify(this.state.paymentRouteErrors));
      errorCopy['show'] = true;
      errorCopy['fields']['regDuplicate'] = true;
      this.setState({ paymentRouteErrors: errorCopy, loader: false });
    }

    if (!this.props.userRegistrateStart && this.props.userRegistrateSuccess && !prevProps.userRegistrateSuccess) {
      this.setState({loader: false, paymentRouteStage: 'password'});
    }

     if (!this.props.userPassChangeStart && this.props.userPassChangeError && !prevProps.userPassChangeError) {
      const errorCopy = JSON.parse(JSON.stringify(this.state.paymentRouteErrors));
      errorCopy['show'] = true;
      errorCopy['fields']['base'] = true;
      errorCopy['messages']['baseError'] = this.props.userPassChangeError['message'];
      this.setState({loader: false, paymentRouteErrors: errorCopy });
    }

    if (this.props.userPassChangeSuccess && !prevProps.userPassChangeSuccess && !this.props.userPassChangeStart) {
      setCookie(this.props.userPassChangeSuccess['token'],'trilino-user-token', 10);
      this.setState({ loader: false, paymentRouteStage: 'payment'});
    }

  }

	componentDidMount(){
		this.props.setUserLanguage(this.props.lang);
	}
	
  render() {

    return(
    	<div className="totalWrapper">
        <Loader  show={ this.state.loader } />
    		<NavigationBar 
    			isMobile={ this.state.isMobile } 
    			language={ this.state.language } 
          fullPath={ this.props.fullPath }
    			page={ this.props.path ? this.props.path : '' }
    			contact={ this.state.dictionary['navigationContact'] }
    			login={ this.state.dictionary['navigationLogin'] }
    			search={ this.state.dictionary['navigationSearch'] }
    			partnership={ this.state.dictionary['navigationPartnership'] }
    			faq={ this.state.dictionary['navigationFaq'] }
          terms={ this.state.dictionary['navigationTerms'] }
    		/>
    		<div className="reservationWrapper">
          <Container>
              <Row>
                <Col xs='12' lg="5" className="hidden-sm-up">
                  <InfoFix
                    partner={this.props.partner['name']}
                    date={this.props.router['query']['date']}
                    time={`${this.props.router['query']['from']} - ${this.props.router['query']['to']}`}
                    price={ this.state.price['total'] }
                    deposit={ this.state.price['deposit'] }
                    lang={this.props.lang}
                    catering={ this.state.info['catering'] }
                    addon={ this.state.info['addon'] }
                    general={ this.state.info['general'] }
                    mobile={ this.state.isMobile }
                    open={ false }
                    num="1"
                  />
                </Col>
                <Col xs='12' lg="7">
                  <Alert color="danger" isOpen={ this.state.errors["flag"] } toggle={this.closeAlert} >
                    <p hidden={ !this.state.errors['fields']['generalName']} >{this.state.dictionary['reservationAlertGeneralName']}</p>
                    <p hidden={ !this.state.errors['fields']['generalAdults']} >{this.state.dictionary['reservationAlertGeneralAdults']}</p>
                    <p hidden={ !this.state.errors['fields']['generalAdutsSize']} >{this.state.dictionary['reservationAlertGeneralAdutsSize']}</p>
                    <p hidden={ !this.state.errors['fields']['generalKids']} >{this.state.dictionary['reservationAlertGeneralKids']}</p>
                    <p hidden={ !this.state.errors['fields']['generalKidsSize']} >{this.state.dictionary['reservationAlertGeneralKidsSize']}</p>
                    <p hidden={ !this.state.errors['fields']['catering']} >{this.state.dictionary['reservationAlertCatering']}</p>
                    <p hidden={ !this.state.errors['fields']['cateringTime']} >{this.state.dictionary['reservationAlertCateringTime']}</p>
                  </Alert>
                  <ResStep
                    num={ 1 }
                    active={ this.state.sections['1']['active'] }
                    clickable={ this.state.sections['1']['clickable'] }
                    name={this.state.dictionary['reservationResStep1']}
                    clickFunction={ this.toggleSteps }
                    id="resStep_1"
                  />
                  <Row className="step">
                    <Col xs="12" className="formSection" id="step_1">
                      <Row>
                        <Col xs="12" sm="4" lg="4">
                          <label>{this.state.dictionary['reservationFormBasicNameTitle']}</label>
                          <PlainInput
                            placeholder={this.state.dictionary['reservationFormBasicNamePlaceholder']} 
                            onChange={(event) => this.uniInputHandler(event.target.value, 'name', 'reservationGeneral')} 
                            value={this.props.reservationGeneral['name']}
                            className={`${this.state.errors['fields']['generalName'] ? "borderWarrning" : ''} logInput`}
                            type="text"
                          />
                        </Col>

                        <Col xs="12" sm="4" lg="4">
                          <label>{this.state.dictionary['reservationFormBasicAdultsNumTitle']}</label>
                          <PlainInput
                            placeholder={this.state.dictionary['reservationFormBasicAdultsNumPlaceholder']} 
                            onChange={(event) => this.uniInputHandler(event.target.value, 'adultsNum', 'reservationGeneral')} 
                            value={this.props.reservationGeneral['adultsNum']}
                            className={`${this.state.errors['fields']['generalAdults'] || this.state.errors['fields']['generalAdutsSize'] ? "borderWarrning" : ''} logInput`}
                            type="text"
                          />
                        </Col>

                        <Col xs="12" sm="4" lg="4">
                          <label>{this.state.dictionary['reservationFormBasicKidsNumTitle']}</label>
                          <PlainInput
                            placeholder={this.state.dictionary['reservationFormBasicKidsNumPlaceholder']}
                            onChange={(event) => this.uniInputHandler(event.target.value, 'kidsNum', 'reservationGeneral')} 
                            value={this.props.reservationGeneral['kidsNum']}
                            className={`${this.state.errors['fields']['generalKids'] || this.state.errors['fields']['generalKidsSize'] ? "borderWarrning" : ''} logInput`}
                            type="text"
                          />
                        </Col>

                        {
                          this.props.partner.hasOwnProperty('isReadyForDouble')
                          ?
                          (
                            <Col xs="12">
                              <div className="middle doubleBox">
                                <CheckBox
                                  disabled={ false }
                                  checked={ this.props.reservationGeneral['double'] }
                                  field="double"
                                  label={ 'Želim dupli termin'  }
                                  onChange={ this.checkDouble }
                                  orientation="back"
                                />
                              </div>
                            </Col>
                          )
                          :
                          null
                        }

                        

                        <Col xs="12">
                          <div className="middle">
                            <button className="next" onClick={() => this.validateSection(1)} >{this.state.dictionary['uniSave']}</button>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  
                  <ResStep
                    num={ 2 }
                    active={ this.state.sections['2']['active'] }
                    clickable={ this.state.sections['2']['clickable'] }
                    name={this.state.dictionary['reservationResStep2']}
                    clickFunction={ this.toggleSteps }
                    id="resStep_2"
                  />
                  <Row className="step">
                    <Col xs="12" className="formSection hide" style={{'paddingTop': '0px'}} id="step_2">
                      {
                       this.props.partner['catering']['deals'].map( (deal, index) => {
                         return(
                           <Row className="cateringDeal" key={`cateringKey_${index}`}>
                            <Col xs="12" sm="5">
                              <p className="strong">{deal['name'] ? deal['name'] : `${this.state.dictionary['reservationFormCateringPartnerDeal']} ${index + 1}`}</p>
                              <p>{`${this.state.dictionary['reservationFormCateringPerPrice']} ${deal['price']}rsd`}</p>
                              <p>{`${this.state.dictionary['reservationFormCateringMin']} ${deal['min']} ${this.state.dictionary['reservationFormCateringPerson']}`}</p>
                            </Col>

                            <Col xs="12" sm="7">
                              <Row>
                                <Col xs="12"><p className="strong">{this.state.dictionary['reservationFormCateringMenu']}</p></Col>
                                {
                                  deal['items'].map( (item, itemIndex) => {
                                    return(
                                      <Col xs="12" sm="6" key={`itemKey_${itemIndex}`}><p className="second">{item}</p></Col>
                                    )
                                  })
                                }
                              </Row>
                            </Col>

                            <Col xs="12">
                              <div className="mobileWrapper">
                                <label className="strong">{this.state.dictionary['reservationFormCateringNumLabel']}</label>
                                <PlainInput
                                  placeholder={ this.state.dictionary['reservationFormBasicKidsNumPlaceholder'] }
                                  onChange={(event) => this.changeCateringNumber(event.target.value, deal['regId'], index)} 
                                  value={this.props.reservationCatering[deal['regId']] ? this.props.reservationCatering[deal['regId']]['num'] : ''}
                                  className={`${this.state.errors['fields'][deal['regId']] || this.state.errors['fields']['cateringTime'] ? "borderWarrning" : ''} logInput`}
                                  type="text"
                                />
                              </div>
                            </Col>
                          </Row>
                          )
                       })
                      }
                      <Row>
                        <Col xs="12">
                          <div className="middle">
                            <button className="next" onClick={() => this.validateSection(2)} >{this.state.dictionary['uniSave']}</button>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  

                  <ResStep
                    num={ 3 }
                    active={ this.state.sections['3']['active'] }
                    clickable={ this.state.sections['3']['clickable'] }
                    name={this.state.dictionary['reservationResStep3']}
                    clickFunction={ this.toggleSteps }
                    id="resStep_3"
                  />

                  <Row className="step">
                    <Col xs="12" className="formSection hide" id="step_3">
                      <Row className="addonSection">
                        <Col xs="12"><h4>{this.state.dictionary['reservationFormAddonFun']}</h4></Col>
                        <Col xs="12">
                        {
                          this.props.partner['contentAddon'].map( (addon, index) => {
                            return(
                              <Row className="item" key={`addonKey_${index}`}>
                                <Col xs="10">
                                  <p className="name">{addon.name}</p>
                                  <p>{`${this.state.dictionary['reservationFormAddonPrice']} ${addon.price}rsd`}</p>
                                </Col>
                                <Col xs="2">
                                 <CheckBox
                                    disabled={ false }
                                    checked={ this.props.reservationAdditional[addon['regId']] ? true : false }
                                    field={ addon['regId'] }
                                    onChange={ this.checkingAddonBox }
                                  />
                                </Col>
                                <Col xs="12">
                                  <p className="small">{addon.comment ? `*${addon.comment}` : ''}</p>
                                </Col>
                              </Row>
                            )
                          })
                        }
                        </Col>
                      </Row>

                      <Row className="addonSection">
                        <Col xs="12"><h4>{this.state.dictionary['reservationFormAddonDecoration']}</h4></Col>
                        <Col xs="12">
                        {
                          Object.keys(this.props.partner['decoration']).map( (key, index) => {
                            const item = this.props.partner['decoration'][key];
                            return(
                              <Row className="item" key={`decorKey_${index}`}>
                                <Col xs="10">
                                  <p className="name">{genOptions['decorType'][item['value'].toString()][`name_${this.props.lang}`]}</p>
                                  <p>{`${this.state.dictionary['reservationFormAddonPrice']} ${item.price}rsd`}</p>
                                </Col>
                                <Col xs="2">
                                 <CheckBox
                                    disabled={ false }
                                    checked={ this.props.reservationAdditional[item['regId']] ? true : false }
                                    field={ item['regId'] }
                                    onChange={ this.checkingDecorationBox }
                                  />
                                </Col>
                              </Row>
                            )
                          })
                        }
                        </Col>
                      </Row>

                      <Row>
                         <Col xs="12">
                          <div className="middle">
                            <button className="next" onClick={() => this.validateSection(3)} >{this.state.dictionary['uniSave']}</button>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  

                  <ResStep
                    num={ 4 }
                    active={ this.state.sections['4']['active'] }
                    clickable={ this.state.sections['4']['clickable'] }
                    name={this.state.dictionary['reservationResStep4']}
                    clickFunction={ this.toggleSteps }
                    id="resStep_4"
                  />

                  <Row className="step">
                    <Col xs="12" className="formSection hide" id="step_4">
                      <PaymentRoute
                        partner={this.props.partner['name']}
                        date={this.props.router['query']['date']}
                        time={`${this.props.router['query']['from']} - ${this.props.router['query']['to']}`}
                        price={ this.state.price['total'] }
                        deposit={ this.state.price['deposit'] }
                        lang={this.props.lang}
                        catering={ this.state.info['catering'] }
                        addon={ this.state.info['addon'] }
                        general={ this.state.info['general'] }
                        mobile={ this.state.isMobile }

                        handleSend={ this.handleLogDataSend }
                        stage={ this.state.paymentRouteStage }
                        errorMessages={ this.state.paymentRouteErrors }
                        changeStage={ this.changePaymentRouteStage }
                        closeAlert={ this.closePaymentRouteAlert }
                      />
                      {/*<Row>
                        <Col xs="12"><h2>Plaćanje</h2></Col>
                         <Col xs="12">
                          <div className="middle">
                            <button className="next" onClick={() => this.openNextSection(4)} >{this.state.dictionary['uniSave']}</button>
                          </div>
                        </Col>
                      </Row>*/}
                    </Col>
                  </Row>
                  
                </Col>
                <Col xs='12' lg="5" className="hidden-sm">
                  <InfoFix
                    partner={this.props.partner['name']}
                    date={this.props.router['query']['date']}
                    time={`${this.props.router['query']['from']} - ${this.props.router['query']['to']}`}
                    price={ this.state.price['total'] }
                    deposit={ this.state.price['deposit'] }
                    lang={this.props.lang}
                    catering={ this.state.info['catering'] }
                    addon={ this.state.info['addon'] }
                    general={ this.state.info['general'] }
                    mobile={ this.state.isMobile }
                    num="2"
                    open={ true }
                  />
                </Col>
              </Row>
            </Container>
            
          </div> 

		    <Footer 
    			isMobile={ this.state.isMobile } 
    			language={ this.state.language } 
    			page={ this.props.path ? this.props.path : '' }
    			contact={ this.state.dictionary['navigationContact'] }
    			login={ this.state.dictionary['navigationLogin'] }
    			search={ this.state.dictionary['navigationSearch'] }
    			partnership={ this.state.dictionary['navigationPartnership'] }
    			faq={ this.state.dictionary['navigationFaq'] }
          terms={ this.state.dictionary['navigationTerms'] }
    		/>

    	</div>
    	
    ) 
  }
}

const mapStateToProps = (state) => ({
  userLanguage: state.UserReducer.language,

  reservationGeneral: state.ReservationReducer.reservationGeneral,
  reservationAdditional: state.ReservationReducer.reservationAdditional,
  reservationCatering: state.ReservationReducer.reservationCatering,

  userLoginStart: state.UserReducer.userLoginStart,
  userLoginError: state.UserReducer.userLoginError,
  userLoginSuccess: state.UserReducer.userLoginSuccess,

  userRegistrateStart: state.UserReducer.userRegistrateStart,
  userRegistrateError: state.UserReducer.userRegistrateError,
  userRegistrateSuccess: state.UserReducer.userRegistrateSuccess,

  userPassChangeStart: state.UserReducer.userPassChangeStart,
  userPassChangeError: state.UserReducer.userPassChangeError,
  userPassChangeSuccess: state.UserReducer.userPassChangeSuccess,

});


const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setUserLanguage,
    changeSingleReservationField,
    changeSingleUserField,
    loginUser,
    registrateUser,
    changePasswordUser,
  },
  dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(ReservationView)