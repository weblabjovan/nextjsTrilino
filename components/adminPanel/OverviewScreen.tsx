import React from 'react';
import Select from 'react-select';
import PlainInput from '../form/input';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col, Button, Table } from 'reactstrap';
import { datePickerLang } from '../../lib/language/dateLanguage';
import { adminGetPartners, adminOverviewSearch } from '../../actions/admin-actions';
import { getLanguage } from '../../lib/language';
import DateHandler from '../../lib/classes/DateHandler';
import genOptions from '../../lib/constants/generalOptions';
import {  getGeneralOptionLabelByValue, addDaysToDate, subtractDaysToDate } from '../../lib/helpers/specificPartnerFunctions';
import {  getPhotoNumbers } from '../../lib/helpers/specificAdminFunctions';
import { renderDate, currencyFormat, getArrayObjectByFieldValue } from '../../lib/helpers/generalFunctions';
import TableModal from '../modals/TableModal';


interface MyProps {
  // using `interface` is also ok
  openLoader(): void;
  closeLoader(): void;
  lang: string;
  token: string;
  link: object;
  adminGetPartners(link: object, data: object, auth: string): Array<object>;
  adminOverviewSearch(link: object, data: object, auth: string): Array<object>;
  adminGetPartnersStart: boolean;
  adminGetPartnersError: object | boolean;
  adminGetPartnersSuccess: null | object;
  adminPartners: Array<object>;
  adminOverviewSearchStart: boolean;
  adminOverviewSearchError: object | boolean;
  adminOverviewSearchSuccess: null | number;
  overviewSearchResult: Array<object>;
};
interface MyState {
	dictionary: object;
	loader: boolean;
	dateFrom: Date;
	dateTo: Date;
	partner: number | object;
	type: number | object;
	partnerOptions: Array<object>;
	typeOptions: Array<object>;
  infoModal: boolean;
  infoData: object;
};

class OverviewScreen extends React.Component <MyProps, MyState>{

	constructor(props){
    super(props);

    this.componentObjectBinding = this.componentObjectBinding.bind(this);

    const bindingFunctions = ['handleInputChange', 'setPartnerOptions', 'toggleInfoModal', 'formatDate', 'search'];
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
    dateFrom: new Date(),
    dateTo: new Date(),
		partner: { "value": 0, "label" : 'Sve'},
		type: { "value": 1, "label" : 'Račun'},
		partnerOptions: [],
		typeOptions: [{ "value": 1, "label" : 'Račun'}, { "value": 2, "label" : 'Predračun'}],
    infoModal: false,
    infoData: {},
  };

  handleInputChange(field, value){
     this.setState(prevState => ({
      ...prevState,
      [field]: value // No error here, but can't ensure that key is in StateKeys
    }));
  }

  setPartnerOptions(){
  	const result = [];
  	for (var i = 0; i < this.props.adminPartners.length; i++) {
  		if (this.props.adminPartners[i]['active'] === true && this.props.adminPartners[i]['forActivation'] === true) {
  			result.push({"value": this.props.adminPartners[i]['_id'], "label": this.props.adminPartners[i]['name']});
  		}
  	}

  	result.unshift({ "value": 0, "label" : 'Sve'});

  	this.setState({partnerOptions: result});
  }

  formatDate(date, format, locale) {
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  }

  toggleInfoModal(){
    this.setState({ infoModal: !this.state.infoModal, infoData: {} });
  }

  search(){
  	this.setState({ loader: true }, () => {
  		this.props.openLoader();
  		this.props.adminOverviewSearch(this.props.link, { dateFrom: this.state.dateFrom, dateTo: this.state.dateTo, partner: this.state.partner }, this.props.token)
  	})
  }

  componentDidUpdate(prevProps: MyProps, prevState:  MyState){

    if (!this.props.adminGetPartnersStart && prevProps.adminGetPartnersStart && this.props.adminGetPartnersSuccess) {
      this.setPartnerOptions();
    }

    if (!this.props.adminOverviewSearchStart && prevProps.adminOverviewSearchStart && this.props.adminOverviewSearchSuccess) {
    	this.setState({ loader: false}, () => {
    		this.props.closeLoader();
    	})
    }
  }

	componentDidMount(){
		const dateHandler = new DateHandler();
		const dateFrom = dateHandler.getDateInThePast(7, 'date', true);
		this.setState({ loader: true, dateFrom }, () => {
			this.props.openLoader();
			this.props.adminGetPartners(this.props.link, {field:'', term: ''}, this.props.token);
			this.props.adminOverviewSearch(this.props.link, { dateFrom, dateTo: this.state.dateTo }, this.props.token);
		})
	}
	
