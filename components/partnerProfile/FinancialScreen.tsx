import React from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col, Button, Table } from 'reactstrap';
import { getLanguage } from '../../lib/language';
import generalOptions from '../../lib/constants/generalOptions';
import { changeSinglePartnerField } from '../../actions/partner-actions';
import { getReservationsForFin } from '../../actions/reservation-actions';
import { isFieldInObject, getGeneralOptionLabelByValue, getOnlyValues, fillPickedOffers, generateString, makeRegIdsUniqueForArray } from '../../lib/helpers/specificPartnerFunctions';
import { currencyFormat, renderDate } from '../../lib/helpers/generalFunctions';
import { datePickerLang } from '../../lib/language/dateLanguage';
import PlainInput from '../form/input';

interface MyProps {
  // using `interface` is also ok
  lang: string;
  link: object;
  token?: string | undefined;
	partnerObject: null | object;
  forActivation: boolean;
  activationAlert: boolean;
  activationProcessPercent: number;
  getFinReservationStart: boolean;
  getFinReservationError: object | boolean;
  getFinReservationSuccess: null | number;
  finReservations: Array<object>;
  getReservationsForFin(link: object, data: object, auth: string): void;
  changeSinglePartnerField(field: string, value: any): any;
  closeLoader(): void;
  openLoader(): void;
};
interface MyState {
	dictionary: object;
	loader: boolean;
	year: number | object;
	month: number | object;
};

class FinancialScreen extends React.Component <MyProps, MyState>{

	constructor(props){
    super(props);

    this.componentObjectBinding = this.componentObjectBinding.bind(this);

    const bindingFunctions = [ 'setMonthOptions', 'setYearOptions', 'handleInputChange', 'searchFin', 'calculateFinancialSum'];
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
  };


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

  searchFin(){
  	this.setState({ loader: true}, () => {
  		this.props.openLoader();
  		this.props.getReservationsForFin(this.props.link, { year: this.state.year['value'], month: this.state.month['value'], language: this.props.lang }, this.props.token );
  	});
  }

  calculateFinancialSum(){
    const result = {
      price: 0,
      deposit: 0,
      commission: 0,
      bank: 0,
      payout: 0,
      onspot: 0,
    }
    if (this.props.finReservations) {
      for (var i = 0; i < this.props.finReservations.length; i++) {
        result['price'] = result['price'] + (this.props.finReservations[i]['price'] - this.props.finReservations[i]['trilinoPrice']);
        result['deposit'] = result['deposit'] + this.props.finReservations[i]['deposit'];
        result['commission'] = result['commission'] + (this.props.finReservations[i]['termPrice'] * 0.1);
        result['bank'] = result['bank'] + (this.props.finReservations[i]['deposit'] * 0.025);
        result['payout'] = result['payout'] + (this.props.finReservations[i]['deposit'] - (this.props.finReservations[i]['termPrice'] * 0.1) - (this.props.finReservations[i]['deposit'] * 0.025));
        result['onspot'] = result['onspot'] + (this.props.finReservations[i]['price'] - this.props.finReservations[i]['trilinoPrice'] - this.props.finReservations[i]['deposit'])
      }
    }

    return result;
    
  }

  handleInputChange(field: string, value: any){
     this.setState(prevState => ({
      ...prevState,
      [field]: value // No error here, but can't ensure that key is in StateKeys
    }));
  }
  
  componentDidUpdate(prevProps: MyProps, prevState:  MyState){
    if (prevProps.lang !== this.props.lang) {
      let dictionary = getLanguage(this.props.lang);
      this.setState({ dictionary });
    }

    if (!this.props.getFinReservationStart && prevProps.getFinReservationStart && !this.props.getFinReservationError && this.props.getFinReservationSuccess && !prevProps.getFinReservationSuccess) {
    	this.setState({loader: false }, () => {
  			this.props.closeLoader();
  		});
    }

    
  }

