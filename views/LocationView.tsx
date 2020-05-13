import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from '../components/loader';
import SimpleMap from '../components/map';
import { Container, Row, Col, Button, Alert, Table } from 'reactstrap';
import { setUserLanguage } from '../actions/user-actions';
import { adminBasicDevLogin } from '../actions/admin-actions';
import { getReservationsOnDate } from '../actions/reservation-actions';
import { getLanguage } from '../lib/language';
import { datePickerLang } from '../lib/language/dateLanguage';
import { isMobile, setUpLinkBasic, getArrayObjectByFieldValue, getArrayIndexByFieldValue, currencyFormat, errorExecute } from '../lib/helpers/generalFunctions';
import { isFieldInObject, getGeneralOptionLabelByValue, isolateByArrayFieldValue, getLayoutNumber, createDisplayPhotoListObject, dateForSearch, addDaysToDate } from '../lib/helpers/specificPartnerFunctions';
import { preparePartnerForLocation } from '../lib/helpers/specificReservationFunctions'
import generalOptions from '../lib/constants/generalOptions';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import PlainInput from '../components/form/input';
import NavigationBar from '../components/navigation/navbar';
import Footer from '../components/navigation/footer';
import GalleryModal from '../components/modals/GalleryModal';
import Keys from '../server/keys';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-day-picker/lib/style.css';
import '../style/style.scss';

interface MyProps {
  // using `interface` is also ok
  userLanguage: string;
  globalError: boolean;
  setUserLanguage(language: string): string;
  getReservationsOnDate(link: object, data: object): void;
  getReservationsStart: boolean;
  getReservationsError: object | boolean;
  getReservationsSuccess: null | number;
  reservations: Array<object>;
  userAgent: string;
  path: string;
  fullPath: string;
  lang: string;
  partner: object;
  date: string;
  userIsLogged: boolean;
};
interface MyState {
	language: string;
	dictionary: object;
	isMobile: boolean;
	galleryOpen: boolean;
  galleryPhoto: string;
  galleryPhotoIndex: number;
  selectedRoom: string;
  date: Date;
  term: object;
  loader: boolean;
};

class LocationView extends React.Component <MyProps, MyState>{

	constructor(props){
    super(props);

    this.componentObjectBinding = this.componentObjectBinding.bind(this);

    const bindingFunctions = ['closeGallery', 'openPhotoGallery', 'changeGalleryPhoto', 'selectRoom', 'formatDate','dateChange', 'makeReservation'];
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
    galleryOpen: false,
    galleryPhoto: '',
    galleryPhotoIndex: 0,
    selectedRoom: '',
    date: this.props.date !== 'null' ? dateForSearch(this.props.date) : new Date(),
    term: {},
    loader: false,
  };

  closeGallery(){
    this.setState({ galleryOpen: false, galleryPhotoIndex: 0, galleryPhoto: '' });
  }

  openPhotoGallery(photo: string){
    const galleryPhotoIndex = getArrayIndexByFieldValue(this.props.partner['photos'], 'name', photo);
    const galleryPhoto = Keys.AWS_PARTNER_PHOTO_LINK + photo;
    this.setState({ galleryOpen: true, galleryPhotoIndex, galleryPhoto });
  }

  changeGalleryPhoto(action: string) {
    if (action === 'next') {
      const galleryPhotoIndex = this.state.galleryPhotoIndex + 1 < this.props.partner['photos'].length ? this.state.galleryPhotoIndex + 1 : 0;
      const galleryPhoto = Keys.AWS_PARTNER_PHOTO_LINK + this.props.partner['photos'][galleryPhotoIndex]['name'];
      this.setState({ galleryPhotoIndex, galleryPhoto });
    }else{
      const galleryPhotoIndex = this.state.galleryPhotoIndex - 1 < 0 ? this.props.partner['photos'].length - 1 : this.state.galleryPhotoIndex - 1;
      const galleryPhoto = Keys.AWS_PARTNER_PHOTO_LINK + this.props.partner['photos'][galleryPhotoIndex]['name'];
      this.setState({ galleryPhotoIndex, galleryPhoto });
    }
  }

  selectRoom(room){
  	const finder = room.split('_')
  	const base = this.props.partner['terms'][parseInt(finder[0])];
  	const term = {room: base['name'], id: base['regId'], from: base['terms'][parseInt(finder[1])]['from'], to: base['terms'][parseInt(finder[1])]['to'], price: base['terms'][parseInt(finder[1])]['price']};
  	this.setState({selectedRoom: room, term });
  }

  formatDate(date, format, locale) {
    if (this.props.lang === 'en') {
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    }
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  }

  dateChange = date => {
  	
    this.setState({ date, loader: true, selectedRoom: '', term: {} }, () => {
    	const shortDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  		const link = setUpLinkBasic(window.location.href);
    	this.props.getReservationsOnDate(link, { date: shortDate, partner: this.props.partner['_id'], type: 'user', language: this.props.lang});
    });
  }

  makeReservation(){
  	if (this.state.date && this.props.partner['link'] && this.state.term) {
  		this.setState({loader: true}, () => {
  			const link = setUpLinkBasic(window.location.href);
		  	const date = `${this.state.date.getDate()}-${this.state.date.getMonth() + 1}-${this.state.date.getFullYear()}`;
		  	const partner = this.props.partner['link'];
		  	const room = this.state.term['id'];
		  	const from = this.state.term['from'];
		  	const to = this.state.term['to'];

		  	const url = `${link['protocol']}${link['host']}/reservation?language=${this.props.lang}&partner=${partner}&room=${room}&from=${from}&to=${to}&date=${date}`;
		  	window.location.href =  url;
  		})
  		
  	}
  }

