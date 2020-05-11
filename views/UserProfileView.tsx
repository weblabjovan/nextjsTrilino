import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from '../components/loader';
import { Container, Row, Col, Button, Alert } from 'reactstrap';
import { getReservationsForUser, cancelReservation, rateReservation } from '../actions/reservation-actions';
import { setUserLanguage } from '../actions/user-actions';
import { getLanguage } from '../lib/language';
import { isMobile, unsetCookie, setUpLinkBasic, currencyFormat, errorExecute } from '../lib/helpers/generalFunctions';
import { setNestPayHash } from '../server/helpers/general';
import PlainInput from '../components/form/input';
import UserSubNavigation from '../components/userProfile/SubNavigation';
import UserBill from '../components/userProfile/UserBill';
import RatingScreen from '../components/userProfile/RatingScreen';
import Modal from '../components/modals/ConfirmationModal';
import PaymentModal from '../components/modals/PaymentModal';
import NavigationBar from '../components/navigation/navbar';
import Footer from '../components/navigation/footer';
import Keys from '../server/keys';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface MyProps {
  // using `interface` is also ok
  userLanguage: string;
  globalError: boolean;
  getUserReservationStart: boolean;
  getUserReservationError: object | boolean;
  getUserReservationSuccess: null | number;
  reservations: Array<object>;
  cancelReservationStart: boolean;
  cancelReservationError: object | boolean;
  cancelReservationSuccess: null | object;
  rateReservationStart: boolean;
  rateReservationError: object | boolean;
  rateReservationSuccess: null | number;
  rateReservation(link: object, data: object, auth: string)
  cancelReservation(link: object, data: object, auth: string): void;
  getReservationsForUser(link: object, data: object, auth: string): void;
  setUserDevice(userAgent: string): boolean;
  setUserLanguage(language: string): string;
  userAgent: string;
  path: string;
  fullPath: string;
  lang: string;
  link?: object;
  token?: string | undefined;
  screen: string;
  passChange: boolean;
  ratingShow: null | object;
};
interface MyState {
	language: string;
	dictionary: object;
	isMobile: boolean;
  loader: boolean;
  passwordChange: boolean;
  activeScreen: string;
  reservationBill: string;
  reservationBillObject: null | object;
  userBillShow: boolean;
  modal: boolean;
  paymentModal: boolean;
};

class UserProfileView extends React.Component <MyProps, MyState>{
  constructor(props){
    super(props);

    this.componentObjectBinding = this.componentObjectBinding.bind(this);

    const bindingFunctions = ['changeScreen', 'openUserBill', 'closeUserBill', 'toggleModal', 'activateCancelReservation', 'togglePaymentModal','activatePayCatering', 'prepareRatingDataForSend', 'goBackFromRating', 'openRating'];
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
    passwordChange: this.props.passChange,
    activeScreen: this.props.screen,
    reservationBill: '',
    reservationBillObject: null,
    userBillShow: false,
    modal: false,
    paymentModal: false,
  };

  logout() {
    unsetCookie('trilino-user-token');
    window.location.href = `${this.props.link["protocol"]}${this.props.link["host"]}/login?page=user&stage=login&language=${this.props.lang}`;
  }

  changeScreen(screen: string){
    if (screen !== this.state.activeScreen) {
      this.setState({ activeScreen: screen });
    }
  }

  goBackFromRating(){
    if (this.props.getUserReservationSuccess) {
      this.setState({ activeScreen: 'reservation', reservationBillObject: null })
    }else{
      this.setState({ loader: true, activeScreen: 'reservation', reservationBillObject: null }, () => {
        this.props.getReservationsForUser(this.props.link, {language: this.props.lang, type: 'user'}, this.props.token);
      })
    }
  }

  openRating(index?: number){
    if (typeof index === 'number') {
      this.setState({ activeScreen: 'rating', reservationBillObject: this.props.reservations[index] });
    }
  }

  closePassChangeAlert(){
    this.setState({ passwordChange: false });
  }

  openUserBill(reservationIndex: number){
    this.setState({ reservationBill: `bill_${reservationIndex}`, userBillShow: true, reservationBillObject: this.props.reservations[reservationIndex] });
  }

  closeUserBill(){
    this.setState({ reservationBill: '', userBillShow: false, reservationBillObject: null });
  }

