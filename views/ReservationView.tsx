import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from '../components/loader';
import { IreservationGeneral } from '../lib/constants/interfaces';
import { Container, Row, Col, Button, Alert } from 'reactstrap';
import { setUserLanguage } from '../actions/user-actions';
import { changeSingleReservationField } from '../actions/reservation-actions';
import { getLanguage } from '../lib/language';
import { isMobile, setUpLinkBasic, getArrayObjectByFieldValue, getObjectFieldByFieldValue } from '../lib/helpers/generalFunctions';
import { isDateDifferenceValid } from '../lib/helpers/specificReservationFunctions';
import { isNumeric, isEmpty, isInputValueMalicious } from '../lib/helpers/validations';
import genOptions from '../lib/constants/generalOptions';
import PlainInput from '../components/form/input';
import CheckBox from '../components/form/checkbox';
import InfoFix from '../components/reservation/InfoFix';
import ResStep from '../components/reservation/ResStep';
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
  setUserLanguage(language: string): string;
  changeSingleReservationField(field: string, value: any): void;
  userAgent: string;
  path: string;
  router: object;
  fullPath: string;
  lang: string;
  partner: object;
};
interface MyState {
	language: string;
	dictionary: object;
	isMobile: boolean;
  alertOpen: boolean;
  loader: boolean;
  step: number;
  sections: object;
  errors: object;
  info: object;
  price: object;
};

class ReservationView extends React.Component <MyProps, MyState>{

  constructor(props){
    super(props);

    this.componentObjectBinding = this.componentObjectBinding.bind(this);

    const bindingFunctions = [ 'uniInputHandler', 'checkTheBox', 'toggleSteps', 'calculateStepHeight', 'openNextSection', 'validateSection', 'generalSectionValidation', 'closeAlert', 'changeCateringNumber', 'cateringSectionValidation', 'setGeneral', 'setCatering', 'setAddon', 'checkingAddonBox', 'checkingDecorationBox', 'refreshInfoHeight', 'checkDouble'];
    this.componentObjectBinding(bindingFunctions);
  }

  componentObjectBinding(array){
    array.map( item => {
      this[item] = this[item].bind(this);
    })
  }

	state: MyState = {
      language: this.props.lang.toUpperCase(),
      dictionary: getLanguage(this.props.lang),
      isMobile: isMobile(this.props.userAgent),
      alertOpen: false,
      loader: false,
      step: 1,
      sections: {'1': {active: true, clickable: false }, '2': {active: false, clickable: false }, '3': {active: false, clickable: false }, '4': {active: false, clickable: false } },
      errors: {flag: false, fields: { }},
      info: { general: {name: '', room:'', adultsNum: 0, kidsNum: 0 }, catering: [], addon: []},
      price: {total: this.props.partner['reservation']['term']['price'], term: this.props.partner['reservation']['term']['price'], catering: 0, addon: 0 },
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
      Object.keys(cateringCopy).map(key => {
        if (!isEmpty(cateringCopy[key]['num'])) {
          num = num + (parseInt(cateringCopy[key]['num']) * cateringCopy[key]['price']);
          arr.push({name:cateringCopy[key]['name'], quantity: parseInt(cateringCopy[key]['num']), total: parseInt(cateringCopy[key]['num']) * cateringCopy[key]['price']});
        }
      })
      infoCopy['catering'] = arr;
      priceCopy['catering'] = num;
      priceCopy['total'] = priceCopy['term'] + priceCopy['catering'] + priceCopy['addon'];
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
      priceCopy['term'] = this.props.partner['isReadyForDouble']['price'] + priceCopy['term'];
    }

    priceCopy['total'] = priceCopy['term'] + priceCopy['catering'] + priceCopy['addon'];

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
      if (step === 1 || step === 4) {
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
    }else{
      if (step === 1 || step === 4) {
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
    const base = this.state.isMobile ? 260 : 340;
    const line = this.state.isMobile ? 30 : 35;
    const add = (this.state.info['catering'].length + this.state.info['addon'].length) * line;

    elem.style.height = `${base + add}px`;
  }

  componentDidUpdate(prevProps: MyProps, prevState:  MyState){ 
    
  }

	componentDidMount(){
    console.log(this.props.partner)
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
                    lang={this.props.lang}
                    catering={ this.state.info['catering'] }
                    addon={ this.state.info['addon'] }
                    general={ this.state.info['general'] }
                    mobile={ this.state.isMobile }
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
                        <Col xs="12" sm="6" lg="4">
                          <label>{this.state.dictionary['reservationFormBasicNameTitle']}</label>
                          <PlainInput
                            placeholder={this.state.dictionary['reservationFormBasicNamePlaceholder']} 
                            onChange={(event) => this.uniInputHandler(event.target.value, 'name', 'reservationGeneral')} 
                            value={this.props.reservationGeneral['name']}
                            className={`${this.state.errors['fields']['generalName'] ? "borderWarrning" : ''} logInput`}
                            type="text"
                          />
                        </Col>

                        <Col xs="12" sm="6" lg="4">
                          <label>{this.state.dictionary['reservationFormBasicAdultsNumTitle']}</label>
                          <PlainInput
                            placeholder={this.state.dictionary['reservationFormBasicAdultsNumPlaceholder']} 
                            onChange={(event) => this.uniInputHandler(event.target.value, 'adultsNum', 'reservationGeneral')} 
                            value={this.props.reservationGeneral['adultsNum']}
                            className={`${this.state.errors['fields']['generalAdults'] || this.state.errors['fields']['generalAdutsSize'] ? "borderWarrning" : ''} logInput`}
                            type="text"
                          />
                        </Col>

                        <Col xs="12" sm="6" lg="4">
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
                                  <p className="small">{`*${addon.comment}`}</p>
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
                      <h1>Plaćanje</h1>
                      <Row>
                         <Col xs="12">
                          <div className="middle">
                            <button className="next" onClick={() => this.openNextSection(4)} >{this.state.dictionary['uniSave']}</button>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  
                </Col>
                <Col xs='12' lg="5" className="hidden-sm">
                  <InfoFix
                    partner={this.props.partner['name']}
                    date={this.props.router['query']['date']}
                    time={`${this.props.router['query']['from']} - ${this.props.router['query']['to']}`}
                    price={ this.state.price['total'] }
                    lang={this.props.lang}
                    catering={ this.state.info['catering'] }
                    addon={ this.state.info['addon'] }
                    general={ this.state.info['general'] }
                    mobile={ this.state.isMobile }
                    num="2"
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
});


const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setUserLanguage,
    changeSingleReservationField,
  },
  dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(ReservationView)