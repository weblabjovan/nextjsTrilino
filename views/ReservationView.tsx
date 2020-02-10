import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from '../components/loader';
import { IreservationGeneral } from '../lib/constants/interfaces';
import { Container, Row, Col, Button, Alert } from 'reactstrap';
import { setUserLanguage } from '../actions/user-actions';
import { changeSingleReservationField } from '../actions/reservation-actions';
import { getLanguage } from '../lib/language';
import { isMobile, setCookie, setUpLinkBasic } from '../lib/helpers/generalFunctions';
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
  reservationGeneral: IreservationGeneral;
  userLanguage: string;
  setUserLanguage(language: string): string;
  changeSingleReservationField(field: string, value: any): void;
  userAgent: string;
  path: string;
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
};

class ReservationView extends React.Component <MyProps, MyState>{

  constructor(props){
    super(props);

    this.componentObjectBinding = this.componentObjectBinding.bind(this);

    const bindingFunctions = [ 'uniInputHandler', 'checkTheBox', 'toggleSteps', 'calculateStepHeight', 'openNextSection'];
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
      sections: {'1': {active: true, clickable: false }, '2': {active: false, clickable: false }, '3': {active: false, clickable: false }, '4': {active: false, clickable: false } }
    };
  

  componentDidUpdate(prevProps: MyProps, prevState:  MyState){ 
    
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

        // elem.classList.toggle('hide');
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
        return '175px';
      }
      if (step === 2) {
        let items = 0;
        const rows = this.props.partner['catering']['deals'].length;
        this.props.partner['catering']['deals'].map(deal => {
          items = items + deal['items'].length;
        })
        const rowHeight = ((items/2) * 25);
        const height = (125 * rows) + (55 * rows) + rowHeight + (rows * 35);
        return `${height}px`;
      }