  toggleModal(index?: number){
    if (typeof index === 'number') {
      this.setState({ modal: !this.state.modal, reservationBillObject: this.props.reservations[index] });
    }else{
      this.setState({ modal: !this.state.modal, reservationBillObject: null });
    }
  }

  togglePaymentModal(index?: number){
    if (typeof index === 'number') {
      this.setState({ paymentModal: !this.state.paymentModal, reservationBillObject: this.props.reservations[index] });
    }else{
      this.setState({ paymentModal: !this.state.paymentModal, reservationBillObject: null });
    }
  }

  activateCancelReservation(){
    this.setState({loader: true}, () => {
      this.props.cancelReservation(this.props.link, {language: this.props.lang, doubleReference: this.state.reservationBillObject['doubleReference'], id: this.state.reservationBillObject['_id']}, this.props.token);
    })
  }

  activatePayCatering(){
    if (this.state.reservationBillObject['cateringObj']) {
      if (Array.isArray(this.state.reservationBillObject['cateringObj'])) {
        if (this.state.reservationBillObject['cateringObj'].length) {
          const id = this.state.reservationBillObject['cateringObj'][0]['_id'];
          const price = this.state.reservationBillObject['cateringObj'][0]['price'];

          const plainText = `${Keys.NEST_PAY_CLIENT_ID}|cat-${id}|${price.toFixed(2)}|${this.props.link['protocol']}${this.props.link['host']}/payment?page=cateringSuccess&catering=${id}&language=${this.props.lang}&result=success|${this.props.link['protocol']}${this.props.link['host']}/payment?page=cateringSuccess&catering=${id}&language=${this.props.lang}&result=fail|Auth||${Keys.NEST_PAY_RANDOM}||||941|${Keys.NEST_PAY_STORE_KEY}`;
          const hash = setNestPayHash(plainText);

          const mydiv = document.getElementById('myformcontainer').innerHTML = `<form id="reviseCombi" method="post" action="https://testsecurepay.eway2pay.com/fim/est3Dgate"> 
          <input type="hidden" name="clientid" value="${Keys.NEST_PAY_CLIENT_ID}"/> 
          <input type="hidden" name="storetype" value="3d_pay_hosting" />  
          <input type="hidden" name="hash" value="${hash}" /> 
          <input type="hidden" name="trantype" value="Auth" /> 
          <input type="hidden" name="amount" value="${price.toFixed(2)}" /> 
          <input type="hidden" name="currency" value="941" /> 
          <input type="hidden" name="oid" value="cat-${id}" /> 
          <input type="hidden" name="okUrl" value="${this.props.link['protocol']}${this.props.link['host']}/payment?page=cateringSuccess&catering=${id}&language=${this.props.lang}&result=success"/> 
          <input type="hidden" name="failUrl" value="${this.props.link['protocol']}${this.props.link['host']}/payment?page=cateringSuccess&catering=${id}&language=${this.props.lang}&result=fail" /> 
          <input type="hidden" name="lang" value="${this.props.lang}" /> 
          <input type="hidden" name="hashAlgorithm" value="ver2" /> 
          <input type="hidden" name="rnd" value="${Keys.NEST_PAY_RANDOM}" /> 
          <input type="hidden" name="encoding" value="utf-8" />
          <input type='hidden' name='shopurl' value="${this.props.link['protocol']}${this.props.link['host']}/payment?page=closed&deactive=false&language=${this.props.lang}" />
          <input type="submit" style="visibility: hidden" /> </form>`;
          
          const form =document.getElementById('reviseCombi');

          if(form){
            let element: HTMLElement = form.querySelector('input[type="submit"]') as HTMLElement;
            this.setState({ loader: true }, () => {
              element.click();
            })
          }
        }
      }
    }
  }

  prepareRatingDataForSend(ratingData: object){
    this.setState({ loader: true }, () => {
      const data = {rating: ratingData, reservation: this.state.reservationBillObject['_id'], language: this.props.lang };
      this.props.rateReservation(this.props.link, data, this.props.token);
    })
  }

