import React from 'react';
import Select from 'react-select';
import PlainInput from '../form/input';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col, Button, CustomInput } from 'reactstrap';
import { setUserLanguage } from '../../actions/user-actions';
import { adminGetPartners, activatePartner, preSignPhoto, putPartnerProfilePhoto, adminSavePartnerPhoto, adminDeletePartnerPhoto, adminSavePartnerField } from '../../actions/admin-actions';
import { getLanguage } from '../../lib/language';
import {  getGeneralOptionLabelByValue } from '../../lib/helpers/specificPartnerFunctions';
import {  getPhotoNumbers, setUpPhotosForSave, findPartnerFromTheList, getPartnerMainPhoto, getNumberOfPartnerSelectionPhotos, setPhotosForDelete } from '../../lib/helpers/specificAdminFunctions';
import genOptions from '../../lib/constants/generalOptions';
import { setUpLinkBasic, getArrayObjectByFieldValue, getArrayIndexByFieldValue } from '../../lib/helpers/generalFunctions';
import PartnerLine from './partners/PartnerLine';
import AdminPartnerProfile from './partners/PartnerProfile';
import AdminPartnerPhoto from './partners/PartnerPhoto';
import AdminPartnerInfo from './partners/PartnerInfo';
import GalleryModal from '../modals/GalleryModal';
import ConfirmationModal from '../modals/ConfirmationModal';
import Keys from '../../server/keys';

interface MyProps {
  // using `interface` is also ok
  adminGetPartnersStart: boolean;
  adminGetPartnersError: object | boolean;
  adminGetPartnersSuccess: null | object;
  adminActivatePartnerStart: boolean;
  adminActivatePartnerError: object | boolean;
  adminActivatePartnerSuccess: null | object;
  adminPhotoPresignStart: boolean;
  adminPhotoPresignError: object | boolean;
  adminPhotoPresignSuccess: null | number;
  adminPutPartnerPhotoStart: boolean;
  adminPutPartnerPhotoError: object | boolean;
  adminPutPartnerPhotoSuccess: null | object;
  adminSavePartnerPhotoStart: boolean;
  adminSavePartnerPhotoError: object | boolean;
  adminSavePartnerPhotoSuccess: null | number;
  adminDeletePartnerPhotoStart: boolean;
  adminDeletePartnerPhotoError: object | boolean;
  adminDeletePartnerPhotoSuccess: null | number;
  adminSaveFieldStart: boolean;
  adminSaveFieldError: boolean;
  adminSaveFieldSuccess: null | number;
  adminPartners: Array<object>;
  partnerPhoto: null | object;
  adminSavePartnerField(link: object, data: object, auth: string): void;
  adminDeletePartnerPhoto(link: object, data: object, auth: string): void;
  adminSavePartnerPhoto(link: object, data: object, auth: string): void;
  adminGetPartners(link: object, data: object, auth: string): Array<object>;
  activatePartner(link: object, data: object, auth: string): void;
  preSignPhoto(link: object, data: object, auth: string): void;
  putPartnerProfilePhoto(link: string, data: object): void;
  setUserLanguage(language: string): string;
  openLoader(): void;
  closeLoader(): void;
  lang: string;
  token: string;
};
interface MyState {
	dictionary: object;
	field: string | object;
	term: string;
  showProfile: boolean;
  showPhoto: boolean;
  showInfo: boolean;
  activePartner: null | object;
  photo: string;
  file: null | object;
  galleryOpen: boolean;
  galleryPhoto: string;
  galleryPhotoIndex: number;
  mainPhotoError: boolean;
  selectionPhotoError: boolean;
  confirmationModalOpen: boolean;
  photoForDelete: string;
};

class PartnerScreen extends React.Component <MyProps, MyState>{

	constructor(props){
    super(props);

    this.componentObjectBinding = this.componentObjectBinding.bind(this);

    const bindingFunctions = ['handleInputChange', 'searchPartners', 'partnerActivation', 'toggleProfile', 'togglePhoto', 'onPhotoChange', 'handlePhotoSave', 'closeGallery', 'changeGalleryPhoto', 'openPhotoGallery', 'changeSelectionPhoto', 'changeMainPhoto', 'changeMainAction', 'changeSelectionAction', 'toggleConfirmationModal', 'activateDeletePhoto', 'openConfirmationModal', 'closePhotoAlert', 'toggleInfo', 'saveMapInfo', 'saveBankInfo', 'changePhotoRoom', 'activatePromotion', 'saveAllInclusive'];
    this.componentObjectBinding(bindingFunctions);
  }

