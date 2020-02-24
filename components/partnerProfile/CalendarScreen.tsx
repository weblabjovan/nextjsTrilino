import React from 'react';
import Select from 'react-select';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReservationScreen from './calendar/ReservationScreen';
import { Container, Row, Col, Button, Alert } from 'reactstrap';
import { getLanguage } from '../../lib/language';
import generalOptions from '../../lib/constants/generalOptions';
import { changeSinglePartnerField, getPartnerReservationTerms, getPartnerReservations } from '../../actions/partner-actions';
import { isFieldInObject, getGeneralOptionLabelByValue, getOnlyValues, prepareDecorationDataForSave, getRoomsSelector, setDateToDayStart, getCurrentWeekStartAndEnd, addDaysToDate, getFieldValueByRegId } from '../../lib/helpers/specificPartnerFunctions';
import { momentLocalize, getLocalMessages } from '../../lib/language/locale';
import { setUpLinkBasic } from '../../lib/helpers/generalFunctions';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style/style.scss';

interface MyProps {
  // using `interface` is also ok
  lang: string;
  token?: string | undefined;
	partnerObject: null | object;
  partnerReservation: null | object;
  partnerRooms: Array<object>;
  getPartnerReservationsStart: boolean;
  getPartnerReservationsError: boolean;
  getPartnerReservationsSuccess: null | number;
  partnerReservationsList: Array<object>;
  forActivation: boolean;
  activationAlert: boolean;
  activationProcessPercent: number;
  changeSinglePartnerField(field: string, value: any): any;
  getPartnerReservationTerms(link: object, data: object): any;
  getPartnerReservations(link: object, data: object): any;
  closeLoader(): void;
  openLoader(): void;
};
interface MyState {
	dictionary: object;
	loader: boolean;
  reservationShow: boolean;
  activeRoom?: number | object;
	errorMessages: object;
  dates: object;
  ready: boolean;
};

class CalendarScreen extends React.Component <MyProps, MyState>{

	constructor(props){
    super(props);

    this.componentObjectBinding = this.componentObjectBinding.bind(this);

    const bindingFunctions = [ 'handleInputChange', 'setReservationShow', 'handleRoomChange', 'handleCalendarDateRangeChange', 'openExistingReservation', 'closeActivationAlert'];
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
    reservationShow: false,
    activeRoom: 1,
		errorMessages: { show: false, fields:{ addonName: false, addonPrice: false, addonComment: false }},
    dates: getCurrentWeekStartAndEnd(),
    ready: true,
  };

  handleInputChange(field, value){
     this.setState(prevState => ({
      ...prevState,
      [field]: value // No error here, but can't ensure that key is in StateKeys
    }));
  }

  setReservationShow(output: boolean){
    const partnerReservation = JSON.parse(JSON.stringify(this.props.partnerReservation));
    if (output) {
      if (this.state.ready) {
        partnerReservation['room'] = this.state.activeRoom;
        partnerReservation['date'] = new Date();
        partnerReservation['partner'] = this.props.partnerObject['_id'];
        partnerReservation['edit'] = true;
        
        const link = setUpLinkBasic(window.location.href);
        const date = new Date();
        this.props.getPartnerReservationTerms(link, {partner: this.props.partnerObject['_id'], date: setDateToDayStart(date.toString()), room: this.state.activeRoom['value'], language: this.props.lang});
      }
      
    }else{
      partnerReservation['partner'] = '';
      partnerReservation['type'] = 'partner';
      partnerReservation['room'] = 0;
      partnerReservation['date'] = new Date();
      partnerReservation['term'] = '';
      partnerReservation['options'] = [];
      partnerReservation['terms'] = [];
      partnerReservation['from'] = '';
      partnerReservation['to'] = '';
      partnerReservation['double'] = false;
      partnerReservation['user'] = '';
      partnerReservation['userName'] = '';
      partnerReservation['guest'] = '';
      partnerReservation['food'] = {};
      partnerReservation['animation'] = {};
      partnerReservation['decoration'] = {};
      partnerReservation['comment'] = '';
      partnerReservation['edit'] = true;
      partnerReservation['showPrice'] = false;
      partnerReservation['termPrice'] = 0;
      partnerReservation['animationPrice'] = 0;
      partnerReservation['decorationPrice'] = 0;
      partnerReservation['foodPrice'] = 0;
      partnerReservation['price'] = 0;
      partnerReservation['deposit'] = 0;
      partnerReservation['id'] = '';
    }
    
    this.props.changeSinglePartnerField('partnerReservation', partnerReservation);
    this.handleInputChange('reservationShow', output);
  }

  handleRoomChange(value: object | string) {
    const link = setUpLinkBasic(window.location.href);
      this.props.getPartnerReservations(link, {type: 'partner', language: this.props.lang, partner: this.props.partnerObject['_id'], room: value['value'], dates: this.state.dates });
    this.handleInputChange('activeRoom', value);
  }


