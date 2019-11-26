import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'reactstrap';
import TermItem from './TermItem';
import { changeSinglePartnerField } from '../../../actions/partner-actions';
import { getLanguage } from '../../../lib/language';
import genOptions from '../../../lib/constants/generalOptions';
import PlainInput from '../../form/input';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../style/style.scss';

interface MyProps {
  // using `interface` is also ok
  lang: string;
  partnerRooms: Array<object>;
  changeSinglePartnerField(field: string, value: any): any;
};
interface MyState {
	dictionary: object;
	test: string;
};

class RoomList extends React.Component <MyProps, MyState>{

	constructor(props){
    super(props);

    this.componentObjectBinding = this.componentObjectBinding.bind(this);

    const bindingFunctions = ['handleInputChange', 'uniInputHandler', 'handleCheckbox', 'addTerm', 'deleteTerm', 'changeTermValue'];
    this.componentObjectBinding(bindingFunctions);
  }

  componentObjectBinding(array){
    array.map( item => {
      this[item] = this[item].bind(this);
    })
  }

	state: MyState = {
    dictionary: getLanguage(this.props.lang),
    test: '',
  };

  componentDidUpdate(prevProps: MyProps, prevState:  MyState){
    if (prevProps.lang !== this.props.lang) {
      let dictionary = getLanguage(this.props.lang);
      this.setState({ dictionary });
    }
  }

  handleInputChange(field, value){
     this.setState(prevState => ({
      ...prevState,
      [field]: value // No error here, but can't ensure that key is in StateKeys
    }));
  }

  uniInputHandler(value, field){
  	if (value['target']) {
  		this.handleInputChange(field, value.target.value);
  	}else{
  		this.handleInputChange(field, value);
  	}
  }

  addTerm(index, day){
  	const roomsCopy = JSON.parse(JSON.stringify(this.props.partnerRooms));
  	const term = {from: '', to: '', price: null };
  	roomsCopy[index]['terms'][day].push(term);

  	this.props.changeSinglePartnerField('partnerRooms', roomsCopy);
  }

  deleteTerm(index, day){
  	const roomsCopy = JSON.parse(JSON.stringify(this.props.partnerRooms));
  	roomsCopy[index]['terms'][day].pop();

  	this.props.changeSinglePartnerField('partnerRooms', roomsCopy);
  }

  changeTermValue(room, day, field, value, index){
  	const roomsCopy = JSON.parse(JSON.stringify(this.props.partnerRooms));
  	roomsCopy[room]['terms'][day][index][field] = value;

  	this.props.changeSinglePartnerField('partnerRooms', roomsCopy);
  }

  changeBasicValue(room, field, value){
  	const roomsCopy = JSON.parse(JSON.stringify(this.props.partnerRooms));
  	roomsCopy[room][field] = value;

  	this.props.changeSinglePartnerField('partnerRooms', roomsCopy);
  }