  componentObjectBinding(array){
    array.map( item => {
      this[item] = this[item].bind(this);
    })
  }

	state: MyState = {
    dictionary: getLanguage(this.props.lang),
    field: '',
    term: '',
    showProfile: false,
    showPhoto: false,
    showInfo: false,
    activePartner: null,
    photo: '',
    file: null,
    galleryOpen: false,
    galleryPhoto: '',
    galleryPhotoIndex: 0,
    mainPhotoError: false,
    selectionPhotoError: false,
    confirmationModalOpen: false,
    photoForDelete: '',
  };

  handleInputChange(field, value){
     this.setState(prevState => ({
      ...prevState,
      [field]: value // No error here, but can't ensure that key is in StateKeys
    }));
  }

  partnerActivation(event){
    if (this.props.adminPartners[parseInt(event.target['id'].substr(15))]['map']) {
      this.props.openLoader();
      const link = setUpLinkBasic(window.location.href);
      const active = !this.props.adminPartners[parseInt(event.target['id'].substr(15))]['active'];
      const data = { id: event.target['name'], active };
      this.props.activatePartner(link, data, this.props.token);
    }
    
  }

  searchPartners(){
  	const link = setUpLinkBasic(window.location.href);
  	const field = this.state.field ? this.state.field['value'] : this.state.field;
  	const term = this.state.term;

		this.props.adminGetPartners(link, { field, term }, this.props.token);
  }

  toggleInfo(outcome: boolean, partner: string){
    if (outcome === true) {
      const obj = getArrayObjectByFieldValue(this.props.adminPartners, '_id', partner);
      this.setState({ activePartner: obj}, () => {
        this.setState({ showInfo: true })
      });
    }else{
      this.setState({showInfo: false, activePartner: null});
    }
  }

  toggleProfile(outcome: boolean, partner: string){
    if (outcome === true) {
      const obj = getArrayObjectByFieldValue(this.props.adminPartners, '_id', partner);
      this.setState({showProfile: true, activePartner: obj});
    }else{
      this.setState({showProfile: false, activePartner: null});
    }
  }

  togglePhoto(outcome: boolean, partner: string){
    if (outcome === true) {
      const obj = getArrayObjectByFieldValue(this.props.adminPartners, '_id', partner);
      this.setState({showPhoto: true, activePartner: obj});
    }else{
      this.setState({showPhoto: false, activePartner: null, photo: '', file: null });
    }
  }

  toggleConfirmationModal(){
    this.setState({ confirmationModalOpen: !this.state.confirmationModalOpen, photoForDelete: '' });
  }

  closeGallery(){
    this.setState({ galleryOpen: false, galleryPhotoIndex: 0, galleryPhoto: '' });
  }

  changeGalleryPhoto(action: string) {
    if (action === 'next') {
      const galleryPhotoIndex = this.state.galleryPhotoIndex + 1 < this.state.activePartner['photos'].length ? this.state.galleryPhotoIndex + 1 : 0;
      const galleryPhoto = Keys.AWS_PARTNER_PHOTO_LINK + this.state.activePartner['photos'][galleryPhotoIndex]['name'];
      this.setState({ galleryPhotoIndex, galleryPhoto });
    }else{
      const galleryPhotoIndex = this.state.galleryPhotoIndex - 1 < 0 ? this.state.activePartner['photos'].length - 1 : this.state.galleryPhotoIndex - 1;
      const galleryPhoto = Keys.AWS_PARTNER_PHOTO_LINK + this.state.activePartner['photos'][galleryPhotoIndex]['name'];
      this.setState({ galleryPhotoIndex, galleryPhoto });
    }
  }

  openPhotoGallery(photo: string){
    const galleryPhotoIndex = getArrayIndexByFieldValue(this.state.activePartner['photos'], 'name', photo);
    const galleryPhoto = Keys.AWS_PARTNER_PHOTO_LINK + photo;
    this.setState({ galleryOpen: true, galleryPhotoIndex, galleryPhoto });
  }

  onPhotoChange(event: any){
    this.setState({ photo: URL.createObjectURL(event.target.files[0]), file: event.target.files[0] });
  }

  changeMainPhoto(event: any){
    if (this.state.activePartner) {
      const main = getPartnerMainPhoto(this.state.activePartner);
      if (main) {
        if (main['name'] === event.target.name) {
          this.changeMainAction(event.target.name, false);
        }else{
          this.setState({ mainPhotoError: true });
        }
      }else{
        this.changeMainAction(event.target.name, true);
      }
    }
    return;
  }

