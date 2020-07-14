import React from 'react';
import Select from 'react-select';
import { Row, Col, Container, Button } from 'reactstrap';
import { getLanguage } from '../../../lib/language';
import { datePickerLang } from '../../../lib/language/dateLanguage';
import generalOptions from '../../../lib/constants/generalOptions';
import { isFieldInObject, getGeneralOptionLabelByValue, isolateByArrayFieldValue, getLayoutNumber, addDaysToDate } from '../../../lib/helpers/specificPartnerFunctions';
import PlainInput from '../../form/input';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import CheckBox from '../../form/checkbox';
import Keys from '../../../server/keys';

interface MyProps {
	partner: null | object;
  show: boolean;
  closeInfo(outcome: boolean, partner: string):void;
  saveMap(map: object):void;
  saveBank(bank: object):void;
  activatePromotion(promotion: object):void;
  saveAllInclusive(allInclusive: object):void;
};
interface MyState {
  dictionary: object;
  lang: string;
  lockMapFields: boolean;
  mapInfo: object;
  bankInfo: object;
  lockBankFields: boolean;
  promoDeadline: Date;
  allInclusive: boolean;
  inclusiveFix: number | null;
  lockInclusive: boolean;
};

export default class AdminPartnerInfo extends React.Component <MyProps, MyState>{

	constructor(props){
    super(props);

    this.componentObjectBinding = this.componentObjectBinding.bind(this);

    const bindingFunctions = ['toggleLock', 'changeStateObj', 'closeInfo', 'formatDate', 'changeStateField'];
    this.componentObjectBinding(bindingFunctions);
  }

  componentObjectBinding(array){
    array.map( item => {
      this[item] = this[item].bind(this);
    })
  }

	state: MyState = {
    dictionary: getLanguage('sr'),
    lang: 'sr',
    lockMapFields: true,
    mapInfo: { lat: '', lng: ''},
    bankInfo: {name: '', account: ''},
    lockBankFields: true,
    promoDeadline: new Date,
    allInclusive: false,
    inclusiveFix: null,
    lockInclusive: false,
  };

  toggleLock(field: string){
     this.setState(prevState => ({
      ...prevState,
      [field]: !this.state[field] // No error here, but can't ensure that key is in StateKeys
    }));
  }

  changeStateField(val: string, field: string){
    this.setState(prevState => ({
      ...prevState,
      [field]: val // No error here, but can't ensure that key is in StateKeys
    }));
  }

  changeStateObj(obj: string, val: string, field: string){
  	const copy = JSON.parse(JSON.stringify(this.state[obj]));
  	copy[field] = val;
    this.setState(prevState => ({
      ...prevState,
      [obj]: copy // No error here, but can't ensure that key is in StateKeys
    }));
  }

  closeInfo(){
    this.setState({
      dictionary: getLanguage('sr'),
      lang: 'sr',
      lockMapFields: true,
      mapInfo: { lat: 0, lng: 0},
      bankInfo: {name: '', account: ''},
      lockBankFields: true,
    }, () => {
      this.props.closeInfo(false, '')
    })
  }

  formatDate(date, format, locale) {
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  }

  dateChange = date => {
    this.setState({ promoDeadline: date });
  }

