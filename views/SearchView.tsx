import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from '../components/loader';
import { Container, Row, Col, Button, Alert } from 'reactstrap';
import { datePickerLang } from '../lib/language/dateLanguage';
import { setUserLanguage } from '../actions/user-actions';
import { adminBasicDevLogin } from '../actions/admin-actions';
import { changeSinglePartnerField, getPartnersMultiple } from '../actions/partner-actions';
import { getLanguage } from '../lib/language';
import { isMobile, setUpLinkBasic, getArrayObjectByFieldValue, getArrayIndexByFieldValue, setUrlString, errorExecute, sumOfRatingMarks } from '../lib/helpers/generalFunctions';
import { addDaysToDate, dateForSearch, createDisplayPhotoListObject, getGeneralOptionLabelByValue, setSearchData } from '../lib/helpers/specificPartnerFunctions';
import genOptions from '../lib/constants/generalOptions';
import PlainInput from '../components/form/input';
import CheckBox from '../components/form/checkbox';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import Select from 'react-select';
import NavigationBar from '../components/navigation/navbar';
import Footer from '../components/navigation/footer';
import Keys from '../server/keys';

interface MyProps {
  // using `interface` is also ok

  setUserLanguage(language: string): string;
  getPartnersMultiple(data: object, link: object): void;
  changeSinglePartnerField(field: string, value: any): any;
  getPartnersMultipleStart: boolean;
  getPartnersMultipleError: object | boolean;
  getPartnersMultipleSuccess: null | number;
  searchResults: Array<object>;
  partners: Array<object>;
  userLanguage: string;
  globalError: boolean;
  userAgent: string;
  path: string;
  date: null | string;
  city: null | string;
  district: null | string;
  fullPath: string;
  lang: string;
  userIsLogged: boolean;
};
interface MyState {
	language: string;
	dictionary: object;
	isMobile: boolean;
  loader: boolean;
  city: null | object;
  district: null | object;
  date: Date,
  kidsNum: number;
  adultsNum: number;
  additional: boolean;
  parking: boolean;
  yard: boolean;
  balcon: boolean;
  pool: boolean;
  animator: boolean;
  movie: boolean;
  gaming: boolean;
  offer: object;
  agesFrom: null | object;
  agesTo: null | object;
  priceFrom: null | object;
  priceTo: null | object;
  name: string;
  sort: null | object;

};

class SearchView extends React.Component <MyProps, MyState>{

	constructor(props){
    super(props);

    this.componentObjectBinding = this.componentObjectBinding.bind(this);

    const bindingFunctions = ['handleInputChange', 'formatDate', 'toggleAdditional', 'checkTheBox', 'checkOfferBox', 'handleSearch', 'goToLocation'];
    this.componentObjectBinding(bindingFunctions);
  }

  componentObjectBinding(array){
    array.map( item => {
      this[item] = this[item].bind(this);
    })
  }

	state: MyState = {
    language: this.props.lang.toUpperCase(),
    dictionary: getLanguage(this.props.lang),
    isMobile: isMobile(this.props.userAgent),
    loader: true,
    city: getArrayIndexByFieldValue(genOptions['cities'], 'value', this.props.city) !== -1 ? getArrayObjectByFieldValue(genOptions['cities'], 'value', this.props.city) : null,
    district: getArrayIndexByFieldValue(genOptions['cities'], 'value', this.props.city) !== -1 && getArrayIndexByFieldValue(genOptions['quarter'][this.props.city], 'value', this.props.district) !== -1 ? getArrayObjectByFieldValue(genOptions['quarter'][this.props.city], 'value', this.props.district) : null,
    date: this.props.date ? dateForSearch(this.props.date)  : new Date(),
    kidsNum: 1,
    adultsNum: 1,
    additional: false,
    parking: false,
	  yard: false,
	  balcon: false,
	  pool: false,
	  animator: false,
	  movie: false,
	  gaming: false,
	  offer: {},
	  agesFrom: null,
  	agesTo: null,
  	priceFrom: null,
  	priceTo: null,
  	name: '',
  	sort: null,
  };

  handleInputChange(field, value){
     this.setState(prevState => ({
      ...prevState,
      [field]: value // No error here, but can't ensure that key is in StateKeys
    }));
  }

  formatDate(date, format, locale) {
    if (this.props.lang === 'en') {
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    }
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  }