  handleCalendarDateRangeChange(event: any){
    if (this.state.ready) {
      if (event['start']) {
        this.setState({ dates: {start: event['start'], end: event['end']}}, () => {
          const link = setUpLinkBasic(window.location.href);
          this.props.getPartnerReservations(link, {type: 'partner', language: this.props.lang, partner: this.props.partnerObject['_id'], room: getRoomsSelector(this.props.partnerRooms)[0]['value'], dates: this.state.dates });
        });
      }else{
        let dates = {};
        if (event.length > 1) {
          dates = {start: event[0], end: event[event.length - 1]};
        }else{
          dates = {start: event[0], end: addDaysToDate(event[0], 1)};
        }
        this.setState({ dates }, () => {
          const link = setUpLinkBasic(window.location.href);
          this.props.getPartnerReservations(link, {type: 'partner', language: this.props.lang, partner: this.props.partnerObject['_id'], room: getRoomsSelector(this.props.partnerRooms)[0]['value'], dates: this.state.dates });
        });
      }
    }
  }

  closeActivationAlert(){
    this.props.changeSinglePartnerField('activationAlert', false);
  }

  openExistingReservation(reservation: object){
    const partnerReservation = JSON.parse(JSON.stringify(this.props.partnerReservation));

    partnerReservation['partner'] = reservation['partner'];
    partnerReservation['type'] = 'partner';
    partnerReservation['room'] = {label: getFieldValueByRegId(this.props.partnerRooms, reservation['room'], 'name'), value: reservation['room']};
    partnerReservation['date'] = new Date(reservation['date']);
    partnerReservation['term'] = {label: `${reservation['from']} - ${reservation['to']}`, value: 0};
    partnerReservation['options'] = [{label: `${reservation['from']} - ${reservation['to']}`, value: 0}];
    partnerReservation['terms'] = [{label: `${reservation['from']} - ${reservation['to']}`, value: 0}];
    partnerReservation['from'] = reservation['from'];
    partnerReservation['to'] = reservation['to'];
    partnerReservation['double'] = reservation['double'];
    partnerReservation['user'] = reservation['user'];
    partnerReservation['userName'] = reservation['userName'];
    partnerReservation['guest'] = reservation['guest'];
    partnerReservation['food'] = reservation['food'] ? reservation['food'] : {};
    partnerReservation['animation'] = reservation['animation'] ? reservation['animation'] : {};
    partnerReservation['decoration'] = reservation['decoration'] ? reservation['decoration'] : {};
    partnerReservation['comment'] = reservation['comment'];
    partnerReservation['edit'] = false;
    partnerReservation['showPrice'] = true;
    partnerReservation['termPrice'] = reservation['termPrice'];
    partnerReservation['animationPrice'] = reservation['animationPrice'];
    partnerReservation['decorationPrice'] = reservation['decorationPrice'];
    partnerReservation['foodPrice'] = reservation['foodPrice'];
    partnerReservation['price'] = reservation['price'];
    partnerReservation['deposit'] = reservation['deposit'];
    partnerReservation['id'] = reservation['_id'];

    this.props.changeSinglePartnerField('partnerReservation', partnerReservation);
    this.handleInputChange('reservationShow', true);
  }

  
  componentDidUpdate(prevProps: MyProps, prevState:  MyState){
    if (prevProps.lang !== this.props.lang) {
      let dictionary = getLanguage(this.props.lang);
      this.setState({ dictionary });
    }

    if (this.props.partnerObject && !prevProps.partnerObject) {
      const ready = isFieldInObject(this.props.partnerObject, 'rooms', 'general') ? this.props.partnerObject['general']['rooms'].length ? true : false : false;
      if (ready) {
        const link = setUpLinkBasic(window.location.href);
        this.props.getPartnerReservations(link, {type: 'partner', language: this.props.lang, partner: this.props.partnerObject['_id'], room: getRoomsSelector(this.props.partnerRooms)[0]['value'], dates: this.state.dates });
        this.setState({ activeRoom: getRoomsSelector(this.props.partnerRooms)[0]})
      }else{
        this.setState({ ready }, () => {
          this.props.closeLoader();
        });
        
      }
    }

    if (this.props.getPartnerReservationsStart) {
      this.props.openLoader();
    }

    if (!this.props.getPartnerReservationsStart && prevProps.getPartnerReservationsStart && !this.props.getPartnerReservationsError && this.props.getPartnerReservationsSuccess) {
      this.props.closeLoader();
    }
  }

