import React from 'react';
import Select from 'react-select';
import PlainInput from '../form/input';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { datePickerLang } from '../../lib/language/dateLanguage';
import { Container, Row, Col, Button, Table } from 'reactstrap';
import { adminFinancialSearch, adminGetPartners } from '../../actions/admin-actions';
import { getLanguage } from '../../lib/language';
import {  getGeneralOptionLabelByValue } from '../../lib/helpers/specificPartnerFunctions';
import {  getPhotoNumbers } from '../../lib/helpers/specificAdminFunctions';
import { renderDate, currencyFormat, getArrayObjectByFieldValue } from '../../lib/helpers/generalFunctions';

interface MyProps {
  // using `interface` is also ok
  openLoader(): void;
  closeLoader(): void;
  lang: string;
  token: string;
  link: object;
  adminFinancialSearch(link: object, data: object, auth: string): void;
  adminGetPartners(link: object, data: object, auth: string): Array<object>;
  adminFinSearchStart: boolean;
  adminFinSearchError: object | boolean;
  adminFinSearchSuccess: null | number;
  finSearchResult: Array<object>;
  adminGetPartnersStart: boolean;
  adminGetPartnersError: object | boolean;
  adminGetPartnersSuccess: null | object;
  adminPartners: Array<object>;
};
interface MyState {
	dictionary: object;
	loader: boolean;
	year: number | object;
	month: number | object;
	partner: number | object;
	type: number | object;
	partnerOptions: Array<object>;
	typeOptions: Array<object>;
};

class PartnerScreen extends React.Component <MyProps, MyState>{

	constructor(props){
    super(props);

    this.componentObjectBinding = this.componentObjectBinding.bind(this);

    const bindingFunctions = ['handleInputChange', 'setMonthOptions', 'setYearOptions', 'setPartnerOptions', 'searchFin', 'calculateFinancialSum'];
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
    year: 0,
		month: 0,
		partner: { "value": 0, "label" : 'Sve'},
		type: { "value": 1, "label" : 'Račun'},
		partnerOptions: [],
		typeOptions: [{ "value": 1, "label" : 'Račun'}, { "value": 2, "label" : 'Predračun'}],
  };

  handleInputChange(field, value){
     this.setState(prevState => ({
      ...prevState,
      [field]: value // No error here, but can't ensure that key is in StateKeys
    }));
  }

  setMonthOptions(){
  	const result = [];
  	if (datePickerLang[this.props.lang]) {
  		for (var i = 0; i < datePickerLang[this.props.lang]['months'].length; i++) {
  			result.push({ "value": i + 1, "label" : datePickerLang[this.props.lang]['months'][i]})
  		}
  	}

  	return result;
  }

