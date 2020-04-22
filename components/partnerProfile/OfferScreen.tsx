import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col, Button, Alert } from 'reactstrap';
import { getLanguage } from '../../lib/language';
import generalOptions from '../../lib/constants/generalOptions';
import { changeSinglePartnerField, updateOfferPartner } from '../../actions/partner-actions';
import { isFieldInObject, getGeneralOptionLabelByValue, getOnlyValues, fillPickedOffers, generateString, makeRegIdsUniqueForArray } from '../../lib/helpers/specificPartnerFunctions';
import { setUpLinkBasic } from '../../lib/helpers/generalFunctions';
import PlainInput from '../form/input';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style/style.scss';

interface MyProps {
  // using `interface` is also ok
  lang: string;
  token?: string | undefined;
	partnerObject: null | object;
  partnerGeneral: object;
  partnerOffer: Array<object>;
  partnerAddon: Array<object>;
  forActivation: boolean;
  activationAlert: boolean;
  activationProcessPercent: number;
  updateOfferPartner(param: string, data: object, link: object, auth: string): object;
  changeSinglePartnerField(field: string, value: any): any;
  closeLoader(): void;
  openLoader(): void;
  updateActionOfferStart: boolean;
  updateActionOfferError: object | boolean;
  updateActionOfferSuccess: null | number;
};
interface MyState {
	dictionary: object;
	pickedOffers: object;
	loader: boolean;
	addonName: string;
	addonPrice: string;
	addonComment: string;
	errorMessages: object;
};

class OfferScreen extends React.Component <MyProps, MyState>{

	constructor(props){
    super(props);

    this.componentObjectBinding = this.componentObjectBinding.bind(this);

    const bindingFunctions = [ 'addOfferItem', 'removeOfferItem', 'saveOffer', 'handleInputChange', 'addAddonToRedux', 'addonValidation', 'closeAlert', 'handleAddOn', 'removeOfferAddon', 'closeActivationAlert'];
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
    pickedOffers: {},
    addonName: '',
		addonPrice: '',
		addonComment: '',
		errorMessages: { show: false, fields:{ addonName: false, addonPrice: false, addonComment: false }}
  };

  addOfferItem(item: any){
  	const label = item.getAttribute('data-label');
  	const value = item.getAttribute('data-value');
  	const pickedOffers =  JSON.parse(JSON.stringify(this.state.pickedOffers)); 
  	pickedOffers[label] = true;
  	this.setState({ pickedOffers }, () => {
  		const partnerOffer = JSON.parse(JSON.stringify(this.props.partnerOffer));
  		partnerOffer.push({value, label});
  		this.props.changeSinglePartnerField('partnerOffer', partnerOffer);
  	});
  }

  removeOfferItem(item: any){
  	const label = item.getAttribute('data-label');
  	const value = item.getAttribute('data-value');
  	const pickedOffers =  JSON.parse(JSON.stringify(this.state.pickedOffers));
  	pickedOffers[label] = false;
  	this.setState({ pickedOffers }, () => {
  		const partnerOffer = JSON.parse(JSON.stringify(this.props.partnerOffer));
  		for (var i = 0; i < partnerOffer.length; ++i) {
  			if (partnerOffer[i]['value'] === value) {
  				partnerOffer.splice(i,1);
  			}
  		}
  		this.props.changeSinglePartnerField('partnerOffer', partnerOffer);
  	});
  }

  addonValidation(callback){
  	const errorCopy =  JSON.parse(JSON.stringify(this.state.errorMessages));
  	if (this.state.addonName === '') {
  		errorCopy['fields']['addonName'] = true;
  	}else{
  		errorCopy['fields']['addonName'] = false;
  	}

  	if (this.state.addonPrice === '') {
  		errorCopy['fields']['addonPrice'] = true;
  	}else{
  		errorCopy['fields']['addonPrice'] = false;
  	}

  	let showVal = false;

    Object.keys(errorCopy['fields']).forEach((key) => {
      if (errorCopy['fields'][key] === true) {
        showVal = true;
      }
    })
    errorCopy['show'] = showVal;

    this.setState({errorMessages: errorCopy }, () => {
      callback();
    });
  }

  addAddonToRedux(){
  	if (!this.state.errorMessages['show']) {
  		const partnerAddon =  JSON.parse(JSON.stringify(this.props.partnerAddon));
	  	const addon = { name: this.state.addonName, price: this.state.addonPrice, comment: this.state.addonComment, regId: generateString(12) };
	  	partnerAddon.push(addon);

	  	this.setState({addonName: '', addonPrice: '', addonComment: ''}, () => {
	  		this.props.changeSinglePartnerField('partnerAddon', partnerAddon);
	  	})
  	}
  }

  handleAddOn(){
  	this.addonValidation(this.addAddonToRedux);
  }

  handleInputChange(field, value){
     this.setState(prevState => ({
      ...prevState,
      [field]: value // No error here, but can't ensure that key is in StateKeys
    }));
  }