  componentDidMount(){
    if (this.props.partnerObject) {
      if (!this.props.getPartnerReservationsSuccess) {

        const ready = isFieldInObject(this.props.partnerObject, 'rooms', 'general') ? this.props.partnerObject['general']['rooms'].length ? true : false : false;
        if (ready) {
          this.props.openLoader();
          const link = setUpLinkBasic(window.location.href);
          this.props.getPartnerReservations(link, {type: 'partner', language: this.props.lang, partner: this.props.partnerObject['_id'], room: getRoomsSelector(this.props.partnerRooms)[0]['value'], dates: this.state.dates });
          this.setState({ activeRoom: getRoomsSelector(this.props.partnerRooms)[0]});
        }else{
          this.setState({ ready });
        }
      }

      
    }
  }
	
  render() {
    const localizer = momentLocalizer(momentLocalize(moment, this.props.lang));

    return(
    	<div className="partnerProflePage calendar">
        <ReservationScreen
          show={ this.state.reservationShow }
          token={ this.props.token }
          lang={ this.props.lang }
          reservationClose={ this.setReservationShow }
          closeLoader = { this.props.closeLoader }
          openLoader = { this.props.openLoader }
          calendarDates= { this.state.dates }
        />
        
        <Container fluid>
          <Row>
            <Col xs="12">
              <div className="pageHeader">
                <h2>{this.state.dictionary['partnerProfileCalendarTitle']}</h2>
                <p>{this.state.dictionary['partnerProfileCalendarDescription']} <a href={`/partnerHelp?language=${this.props.lang}&section=calendar`} target="_blank">{this.state.dictionary['uniPartnerProfileHelp']}</a></p>
              </div>
            </Col>

            <Col xs='12'>
              <Alert color="success" isOpen={ this.props.activationAlert } toggle={this.closeActivationAlert} >
                <h3>{`${this.props.activationProcessPercent}${this.state.dictionary['uniPartnerProgressTitle']}`}</h3>
                <p>{this.state.dictionary['uniPartnerProgressDescription']} <a href={`/partnerHelp?language=${this.props.lang}&section=activation`} target="_blank"> {this.state.dictionary['uniPartnerProgressLink']}</a> </p>
              </Alert>
            </Col>
            
          </Row>

          <Row className="calendarTop">
            <Col xs="12" sm="6" lg="4">
              <div className="middle">
                <button className="buttonAdd" disabled={!this.state.ready} onClick={ () => this.setReservationShow(true) }>{this.state.dictionary['partnerProfileCalendarButton']}</button>
              </div>
            </Col>
            <Col xs="12" sm="1" lg="4">
            </Col>
            {
              isFieldInObject(this.props.partnerObject, 'rooms', 'general')
              ?
              this.props.partnerObject['general']['rooms'].length > 1
              ?
              (
                <Col xs="12" sm="5" lg="4">
                  <Select 
                    options={getRoomsSelector(this.props.partnerRooms)} 
                    value={ this.state.activeRoom } 
                    onChange={(val) => this.handleRoomChange(val)} 
                    instanceId="quarterInput" 
                    className="logInput" 
                    placeholder={this.state.dictionary['partnerProfileGeneralRoom']}/>
                </Col>
              )
              :
              null
              :
              null
            }
            
          </Row>

          <Row>
            <Col xs="12">
              <div className="myCalendarView">
                <Calendar
                  localizer={localizer}
                  events={ this.props.partnerReservationsList }
                  startAccessor="start"
                  endAccessor="end"
                  defaultView="week"
                  views={['month', 'week', 'day']}
                  step={ 30 }
                  timeslots={ 2 }
                  toolbar={ true }
                  min={new Date(2017, 10, 0, 6, 0, 0)}
                  max={new Date(2017, 10, 0, 22, 0, 0)}
                  messages={ getLocalMessages(this.props.lang) }
                  // onNavigate={ (event) => { console.log(event)} }
                  // onView={ (event) => { console.log(event)}}
                  onRangeChange={ (event) => { this.handleCalendarDateRangeChange(event)} }
                  onSelectEvent={ (event, e) =>{ this.openExistingReservation(event) } }
                />
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
  partnerRooms: state.PartnerReducer.partnerRooms,

  forActivation: state.PartnerReducer.forActivation,
  activationAlert: state.PartnerReducer.activationAlert,
  activationProcessPercent: state.PartnerReducer.activationProcessPercent,

  getPartnerReservationsStart: state.PartnerReducer.getPartnerReservationsStart,
  getPartnerReservationsError: state.PartnerReducer.getPartnerReservationsError,
  getPartnerReservationsSuccess: state.PartnerReducer.getPartnerReservationsSuccess,

  partnerReservation: state.PartnerReducer.partnerReservation,
  partnerReservationsList: state.PartnerReducer.partnerReservationsList,
});


const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
  	changeSinglePartnerField,
    getPartnerReservationTerms,
    getPartnerReservations,
  },
  dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(CalendarScreen)