  componentDidUpdate(prevProps: MyProps, prevState:  MyState){ 
    errorExecute(window, this.props.globalError);

    if (!this.props.cancelReservationStart && prevProps.cancelReservationStart && !this.props.cancelReservationError && this.props.cancelReservationSuccess && !prevProps.cancelReservationSuccess) {
      this.props.getReservationsForUser(this.props.link, {language: this.props.lang, type: 'user'}, this.props.token);
    }

    if (!this.props.getUserReservationStart && prevProps.getUserReservationStart && !this.props.getUserReservationError && this.props.getUserReservationSuccess && !prevProps.getUserReservationSuccess) {
      this.setState({loader: false, modal: false, reservationBillObject: null });
    }

    if (!this.props.rateReservationStart && prevProps.rateReservationStart && !this.props.rateReservationError && this.props.rateReservationSuccess && !prevProps.rateReservationSuccess) {
      this.setState({ activeScreen: 'reservation', reservationBillObject: null }, () => {
        this.props.getReservationsForUser(this.props.link, {language: this.props.lang, type: 'user'}, this.props.token);
      });
    }

  }

	async componentDidMount(){
		this.props.setUserLanguage(this.props.lang);
    if (!this.props.ratingShow) {
      this.props.getReservationsForUser(this.props.link, {language: this.props.lang, type: 'user'}, this.props.token);
    }else{
      this.setState({reservationBillObject: this.props.ratingShow, loader: false });
    }
    
	}
	
