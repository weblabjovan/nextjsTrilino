import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from '../components/loader';
import { Container, Row, Col, Button, Alert, Table } from 'reactstrap';
import { setUserLanguage } from '../actions/user-actions';
import { adminBasicDevLogin } from '../actions/admin-actions';
import { getReservationsOnDate } from '../actions/reservation-actions';
import { getLanguage } from '../lib/language';
import { datePickerLang } from '../lib/language/dateLanguage';
import { isMobile, setUpLinkBasic, getArrayObjectByFieldValue, getArrayIndexByFieldValue } from '../lib/helpers/generalFunctions';
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
		console.log(this.props.partner);
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

		          		<Row>
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

	          <Row className="offer">
	          	<Col xs="12" sm="6" lg="4">
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

	          	<Col xs="12" sm="6" lg="4">
	          		<div className="section">
	          			<h3>{this.state.dictionary['locationOfferTitleAddon']}</h3>
	          			{
	          				this.props.partner['contentAddon'].length
	                  ?
	                  this.props.partner['contentAddon'].map( (addon, index) => {
	                    return(
	                    	<div className="item" key={`addonKey_${index}`}>
				          				<span className="icon check"></span>
				          				<p>{`${addon['name']} / ${this.state.dictionary['partnerProfileOfferAddonPrice']} ${addon['price']} rsd`}</p>
				          				<p className="payRemark">{addon['comment'] ? `*${addon['comment']}` : ''}</p>
				          			</div>
	                     )
	                  })
	                  :
                    <h5 className="fadedPrev">{this.state.dictionary['partnerProfilePreviewOfferPayedEmpty']}</h5>
	          			}
	          		</div>
	          	</Col>

	          	<Col xs="12" sm="6" lg="4">

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
				          				<p>{`${generalOptions['decorType'][decor['value']]['name_'+this.props.lang]} / ${decor['price'] ? (decor['price'] + 'rsd') : this.state.dictionary['partnerProfilePreviewDecorationFree']}`}</p>
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
										          <td>{`${term['capKids']} dece i ${term['capAdults']} odraslih`}</td>
										          <td className="activeButtons">
										          	{
										          		term['terms'].length
										          		?
										          		term['terms'].map( (item, itemIndex) => {
										          			return(
										          				<Button color="primary" key={`termButtonKey_${index}_${itemIndex}`} onClick={() => this.selectRoom(`${index}_${itemIndex}`)} active={this.state.selectedRoom === `${index}_${itemIndex}`}>{`${item['from']} - ${item['to']}`} <span>{`${item['price']}rsd`}</span></Button>
										          			)
										          		})
										          		:
										          		<p>Nema dostupnih termina</p>
										          	}

										          </td>
										          <td>
										          	{
										          		term['terms'].length
										          		?
										          		this.state.selectedRoom
										          		?
										          		(	
										          			<div className="resInfoMsg">
										          				<p>{this.state.dictionary['locationChooseTermAfter']}</p>
											          			<p>{this.state.term['room']}</p>
											          			<p>{`${this.state.term['from']} - ${this.state.term['to']}`}</p>
											          			<p>{`${this.state.term['price']} rsd`}</p>
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
    		/>

    	</div>
    	
    ) 
  }
}

const mapStateToProps = (state) => ({
  userLanguage: state.UserReducer.language,

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