import React from 'react';
import Select from 'react-select';
import { Row, Col } from 'reactstrap';
import { getLanguage } from '../../../lib/language';
import genOptions from '../../../lib/constants/generalOptions';
import PlainInput from '../../form/input';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../style/style.scss';

interface MyProps {
  // using `interface` is also ok
  lang: string;
  terms: Array<object>;
  day: string;
  title: string;
  room: number;
  addTerm(index: number, day: string): any;
  deleteTerm(index: number, day: string): any;
  changeTermValue(room: number, day: string, field: string, value: string, index: number): any;
};
interface MyState {
	dictionary: object;
};

class TermItem extends React.Component <MyProps, MyState>{

	state: MyState = {
    dictionary: getLanguage(this.props.lang),
  };

  componentDidUpdate(prevProps: MyProps, prevState:  MyState){
    if (prevProps.lang !== this.props.lang) {
      let dictionary = getLanguage(this.props.lang);
      this.setState({ dictionary });
    }
  }

	
  render() {
    return(
    	<div className="maxWidth generalDays">
        {
        	this.props.terms.map((key, index) => {
        		return(
        			<Row key={`k_${this.props.day}_${index}`}>
		            <Col xs='12' sm='3'>
		            	{ index === 0 ? ( <h5 className="middle blue">{this.props.title}</h5> ) : null }
		            </Col>
		            <Col xs='4' sm='3'>
		            	<label>{this.state.dictionary['partnerProfileGeneralStart']}</label>
		            	<Select 
		                options={genOptions[`times`]} 
		                value={ key['from'] } 
		                onChange={(val) => this.props.changeTermValue(this.props.room, this.props.day, 'from', val, index)} 
		                instanceId={`roomsInput_${this.props.day}_${index}` }
		                className="logInput" 
		                styles={{ container: (provided, state) => ({ ...provided, border: false ? "1px solid red" : "#ccc" })}}
		                placeholder={this.state.dictionary['partnerProfileGeneralDaysFrom']}/>
		            </Col>
		            <Col xs='4' sm='3'>
		            	<label>{this.state.dictionary['partnerProfileGeneralEnd']}</label>
		            	<Select 
		                options={genOptions[`times`]} 
		                value={ key['to'] } 
		                onChange={(val) => this.props.changeTermValue(this.props.room, this.props.day, 'to', val, index)} 
		                instanceId={`roomsInput1_${this.props.day}_${index}` } 
		                className="logInput" 
		                styles={{ container: (provided, state) => ({ ...provided, border: false ? "1px solid red" : "#ccc" })}}
		                placeholder={this.state.dictionary['partnerProfileGeneralDaysTo']}/>
		            </Col>
		            <Col xs='4' sm='3'>
		            	<label>{this.state.dictionary['partnerProfileGeneralItemPriceTitle']}</label>
		            	<PlainInput 
		                placeholder={this.state.dictionary['partnerProfileGeneralItemPricePlaceholder']} 
		                onChange={(event) => this.props.changeTermValue(this.props.room, this.props.day, 'price', event.target.value, index)} 
		                value={key['price']} 
		                type="number"
		                className={`logInput`} />
		            </Col>

		            {
		            	index + 1 === this.props.terms.length
		            	?
		            	this.props.terms.length > 1
		            	?
		            	(
		            		<div className="maxWidth flex">
		            			<Col xs='6'>
					            	<div className="middle">
													<button className="smallButton btnAction"  onClick={ () => this.props.addTerm(this.props.room, this.props.day) }>{this.state.dictionary['partnerProfileGeneralButtonAddTerm']}</button>
												</div>
					            </Col>
					            <Col xs='6'>
					            	<div className="middle">
													<button className="smallButton btnCancel"  onClick={ () => this.props.deleteTerm(this.props.room, this.props.day) }>{this.state.dictionary['partnerProfileGeneralButtonDeleteTerm']}</button>
												</div>
					            </Col>
		            		</div>
		            	)
		            	:
		            	(
		            		<Col xs='12'>
				            	<div className="middle">
												<button className="smallButton btnAction"  onClick={ () => this.props.addTerm(this.props.room, this.props.day) }>{this.state.dictionary['partnerProfileGeneralButtonAddTerm']}</button>
											</div>
				            </Col>
		            	)
		            	: null
		            }

		            
	            </Row>
	          )
        	})
        }
    	</div>
    	
    ) 
  }
}


export default TermItem;