  render() {
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
    		/>

        <UserSubNavigation
          lang={ this.props.lang }
          isMobile={ this.state.isMobile }
          screen={ this.state.activeScreen }
          changeScreen={ this.changeScreen }
        />

        <UserBill
          lang={ this.props.lang }
          isMobile={ this.state.isMobile }
          show={ this.state.userBillShow }
          close={ this.closeUserBill }
          reservation={ this.state.reservationBillObject }
        />

        <Modal
          isOpen={ this.state.modal }
          title={this.state.dictionary['userProfileListModalTitle']}
          text={this.state.reservationBillObject ? this.state.reservationBillObject['cancelPolicy'] ? this.state.reservationBillObject['cancelPolicy']['free'] ? this.state.dictionary['userProfileListModalTextFree'] : this.state.dictionary['userProfileListModalTextPaid'] : '' : ''}
          buttonColor="danger"
          buttonText={this.state.dictionary['userProfileListModalButton']}
          toggle={ this.toggleModal }
          clickFunction={ this.activateCancelReservation }
        />

        <PaymentModal
          isOpen={ this.state.paymentModal }
          title={this.state.dictionary['userProfileListCateringModalTitle']}
          text={this.state.reservationBillObject ? `${this.state.dictionary['userProfileListCateringModalText1']} ${this.state.reservationBillObject['trilinoCateringString']}, ${this.state.dictionary['userProfileListCateringModalText2']} ${currencyFormat(this.state.reservationBillObject['trilinoPrice'])} ${this.state.dictionary['userProfileListCateringModalText3']} ${this.state.reservationBillObject['trilinoPaymentDeadline']} ${this.state.dictionary['userProfileListCateringModalText4']}` : ''}
          buttonColor="danger"
          checkboxLabel={this.state.dictionary['paymentStageCheck']}
          buttonText={this.state.dictionary['userProfileListCateringModalButton']}
          vatInfo={this.state.dictionary['uniVAT'] }
          toggle={ this.togglePaymentModal }
          clickFunction={ this.activatePayCatering }

        />

    		<div>
          <Container>
              <Row className="userProfileScreen">
                <Col xs='12'>
                  <Alert color="success" isOpen={ this.state.passwordChange } toggle={() => this.closePassChangeAlert()} >
                    <h3>{this.state.dictionary['userProfileListAlert']}</h3>
                  </Alert>
                </Col>

                {
                  this.state.activeScreen === 'reservation'
                  ?
                  (
                    <Col xs='12'>
                      <div className="middle">
                        <h3 className="screenTitle">{this.state.dictionary['userProfileListTitle']}</h3>
                      </div>
                      <Row className="reservationList justify-content-sm-center">

                        {
                          this.props.reservations.length
                          ?
                          this.props.reservations.map((reser, index) => {
                            return(
                              <Col xs="12" sm="6" lg="4" key={`resKEy_${index}`}>
                                <div className="item">
                                  <div className={`outcome ${reser['status']}`}>
                                    <p>{ reser['status'] === 'accepted' ? this.state.dictionary['paymentUserEmailPaymentStatusTrue'] : reser['status'] === 'declined' ? this.state.dictionary['paymentUserEmailPaymentStatusFalse'] : this.state.dictionary['paymentUserEmailPaymentStatusCancel']}</p>
                                  </div>
                                  <div className="info">
                                    <Row>
                                      <Col xs="12" sm="8">
                                        <span>{this.state.dictionary['paymentUserEmailOrderId']}</span>
                                        <span>{ reser['_id']}</span>
                                        <span>{this.state.dictionary['paymentUserEmailDate']}</span>
                                        <span>{ reser['dateTime']}</span>
                                        <span>{this.state.dictionary['paymentUserEmailPartnerName']}</span>
                                        <span>{ reser['partnerObj'][0]['name']}</span>
                                      </Col>
                                      <Col xs="12" sm="4">
                                        <div className="actions">
                                          <button onClick={ () => this.openUserBill(index)}>{this.state.dictionary['userProfileListButtonMore']}</button>
                                          {
                                            reser['forRating']
                                            ?
                                            <button onClick={ () => this.openRating(index) }>{this.state.dictionary['userProfileListButtonRate']}</button>
                                            :
                                            null
                                          }

                                          {
                                            reser['isForTrilino']
                                            ?
                                            <button onClick={ () => this.togglePaymentModal(index)}>{this.state.dictionary['userProfileListButtonCatering']}</button>
                                            :
                                            null
                                          }
                                          
                                          {
                                            reser['cancelPolicy']
                                            ?
                                            reser['cancelPolicy']['cancel']
                                            ?
                                            <button className="decline" onClick={ () => this.toggleModal(index) }>{this.state.dictionary['userProfileListButtonCancel']}</button>
                                            :
                                            null
                                            :
                                            null
                                          }
                                          
                                         </div>
                                      </Col>
                                    </Row>
                                    
                                  </div>
                                 
                                </div>
                              </Col>
                            )
                          })
                          :
                          <Col xs="12">
                            <div className="middle">
                              <h4 className="noMatch">{this.state.dictionary['userProfileListNoList']}</h4>
                            </div>
                            
                          </Col>
                        }

                      </Row>
                      
                    </Col>
                  )
                  :
                  null
                }

                {
                  this.state.activeScreen === 'message'
                  ?
                  (
                    <Col xs='12'>
                      <div className="middle">
                        <h2>Ovde su korisničke poruke</h2>
                      </div>
                    </Col>
                  )
                  :
                  null
                }

                {
                  this.state.activeScreen === 'logout'
                  ?
                  (
                    <Col xs='12'>
                      <div className="middle">
                        <h3 className="screenTitle">Odjava</h3>
                        <p>Ukoliko se odjavite napustićete svoj korisnički profil</p>
                        <Button color="success" onClick={() => { this.logout() }}>Odjavite se</Button>
                      </div>
                    </Col>
                  )
                  :
                  null
                }

                {
                  this.state.activeScreen === 'rating'
                  ?
                  (
                     <RatingScreen
                      lang={ this.props.lang }
                      isMobile={ this.state.isMobile }
                      goBack={ this.goBackFromRating }
                      sendRatingData={ this.prepareRatingDataForSend }
                      reservation={ this.state.reservationBillObject }
                    />
                  )
                  :
                  null
                }
                <div id="myformcontainer" style={{"visibility":"hidden"}}></div>
                
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

  getUserReservationStart: state.ReservationReducer.getUserReservationStart,
  getUserReservationError: state.ReservationReducer.getUserReservationError,
  getUserReservationSuccess: state.ReservationReducer.getUserReservationSuccess,

  cancelReservationStart: state.ReservationReducer.cancelReservationStart,
  cancelReservationError: state.ReservationReducer.cancelReservationError,
  cancelReservationSuccess: state.ReservationReducer.cancelReservationSuccess,

  rateReservationStart: state.ReservationReducer.rateReservationStart,
  rateReservationError: state.ReservationReducer.rateReservationError,
  rateReservationSuccess: state.ReservationReducer.rateReservationSuccess,

  reservations: state.ReservationReducer.reservations,
});


const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setUserLanguage,
    getReservationsForUser,
    cancelReservation,
    rateReservation,
  },
  dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(UserProfileView)