  removeOfferAddon(target: any){
  	const index = target.getAttribute('data-item');
  	const partnerAddon = JSON.parse(JSON.stringify(this.props.partnerAddon));
  	partnerAddon.splice(index, 1);
  	this.props.changeSinglePartnerField('partnerAddon', partnerAddon);
  }

  closeAlert(){
    const errorCopy = JSON.parse(JSON.stringify(this.state.errorMessages));
    errorCopy['show'] = false;
    this.setState({errorMessages: errorCopy});
  }

  closeActivationAlert(){
    this.props.changeSinglePartnerField('activationAlert', false);
  }

  saveOffer(){
  	this.props.openLoader();
		const link = setUpLinkBasic(window.location.href);
		const offer = getOnlyValues(this.props.partnerOffer);
		const addon = JSON.parse(JSON.stringify(makeRegIdsUniqueForArray(this.props.partnerAddon)));
  	const data = { language: this.props.lang, offer, addon, partner: this.props.partnerObject };
  	this.props.updateOfferPartner('_id', data, link, this.props.token);
  }

  
  componentDidUpdate(prevProps: MyProps, prevState:  MyState){
    if (prevProps.lang !== this.props.lang) {
      let dictionary = getLanguage(this.props.lang);
      this.setState({ dictionary });
    }

    if (this.props.partnerObject && !prevProps.partnerObject) {
    	if (this.props.partnerObject['contentOffer']) {
    		const pickedOffers =  fillPickedOffers(this.state.pickedOffers, this.props.partnerObject['contentOffer'], this.props.lang);
	    		this.setState({loader: false, pickedOffers }, () => {
	    			this.props.closeLoader();
	    		});
    	}else{
    		this.props.closeLoader();
    	}
    }

    if (!this.props.updateActionOfferStart && prevProps.updateActionOfferStart && !this.props.updateActionOfferError) {
    	if (this.props.partnerObject) {
    		if (this.props.partnerObject['contentOffer']) {
	    		this.setState({loader: false }, () => {
	    			this.props.closeLoader();
	    		});
	    	}
    	}
    }
  }