  componentDidUpdate(prevProps: MyProps, prevState:  MyState){ 
  	errorExecute(window, this.props.globalError);

  	if (!this.props.getReservationsStart && prevProps.getReservationsStart && this.props.getReservationsSuccess) {
  		this.props.partner['reservations'] = this.props.reservations;
  		this.props.partner['terms'] = preparePartnerForLocation([...this.props.partner['general']['rooms']], [...this.props.reservations], this.state.date);
  		this.setState({ loader: false }, () => {
  			console.log();
  		})
  	}

  }

	componentDidMount(){
		this.props.setUserLanguage(this.props.lang);
	}
	
  render() {
  	const photoList = createDisplayPhotoListObject(this.props.partner);

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
    		<div className="location">
	    		<GalleryModal 
	          title={this.props.partner['name']}
	          isOpen={ this.state.galleryOpen }
	          toggle={ this.closeGallery }
	          photo={ this.state.galleryPhoto }
	          index={ this.state.galleryPhotoIndex }
	          max={ this.props.partner ? this.props.partner['photos'] ? this.props.partner['photos'].length : 0 : 0 }
	          text={this.state.dictionary['locationGalleryText']}
	          from={this.state.dictionary['locationGalleryFrom']}
	          changePhoto={ this.changeGalleryPhoto }
	        />
	        <Container>

	          <Row>
	            <Col xs="12" sm="5">
	              <div className="mainPhoto" onClick={ () => this.openPhotoGallery(photoList['main']) } style={ photoList['main'] ? {'background': 'url('+Keys.AWS_PARTNER_PHOTO_LINK+photoList['main']+') center / cover no-repeat'} : {'background': '#ccc'}}></div>
	            </Col>
	            <Col xs="12" sm="7" className="mobileHide">
	              <Row>
	                <Col xs="12" sm="4" className="smallColPadd">
	                  <div className="supportPhoto" onClick={ () => this.openPhotoGallery(photoList['sel_1']) } style={ photoList['sel_1'] ? {'background': 'url('+Keys.AWS_PARTNER_PHOTO_LINK+photoList['sel_1']+') center / cover no-repeat'} : {'background': '#ccc'}}></div>
	                </Col>
	                <Col xs="12" sm="4" className="smallColPadd">
	                  <div className="supportPhoto" onClick={ () => this.openPhotoGallery(photoList['sel_2']) } style={ photoList['sel_2'] ? {'background': 'url('+Keys.AWS_PARTNER_PHOTO_LINK+photoList['sel_2']+') center / cover no-repeat'} : {'background': '#ccc'}}></div>
	                </Col>
	                <Col xs="12" sm="4" className="smallColPadd">
	                  <div className="supportPhoto" onClick={ () => this.openPhotoGallery(photoList['sel_3']) } style={ photoList['sel_3'] ? {'background': 'url('+Keys.AWS_PARTNER_PHOTO_LINK+photoList['sel_3']+') center / cover no-repeat'} : {'background': '#ccc'}}></div>
	                </Col>
	              </Row>

	              <Row>
	                <Col xs="4" className="smallColPadd">
	                  <div className="supportPhoto" onClick={ () => this.openPhotoGallery(photoList['sel_4']) } style={ photoList['sel_4'] ? {'background': 'url('+Keys.AWS_PARTNER_PHOTO_LINK+photoList['sel_4']+') center / cover no-repeat'} : {'background': '#ccc'}}></div>
	                </Col>
	                <Col xs="4" className="smallColPadd">
	                  <div className="supportPhoto" onClick={ () => this.openPhotoGallery(photoList['sel_5']) } style={ photoList['sel_5'] ? {'background': 'url('+Keys.AWS_PARTNER_PHOTO_LINK+photoList['sel_5']+') center / cover no-repeat'} : {'background': '#ccc'}}></div>
	                </Col>
	                <Col xs="4" className="smallColPadd">
	                  <div className="supportPhoto" onClick={ () => this.openPhotoGallery(photoList['sel_6']) } style={ photoList['sel_6'] ? {'background': 'url('+Keys.AWS_PARTNER_PHOTO_LINK+photoList['sel_6']+') center / cover no-repeat'} : {'background': '#ccc'}}></div>
	                </Col>
	              </Row>

	            </Col>
	          </Row>

	          <Row>
	          	<Col xs="12">
	          		<div className="generalFirst">
	                <h3>{this.props.partner['general']['spaceType'] ? getGeneralOptionLabelByValue(generalOptions['spaceType_' + this.props.lang], this.props.partner['general']['spaceType']) + ' ' + this.props.partner['name'] : `${this.props.partner['name']}`}</h3>

	                <h5>{this.props.partner['general']['address']}, {getGeneralOptionLabelByValue(generalOptions['cities'], this.props.partner['city'])}</h5>
	              </div>
	          	</Col>
	          </Row>

	          <Row>
	          	<Col xs="12" sm="6">

	              <div className="icon-section">
	              	<p>{this.props.partner['general']['description']}</p>

		          		<Row className="justify-content-sm-center">
				            {
				              isFieldInObject(this.props.partner, 'parking', 'general')
				              ?
				              this.props.partner['general']['parking'] === '1'
				              ?
				              (<Col xs="6" sm="4" lg="2" className="smallColPadd">
				                <div className="iconHolder">
				                  <span className="icon parking" />
				                  <p>{this.state.dictionary['partnerProfilePreviewIconParking']}</p>
				                </div>
				              </Col>)
				              :
				              null
				              :
				              null
				            }

				            {
				              isFieldInObject(this.props.partner, 'yard', 'general')
				              ?
				              this.props.partner['general']['yard'] === '1'
				              ?
				              (<Col xs="6" sm="4" lg="2" className="smallColPadd">
				                <div className="iconHolder">
				                  <span className="icon yard" />
				                  <p>{this.state.dictionary['partnerProfilePreviewIconYard']}</p>
				                </div>
				              </Col>)
				              :
				              null
				              :
				              null
				            }

				            {
				              isFieldInObject(this.props.partner, 'balcon', 'general')
				              ?
				              this.props.partner['general']['balcon'] === '1'
				              ?
				              (<Col xs="6" sm="4" lg="2" className="smallColPadd">
				                <div className="iconHolder">
				                  <span className="icon balcon" />
				                  <p>{this.state.dictionary['partnerProfilePreviewIconBalcon']}</p>
				                </div>
				              </Col>)
				              :
				              null
				              :
				              null
				            }

				            {
				              isFieldInObject(this.props.partner, 'pool', 'general')
				              ?
				              this.props.partner['general']['pool'] === '1'
				              ?
				              (<Col xs="6" sm="4" lg="2" className="smallColPadd">
				                <div className="iconHolder">
				                  <span className="icon pool" />
				                  <p>{this.state.dictionary['partnerProfilePreviewIconPool']}</p>
				                </div>
				              </Col>)
				              :
				              null
				              :
				              null
				            }

				            {
				              isFieldInObject(this.props.partner, 'wifi', 'general')
				              ?
				              this.props.partner['general']['wifi'] === '1'
				              ?
				              (<Col xs="6" sm="4" lg="2" className="smallColPadd">
				                <div className="iconHolder">
				                  <span className="icon wifi" />
				                  <p>{this.state.dictionary['partnerProfilePreviewIconWifi']}</p>
				                </div>
				              </Col>)
				              :
				              null
				              :
				              null
				            }

				            {
				              isFieldInObject(this.props.partner, 'animator', 'general')
				              ?
				              this.props.partner['general']['animator'] === '1'
				              ?
				              (<Col xs="6" sm="4" lg="2" className="smallColPadd">
				                <div className="iconHolder">
				                  <span className="icon animator" />
				                  <p>{this.state.dictionary['partnerProfilePreviewIconAnimator']}</p>
				                </div>
				              </Col>)
				              :
				              null
				              :
				              null
				            }

				            {
				              isFieldInObject(this.props.partner, 'movie', 'general')
				              ?
				              this.props.partner['general']['movie'] === '1'
				              ?
				              (<Col xs="6" sm="4" lg="2" className="smallColPadd">
				                <div className="iconHolder">
				                  <span className="icon movie" />
				                  <p>{this.state.dictionary['partnerProfilePreviewIconMovie']}</p>
				                </div>
				              </Col>)
				              :
				              null
				              :
				              null
				            }

				            {
				              isFieldInObject(this.props.partner, 'gaming', 'general')
				              ?
				              this.props.partner['general']['gaming'] === '1'
				              ?
				              (<Col xs="6" sm="4" lg="2" className="smallColPadd">
				                <div className="iconHolder">
				                  <span className="icon gaming" />
				                  <p>{this.state.dictionary['partnerProfilePreviewIconGaming']}</p>
				                </div>
				              </Col>)
				              :
				              null
				              :
				              null
				            }

				            {
				              isFieldInObject(this.props.partner, 'food', 'general')
				              ?
				              this.props.partner['general']['food'] === '1'
				              ?
				              (<Col xs="6" sm="4" lg="2" className="smallColPadd">
				                <div className="iconHolder" >
				                  <span className="icon food" />
				                  <p>{this.state.dictionary['partnerProfilePreviewIconFood']}</p>
				                </div>
				              </Col>)
				              :
				              null
				              :
				              null
				            }

				            {
				              isFieldInObject(this.props.partner, 'drink', 'general')
				              ?
				              this.props.partner['general']['drink'] === '1'
				              ?
				              (<Col xs="6" sm="4" lg="2" className="smallColPadd">
				                <div className="iconHolder">
				                  <span className="icon drink" />
				                  <p>{this.state.dictionary['partnerProfilePreviewIconDrink']}</p>
				                </div>
				              </Col>)
				              :
				              null
				              :
				              null
				            }

				            {
				              isFieldInObject(this.props.partner, 'smoking', 'general')
				              ?
				              this.props.partner['general']['smoking'] === '1'
				              ?
				              (<Col xs="6" sm="4" lg="2" className="smallColPadd">
				                <div className="iconHolder">
				                  <span className="icon smoking" />
				                  <p>{this.state.dictionary['partnerProfilePreviewIconSmoking']}</p>
				                </div>
				              </Col>)
				              :
				              null
				              :
				              null
				            }
				          </Row>
			          </div>
	          	</Col>
	          	<Col xs="12" sm="6" className="bigColPaddLeft">
	          		<div className="generalSecond">
	          			<Row className="item">
		          			<Col xs="12"><span className="icon range" /> <h5>{`${this.state.dictionary['locationRangeFirst']} ${this.props.partner['general']['ageFrom']} ${this.state.dictionary['locationRangeSecond']} ${this.props.partner['general']['ageTo']} ${this.state.dictionary['locationRangeThird']}`}</h5></Col>
		          		</Row>

		          		<Row className="item">
		          			<Col xs="12"><span className="icon size" /> <h5>{`${this.state.dictionary['locationSizeFirst']} ${this.props.partner['general']['size']}m2 `}</h5></Col>
		          		</Row> 

		          		<Row className="item">
		          			<Col xs="12"><span className="icon play" /> <h5>{`${this.state.dictionary['locationPlaySizeFirst']} ${this.props.partner['general']['playSize']}m2`}</h5></Col>
		          		</Row>

		          		<Row className="item">
		          			{
		          				this.props.partner['general']['selfFood'] === '1'
		          				?
		          				<Col xs="12">
		          					<span className="icon add" /> <h5>{`${this.state.dictionary['locationSelfFoodTrue']}`}</h5>
		          				</Col>
		          				:
		          				<Col xs="12">
		          					<span className="icon block" /> <h5>{`${this.state.dictionary['locationSelfFoodFalse']}`}</h5>
		          				</Col>
		          			}
		          		</Row>

		          		<Row className="item">
		          			{
		          				this.props.partner['general']['selfDrink'] === '1'
		          				?
		          				<Col xs="12">
		          					<span className="icon add" /> <h5>{`${this.state.dictionary['locationSelfDrinkTrue']}`}</h5>
		          				</Col>
		          				:
		          				<Col xs="12">
		          					<span className="icon block" /> <h5>{`${this.state.dictionary['locationSelfDrinkFalse']}`}</h5>
		          				</Col>
		          			}
		          		</Row>

		          		<Row className="item">
		          			{
		          				this.props.partner['general']['selfAnimator'] === '1'
		          				?
		          				<Col xs="12">
		          					<span className="icon add" /> <h5>{`${this.state.dictionary['locationSelfAnimatorTrue']}`}</h5>
		          				</Col>
		          				:
		          				<Col xs="12">
		          					<span className="icon block" /> <h5>{`${this.state.dictionary['locationSelfAnimatorFalse']}`}</h5>
		          				</Col>
		          			}
		          		</Row>     		

		          	</div>
	          	</Col>

	          </Row>

	          <Row>
	          	<Col xs="12" className="cancelation">
	          		<h5><strong>*</strong>{this.props.partner['general']['cancelation'] === '0' ? `${this.state.dictionary['locationCancelationNone']}` : `${this.state.dictionary['locationCancelationFirst']} ${this.props.partner['general']['cancelation']} ${this.state.dictionary['locationCancelationSecond']}`}</h5>
	          	</Col>
	          </Row>

	          <Row className="offer">
	          	<Col xs="12">
	          		<div className="section">
	          			<h3>{this.state.dictionary['locationOfferTitleFree']}</h3>
	          			{
	          				this.props.partner['contentOffer'].map( (offer, index) => {
	                    return(
	                    	<div className="item" key={`offerKey_${index}`}>
				          				<span className="icon check"></span>
				          				<p>{getGeneralOptionLabelByValue(generalOptions[`contentOffer_${this.props.lang}`], offer.toString())}</p>
				          			</div>
	                     )
	                  })
	          			}
	          			
	          		</div>
	          		
	          	</Col>

	          	<Col xs="12">
	          		<div className="section">
	          			<h3>{this.state.dictionary['locationOfferTitleAddon']}</h3>
	          			{
	          				this.props.partner['contentAddon'].length
	                  ?
	                  this.props.partner['contentAddon'].map( (addon, index) => {
	                    return(
	                    	<div className="item" key={`addonKey_${index}`}>
				          				<span className="icon check"></span>
				          				<p>{`${addon['name']} / ${this.state.dictionary['partnerProfileOfferAddonPrice']} ${currencyFormat(parseInt(addon['price']))}`}</p>
				          				<p className="payRemark">{addon['comment'] ? `*${addon['comment']}` : ''}</p>
				          			</div>
	                     )
	                  })
	                  :
                    <h5 className="fadedPrev">{this.state.dictionary['partnerProfilePreviewOfferPayedEmpty']}</h5>
	          			}
	          		</div>
	          	</Col>

	          	<Col xs="12">

	          		<div className="section">
	          			<h3>{this.state.dictionary['locationOfferTitleDecor']}</h3>
	          			{
              			isFieldInObject(this.props.partner, 'decoration')
				            ?
				            Object.keys(this.props.partner['decoration']).length
				            ?
				            Object.keys(this.props.partner['decoration']).map( (item, index) => {
				              const decor = this.props.partner['decoration'][item];
				              return(
				              	<div className="item" key={`decorKey_${index}`}>
				          				<span className="icon check"></span>
				          				<p>{`${generalOptions['decorType'][decor['value']]['name_'+this.props.lang]} / ${decor['price'] ? currencyFormat(parseInt(decor['price'])) : this.state.dictionary['partnerProfilePreviewDecorationFree']}`}</p>
				          			</div>
				              )
				            })
				            :
				            <h5 className="fadedPrev">{this.state.dictionary['partnerProfilePreviewDecorationEmpty']}</h5>
				            :
				            <h5 className="fadedPrev">{this.state.dictionary['partnerProfilePreviewDecorationEmpty']}</h5>
				          }
	          		</div>
	          	</Col>

	          </Row>

	          <Row className="availabilityTable">
	          	<Col xs="12">
	          		<div className="headline">
		          		<h4>{this.state.dictionary['locationAvailabilityTitle']}</h4>
		          		<DayPickerInput 
	                  value={ this.state.date }
	                  formatDate={ this.formatDate }
	                  placeholder="Izaberite datum"
	                  onDayChange= { this.dateChange }
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
	          	</div>
	          	</Col>

	          	<Col xs="12">
	          		<Table responsive>
						      <thead>
						        <tr>
						          <th>{this.state.dictionary['locationAvailabilityTableColumnOne']}</th>
						          <th>{this.state.dictionary['locationAvailabilityTableColumnTwo']}</th>
						          <th>{this.state.dictionary['locationAvailabilityTableColumnThree']}</th>
						          <th>{this.state.dictionary['locationAvailabilityTableColumnFour']}</th>
						          <th></th>
						        </tr>
						      </thead>
						      <tbody>
						      	{
						      		this.props.partner['terms'].map( (term, index) => {
						      			return(
						      				(
						      					<tr key={`term${index}`}>
										          <th scope="row">{term['name']}</th>
										          <td>{`${term['size']}m2`}</td>
										          <td>{`${term['capKids']} ${this.state.dictionary['locationAvailabilityKids']} ${term['capAdults']} ${this.state.dictionary['locationAvailabilityAdults']}`}</td>
										          <td className="activeButtons">
										          	{
										          		term['terms'].length
										          		?
										          		term['terms'].map( (item, itemIndex) => {
										          			return(
										          				<Button color="primary" key={`termButtonKey_${index}_${itemIndex}`} onClick={() => this.selectRoom(`${index}_${itemIndex}`)} active={this.state.selectedRoom === `${index}_${itemIndex}`}>{`${item['from']} - ${item['to']}`} <span>{`${currencyFormat(item['price'])}`}</span></Button>
										          			)
										          		})
										          		:
										          		<p>{this.state.dictionary['locationAvailabilityNoTerm']}</p>
										          	}

										          </td>
										          <td>
										          	{
										          		term['terms'].length
										          		?
										          		this.state.selectedRoom && parseInt(this.state.selectedRoom.substr(0,1)) === index
										          		?
										          		(	
										          			<div className="resInfoMsg">
										          				<p>{this.state.dictionary['locationChooseTermAfter']}</p>
											          			<p>{this.state.term['room']}</p>
											          			<p>{`${this.state.term['from']} - ${this.state.term['to']}`}</p>
											          			<p>{`${currencyFormat(this.state.term['price'])}`}</p>
											          			<Button color="success" onClick={ this.makeReservation } className="hidden-xs">{this.state.dictionary['locationButtonReserve']}</Button>
										          			</div>
										          			
										          		)
										          		:
										          		(
										          			<div className="resInfoMsg">
										          				<p>{this.state.dictionary['locationChooseTermBefore']}</p>
										          			</div>
										          		)
										          		:
										          		(
										          			<div className="resInfoMsg">
										          				<p></p>
										          			</div>
										          		)
										          		
										          	}
										          </td>
										        </tr>
						      				)
						      			)
						      		})
						      	}
						      </tbody>
						    </Table>
	          	</Col>

	          	<Col xs="12" className="hidden-xs-up">
	          		<div className="middle xsReserveButton">
	          		{
	          			this.state.selectedRoom
									?
									<Button color="success" onClick={ this.makeReservation }>{this.state.dictionary['locationButtonReserve']}</Button>
									:
									null
	          		}
	          		</div>
	          	</Col>

	          </Row>

	          <Row className="review">
	          	<Col xs="12"><h4>{this.state.dictionary['locationReviewTitle']}</h4></Col>
	          	{
	          		this.props.partner['rating']
	          		?
	          		(
	          			<Col xs="12" sm="6" className="grades">
			          		<div className="item">
			          			<Row style={{"margin":"0px"}}>
			          				<Col xs="6">
			          					<h5>{this.state.dictionary['ratingFormOverall']}</h5>
			          					<p>{this.state.dictionary['ratingFormOverallText']}</p>
			          				</Col>
			          				<Col xs="6">
			          					<Row>
			          						<Col xs="4">
			          							<h6 className="marks">{(this.props.partner['rating']['overall'] / this.props.partner['numberOfRating']).toFixed(1)}</h6>
			          						</Col>
			          						<Col xs="8">
			          							<div className="line"></div>
			          							<div className="line blue" style={{"width":`${(this.props.partner['rating']['overall'] / this.props.partner['numberOfRating'] * 20).toFixed(0)}%`}}></div>
			          						</Col>
			          					</Row>
			          				</Col>
			          			</Row>
			          		</div>

			          		<div className="item">
			          			<Row style={{"margin":"0px"}}>
			          				<Col xs="6">
			          					<h5>{this.state.dictionary['ratingFormTrust']}</h5>
			          					<p>{this.state.dictionary['ratingFormTrustText']}</p>
			          				</Col>
			          				<Col xs="6">
			          					<Row>
			          						<Col xs="4">
			          							<h6 className="marks">{(this.props.partner['rating']['trust']/ this.props.partner['numberOfRating']).toFixed(1)}</h6>
			          						</Col>
			          						<Col xs="8">
			          							<div className="line"></div>
			          							<div className="line blue" style={{"width":`${(this.props.partner['rating']['trust'] / this.props.partner['numberOfRating'] * 20).toFixed(0)}%`}}></div>
			          						</Col>
			          					</Row>
			          				</Col>
			          			</Row>
			          		</div>

			          		<div className="item">
			          			<Row style={{"margin":"0px"}}>
			          				<Col xs="6">
			          					<h5>{this.state.dictionary['ratingFormSpace']}</h5>
			          					<p>{this.state.dictionary['ratingFormSpaceText']}</p>
			          				</Col>
			          				<Col xs="6">
			          					<Row>
			          						<Col xs="4">
			          							<h6 className="marks">{(this.props.partner['rating']['space'] / this.props.partner['numberOfRating']).toFixed(1)}</h6>
			          						</Col>
			          						<Col xs="8">
			          							<div className="line"></div>
			          							<div className="line blue" style={{"width":`${(this.props.partner['rating']['space'] / this.props.partner['numberOfRating'] * 20).toFixed(0)}%`}}></div>
			          						</Col>
			          					</Row>
			          				</Col>
			          			</Row>
			          		</div>

			          		<div className="item">
			          			<Row style={{"margin":"0px"}}>
			          				<Col xs="6">
			          					<h5>{this.state.dictionary['ratingFormHygiene']}</h5>
			          					<p>{this.state.dictionary['ratingFormHygieneText']}</p>
			          				</Col>
			          				<Col xs="6">
			          					<Row>
			          						<Col xs="4">
			          							<h6 className="marks">{(this.props.partner['rating']['hygiene'] / this.props.partner['numberOfRating']).toFixed(1)}</h6>
			          						</Col>
			          						<Col xs="8">
			          							<div className="line"></div>
			          							<div className="line blue" style={{"width":`${(this.props.partner['rating']['hygiene'] / this.props.partner['numberOfRating'] * 20).toFixed(0)}%`}}></div>
			          						</Col>
			          					</Row>
			          				</Col>
			          			</Row>
			          		</div>

			          		<div className="item">
			          			<Row style={{"margin":"0px"}}>
			          				<Col xs="6">
			          					<h5>{this.state.dictionary['ratingFormContent']}</h5>
			          					<p>{this.state.dictionary['ratingFormContentText']}</p>
			          				</Col>
			          				<Col xs="6">
			          					<Row>
			          						<Col xs="4">
			          							<h6 className="marks">{(this.props.partner['rating']['content'] / this.props.partner['numberOfRating']).toFixed(1)}</h6>
			          						</Col>
			          						<Col xs="8">
			          							<div className="line"></div>
			          							<div className="line blue" style={{"width":`${(this.props.partner['rating']['content'] / this.props.partner['numberOfRating'] * 20).toFixed(0)}%`}}></div>
			          						</Col>
			          					</Row>
			          				</Col>
			          			</Row>
			          		</div>

			          		<div className="item">
			          			<Row style={{"margin":"0px"}}>
			          				<Col xs="6">
			          					<h5>{this.state.dictionary['ratingFormStaff']}</h5>
			          					<p>{this.state.dictionary['ratingFormLocationText']}</p>
			          				</Col>
			          				<Col xs="6">
			          					<Row>
			          						<Col xs="4">
			          							<h6 className="marks">{(this.props.partner['rating']['staff'] / this.props.partner['numberOfRating']).toFixed(1)}</h6>
			          						</Col>
			          						<Col xs="8">
			          							<div className="line"></div>
			          							<div className="line blue" style={{"width":`${(this.props.partner['rating']['staff'] / this.props.partner['numberOfRating'] * 20).toFixed(0)}%`}}></div>
			          						</Col>
			          					</Row>
			          				</Col>
			          			</Row>
			          		</div>

			          		<div className="item">
			          			<Row style={{"margin":"0px"}}>
			          				<Col xs="6">
			          					<h5>{this.state.dictionary['ratingFormLocation']}</h5>
			          					<p>{this.state.dictionary['ratingFormLocationText']}</p>
			          				</Col>
			          				<Col xs="6">
			          					<Row>
			          						<Col xs="4">
			          							<h6 className="marks">{(this.props.partner['rating']['location'] / this.props.partner['numberOfRating']).toFixed(1)}</h6>
			          						</Col>
			          						<Col xs="8">
			          							<div className="line"></div>
			          							<div className="line blue" style={{"width":`${(this.props.partner['rating']['location'] / this.props.partner['numberOfRating'] * 20).toFixed(0)}%`}}></div>
			          						</Col>
			          					</Row>
			          				</Col>
			          			</Row>
			          		</div>

			          		<div className="item">
			          			<Row style={{"margin":"0px"}}>
			          				<Col xs="6">
			          					<h5>{this.state.dictionary['ratingFormValue']}</h5>
			          					<p>{this.state.dictionary['ratingFormValueText']}</p>
			          				</Col>
			          				<Col xs="6">
			          					<Row>
			          						<Col xs="4">
			          							<h6 className="marks">{(this.props.partner['rating']['value'] / this.props.partner['numberOfRating']).toFixed(1)}</h6>
			          						</Col>
			          						<Col xs="8">
			          							<div className="line"></div>
			          							<div className="line blue" style={{"width":`${(this.props.partner['rating']['value'] / this.props.partner['numberOfRating'] * 20).toFixed(0)}%`}}></div>
			          						</Col>
			          					</Row>
			          				</Col>
			          			</Row>
			          		</div>
			          	</Col>
	          		)
								:
								(
								<Col xs="12" sm="6" className="grades">
									<div className="noGrades">
										<h3>{this.state.dictionary['locationReviewNoGradesTitle']}</h3>
          					<p>{this.state.dictionary['locationReviewNoGradesText']}</p>
									</div>
          				
          			</Col>
								)
	          	}
	          	
	          	<Col xs="12" sm="6" className="comments">
	          		<h3>{this.state.dictionary['locationCommentTitle']}</h3>
	          		<div className="list">
	          			{
	          				this.props.partner['rating']
	          				?
	          				this.props.partner['rating']['comment']
	          				?
	          				Array.isArray(this.props.partner['rating']['comment'])
	          				?
	          				this.props.partner['rating']['comment'].map((item, index) => {
	          					return(
	          						<div className="item" key={`comment_key_${index}`}>
					          			<p>{item['text']}</p>
					          			<span>{`${item['date']}, ${item['user']}`}</span>
					          		</div>
	          					)
	          				})
	          				:
	          				<div className="noGrades">
	          					<p>{this.state.dictionary['locationCommentNoGradesText']}</p>
										</div>
	          				:
	          				<div className="noGrades">
	          					<p>{this.state.dictionary['locationCommentNoGradesText']}</p>
										</div>
										:
	          				<div className="noGrades">
	          					<p>{this.state.dictionary['locationCommentNoGradesText']}</p>
										</div>
	          			}
	          			
	          		</div>
	          		
	          	</Col>
	          </Row>


	          <Row className="mapScreen">
	          	<Col xs="12"><h4>{this.state.dictionary['uniMap']}</h4></Col>
	          	<Col>
	          		<SimpleMap
	          			lat={this.props.partner['map'] ? this.props.partner['map']['lat'] : 0}
	          			lng={this.props.partner['map'] ? this.props.partner['map']['lng'] : 0}
	          			zoom={15}
	          		/>
	          	</Col>
	          </Row>

	          <Row>
	          	<Col xs="12" sm="8" lg="9">
	          		<Row className="cateringCardPr">
			          	<Col xs="12"><h4>{this.state.dictionary['partnerProfilePreviewCateringCardSub']}</h4></Col>
			            {
			              isFieldInObject(this.props.partner, 'drinkCard', 'catering')
			              ?
			              this.props.partner['catering']['drinkCard'].length
			              ?
			              (
			                <Col xs="12">
			                <Row>
			                  <Col xs="12" sm="4">
			                    <div>
			                      <h5>{this.state.dictionary['partnerProfilePreviewCateringCardPillarNon']}</h5>
			                    </div>
			                    {
			                      isolateByArrayFieldValue(this.props.partner['catering']['drinkCard'], 'type', '1').length
			                      ?
			                      isolateByArrayFieldValue(this.props.partner['catering']['drinkCard'], 'type', '1').map( (drink, index) => {
			                        return(
			                          <p key={`non_${index}`}>{`${drink['name']}, ${drink['quantity']} ${getGeneralOptionLabelByValue(generalOptions['drinkScale'], drink['scale'].toString())} - ${currencyFormat(parseInt(drink['price']))}`}</p>
			                         )
			                      })
			                      :
			                      <div className="middle">
			                         <h6 className="fadedPrev">{this.state.dictionary['partnerProfilePreviewCateringCardPillarNonEmpty']}</h6>
			                      </div>
			                    }
			                  </Col>
			                  <Col xs="12" sm="4">
			                    <div>
			                      <h5>{this.state.dictionary['partnerProfilePreviewCateringCardPillarAlco']}</h5>
			                    </div>
			                    {
			                      isolateByArrayFieldValue(this.props.partner['catering']['drinkCard'], 'type', '2').length
			                      ?
			                      isolateByArrayFieldValue(this.props.partner['catering']['drinkCard'], 'type', '2').map( (drink, index) => {
			                        return(
			                          <p key={`alco_${index}`}>{`${drink['name']}, ${drink['quantity']} ${getGeneralOptionLabelByValue(generalOptions['drinkScale'], drink['scale'].toString())} - ${currencyFormat(parseInt(drink['price']))}`}</p>
			                         )
			                      })
			                      :
			                      <div className="middle">
			                         <h6 className="fadedPrev">{this.state.dictionary['partnerProfilePreviewCateringCardPillarAlcoEmpty']}</h6>
			                      </div>
			                    }
			                  </Col>
			                  <Col xs="12" sm="4">
			                    <div>
			                      <h5>{this.state.dictionary['partnerProfilePreviewCateringCardPillarHot']}</h5>
			                    </div>
			                    {
			                      isolateByArrayFieldValue(this.props.partner['catering']['drinkCard'], 'type', '3').length
			                      ?
			                      isolateByArrayFieldValue(this.props.partner['catering']['drinkCard'], 'type', '3').map( (drink, index) => {
			                        return(
			                          <p key={`hot_${index}`}>{`${drink['name']}, ${drink['quantity']} ${getGeneralOptionLabelByValue(generalOptions['drinkScale'], drink['scale'].toString())} - ${currencyFormat(parseInt(drink['price']))}`}</p>
			                         )
			                      })
			                      :
			                      <div className="middle">
			                         <h6 className="fadedPrev">{this.state.dictionary['partnerProfilePreviewCateringCardPillarHotEmpty']}</h6>
			                      </div>
			                     
			                    }
			                  </Col>
			                </Row>
			                </Col>
			              )
			              :
			              (<Col xs="12">
			              <h5 className="fadedPrev">{this.state.dictionary['partnerProfilePreviewCateringCardEmpty']}</h5>
			              </Col>)
			              :
			              (<Col xs="12">
			              <h5 className="fadedPrev">{this.state.dictionary['partnerProfilePreviewCateringCardEmpty']}</h5>
			              </Col>)
			            }
			            
			          </Row>
	          	</Col>

	          	<Col xs="12" sm="4" lg="3">
	          		<Row className="workingHours">
	          			<Col xs="12"><h4>{`${this.state.dictionary['partnerProfileGeneralSubTimes']}:`}</h4></Col>
	          			<Col xs="12" >
	          				<div className="line">
	          					<h3>{`${this.state.dictionary['partnerProfileGeneralDaysMonday']}:`}</h3>
	          				<h5>{this.props.partner['general']['mondayFrom'] !== '-1' && this.props.partner['general']['mondayTo'] !== '-1' ? `${this.props.partner['general']['mondayFrom']} - ${this.props.partner['general']['mondayTo']}` : `${this.state.dictionary['uniNotWorkingDay']}`}</h5>
	          				</div>
	          				<div className="line">
	          					<h3>{`${this.state.dictionary['partnerProfileGeneralDaysTuesday']}:`}</h3>
	          					<h5>{this.props.partner['general']['tuesdayFrom'] !== '-1' && this.props.partner['general']['tuesdayTo'] !== '-1' ? `${this.props.partner['general']['tuesdayFrom']} - ${this.props.partner['general']['tuesdayTo']}` : `${this.state.dictionary['uniNotWorkingDay']}`}</h5>
	          				</div>
	          				
	          				<div className="line">
	          					<h3>{`${this.state.dictionary['partnerProfileGeneralDaysWednesday']}:`}</h3>
	          					<h5>{this.props.partner['general']['wednesdayFrom'] !== '-1' && this.props.partner['general']['wednesdayTo'] !== '-1' ? `${this.props.partner['general']['wednesdayFrom']} - ${this.props.partner['general']['wednesdayTo']}` : `${this.state.dictionary['uniNotWorkingDay']}`}</h5>
	          				</div>
	          				
	          				<div className="line">
	          					<h3>{`${this.state.dictionary['partnerProfileGeneralDaysThursday']}:`}</h3>
	          					<h5>{this.props.partner['general']['thursdayFrom'] !== '-1' && this.props.partner['general']['thursdayTo'] !== '-1' ? `${this.props.partner['general']['thursdayFrom']} - ${this.props.partner['general']['thursdayTo']}` : `${this.state.dictionary['uniNotWorkingDay']}`}</h5>
	          				</div>
	          				
	          				<div className="line">
	          					<h3>{`${this.state.dictionary['partnerProfileGeneralDaysFriday']}:`}</h3>
	          					<h5>{this.props.partner['general']['fridayFrom'] !== '-1' && this.props.partner['general']['fridayTo'] !== '-1' ? `${this.props.partner['general']['fridayFrom']} - ${this.props.partner['general']['fridayTo']}` : `${this.state.dictionary['uniNotWorkingDay']}`}</h5>
	          				</div>
	          				
	          				<div className="line">
	          					<h3>{`${this.state.dictionary['partnerProfileGeneralDaysSatruday']}:`}</h3>
	          					<h5>{this.props.partner['general']['saturdayFrom'] !== '-1' && this.props.partner['general']['saturdayTo'] !== '-1' ? `${this.props.partner['general']['saturdayFrom']} - ${this.props.partner['general']['saturdayTo']}` : `${this.state.dictionary['uniNotWorkingDay']}`}</h5>
	          				</div>
	          				
	          				<div className="line">
	          					<h3>{`${this.state.dictionary['partnerProfileGeneralDaysSunday']}:`}</h3>
	          					<h5>{this.props.partner['general']['sundayFrom'] !== '-1' && this.props.partner['general']['sundayTo'] !== '-1' ? `${this.props.partner['general']['sundayFrom']} - ${this.props.partner['general']['sundayTo']}` : `${this.state.dictionary['uniNotWorkingDay']}`}</h5>
	          				</div>
	          				
	          			</Col>
	          		</Row>
	          	</Col>
	          </Row>

	          <Row>
	          	<Col xs="12">
	          		<p className="remarkVAT">{this.state.dictionary['uniVAT']}</p>
	          	</Col>
	          </Row>
	          
	          
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

  getReservationsStart: state.ReservationReducer.getReservationsStart,
  getReservationsError: state.ReservationReducer.getReservationsError,
  getReservationsSuccess: state.ReservationReducer.getReservationsSuccess,
  reservations: state.ReservationReducer.reservations,
});


const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setUserLanguage,
    getReservationsOnDate,
  },
  dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(LocationView)