  handleCheckbox(field){
     this.setState(prevState => ({
      ...prevState,
      [field]: !this.state[field] // No error here, but can't ensure that key is in StateKeys
    }));
  }

	
  render() {
    return(
    	<div>
        {
        	this.props.partnerRooms.map((key, index) => {
        		return(
        			<Row key={`${this.state.dictionary['partnerProfileGeneralRoom']} ${index+1}`}>
	        			<Col xs='12'>
		            	<h5 className="middle">{`Sala ${index+1}`}</h5>
		            </Col>
		            <Col xs='6' sm='3'>
		            	<label>{this.state.dictionary['partnerProfileGeneralRoomnameTitle']}</label>
		            	<PlainInput 
		                placeholder={this.state.dictionary['partnerProfileGeneralRoomnamePlaceholder']}
		                onChange={(event) => this.changeBasicValue(index, 'name', event.target.value)} 
		                value={key['name']} 
		                type="text"
		                className={`${this.state.test ? "borderWarrning" : ''} logInput`} />
		            </Col>
		            <Col xs='6' sm='3'>
		            	<label>{this.state.dictionary['partnerProfileGeneralRoomsizeTitle']}</label>
		            	<PlainInput 
		                placeholder={this.state.dictionary['partnerProfileGeneralItemPlaysizePlaceholder']}
		                onChange={(event) => this.changeBasicValue(index, 'size', event.target.value)} 
		                value={key['size']} 
		                type="number"
		                className={`${this.state.test ? "borderWarrning" : ''} logInput`} />
		            </Col>
		            <Col xs='6' sm='3'>
		            	<label>{this.state.dictionary['partnerProfileGeneralRoomcapKidsTitle']}</label>
		            	<PlainInput 
		                placeholder={this.state.dictionary['partnerProfileGeneralRoomcapKidsPlaceholder']} 
		                onChange={(event) => this.changeBasicValue(index, 'capKids', event.target.value)} 
		                value={key['capKids']} 
		                type="number"
		                className={`${this.state.test ? "borderWarrning" : ''} logInput`} />
		            </Col>
		            <Col xs='6' sm='3'>
		            	<label>{this.state.dictionary['partnerProfileGeneralRoomcapAdultsTitle']}</label>
		            	<PlainInput 
		                placeholder={this.state.dictionary['partnerProfileGeneralRoomcapAdultsPlaceholder']} 
		                onChange={(event) => this.changeBasicValue(index, 'capAdults', event.target.value)} 
		                value={key['capAdults']} 
		                type="number"
		                className={`${this.state.test ? "borderWarrning" : ''} logInput`} />
		            </Col>

		            <Col xs='12'>
		            	<h5 className="middle">{this.state.dictionary['partnerProfileGeneralPriceTitle']}</h5>
		            </Col>
		            <TermItem 
		            	lang={ this.props.lang }
		            	day="monday"
		            	title={ this.state.dictionary['partnerProfileGeneralDaysMonday'] }
		            	room={ index }
		            	terms={ key['terms']['monday'] }
		            	addTerm= { this.addTerm }
		            	deleteTerm={ this.deleteTerm }
		            	changeTermValue={ this.changeTermValue }
		            />

		            <TermItem 
		            	lang={ this.props.lang }
		            	day="tuesday"
		            	title={ this.state.dictionary['partnerProfileGeneralDaysTuesday'] }
		            	room={ index }
		            	terms={ key['terms']['tuesday'] }
		            	addTerm= { this.addTerm }
		            	deleteTerm={ this.deleteTerm }
		            	changeTermValue={ this.changeTermValue }
		            />

		            <TermItem 
		            	lang={ this.props.lang }
		            	day="wednesday"
		            	title={ this.state.dictionary['partnerProfileGeneralDaysWednesday'] }
		            	room={ index }
		            	terms={ key['terms']['wednesday'] }
		            	addTerm= { this.addTerm }
		            	deleteTerm={ this.deleteTerm }
		            	changeTermValue={ this.changeTermValue }
		            />

		            <TermItem 
		            	lang={ this.props.lang }
		            	day="thursday"
		            	title={ this.state.dictionary['partnerProfileGeneralDaysThursday'] }
		            	room={ index }
		            	terms={ key['terms']['thursday'] }
		            	addTerm= { this.addTerm }
		            	deleteTerm={ this.deleteTerm }
		            	changeTermValue={ this.changeTermValue }
		            />

		            <TermItem 
		            	lang={ this.props.lang }
		            	day="friday"
		            	title={ this.state.dictionary['partnerProfileGeneralDaysFriday'] }
		            	room={ index }
		            	terms={ key['terms']['friday'] }
		            	addTerm= { this.addTerm }
		            	deleteTerm={ this.deleteTerm }
		            	changeTermValue={ this.changeTermValue }
		            />

		            <TermItem 
		            	lang={ this.props.lang }
		            	day="saturday"
		            	title={ this.state.dictionary['partnerProfileGeneralDaysSatruday'] }
		            	room={ index }
		            	terms={ key['terms']['saturday'] }
		            	addTerm= { this.addTerm }
		            	deleteTerm={ this.deleteTerm }
		            	changeTermValue={ this.changeTermValue }
		            />

		            <TermItem 
		            	lang={ this.props.lang }
		            	day="sunday"
		            	title={ this.state.dictionary['partnerProfileGeneralDaysSunday'] }
		            	room={ index }
		            	terms={ key['terms']['sunday'] }
		            	addTerm= { this.addTerm }
		            	deleteTerm={ this.deleteTerm }
		            	changeTermValue={ this.changeTermValue }
		            />
	            </Row>
        		)
        	})
        }
    	</div>
    	
    ) 
  }
}

const mapStateToProps = (state) => ({
	partnerRooms: state.PartnerReducer.partnerRooms,
});


const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
  	changeSinglePartnerField
  },
  dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(RoomList)