  toggleAdditional() {
  	this.setState({ additional: !this.state.additional }, () => {
  		const elem = document.getElementById("additional");
  		elem.classList.toggle('hide');
  		const time = this.state.additional ? 600 : 1;
  		setTimeout(() => {
  			elem.classList.toggle('overflow');
  		}, time);
  		
  	})
  }

  checkTheBox(box: any){
  	const field = box.getAttribute('data-field');
  	const value = !this.state[field];

  	this.handleInputChange(field, value);
  }

  checkOfferBox(box: any){
  	const offer = {...this.state.offer};
  	const field = box.getAttribute('data-field');
  	const value = offer[field] ? !offer[field] : true;
  	offer[field] = value;

  	this.handleInputChange('offer', offer);
  }

  handleSearch(){
  	this.setState({ loader: true }, () => {
  		if (this.state.additional) {
  			this.toggleAdditional();
  		}
  		
  		const data = setSearchData({...this.state});
  		const link = setUpLinkBasic(window.location.href);
  		this.props.getPartnersMultiple(data, link);
  	})
  	
  }

  goToLocation(link: string){
    this.setState({ loader: true }, () => {
      window.location.href = link;
    })
  }

  componentDidUpdate(prevProps: MyProps, prevState:  MyState){ 
    errorExecute(window, this.props.globalError);
    
  	if (!this.props.getPartnersMultipleStart && prevProps.getPartnersMultipleStart && !this.props.getPartnersMultipleError && this.props.getPartnersMultipleSuccess) {
    	this.setState({loader: false });
    }
  }

	componentDidMount(){
		this.props.setUserLanguage(this.props.lang);
		this.props.changeSinglePartnerField('searchResults', this.props.partners);
    this.setState({loader: false });
	}
	