  componentDidMount(){
  	if (this.props.partnerObject) {
  		const d = new Date();
  		const year = { "value": d.getFullYear(), "label": d.getFullYear().toString()};
  		const month = { "value": d.getMonth() + 1, "label": datePickerLang[this.props.lang]['months'][d.getMonth()]};
  		this.setState({ year, month }, () => {
  			this.props.openLoader();
  			this.props.getReservationsForFin(this.props.link, { year: year['value'], month: month['value'], language: this.props.lang }, this.props.token )
  		})
  	}
  }

	
  render() {
    return(
    	<div className="partnerProflePage financial">
        <Container fluid>
          <Row>
            <Col xs="12">
              <div className="pageHeader">
                <h2>{this.state.dictionary['partnerProfileFinTitle']}</h2>
                <p>{this.state.dictionary['partnerProfileFinDescription']}</p>
              </div>
            </Col>
          </Row>

          <Row className="findOptions">
          	<Col xs="12" sm="5" lg="4">
          		<Select 
                options={this.setMonthOptions()} 
                instanceId="finMonth" 
                value={ this.state.month }
                onChange={ (val) => this.handleInputChange('month', val)}
                className="monthInput" 
                placeholder={this.state.dictionary['partnerProfileFinMonthPlaceholder']} />
          	</Col>

          	<Col xs="12" sm="5" lg="4">
          		<Select 
                options={this.setYearOptions()} 
                instanceId="finYear" 
                value={ this.state.year }
                onChange={ (val) => this.handleInputChange('year', val)}
                className="yearInput" 
                placeholder={this.state.dictionary['partnerProfileFinYearPlaceholder']} />
          	</Col>

          	<Col xs="12" sm="2" lg="4">
          		<div className="middle">
								<button className="buttonAdd" disabled={this.props.partnerObject['active'] && this.props.partnerObject['forActivation'] ? false : true } onClick={ this.searchFin }>{this.state.dictionary['uniSearch']}</button>
							</div>
          	</Col>
          </Row>

          <Row>
          	<Col xs="12">
          		<Table responsive>
          			<thead>
					        <tr>
					          <th>{this.state.dictionary['partnerProfileFinTableColReservation']}</th>
					          <th>{this.state.dictionary['partnerProfileFinTableColDate']}</th>
					          <th>{this.state.dictionary['partnerProfileFinTableColPrice']}</th>
					          <th>{this.state.dictionary['partnerProfileFinTableColDeposit']}</th>
					          <th>{this.state.dictionary['partnerProfileFinTableColCommission']}</th>
					          <th>{this.state.dictionary['partnerProfileFinTableColBank']}</th>
					          <th>{this.state.dictionary['partnerProfileFinTableColTrilino']}</th>
					          <th>{this.state.dictionary['partnerProfileFinTableColUser']}</th>
					        </tr>
					      </thead>

					      <tbody>
					      	{
					      		this.props.finReservations.length
					      		?
					      		this.props.finReservations.map((reservation, index) => {
					      			return(
					      				<tr key={`finLine_${index}`}>
								          <td>{reservation['_id']}</td>
								          <td>{renderDate(reservation['date'])}</td>
								          <td>{currencyFormat(reservation['price'] - reservation['trilinoPrice'])}</td>
								          <td>{currencyFormat(reservation['deposit'])}</td>
								          <td>{currencyFormat(reservation['termPrice'] * 0.1) }</td>
								          <td>{currencyFormat(reservation['deposit'] * 0.025) }</td>
								          <td>{currencyFormat(reservation['deposit'] - (reservation['termPrice'] * 0.1) - (reservation['deposit'] * 0.025)) }</td>
								          <td>{currencyFormat(reservation['price'] - reservation['trilinoPrice'] - reservation['deposit']) }</td>
								        </tr>
					      			)
					      		})
					      		:
					      		null
					      	}

                  {
                    this.props.finReservations.length
                    ?
                    (
                      <tr className="calcSum">
                        <th>{this.state.dictionary['partnerProfileFinTableTotal']}</th>
                        <td></td>
                        <th>{currencyFormat(this.calculateFinancialSum()['price'])}</th>
                        <th>{currencyFormat(this.calculateFinancialSum()['deposit'])}</th>
                        <th>{currencyFormat(this.calculateFinancialSum()['commission'])}</th>
                        <th>{currencyFormat(this.calculateFinancialSum()['bank'])}</th>
                        <th>{currencyFormat(this.calculateFinancialSum()['payout'])}</th>
                        <th>{currencyFormat(this.calculateFinancialSum()['onspot'])}</th>
                      </tr>
                    )
                    :
                    null
                  }
					       
					      </tbody>
          		</Table>
          		{
          			!this.props.finReservations.length
          			?
          			<div className="middle">
          				<p className="fadedPrev">{this.state.dictionary['partnerProfileFinTableNone']}</p>
          			</div>
          			:
          			null
          		}
          	</Col>
          </Row>

          <Row>
            <Col xs="12">
            	<div className="remarks">
								<p>{ this.state.dictionary['partnerProfileGeneralRemark_1'] } </p>
                <p>{ this.state.dictionary['partnerProfileGeneralRemark_2'] } </p>
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

  forActivation: state.PartnerReducer.forActivation,
  activationAlert: state.PartnerReducer.activationAlert,
  activationProcessPercent: state.PartnerReducer.activationProcessPercent,

  getFinReservationStart: state.ReservationReducer.getFinReservationStart,
  getFinReservationError: state.ReservationReducer.getFinReservationError,
  getFinReservationSuccess: state.ReservationReducer.getFinReservationSuccess,

  finReservations: state.ReservationReducer.finReservations,
});


const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
  	changeSinglePartnerField,
  	getReservationsForFin,
  },
  dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(FinancialScreen)