  componentDidMount(){
  	if (this.props.partnerObject) {
  		const pickedOffers =  fillPickedOffers(this.state.pickedOffers, this.props.partnerObject['contentOffer'], this.props.lang);
    	this.setState({pickedOffers});
  	}
  }

	
  render() {
    return(
    	<div className="partnerProflePage offer">
        <Container fluid>
          <Row>
            <Col xs="12">
              <div className="pageHeader">
                <h2>{this.state.dictionary['partnerProfileOfferTitle']}</h2>
                <p>{this.state.dictionary['partnerProfileOfferDescription']}<a href={`/partnerHelp/${this.props.lang}/?section=content`} target="_blank">{this.state.dictionary['uniPartnerProfileHelp']}</a></p>
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
          	<Col xs="12">
          		<h4>{this.state.dictionary['partnerProfileOfferSubFree']}</h4>
          	</Col>
          </Row>

          <Row className="partnerSection">
          	<Col xs="12" sm="12" lg="4">
          		<Row >
		          	<Col xs="12">
                  <div className="middle">
                    <p className="sub-sm">{this.state.dictionary['partnerProfileOfferSubFreeContent']}</p>
                  </div>
                </Col>
		          	<Col xs="12">
		          		<div className="chipList">
					        	{
					        		this.props.partnerOffer.length 
					        		?
					        		this.props.partnerOffer.map( (offer, index) => {
					        			return(
					        				<div className="offerChip" key={`chip_${index}`}>
						          			<span data-label={offer['label']} data-value={offer['value']} onClick={(event) => this.removeOfferItem(event.target)}></span>
						          			<p>{offer['label']}</p>
						          		</div>
					        			)
					        		})
					        		:
					        		<h3>{this.state.dictionary['partnerProfileOfferNoItemsFree']}</h3>
					        	}
				        	</div>
		          	</Col>
		          </Row>
          	</Col>

          	<Col xs="12" sm="12" lg="8" className="offerBorder">
          		<Row>
                <Col xs="12">
                  <div className="middle">
                    <p className="sub-sm">{this.state.dictionary['partnerProfileOfferSubFreeList']}</p>
                  </div>
                </Col>
			          {
			          	generalOptions[`contentOffer_${this.props.lang}`].map( (obj, index) => {
			          		return(
			          			<Col xs="12" sm="6" key={`offer_${index}`}>
				          			<Row className="offerItem">
				          					<Col xs="6" lg="8">
				          						<span>{obj['label']}</span>
				          					</Col>
				          					<Col xs="3" lg="2" className="smallColPadd">
				          						<button data-label={obj['label'].toLowerCase()} data-value={obj['value']} onClick={(event) => this.addOfferItem(event.target)} disabled={ this.state.pickedOffers[obj['label'].toLowerCase()] ? true : false }><span className="add"></span></button>
				          					</Col>
				          					<Col xs="3" lg="2" className="smallColPadd">
				          						<button className="cancel" data-label={obj['label'].toLowerCase()} data-value={obj['value']} onClick={(event) => this.removeOfferItem(event.target)} disabled={ this.state.pickedOffers[obj['label'].toLowerCase()] ? false : true }><span className="clear"></span></button>
				          					</Col>
				          			</Row>
			          			</Col>
			          		)
			          	})
			          }
		          </Row>
          	</Col>
          </Row>

          

          <Row>
          	<Col xs="12">
          		<h4>{this.state.dictionary['partnerProfileOfferSubPay']}</h4>
          	</Col>
          </Row>

          <Row className="partnerSection">
            <Col xs="12">
              <div className="middle">
                <p className="sub-sm">{this.state.dictionary['partnerProfileOfferSubAddContent']}</p>
              </div>
            </Col>
          	<Col xs="12">
          		<Alert color="danger" isOpen={ this.state.errorMessages["show"] } toggle={this.closeAlert} >
                <p hidden={ !this.state.errorMessages['fields']['addonName']} >{this.state.dictionary['partnerProfileOfferAddonAlertName']}</p>
                <p hidden={ !this.state.errorMessages['fields']['addonPrice']} >{this.state.dictionary['partnerProfileOfferAddonAlertPrice']}</p>
              </Alert>
          		<div className="chipList">
          			{
          				this.props.partnerAddon.length 
			        		?
          				this.props.partnerAddon.map( (addon, index) => {
          					return(
          						<div className="addonChip" key={`addon_${index}`}>
			          				<span data-item={index} onClick={(event) => this.removeOfferAddon(event.target)}></span>
			          				<label>{`${addon['name']} - ${addon['price']} rsd`}</label>
			          				<p>{addon['comment']}</p>
			          			</div>
          					)
          				})
          				:
          				<h3>{this.state.dictionary['partnerProfileOfferNoItemsPay']}</h3>
          			}
		        	</div>
          	</Col>

            <Col xs="12">
              <Row>
                <Col xs="12">
                  <div className="middle">
                    <p className="sub-sm">{this.state.dictionary['partnerProfileOfferSubAddForm']}</p>
                  </div>
                </Col>

                <Col xs="12" sm="8">
                  <label>{this.state.dictionary['partnerProfileOfferAddonName']}</label>
                  <PlainInput 
                    placeholder={this.state.dictionary['partnerProfileOfferAddonNamePlaceholder']}
                    value={ this.state.addonName }
                    onChange={ (event) => this.handleInputChange('addonName', event.target.value) }
                    type="text"
                    className={`${this.state.errorMessages['fields']['addonName'] ? "borderWarrning" : ''} logInput`} />
                </Col>
                <Col xs="12" sm="4">
                  <label>{this.state.dictionary['partnerProfileOfferAddonPrice']}</label>
                  <PlainInput 
                    placeholder={this.state.dictionary['partnerProfileOfferAddonPricePlaceholder']}
                    value={ this.state.addonPrice }
                    onChange={ (event) => this.handleInputChange('addonPrice', event.target.value) }
                    type="number"
                    className={`${this.state.errorMessages['fields']['addonPrice'] ? "borderWarrning" : ''} logInput`} />
                </Col>
                <Col xs="12">
                  <label>{this.state.dictionary['partnerProfileOfferAddonComment']}</label>
                  <PlainInput 
                    placeholder={this.state.dictionary['partnerProfileOfferAddonCommentPlaceholder']} 
                    value={ this.state.addonComment }
                    onChange={ (event) => this.handleInputChange('addonComment', event.target.value) }
                    type="text"
                    max={ 255 }
                    className="logInput" />
                </Col>
                <Col xs="12">
                  <div className="middle">
                    <button className="buttonAdd" onClick={ this.handleAddOn }>{this.state.dictionary['partnerProfileOfferAddonButton']}</button>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row>
            <Col xs="12">
            	<div className="middle bigMarginSeparation">
								<Button color="success" onClick={ this.saveOffer } >{this.state.dictionary['partnerProfileOfferSaveButton']}</Button>
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
	partnerOffer: state.PartnerReducer.partnerOffer,
	partnerAddon: state.PartnerReducer.partnerAddon,

  forActivation: state.PartnerReducer.forActivation,
  activationAlert: state.PartnerReducer.activationAlert,
  activationProcessPercent: state.PartnerReducer.activationProcessPercent,
  
	updateActionOfferStart: state.PartnerReducer.updateActionOfferStart,
  updateActionOfferError: state.PartnerReducer.updateActionOfferError,
  updateActionOfferSuccess: state.PartnerReducer.updateActionOfferSuccess,
});


const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
  	changeSinglePartnerField,
  	updateOfferPartner,
  },
  dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(OfferScreen)