  changeMainAction(photo: string, outcome: boolean){
    if (this.state.activePartner['photos'].length) {
      const index = getArrayIndexByFieldValue(this.state.activePartner['photos'], 'name', photo);
      const photos = [...this.state.activePartner['photos']];
      photos[index]['main'] = outcome;
      const link = setUpLinkBasic(window.location.href);
      this.props.openLoader();
      this.props.adminSavePartnerPhoto(link, {partnerId: this.state.activePartner['_id'], photos}, this.props.token);
    }
  }

  changeSelectionPhoto(event: any){
    if (event.target.checked) {
      if (getNumberOfPartnerSelectionPhotos(this.state.activePartner) < 6) {
        this.changeSelectionAction(event.target.name, true);
      }else{
        this.setState({ selectionPhotoError: true })
      }
    }else{
      this.changeSelectionAction(event.target.name, false);
    }
  }

  changePhotoRoom(photo: string, select: any){
    if (this.state.activePartner['photos'].length) {
      const index = getArrayIndexByFieldValue(this.state.activePartner['photos'], 'name', photo);
      const photos = [...this.state.activePartner['photos']];
      photos[index]['room'] = select['value'];
      const link = setUpLinkBasic(window.location.href);
      this.props.openLoader();
      this.props.adminSavePartnerPhoto(link, {partnerId: this.state.activePartner['_id'], photos}, this.props.token);
    }
  }

  changeSelectionAction(photo: string, outcome: boolean){
    if (this.state.activePartner['photos'].length) {
      const index = getArrayIndexByFieldValue(this.state.activePartner['photos'], 'name', photo);
      const photos = [...this.state.activePartner['photos']];
      photos[index]['selection'] = outcome;
      const link = setUpLinkBasic(window.location.href);
      this.props.openLoader();
      this.props.adminSavePartnerPhoto(link, {partnerId: this.state.activePartner['_id'], photos}, this.props.token);
    }
  }

  closePhotoAlert(){
    this.setState({ mainPhotoError: false, selectionPhotoError: false });
  }

  handlePhotoSave(){
    if (this.state.photo) {
      this.props.openLoader();
      const link = setUpLinkBasic(window.location.href);
      this.props.preSignPhoto(link, {partner: this.state.activePartner['_id'], num: getPhotoNumbers(this.state.activePartner)['largest']}, this.props.token);
    }
    
  }

  openConfirmationModal(photo: string){
    this.setState({ confirmationModalOpen: !this.state.confirmationModalOpen, photoForDelete: photo });
  }

  activateDeletePhoto(){
    const link = setUpLinkBasic(window.location.href);
    const photos = setPhotosForDelete(this.state.activePartner['photos'], this.state.photoForDelete);
    const data = { photo: this.state.photoForDelete, photos, partnerId: this.state.activePartner['_id']};
    this.props.openLoader();
    this.props.adminDeletePartnerPhoto(link, data, this.props.token);
  }

  saveMapInfo(map: object){
    const link = setUpLinkBasic(window.location.href);
      this.props.openLoader();
      const value = { lat: parseFloat(map['lat']), lng: parseFloat(map['lng'])};
      this.props.adminSavePartnerField(link, {partnerId: this.state.activePartner['_id'], value, field: 'map'}, this.props.token);
  }

  saveBankInfo(bank: object){
    const link = setUpLinkBasic(window.location.href);
      this.props.openLoader();
      this.props.adminSavePartnerField(link, {partnerId: this.state.activePartner['_id'], value: bank, field: 'bank'}, this.props.token);
  }

  saveAllInclusive(allInclusive: object){
    const link = setUpLinkBasic(window.location.href);
      this.props.openLoader();
      this.props.adminSavePartnerField(link, {partnerId: this.state.activePartner['_id'], value: allInclusive, field: 'allInclusive'}, this.props.token);
  }

  activatePromotion(promotion: object){
    const link = setUpLinkBasic(window.location.href);
    this.props.openLoader();
    this.props.adminSavePartnerField(link, {partnerId: this.state.activePartner['_id'], value: promotion, field: 'promotion'}, this.props.token);
  }

