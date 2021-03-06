import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col, Button, Alert } from 'reactstrap';
import { getLanguage } from '../../lib/language';
import generalOptions from '../../lib/constants/generalOptions';
import { changeSinglePartnerField, updateDecorationPartner } from '../../actions/partner-actions';
import { isFieldInObject, getGeneralOptionLabelByValue, getOnlyValues, prepareDecorationDataForSave, generateString, isForDecorationSave } from '../../lib/helpers/specificPartnerFunctions';
import { setUpLinkBasic } from '../../lib/helpers/generalFunctions';
import PlainInput from '../form/input';
import CheckBox from '../form/checkbox';

interface MyProps {
  // using `interface` is also ok
  lang: string;
  token?: string | undefined;
	partnerObject: null | object;
  partnerDecoration: object;
  forActivation: boolean;
  activationAlert: boolean;
  activationProcessPercent: number;
  updateActionDecorationStart: boolean;
  updateActionDecorationError: object | boolean;
  updateActionDecorationSuccess: null | number;
  updateDecorationPartner(param: string, data: object, link: object, auth: string): object;
  changeSinglePartnerField(field: string, value: any): any;
  closeLoader(): void;
  openLoader(): void;
};
interface MyState {
	dictionary: object;
	loader: boolean;
	errorMessages: object;
};

class DecorationScreen extends React.Component <MyProps, MyState>{

	constructor(props){
    super(props);

    this.componentObjectBinding = this.componentObjectBinding.bind(this);

    const bindingFunctions = [ 'saveDecoration', 'handleInputChange', 'closeAlert', 'checkTheBox', 'changeThePrice', 'closeActivationAlert'];
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
		errorMessages: { show: false, fields:{ addonName: false, addonPrice: false, addonComment: false }}
  };

  handleInputChange(field, value){
     this.setState(prevState => ({
      ...prevState,
      [field]: value // No error here, but can't ensure that key is in StateKeys
    }));
  }

  closeAlert(){
    const errorCopy = JSON.parse(JSON.stringify(this.state.errorMessages));
    errorCopy['show'] = false;
    this.setState({errorMessages: errorCopy});
  }

  closeActivationAlert(){
    this.props.changeSinglePartnerField('activationAlert', false);
  }

  checkTheBox(item: any){
    const field = item.getAttribute('data-field');
    const partnerDecoration = JSON.parse(JSON.stringify(this.props.partnerDecoration));
    partnerDecoration[field]['check'] = !partnerDecoration[field]['check'];
    partnerDecoration[field]['regId'] = partnerDecoration[field]['check'] === true ? generateString(12) : partnerDecoration[field]['regId'];
    partnerDecoration[field]['price'] =  partnerDecoration[field]['check'] === false ? '' : partnerDecoration[field]['price'];
    this.props.changeSinglePartnerField('partnerDecoration', partnerDecoration);
  }

  changeThePrice(item: any){
    const field = item.getAttribute('name');
    const partnerDecoration = JSON.parse(JSON.stringify(this.props.partnerDecoration));
    partnerDecoration[field]['price'] = item['value'];
    this.props.changeSinglePartnerField('partnerDecoration', partnerDecoration);
  }

  saveDecoration(){
		const decoration = prepareDecorationDataForSave(this.props.partnerDecoration);
    if (isForDecorationSave(Object.keys(decoration).length, this.props.partnerObject)) {
      this.props.openLoader();
      const link = setUpLinkBasic(window.location.href);
      const data = { language: this.props.lang, decoration };
      this.props.updateDecorationPartner('_id', data, link, this.props.token);
    }
  }

  
  componentDidUpdate(prevProps: MyProps, prevState:  MyState){
    if (prevProps.lang !== this.props.lang) {
      let dictionary = getLanguage(this.props.lang);
      this.setState({ dictionary });
    }

    if (this.props.partnerObject && !prevProps.partnerObject) {
       this.props.closeLoader();
    }

    if (!this.props.updateActionDecorationStart && prevProps.updateActionDecorationStart && !this.props.updateActionDecorationError) {
      if (this.props.partnerObject) {
        if (this.props.partnerObject['catering']) {
          this.setState({loader: false }, () => {
            this.props.closeLoader();
          });
        }
      }
    }

  }

	
  render() {
    return(
    	<div className="partnerProflePage decoration">
        <Container fluid>
          <Row>
            <Col xs="12">
              <div className="pageHeader">
                <h2>{this.state.dictionary['partnerProfileDecorationTitle']}</h2>
                <p>{this.state.dictionary['partnerProfileDecorationDescription']} <a href={`/partnerHelp/${this.props.lang}/?section=decoration`} target="_blank">{this.state.dictionary['uniPartnerProfileHelp']}</a></p>
              </div>
            </Col>

            <Col xs='12'>
              <Alert color="success" isOpen={ this.props.activationAlert } toggle={this.closeActivationAlert} >
                <h3>{`${this.props.activationProcessPercent}${this.state.dictionary['uniPartnerProgressTitle']}`}</h3>
                <p>{this.state.dictionary['uniPartnerProgressDescription']} <a href={`/partnerHelp/${this.props.lang}/?section=activation`} target="_blank"> {this.state.dictionary['uniPartnerProgressLink']}</a> </p>
              </Alert>
            </Col>
            
          </Row>

          <Row>
            <Row>
              <Col xs="12">
                <h4>{this.state.dictionary['partnerProfileDecorationSubMain']}</h4>
              </Col>
            </Row>
          </Row>

          <Row className="decorationList partnerSection">
            <Col xs="12">
              <div className="middle">
                <p className="sub-sm">{this.state.dictionary['partnerProfileDecorationSubSmal']}</p>
              </div>
            </Col>
            {
              Object.keys(this.props.partnerDecoration).map( (key, index) => {
                const item = this.props.partnerDecoration[key];
                return(
                   <Col xs="12" sm="6" lg="4" key={`decoKey_${index}`} className="decorationItem">
                    <Row>
                      <Col xs="2">
                        <CheckBox
                          disabled={ false }
                          checked={ item['check'] }
                          field={ item['value'].toString() }
                          onChange={ this.checkTheBox }
                        />
                      </Col>
                      <Col xs="6">
                        <p>{item[`name_${this.props.lang}`]}</p>
                      </Col>
                      
                      <Col xs="4">
                        <PlainInput 
                          placeholder={this.state.dictionary['partnerProfileDecorationPricePlaceholder']}
                          value={ item['price'] }
                          name={ item['value'].toString() }
                          onChange={ (event) => this.changeThePrice(event.target) }
                          type="number"
                          disabled={ !item['check'] }
                          className="logInput" />
                      </Col>
                    </Row>
                  </Col>
                )
              })
            }
           
          </Row>

          <Row>
            <Col xs="12">
              <div className="middle bigMarginSeparation">
                <Button color="success"  onClick={ this.saveDecoration }>{this.state.dictionary['partnerProfileDecorationSaveButton']}</Button>
              </div>
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
  partnerDecoration: state.PartnerReducer.partnerDecoration,
  
  forActivation: state.PartnerReducer.forActivation,
  activationAlert: state.PartnerReducer.activationAlert,
  activationProcessPercent: state.PartnerReducer.activationProcessPercent,

  updateActionDecorationStart: state.PartnerReducer.updateActionDecorationStart,
  updateActionDecorationError: state.PartnerReducer.updateActionDecorationError,
  updateActionDecorationSuccess: state.PartnerReducer.updateActionDecorationSuccess,
});


const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
  	changeSinglePartnerField,
  	updateDecorationPartner,
  },
  dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(DecorationScreen)