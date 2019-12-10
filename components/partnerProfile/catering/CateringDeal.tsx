import React from 'react';
import { Row, Col } from 'reactstrap';
import { getLanguage } from '../../../lib/language';
import generalOptions from '../../../lib/constants/generalOptions';
import PlainInput from '../../form/input';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../style/style.scss';

interface MyProps {
  // using `interface` is also ok
  key: string;
  lang: string;
  index: number;
  type: string | object;
  price: string;
  min: string;
  currentItem: string;
  items: Array<string>;
  changeDealField(index: number, field: string, value: any): void;
  removeDeal(index: number): void;
  addDealItem(index: number): void;
  removeDealItem(dealIndex: number, itemIndex: number): void;
};
interface MyState {
	dictionary: object;
	test: string;

};

class CateringDeal extends React.Component <MyProps, MyState>{

	constructor(props){
    super(props);

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

	
  render() {
    return(
    	<Row className="cateringDeal">
        <Col xs="12">
        	<div>
        		<h4>{`${this.state.dictionary['partnerProfileCateringDealsDeal']} ${this.props.index + 1}`}</h4>
          	<span className="closeIcon" onClick={() => this.props.removeDeal(this.props.index)}></span>
        	</div>
        </Col>

        <Col xs="12">
          <Row>
            <Col xs="12" sm="4">
              <label>{this.state.dictionary['partnerProfileCateringDealsType']}</label>
              <Select 
                options={generalOptions[`dealType_${this.props.lang}`]} 
                value={ this.props.type } 
                onChange={(val) => this.props.changeDealField(this.props.index, 'type', val)} 
                instanceId="scaleInput" 
                className="logInput" 
                placeholder=""/>
            </Col>
            <Col xs="12" sm="4">
              <label>{this.state.dictionary['partnerProfileCateringDealsPrice']}</label>
              <PlainInput 
                placeholder=""
                value={ this.props.price }
                onChange={ (event) => this.props.changeDealField(this.props.index, 'price', event.target.value) }
                type="number"
                className="logInput" />
            </Col>
            <Col xs="12" sm="4">
              <label>{this.state.dictionary['partnerProfileCateringDealsMin']}</label>
              <PlainInput 
                placeholder=""
                value={ this.props.min }
                onChange={ (event) => this.props.changeDealField(this.props.index, 'min', event.target.value) }
                type="number"
                className="logInput" />
            </Col>
          </Row>

          <Row className="dealContent">
            <Col xs="12">
              <div className="middle">
                <p className="sub-sm">{this.state.dictionary['partnerProfileCateringDealsDealCont']}</p>
              </div>
            </Col>
          	{
          		this.props.items.length
          		?
          		this.props.items.map((item, index) => {
          			return(
          				<Col xs="12" sm="6" key={`dealItemKey_${index}`} className={ index % 2 == 0 ? 'evenCol' : null }>
          					<div>
          						<p>{ item }</p>
          						<span className="closeIcon small" onClick={() => this.props.removeDealItem(this.props.index, index)}></span>
          					</div>
			              
			            </Col>
          			)
          		})
          		:
          		<Col xs="12">
          			<div className="middle">
          				<h6 className="fadedPrev">{this.state.dictionary['partnerProfileCateringDealsEmptyDeal']}</h6>
          			</div>
	            </Col>
          	}
          </Row>

          <Row>
            <Col xs="12" lg="8">
            	<label>{this.state.dictionary['partnerProfileCateringDealsFoodName']}</label>
              <PlainInput 
                placeholder="" 
                value={ this.props.currentItem }
                onChange={ (event) => this.props.changeDealField(this.props.index, 'currentItem', event.target.value) }
                type="text"
                className="logInput" />
            </Col>

            <Col xs="12" lg="4">
            	<div className="middle">
              	<button className="buttonAdd" onClick={ () => this.props.addDealItem(this.props.index) }>{this.state.dictionary['partnerProfileCateringDealsFoodButton']}</button>
              </div>
            </Col>
          </Row>
        </Col>
     </Row>
    	
    ) 
  }
}


export default CateringDeal;