      if (step === 3) {
        const rows = Object.keys(this.props.partner['decoration']).length  + this.props.partner['contentAddon'].length;
        const height = 150 + (rows * 100);
        return `${height}px`;
      }
    }else{
      if (step === 1 || step === 4) {
        return '300px';
      }

      if (step === 2) {
        let items = 0;
        const rows = this.props.partner['catering']['deals'].length;
        this.props.partner['catering']['deals'].map(deal => {
          items = items + deal['items'].length;
        })
        const rowHeight = items * 25;
        const height = (125 * rows) + (85 * rows) + rowHeight + (rows * 35);
        console.log(height);
        return `${height}px`;
      }

      if (step === 3) {
        const rows = Object.keys(this.props.partner['decoration']).length  + this.props.partner['contentAddon'].length;
        const height = 150 + (rows * 95);
        return `${height}px`;
      }
    }
    
  }

  checkTheBox(item: any){
    const field = item.getAttribute('data-field');
    const additionalCopy = JSON.parse(JSON.stringify(this.props.reservationAdditional));
    if (additionalCopy[field]) {
      delete additionalCopy[field];
    }else{
      additionalCopy[field] = true;
    }

    this.props.changeSingleReservationField('reservationAdditional', additionalCopy);
  }

  uniInputHandler(value: any, field: string, object: string){
    const objCopy = JSON.parse(JSON.stringify(this.props[object]));
    objCopy[field] = value;
    this.props.changeSingleReservationField(object, objCopy);
  }

	componentDidMount(){
		this.props.setUserLanguage(this.props.lang);
		// console.log(this.props.userAgent);
	}
	
  render() {
    const catering = [{name: 'Partner 1', quantity: 30, total: 15000}, {name: 'Trilino lux', quantity: 20, total: 10000}];
    const addon = [{name: 'Laser tag', total: 5000 }, {name: 'Baloni', total: 1000 }, {name: 'Klovnovi', total: 2000 }];
    const general = { name: 'Milam', adultsNum: 30, kidsNum: 20, room: this.props.partner['reservation']['name']};
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
                    date="24.03.2020"
                    time="10:00 - 12:30"
                    price={ 21500 }
                    lang={this.props.lang}
                    catering={ catering }
                    addon={ addon }
                    general={ general }
                    mobile={ this.state.isMobile }
                    num="1"
                  />
                </Col>
                <Col xs='12' lg="7">
                  <ResStep
                    num={ 1 }
                    active={ this.state.sections['1']['active'] }
                    clickable={ this.state.sections['1']['clickable'] }
                    name="Osnovni podaci"
                    clickFunction={ this.toggleSteps }
                    id="resStep_1"
                  />
                  <Row className="step">
                    <Col xs="12" className="formSection" id="step_1">
                      <Row>
                        <Col xs="12" sm="6" lg="4">
                          <label>Ime slavljenika/ce:</label>
                          <PlainInput
                            placeholder="ime" 
                            onChange={(event) => this.uniInputHandler(event.target.value, 'name', 'reservationGeneral')} 
                            value={this.props.reservationGeneral['name']}
                            className="logInput"
                            type="text"
                          />
                        </Col>

                        <Col xs="12" sm="6" lg="4">
                          <label>Očekivani broj odraslih:</label>
                          <PlainInput
                            placeholder="broj" 
                            onChange={(event) => this.uniInputHandler(event.target.value, 'adultsNum', 'reservationGeneral')} 
                            value={this.props.reservationGeneral['adultsNum']}
                            className="logInput"
                            type="text"
                          />
                        </Col>

                        <Col xs="12" sm="6" lg="4">
                          <label>Očekivani broj dece:</label>
                          <PlainInput
                            placeholder="broj" 
                            onChange={(event) => this.uniInputHandler(event.target.value, 'kidsNum', 'reservationGeneral')} 
                            value={this.props.reservationGeneral['kidsNum']}
                            className="logInput"
                            type="text"
                          />
                        </Col>

                        <Col xs="12">
                          <div className="middle">
                            <button className="next" onClick={() => this.openNextSection(1)} >Sačuvaj</button>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  
                  <ResStep
                    num={ 2 }
                    active={ this.state.sections['2']['active'] }
                    clickable={ this.state.sections['2']['clickable'] }
                    name="Ketering"
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
                              <p className="strong">{deal['name'] ? deal['name'] : `Partner paket ${index + 1}`}</p>
                              <p>{`Cena po osobi ${deal['price']}rsd`}</p>
                              <p>{`Minimum ${deal['min']} osoba`}</p>
                            </Col>

                            <Col xs="12" sm="7">
                              <Row>
                                <Col xs="12"><p className="strong">Meni:</p></Col>
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
                                <label className="strong">Broj gostiju koji želi ovaj paket:</label>
                                <PlainInput
                                  placeholder="broj" 
                                  onChange={(event) => this.uniInputHandler(event.target.value, 'kidsNum', 'reservationGeneral')} 
                                  value={this.props.reservationGeneral['kidsNum']}
                                  className="logInput"
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
                            <button className="next" onClick={() => this.openNextSection(2)} >Sačuvaj</button>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  

                  <ResStep
                    num={ 3 }
                    active={ this.state.sections['3']['active'] }
                    clickable={ this.state.sections['3']['clickable'] }
                    name="Dodatni sadržaj"
                    clickFunction={ this.toggleSteps }
                    id="resStep_3"
                  />

                  <Row className="step">
                    <Col xs="12" className="formSection hide" id="step_3">
                      <Row className="addonSection">
                        <Col xs="12"><h4>Zabava</h4></Col>
                        <Col xs="12">
                        {
                          this.props.partner['contentAddon'].map( (addon, index) => {
                            return(
                              <Row className="item" key={`addonKey_${index}`}>
                                <Col xs="10">
                                  <p className="name">{addon.name}</p>
                                  <p>{`Cena ${addon.price}rsd`}</p>
                                </Col>
                                <Col xs="2">
                                 <CheckBox
                                    disabled={ false }
                                    checked={ this.props.reservationAdditional[addon['regId']] ? true : false }
                                    field={ addon['regId'] }
                                    onChange={ this.checkTheBox }
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
                        <Col xs="12"><h4>Dekoracija</h4></Col>
                        <Col xs="12">
                        {
                          Object.keys(this.props.partner['decoration']).map( (key, index) => {
                            const item = this.props.partner['decoration'][key];
                            return(
                              <Row className="item" key={`decorKey_${index}`}>
                                <Col xs="10">
                                  <p className="name">{genOptions['decorType'][item['value'].toString()][`name_${this.props.lang}`]}</p>
                                  <p>{`Cena ${item.price}rsd`}</p>
                                </Col>
                                <Col xs="2">
                                 <CheckBox
                                    disabled={ false }
                                    checked={ this.props.reservationAdditional[item['regId']] ? true : false }
                                    field={ item['regId'] }
                                    onChange={ this.checkTheBox }
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
                            <button className="next" onClick={() => this.openNextSection(3)} >Sačuvaj</button>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  

                  <ResStep
                    num={ 4 }
                    active={ this.state.sections['4']['active'] }
                    clickable={ this.state.sections['4']['clickable'] }
                    name="Plaćanje"
                    clickFunction={ this.toggleSteps }
                    id="resStep_4"
                  />

                  <Row className="step">
                    <Col xs="12" className="formSection hide" id="step_4">
                      <h1>Plaćanje</h1>
                      <Row>
                         <Col xs="12">
                          <div className="middle">
                            <button className="next" onClick={() => this.openNextSection(4)} >Sačuvaj</button>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  
                </Col>
                <Col xs='12' lg="5" className="hidden-sm">
                  <InfoFix
                    partner={this.props.partner['name']}
                    date="24.03.2020"
                    time="10:00 - 12:30"
                    price={ 21500 }
                    lang={this.props.lang}
                    catering={ catering }
                    addon={ addon }
                    general={ general }
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
});


const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setUserLanguage,
    changeSingleReservationField,
  },
  dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(ReservationView)