  componentDidUpdate(prevProps: MyProps, prevState:  MyState){
  	if (this.props.show && !prevProps.show) {
  		if (this.props.partner) {
  			if (this.props.partner['map']) {
  				this.setState({mapInfo: {lat: this.props.partner['map']['lat'].toString(), lng:this.props.partner['map']['lng'].toString() }})
  			}
        if (this.props.partner['bank']) {
          this.setState({bankInfo: this.props.partner['bank'] })
        }

        if (this.props.partner['promotion']) {
          const d = new Date(this.props.partner['promotion']['initialDeadline']);
          this.setState({promoDeadline: d })
        }

        if (this.props.partner['allInclusive']) {
          this.setState({allInclusive: this.props.partner['allInclusive']['inclusive'], inclusiveFix: this.props.partner['allInclusive']['fix'], lockInclusive: true })
        }
  		}
  	}
  }

	
  render() {

    return(
      this.props.show 
      ?
      (
        <div className="darkCover" >
          <div className="partnerActions">
              <Container fluid>
                <Row>
                  <span className="icon closeIt absol" onClick={ this.closeInfo }></span>
                  <Col xs="10">
                    <div className="pageHeader">
                      <h2>Akcije</h2>
                    </div>
                  </Col>
                  
                </Row>

                <Row>
                	<Col xs="12" lg="6">
                		<Row className="section">
                			<Col xs="12">
                				<h4>Mape:</h4>
                			</Col>
                			<Col xs="12" lg="4">
                				<label>Geografska širina</label>
					            	<PlainInput 
					                placeholder="lat"
					                onChange={(event) => this.changeStateObj('mapInfo', event.target.value, 'lat')} 
					                value={this.state.mapInfo['lat']} 
					                type="text"
					                disabled={ this.state.lockMapFields }
					                className="logInput" />
                			</Col>
                			<Col xs="12" lg="4">
                				<label>Geografska dužina</label>
                				<PlainInput 
					                placeholder="lng"
					                onChange={(event) => this.changeStateObj('mapInfo', event.target.value, 'lng')} 
					                value={this.state.mapInfo['lng']} 
					                type="text"
					                disabled={ this.state.lockMapFields }
					                className="logInput" />
                			</Col>
                			
                			<Col xs="12" lg="2" style={{'textAlign': 'center'}}>
                				<label>Zaključaj</label>
                				<CheckBox
                          disabled={ false }
                          checked={ this.state.lockMapFields }
                          field={ 'mapLock' }
                          onChange={ () => this.toggleLock('lockMapFields') }
                        />
                			</Col>

                			<Col xs="12" lg="2">
                				<Button color="success" onClick={ () => this.props.saveMap(this.state.mapInfo) }>Sačuvaj</Button>
                			</Col>
                		</Row>
                	</Col>
                </Row>

                <Row>
                  <Col xs="12" lg="6">
                    <Row className="section bank">
                      <Col xs="12">
                        <h4>Banka:</h4>
                      </Col>
                      <Col xs="12" lg="4">
                        <label>Broj računa</label>
                        <PlainInput 
                          placeholder="račun"
                          onChange={(event) => this.changeStateObj('bankInfo', event.target.value, 'account')} 
                          value={this.state.bankInfo['account']} 
                          type="text"
                          disabled={ this.state.lockBankFields }
                          className="logInput" />
                      </Col>
                      <Col xs="12" lg="4">
                        <label>Naziv banke</label>
                        <PlainInput 
                          placeholder="naziv"
                          onChange={(event) => this.changeStateObj('bankInfo', event.target.value, 'name')} 
                          value={this.state.bankInfo['name']} 
                          type="text"
                          disabled={ this.state.lockBankFields }
                          className="logInput" />
                      </Col>
                      
                      <Col xs="12" lg="2" style={{'textAlign': 'center'}}>
                        <label>Zaključaj</label>
                        <CheckBox
                          disabled={ false }
                          checked={ this.state.lockBankFields }
                          field={ 'bankLock' }
                          onChange={ () => this.toggleLock('lockBankFields') }
                        />
                      </Col>

                      <Col xs="12" lg="2">
                        <Button color="success" onClick={ () => this.props.saveBank(this.state.bankInfo) }>Sačuvaj</Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>


                <Row>
                  <Col xs="12" lg="6">
                    <Row className="section bank">
                      <Col xs="12">
                        <h4>All inclusive:</h4>
                      </Col>
                      <Col xs="12" lg="4">
                        <label>All inclusive partner</label>
                        <CheckBox
                          disabled={ this.state.lockInclusive }
                          checked={ this.state.allInclusive }
                          field={ 'allInclusive' }
                          onChange={ () => this.toggleLock('allInclusive') }
                        />
                      </Col>
                      <Col xs="12" lg="4">
                        <label>Fixna provizija</label>
                        <PlainInput 
                          placeholder="provizija"
                          onChange={(event) => this.changeStateField(event.target.value, 'inclusiveFix')} 
                          value={this.state.inclusiveFix} 
                          type="text"
                          disabled={ this.state.lockInclusive }
                          className="logInput" />
                      </Col>
                      
                      <Col xs="12" lg="2" style={{'textAlign': 'center'}}>
                        <label>Zaključaj</label>
                        <CheckBox
                          disabled={ false }
                          checked={ this.state.lockInclusive }
                          field={ 'inclusiveLock' }
                          onChange={ () => this.toggleLock('lockInclusive') }
                        />
                      </Col>

                      <Col xs="12" lg="2">
                        <Button color="success" onClick={ () => this.props.saveAllInclusive({ inclusive: this.state.allInclusive, fix: this.state.inclusiveFix }) }>Sačuvaj</Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>


                <Row>
                  <Col xs="12" lg="6">
                    <Row className="section bank">
                      <Col xs="12">
                        <h4>Promocija:</h4>
                      </Col>
                      <Col xs="12" lg="6">
                        <label>{this.props.partner['promotion'] ? 'Ovaj partner ima aktiviranu promociju koja traje do datuma iskazanog u polju rok. Promena roka nije moguća.' : 'Ovaj partner nema aktiviranu promociju. Ukoliko želite da je aktivirate u polju rok označite do kada će promocija biti aktivna i kliknite na dugme AKTIVIRAJ' }.</label>
                      </Col>
                      <Col xs="12" lg="4">
                        <label>Rok</label>
                        <DayPickerInput 
                            inputProps={{ disabled: this.props.partner['promotion'] ? true : false }}
                            value={ this.state.promoDeadline }
                            formatDate={ this.formatDate }
                            placeholder="Izaberite datum"
                            onDayChange= { this.dateChange }
                            format="dd/mm/yyyy"
                            hideOnDayClick={ true }
                            keepFocus={ false }
                            dayPickerProps={{
                              disabledDays: {
                                  before: new Date(),
                                  after: addDaysToDate(null, 365),
                              },
                              todayButton: datePickerLang[this.state.lang]['today'],
                              selectedDays: [ this.state.promoDeadline ],
                              weekdaysShort: datePickerLang[this.state.lang]['daysShort'],
                              months: datePickerLang[this.state.lang]['months']
                            }}
                           />
                      </Col>

                      <Col xs="12" lg="2">
                        <Button color="success" disabled={ this.props.partner['promotion'] ? true : false } onClick={ () => this.props.activatePromotion({initialDeadline: this.state.promoDeadline}) }>Aktiviraj</Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>

              </Container>    
          </div>
        </div>
      )
      :
      null
    ) 
  }
}