  componentDidUpdate(prevProps: MyProps, prevState:  MyState){
    if (this.props.adminGetPartnersStart) {
      this.props.openLoader();
    }

    if (!this.props.adminDeletePartnerPhotoStart && prevProps.adminDeletePartnerPhotoStart && this.props.adminDeletePartnerPhotoSuccess) {
      this.setState({confirmationModalOpen: false, photoForDelete: '', activePartner: findPartnerFromTheList(this.state.activePartner['_id'], this.props.adminPartners)}, () => {
        this.props.closeLoader();
      })
    }

    if (!this.props.adminSavePartnerPhotoStart && prevProps.adminSavePartnerPhotoStart && this.props.adminSavePartnerPhotoSuccess) {
      this.setState({file: null, photo: '', activePartner: findPartnerFromTheList(this.state.activePartner['_id'], this.props.adminPartners)}, () => {
        this.props.closeLoader();
      })
    }

    if (!this.props.adminSaveFieldStart && prevProps.adminSaveFieldStart && this.props.adminSaveFieldSuccess) {
      this.setState({ activePartner: findPartnerFromTheList(this.state.activePartner['_id'], this.props.adminPartners)}, () => {
        this.props.closeLoader();
      })
    }

    if (!this.props.adminPutPartnerPhotoStart && prevProps.adminPutPartnerPhotoStart && this.props.adminPutPartnerPhotoSuccess) {
      const link = setUpLinkBasic(window.location.href);
      const photos = setUpPhotosForSave(this.state.activePartner, this.props.partnerPhoto['key']);
      this.props.adminSavePartnerPhoto(link, {partnerId: this.state.activePartner['_id'], photos}, this.props.token);
    }

    if (!this.props.adminPhotoPresignStart && prevProps.adminPhotoPresignStart && this.props.adminPhotoPresignSuccess) {
      this.props.putPartnerProfilePhoto(this.props.partnerPhoto['url'], this.state.file);
    }

    if (!this.props.adminGetPartnersStart && prevProps.adminGetPartnersStart && this.props.adminGetPartnersSuccess) {
      this.props.closeLoader();
    }

    if (!this.props.adminActivatePartnerStart && prevProps.adminActivatePartnerStart && this.props.adminActivatePartnerSuccess) {
      this.props.closeLoader();
    }
  }

	componentDidMount(){
    this.props.openLoader();
		const link = setUpLinkBasic(window.location.href);
		this.props.adminGetPartners(link, {field:this.state.field, term: this.state.term}, this.props.token);
	}
	
  render() {
  	const options = [{label:'naziv', value:'name'}, {label: 'PIB', value:'taxNum'}];
    return(
    	<div className="adminScreen partners">
        <ConfirmationModal
          isOpen={ this.state.confirmationModalOpen }
          title="Izbrišite sliku"
          text="Da li ste sigurni da želite da izbrišete ovu sliku?"
          buttonColor="danger"
          buttonText="Da, izriši sliku"
          toggle={ this.toggleConfirmationModal }
          clickFunction={ this.activateDeletePhoto }
        />
        <GalleryModal 
          title="Galerija"
          isOpen={ this.state.galleryOpen }
          toggle={ this.closeGallery }
          photo={ this.state.galleryPhoto }
          index={ this.state.galleryPhotoIndex }
          max={ this.state.activePartner ? this.state.activePartner['photos'] ? this.state.activePartner['photos'].length : 0 : 0 }
          text="slika"
          from="od"
          changePhoto={ this.changeGalleryPhoto }
        />
        <AdminPartnerProfile 
          show={ this.state.showProfile }
          partner={ this.state.activePartner }
          closeProfile={ this.toggleProfile }
        />

        <AdminPartnerPhoto
          show={ this.state.showPhoto }
          partner={ this.state.activePartner }
          closePhoto={ this.togglePhoto }
          photo={ this.state.photo }
          onPhotoChange={ this.onPhotoChange }
          preSignPhoto={ this.handlePhotoSave }
          openPhotoGallery={ this.openPhotoGallery }
          changeMainPhoto={ this.changeMainPhoto }
          changeSelectionPhoto={ this.changeSelectionPhoto }
          mainPhotoError={ this.state.mainPhotoError }
          selectionPhotoError={ this.state.selectionPhotoError }
          openConfirmationModal={ this.openConfirmationModal }
          closeAlert={ this.closePhotoAlert }
          changePhotoRoom={ this.changePhotoRoom }
        />

        <AdminPartnerInfo
          show={ this.state.showInfo }
          partner={ this.state.activePartner }
          closeInfo={ this.toggleInfo }
          saveMap={ this.saveMapInfo }
          saveBank={ this.saveBankInfo }
          activatePromotion={ this.activatePromotion }
          saveAllInclusive={ this.saveAllInclusive }
        />
    		<Row>
          <Col xs='12' className="middle">
            <h2>Trilino Partneri</h2>
          </Col>

          <Col xs="12">
          	<Row className="justify-content-md-center">
          		<Col xs='12' sm="3">
		            <p className="middle">Termin za pretragu:</p>
		          	<PlainInput
		          		placeholder="" 
		          		onChange={(event) => this.handleInputChange('term', event.target.value)} 
		              value={this.state.term}
		              className="logInput"
		              type="text"
		          	/>
		          </Col>

		          <Col xs='12' sm="2">
		            <p className="middle">Polje pretrage:</p>
		          	<Select 
		              options={options} 
		              value={ this.state.field } 
		              onChange={(val) => this.handleInputChange('field', val)} 
		              instanceId="searchFieldInput" 
		              className="logInput" 
		              placeholder=""/>
		          </Col>

		          <Col xs='12' sm="2">
		          	<div className="middle">
		          		<Button color="success" className="searchButton" onClick={ this.searchPartners }>Pretraži</Button>
		          	</div>
		          	
		          </Col>
          	</Row>
          </Col>

          

          <Col xs="12" className="partnersList">
          	{
          		this.props.adminPartners.map((partner, index) => {
          			return(
          				<PartnerLine
                    key={`partnerLine_${index}`}
          					index={ index }
          					partnerId={ partner['_id'] }
          					name={ partner['name'] }
          					taxNum={partner['taxNum'] }
          					percent={ partner['activationPercent'] }
          					city={ getGeneralOptionLabelByValue(genOptions['cities'], partner['city']) }
          					active={ partner['active'] }
                    partnerActivation={ this.partnerActivation }
                    openProfile={ this.toggleProfile }
                    openPhoto={ this.togglePhoto }
                    openInfo={ this.toggleInfo }
                    photoNumber={ partner['photos'] ? partner['photos'].length : 0 }
          				/>
          			)
          		})
          	}
          </Col>
         
        </Row>
    		
    	</div>
    ) 
  }
}