  render() {
    return(
    	<div className="adminScreen financial">

      <TableModal
        isOpen={ this.state.infoModal }
        toggle={ this.toggleInfoModal }
        data={ this.state.infoData }
      />
        
    		<Row>
          <Col xs='12' className="middle">
            <h2>Trilino Rezervacije</h2>
            <p>Prikaz rezervacija</p>
          </Col>
         
        </Row>

        <Row className="findOptions">
          	<Col xs="12" sm="6" lg="3">
          		<DayPickerInput 
                value={ this.state.dateFrom }
                formatDate={ this.formatDate }
                placeholder="Izaberite datum"
                onDayChange= { (date) => this.handleInputChange('dateFrom', date) }
                format="dd/mm/yyyy"
                hideOnDayClick={ true }
                keepFocus={ false }
                dayPickerProps={{
                  disabledDays: {
                  		before: subtractDaysToDate(null, 180),
                      after: addDaysToDate(null, 365),
                  },
                  todayButton: datePickerLang[this.props.lang]['today'],
                  selectedDays: [ this.state.dateFrom ],
                  weekdaysShort: datePickerLang[this.props.lang]['daysShort'],
                  months: datePickerLang[this.props.lang]['months']
                }}
               />
          	</Col>

          	<Col xs="12" sm="6" lg="3">
          		<DayPickerInput 
                value={ this.state.dateTo }
                formatDate={ this.formatDate }
                placeholder="Izaberite datum"
                onDayChange= { (date) => this.handleInputChange('dateTo', date) }
                format="dd/mm/yyyy"
                hideOnDayClick={ true }
                keepFocus={ false }
                dayPickerProps={{
                  disabledDays: {
                      before: new Date(),
                      after: addDaysToDate(null, 180),
                  },
                  todayButton: datePickerLang[this.props.lang]['today'],
                  selectedDays: [ this.state.dateTo ],
                  weekdaysShort: datePickerLang[this.props.lang]['daysShort'],
                  months: datePickerLang[this.props.lang]['months']
                }}
               />
          	</Col>

          	<Col xs="12" sm="6" lg="3">
          		<Select 
                options={ this.state.partnerOptions } 
                instanceId="finPartner" 
                value={ this.state.partner }
                onChange={ (val) => this.handleInputChange('partner', val)}
                className="partnerInput" 
                placeholder="Partner" />
          	</Col>

          	<Col xs="12" sm="6" lg="3">
          		<div className="middle">
								<button className="buttonAdd nonMargin" onClick={ this.search }>{this.state.dictionary['uniSearch']}</button>
							</div>
          	</Col>
          </Row>

          <Row>
          	<Col xs="12">
          		<Table responsive>
          			<thead>
					        <tr>
					          <th>Partner</th>
					          <th>Partner kreirano</th>
					          <th>User kreirano</th>
                    <th>Partner održano</th>
                    <th>User održano</th>
                    <th>Kontakt</th>
					        </tr>
					      </thead>

					      <tbody>
					      	{
					      		Object.keys(this.props.overviewSearchResult).length
					      		?
					      		Object.keys(this.props.overviewSearchResult).map((key, index) => {
					      			return(
					      				<tr key={`finLine_${index}`}>
								          <td>{this.props.overviewSearchResult[key]['name']}</td>
								          <td>{this.props.overviewSearchResult[key]['createdPartner']}</td>
								          <td>{this.props.overviewSearchResult[key]['createdUser']}</td>
                          <td>{this.props.overviewSearchResult[key]['heldPartner']}</td>
                          <td>{this.props.overviewSearchResult[key]['heldUser']}</td>
                          <td>{this.props.overviewSearchResult[key]['contact']}</td>
								        </tr>
					      			)
					      		})
					      		:
					      		null
					      	}
					       
					      </tbody>
          		</Table>
          		{
          			!Object.keys(this.props.overviewSearchResult).length
          			?
          			<div className="middle">
          				<p className="fadedPrev">Trenutno nema podataka za označeni period</p>
          			</div>
          			:
          			null
          		}
          	</Col>
          </Row>
    		
    	</div>
    ) 
  }
}

const mapStateToProps = (state) => ({
  userLanguage: state.UserReducer.language,

  adminGetPartnersStart: state.AdminReducer.adminGetPartnersStart,
  adminGetPartnersError: state.AdminReducer.adminGetPartnersError,
  adminGetPartnersSuccess: state.AdminReducer.adminGetPartnersSuccess,

  adminOverviewSearchStart: state.AdminReducer.adminOverviewSearchStart,
  adminOverviewSearchError: state.AdminReducer.adminOverviewSearchError,
  adminOverviewSearchSuccess: state.AdminReducer.adminOverviewSearchSuccess,


  overviewSearchResult: state.AdminReducer.overviewSearchResult,
  adminPartners: state.AdminReducer.partners,

});


const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
    adminGetPartners,
    adminOverviewSearch,
  },
  dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(OverviewScreen)