  render() {
    const dateString = `${this.state.date.getDate()}-${this.state.date.getMonth()+1}-${this.state.date.getFullYear()}`;

    return(
    	<div className="totalWrapper">
        <Loader  show={ this.state.loader } />
    		<NavigationBar 
    			isMobile={ this.state.isMobile } 
    			language={ this.state.language } 
          fullPath={ this.props.fullPath }
    			page={ this.props.path ? this.props.path : '' }
    			contact={ this.state.dictionary['navigationContact'] }
    			login={ this.state.dictionary['navigationLogin'] }
    			search={ this.state.dictionary['navigationSearch'] }
    			partnership={ this.state.dictionary['navigationPartnership'] }
    			faq={ this.state.dictionary['navigationFaq'] }
          terms={ this.state.dictionary['navigationTerms'] }
          user={ this.props.userIsLogged }
          userProfile={ this.state.dictionary['navigationProfile'] }
    		/>
    		<div className="searchWrapper">
    			<div className="filter">
    				<Container>
    					<Row className="basic">
    						<Col xs='4' sm="2">
    							<label>{ this.state.dictionary['searchFilterBasicCity'] }</label>
                	<Select 
	                  options={genOptions['cities']} 
	                  value={ this.state.city } 
	                  onChange={(val) => this.handleInputChange('city', val)} 
	                  instanceId="homeCity" 
	                  className="logInput" 
	                  placeholder={ this.state.dictionary['uniCity'] }/>
                </Col>
                <Col xs='4' sm="2">
    							<label>{ this.state.dictionary['searchFilterBasicDistrict'] }</label>
                	<Select 
	                  options={genOptions['quarter'][this.state.city ? this.state.city['value'].toString() : 0]} 
	                  value={ this.state.district } 
	                  onChange={(val) => this.handleInputChange('district', val)} 
	                  instanceId="homeDistrict" 
	                  className="logInput" 
	                  placeholder={ this.state.dictionary['uniDistrict'] }/>
                </Col>
                <Col xs='4' sm="2">
    							<label>{ this.state.dictionary['searchFilterBasicDate'] }</label>
                	 <DayPickerInput 
	                  value={ this.state.date }
	                  formatDate={ this.formatDate }
	                  placeholder={ this.state.dictionary['partnerProfileReservationDatePlaceHolder'] }
	                  onDayChange= { (date) => this.handleInputChange('date', date) }
	                  format="dd/mm/yyyy"
	                  hideOnDayClick={ true }
	                  keepFocus={ false }
	                  dayPickerProps={{
	                  	disabledDays: {
                          before: new Date(),
                          after: addDaysToDate(null, 180),
                      },
	                    todayButton: datePickerLang[this.props.lang]['today'],
	                    selectedDays: [ this.state.date ],
	                    weekdaysShort: datePickerLang[this.props.lang]['daysShort'],
	                    months: datePickerLang[this.props.lang]['months']
	                  }}
	                 />
                </Col>
               
                <Col xs='4' sm="2">
                	<label>{ this.state.dictionary['searchFilterBasicKidsNum'] }</label>
                	<PlainInput 
                    placeholder={ this.state.dictionary['searchFilterBasicKidsNum'] } 
                    onChange={(event) => this.handleInputChange('kidsNum', event.target.value)} 
                    value={this.state.kidsNum} 
                    className="logInput" />
                </Col>
                <Col xs='4' sm="2">
                	<label>{ this.state.dictionary['searchFilterBasicAdultsNum'] }</label>
                	<PlainInput 
                    placeholder={ this.state.dictionary['searchFilterBasicAdultsNum'] }
                    onChange={(event) => this.handleInputChange('adultsNum', event.target.value)} 
                    value={this.state.adultsNum} 
                    className="logInput" />
                </Col>
                <Col xs='12' sm="2">
                	<Button color="success" onClick={ this.handleSearch }>{ this.state.dictionary['uniSearch'] }</Button>
                </Col>
                <Col xs="12">
                	<div className="middle">
                		<p onClick={ this.toggleAdditional }>{this.state.additional ? `${this.state.dictionary['searchFilterBasicMoreBasic']}` : `${this.state.dictionary['searchFilterBasicMoreDetail']}` }</p>
                	</div>
                </Col>
              </Row>

              <Row id="additional" className="additional hide">
              	<Col xs="12">
              		<hr></hr>
              	</Col>
              	<Col xs="12" md="5">
              		<Row>
              			<Col xs="12">
              				<div className="middle">
              					<h5>{ this.state.dictionary['partnerProfileGeneralSubSpace'] }</h5>
              				</div>
              			</Col>
              		</Row>
              		<Row>
              			<Col xs="12" sm="12" lg="6">

		              		<Row>
		              			<Col xs="12">
		              				<label>{ this.state.dictionary['searchFilterAdditionalVenueName'] }</label>
				                	<PlainInput 
				                    placeholder={ this.state.dictionary['partnerProfileGeneralRoomnamePlaceholder'] }
				                    onChange={(event) => this.handleInputChange('name', event.target.value)} 
				                    value={this.state.name} 
				                    className="logInput" />
		              			</Col>
		              			<Col xs="12">
		              				<Row>
				                		<Col xs="6">
				                			<label>{this.state.dictionary['searchFilterAdditionalAgeFrom']}</label>
						                	<Select 
							                  options={genOptions['ages']} 
							                  value={ this.state.agesFrom } 
							                  onChange={(val) => this.handleInputChange('agesFrom', val)} 
							                  instanceId="agesFrom" 
							                  className="logInput" 
							                  placeholder={this.state.dictionary['searchFilterAdditionalAgePlaceholder']}/>
				                		</Col>
				                		<Col xs="6">
				                			<label>{this.state.dictionary['searchFilterAdditionalAgeTo']}</label>
						                	<Select 
							                  options={genOptions['ages']} 
							                  value={ this.state.agesTo } 
							                  onChange={(val) => this.handleInputChange('agesTo', val)} 
							                  instanceId="agesTo" 
							                  className="logInput" 
							                  placeholder={this.state.dictionary['searchFilterAdditionalAgePlaceholder']}/>
				                		</Col>
				                	</Row>
		              				
		              			</Col>
		              			<Col xs="12">
		              				<Row>
				                		<Col xs="6">
				                			<label>{this.state.dictionary['searchFilterAdditionalPriceFrom']}</label>
						                	<Select 
							                  options={genOptions['prices']} 
							                  value={ this.state.priceFrom } 
							                  onChange={(val) => this.handleInputChange('priceFrom', val)} 
							                  instanceId="priceTermFrom" 
							                  className="logInput" 
							                  placeholder={this.state.dictionary['partnerProfileOfferAddonPricePlaceholder']}/>
				                		</Col>
				                		<Col xs="6">
				                			<label>{this.state.dictionary['searchFilterAdditionalPriceTo']}</label>
						                	<Select 
							                  options={genOptions['prices']} 
							                  value={ this.state.priceTo } 
							                  onChange={(val) => this.handleInputChange('priceTo', val)} 
							                  instanceId="priceTermTo" 
							                  className="logInput" 
							                  placeholder={this.state.dictionary['partnerProfileOfferAddonPricePlaceholder']}/>
				                		</Col>
				                	</Row>
		              			</Col>
		              		</Row>
		              	</Col>

		              	<Col xs="12" sm="12" lg="6">
		              		<Row>
		              			<Col xs="12">
		              				<CheckBox
		                        disabled={ false }
		                        checked={ this.state.parking }
		                        field="parking"
		                        onChange={ this.checkTheBox }
		                        orientation="back"
		                        label={ this.state.dictionary['partnerProfilePreviewIconParking'] }
		                      />
		              			</Col>
		              			<Col xs="12">
		              				<CheckBox
		                        disabled={ false }
		                        checked={ this.state.yard }
		                        field="yard"
		                        onChange={ this.checkTheBox }
		                        orientation="back"
		                        label={ this.state.dictionary['partnerProfilePreviewIconYard'] }
		                      />
		              			</Col>
		              			<Col xs="12">
		              				<CheckBox
		                        disabled={ false }
		                        checked={ this.state.balcon }
		                        field="balcon"
		                        onChange={ this.checkTheBox }
		                        orientation="back"
		                        label={ this.state.dictionary['partnerProfilePreviewIconBalcon'] }
		                      />
		              			</Col>
		              			<Col xs="12">
		              				<CheckBox
		                        disabled={ false }
		                        checked={ this.state.pool }
		                        field="pool"
		                        onChange={ this.checkTheBox }
		                        orientation="back"
		                        label={ this.state.dictionary['partnerProfilePreviewIconPool'] }
		                      />
		              			</Col>
		              			<Col xs="12">
		              				<CheckBox
		                        disabled={ false }
		                        checked={ this.state.animator }
		                        field="animator"
		                        onChange={ this.checkTheBox }
		                        orientation="back"
		                        label={ this.state.dictionary['partnerProfilePreviewIconAnimator'] }
		                      />
		              			</Col>
		              			<Col xs="12">
		              				<CheckBox
		                        disabled={ false }
		                        checked={ this.state.movie }
		                        field="movie"
		                        onChange={ this.checkTheBox }
		                        orientation="back"
		                        label={ this.state.dictionary['partnerProfilePreviewIconMovie'] }
		                      />
		              			</Col>
		              			<Col xs="12">
		              				<CheckBox
		                        disabled={ false }
		                        checked={ this.state.gaming }
		                        field="gaming"
		                        onChange={ this.checkTheBox }
		                        orientation="back"
		                        label={ this.state.dictionary['partnerProfilePreviewIconGaming'] }
		                      />
		              			</Col>
		              		</Row>
		              	</Col>
              		</Row>
              	</Col>
              	
              	
              	<Col xs="12" md="7">
              		<Row>
              			<Col xs="12">
              				<div className="middle">
              					<h5>{ this.state.dictionary['searchFilterAdditionalEntertainmentSub'] }</h5>
              				</div>
              			</Col>
              		</Row>
              		<Row>
              			{
              				genOptions[`contentOffer_${this.props.lang}`].map((offer, index) => {
              					if (genOptions['contentOfferForSearch'].indexOf(parseInt(offer['value'])) > -1) {
              						return(
	              						<Col xs="6" sm="6" lg="4" key={`filterKey_${index}`}>
				              				<CheckBox
				                        disabled={ false }
				                        checked={ this.state.offer[offer['value']] ? this.state.offer[offer['value']] : false }
				                        field={offer['value']}
				                        onChange={ this.checkOfferBox }
				                        orientation="back"
				                        label={offer['label']}
				                      />
				              			</Col>
	              					)
              					}
              				})
              			}
              			
              		</Row>
              	</Col>
              </Row>
    				</Container>
    			</div>

          <Container>
            <Row className="searchResultsTitle">
              <Col xs='12' sm="3">
                <Select 
                  options={genOptions[`searchSortOptions_${this.props.lang}`]} 
                  value={ this.state.sort } 
                  onChange={(val) => this.handleInputChange('sort', val)} 
                  instanceId="sortOptions" 
                  className="logInput" 
                  isDisabled={true}
                  placeholder={ this.state.dictionary['searchResultsSortPlaceholder'] }/>
              </Col>

              <Col xs='12' sm="6">
              	<div className="middle">
              		<h2>{ this.state.dictionary['searchResultsTitle'] }</h2>
              	</div>
              </Col>

              <Col xs='12' sm="3">
                <div className="middle">
              		<h5>{ `${this.props.searchResults.length} ${this.state.dictionary['searchResultsItemsNum']}` }</h5>
              	</div>
              </Col>
            </Row>
            {
              this.props.searchResults.length
              ?
              <div>
                <Row className="searchResultsContent justify-content-sm-center">
                  {
                    this.props.searchResults.map((item, index) => {
                      const photoList = createDisplayPhotoListObject(item);
                      return(
                        <Col xs="12" sm="6" lg="4" xl="3" key={`resultKey_${index}`}>
                          <div className="searchItem" onClick={ () => this.goToLocation(`/locations/${setUrlString(item['name'])}/?partner=${item['link']}&language=${this.props.lang}&date=${dateString}`)}>
                            <div className="photo" style={{'background': 'url('+Keys.AWS_PARTNER_PHOTO_LINK+photoList['main']+') center / cover no-repeat'}}></div>
                            <div className="info">
                              <h5>{getGeneralOptionLabelByValue(genOptions['spaceType_' + this.props.lang], item['general']['spaceType']) + ' ' + item['name']}</h5>
                              <p><span className="icon room"></span>{item['general']['address']}</p>
                              <p><span className="icon group"></span>{`${item['general']['capacity']['sumKids']} ${this.state.dictionary['searchResultsItemKids']} ${item['general']['capacity']['sumAdults']} ${this.state.dictionary['searchResultsItemAdults']}`}</p>
                              <p><span className="icon house"></span>{`${item['general']['size']}m2`}</p>
                              {
                                item['rating']
                                ?
                                <div>
                                  <h6> <span className="icon star"></span>{(sumOfRatingMarks(item['rating']) / 8 / item['numberOfRating']).toFixed(1)}</h6>
                                  <p className="rates">{`${this.state.dictionary['searchResultsRated']} ${item['numberOfRating']} ${this.state.dictionary['searchResultsTimes']}`}</p>
                                </div>
                                
                                :
                                <p className="rates">{'trenutno neocenjeno'}</p>
                              }
                              
                            </div>
                          </div>
                        </Col>
                      )
                    })
                  }
                  
                </Row>

                <Row className="searchViewEnd">
                  <Col xs="12">
                    <div className="middle" hidden={true}>
                      <Button color="success">{ this.state.dictionary['searchResultsLoadButton'] }</Button>
                    </div>
                  </Col>
                </Row>
                
              </div>
              :
              <Row>
                <Col xs="12">
                  <div className="middle">
                    <h3 className="noMatch">Trenutno nema rezultata koji odgovaraju vašim kriterijumima pretrage</h3>
                  </div>
                </Col>
                
              </Row>
            }

            
        	</Container>
            
          </div> 

		    <Footer 
    			isMobile={ this.state.isMobile } 
    			language={ this.state.language } 
    			page={ this.props.path ? this.props.path : '' }
    			contact={ this.state.dictionary['navigationContact'] }
    			login={ this.state.dictionary['navigationLogin'] }
    			search={ this.state.dictionary['navigationSearch'] }
    			partnership={ this.state.dictionary['navigationPartnership'] }
    			faq={ this.state.dictionary['navigationFaq'] }
          terms={ this.state.dictionary['navigationTerms'] }
          payment={ this.state.dictionary['navigationOnline'] }
          privacy={ this.state.dictionary['navigationPrivacy'] }
    		/>

    	</div>
    	
    ) 
  }
}

const mapStateToProps = (state) => ({
  userLanguage: state.UserReducer.language,
  globalError: state.UserReducer.globalError,

  searchResults: state.PartnerReducer.searchResults,
  getPartnersMultipleStart: state.PartnerReducer.getPartnersMultipleStart,
  getPartnersMultipleError: state.PartnerReducer.getPartnersMultipleError,
  getPartnersMultipleSuccess: state.PartnerReducer.getPartnersMultipleSuccess,
});


const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setUserLanguage,
    changeSinglePartnerField,
    getPartnersMultiple,
  },
  dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(SearchView)