  setYearOptions(){
  	const result = [];
  	const d = new Date();
  	const y = d.getFullYear();


		for (var i = 0; i < 4; i++) {
			let dev = i - 3;
			result.push({ "value": y + dev, "label" : (y + dev).toString()});
		}

  	return result;
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

  calculateFinancialSum(){
    const result = {
      price: 0,
      deposit: 0,
      commission: 0,
      bank: 0,
      payout: 0,
    }
    if (this.props.finSearchResult) {
      for (var i = 0; i < this.props.finSearchResult.length; i++) {
        result['price'] = result['price'] + (this.props.finSearchResult[i]['price'] - this.props.finSearchResult[i]['trilinoPrice']);
        result['deposit'] = result['deposit'] + this.props.finSearchResult[i]['deposit'];
        result['commission'] = result['commission'] + (this.props.finSearchResult[i]['termPrice'] * 0.1);
        result['bank'] = result['bank'] + (this.props.finSearchResult[i]['deposit'] * 0.025);
        result['payout'] = result['payout'] + (this.props.finSearchResult[i]['deposit'] - (this.props.finSearchResult[i]['termPrice'] * 0.1) - (this.props.finSearchResult[i]['deposit'] * 0.025));
      }
    }

    return result;
    
  }

  searchFin(){
  	this.setState({ loader: true }, () => {
			this.props.openLoader();
			this.props.adminFinancialSearch(this.props.link, { year: this.state.year['value'], month: this.state.month['value'], partner: this.state.partner['value'], type: this.state.type['value'] }, this.props.token )
		});
  }

  

  componentDidUpdate(prevProps: MyProps, prevState:  MyState){
    if (!this.props.adminFinSearchStart && prevProps.adminFinSearchStart && this.props.adminFinSearchSuccess && !prevProps.adminFinSearchSuccess && !this.props.adminFinSearchError) {
    	this.setState({ loader: false }, () => {
    		this.props.closeLoader();
    	})
    }

    if (!this.props.adminGetPartnersStart && prevProps.adminGetPartnersStart && this.props.adminGetPartnersSuccess) {
      this.setPartnerOptions();
    }
  }

	componentDidMount(){
		const d = new Date();
		const year = { "value": d.getFullYear(), "label": d.getFullYear().toString()};
		const month = { "value": d.getMonth() + 1, "label": datePickerLang[this.props.lang]['months'][d.getMonth()]};
		this.setState({ year, month, loader: true }, () => {
			this.props.openLoader();
			this.props.adminGetPartners(this.props.link, {field:'', term: ''}, this.props.token);
			this.props.adminFinancialSearch(this.props.link, { year: year['value'], month: month['value'], partner: this.state.partner['value'], type: this.state.type['value'] }, this.props.token )
		})
	}
	
  render() {
    return(
    	<div className="adminScreen financial">
        
    		<Row>
          <Col xs='12' className="middle">
            <h2>Trilino Finansije</h2>
            <p>Prikaz mesečnih transakcija</p>
          </Col>
         
        </Row>

        <Row className="findOptions">
          	<Col xs="12" sm="6" lg="3">
          		<Select 
                options={this.setMonthOptions()} 
                instanceId="finMonth" 
                value={ this.state.month }
                onChange={ (val) => this.handleInputChange('month', val)}
                className="monthInput" 
                placeholder={this.state.dictionary['partnerProfileFinMonthPlaceholder']} />
          	</Col>

          	<Col xs="12" sm="6" lg="3">
          		<Select 
                options={this.setYearOptions()} 
                instanceId="finYear" 
                value={ this.state.year }
                onChange={ (val) => this.handleInputChange('year', val)}
                className="yearInput" 
                placeholder={this.state.dictionary['partnerProfileFinYearPlaceholder']} />
          	</Col>

          	<Col xs="12" sm="6" lg="3">
          		<Select 
                options={ this.state.typeOptions } 
                instanceId="finType" 
                value={ this.state.type }
                onChange={ (val) => this.handleInputChange('type', val)}
                className="partnerInput" 
                placeholder="Tip" />
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

          	<Col xs="12">
          		<div className="middle">
								<button className="buttonAdd" onClick={ this.searchFin }>{this.state.dictionary['uniSearch']}</button>
							</div>
          	</Col>
          </Row>

          <Row>
          	<Col xs="12">
          		<Table responsive>
          			<thead>
					        <tr>
					          <th>{this.state.dictionary['partnerProfileFinTableColReservation']}</th>
					          <th>Izdato</th>
					          <th>Dospeva</th>
					          <th>Partner</th>
					          <th>{this.state.dictionary['partnerProfileFinTableColPrice']}</th>
					          <th>Uplata</th>
					          <th>{this.state.dictionary['partnerProfileFinTableColCommission']}</th>
					          <th>Banka</th>
					          <th>Isplata</th>
					        </tr>
					      </thead>

					      <tbody>
					      	{
					      		this.props.finSearchResult.length
					      		?
					      		this.props.finSearchResult.map((reservation, index) => {
					      			return(
					      				<tr key={`finLine_${index}`}>
								          <td>{reservation['_id']}</td>
								          <td>{renderDate(reservation['createdAt'])}</td>
								          <td>{renderDate(reservation['date'])}</td>
								          <td>{reservation['partnerObj'][0]['name']}</td>
								          <td>{currencyFormat(reservation['price'] - reservation['trilinoPrice'])}</td>
								          <td>{currencyFormat(reservation['deposit'])}</td>
								          <td>{currencyFormat(reservation['termPrice'] * 0.1) }</td>
								          <td>{currencyFormat(reservation['deposit'] * 0.025) }</td>
								          <td>{currencyFormat(reservation['deposit'] - (reservation['termPrice'] * 0.1) - (reservation['deposit'] * 0.025)) }</td>
								        </tr>
					      			)
					      		})
					      		:
					      		null
					      	}

                  {
                    this.props.finSearchResult.length
                    ?
                    (
                      <tr className="calcSum">
                        <th>Ukupno</th>
                        <td></td>
                        <td></td>
                        <td></td>
                        <th>{currencyFormat(this.calculateFinancialSum()['price'])}</th>
                        <th>{currencyFormat(this.calculateFinancialSum()['deposit'])}</th>
                        <th>{currencyFormat(this.calculateFinancialSum()['commission'])}</th>
                        <th>{currencyFormat(this.calculateFinancialSum()['bank'])}</th>
                        <th>{currencyFormat(this.calculateFinancialSum()['payout'])}</th>
                      </tr>
                    )
                    :
                    null
                  }
                 
					       
					      </tbody>
          		</Table>
          		{
          			!this.props.finSearchResult.length
          			?
          			<div className="middle">
          				<p className="fadedPrev">{this.state.dictionary['partnerProfileFinTableNone']}</p>
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

  adminFinSearchStart: state.AdminReducer.adminFinSearchStart,
  adminFinSearchError: state.AdminReducer.adminFinSearchError,
  adminFinSearchSuccess: state.AdminReducer.adminFinSearchSuccess,

  adminGetPartnersStart: state.AdminReducer.adminGetPartnersStart,
  adminGetPartnersError: state.AdminReducer.adminGetPartnersError,
  adminGetPartnersSuccess: state.AdminReducer.adminGetPartnersSuccess,

  finSearchResult: state.AdminReducer.finSearchResult,
  adminPartners: state.AdminReducer.partners,

});


const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
    adminFinancialSearch,
    adminGetPartners,
  },
  dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(PartnerScreen)