const mapStateToProps = (state) => ({
  userLanguage: state.UserReducer.language,

  adminGetPartnersStart: state.AdminReducer.adminGetPartnersStart,
  adminGetPartnersError: state.AdminReducer.adminGetPartnersError,
  adminGetPartnersSuccess: state.AdminReducer.adminGetPartnersSuccess,

  adminActivatePartnerStart: state.AdminReducer.adminActivatePartnerStart,
  adminActivatePartnerError: state.AdminReducer.adminActivatePartnerError,
  adminActivatePartnerSuccess: state.AdminReducer.adminActivatePartnerSuccess,

  adminPhotoPresignStart: state.AdminReducer.adminPhotoPresignStart,
  adminPhotoPresignError: state.AdminReducer.adminPhotoPresignError,
  adminPhotoPresignSuccess: state.AdminReducer.adminPhotoPresignSuccess,

  adminPutPartnerPhotoStart: state.AdminReducer.adminPutPartnerPhotoStart,
  adminPutPartnerPhotoError: state.AdminReducer.adminPutPartnerPhotoError,
  adminPutPartnerPhotoSuccess: state.AdminReducer.adminPutPartnerPhotoSuccess,

  adminSavePartnerPhotoStart: state.AdminReducer.adminSavePartnerPhotoStart,
  adminSavePartnerPhotoError: state.AdminReducer.adminSavePartnerPhotoError,
  adminSavePartnerPhotoSuccess: state.AdminReducer.adminSavePartnerPhotoSuccess,

  adminDeletePartnerPhotoStart: state.AdminReducer.adminDeletePartnerPhotoStart,
  adminDeletePartnerPhotoError: state.AdminReducer.adminDeletePartnerPhotoError,
  adminDeletePartnerPhotoSuccess: state.AdminReducer.adminDeletePartnerPhotoSuccess,

  adminSaveFieldStart: state.AdminReducer.adminSaveFieldStart,
  adminSaveFieldError: state.AdminReducer.adminSaveFieldError,
  adminSaveFieldSuccess: state.AdminReducer.adminSaveFieldSuccess,

  partnerPhoto: state.AdminReducer.partnerPhoto,

  adminPartners: state.AdminReducer.partners,
});


const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setUserLanguage,
    adminGetPartners,
    activatePartner,
    preSignPhoto,
    putPartnerProfilePhoto,
    adminSavePartnerPhoto,
    adminDeletePartnerPhoto,
    adminSavePartnerField,
  },
  dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(PartnerScreen)