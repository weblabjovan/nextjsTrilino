import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from '../components/loader';
import { Container, Row, Col, Button, Alert } from 'reactstrap';
import { getReservationsForUser, cancelReservation } from '../actions/reservation-actions';
import { setUserLanguage } from '../actions/user-actions';
import { getLanguage } from '../lib/language';
import { isMobile, setCookie, unsetCookie, setUpLinkBasic } from '../lib/helpers/generalFunctions';
import PlainInput from '../components/form/input';
import UserSubNavigation from '../components/userProfile/SubNavigation';
import UserBill from '../components/userProfile/UserBill';
import Modal from '../components/modals/ConfirmationModal';
import NavigationBar from '../components/navigation/navbar';
import Footer from '../components/navigation/footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface MyProps {
  // using `interface` is also ok
  userLanguage: string;
  getUserReservationStart: boolean;
  getUserReservationError: object | boolean;
  getUserReservationSuccess: null | number;
  reservations: Array<object>;
  cancelReservationStart: boolean;
  cancelReservationError: object | boolean;
  cancelReservationSuccess: null | object;
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
  passChange: boolean;
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
};

class UserProfileView extends React.Component <MyProps, MyState>{
  constructor(props){
    super(props);

    this.componentObjectBinding = this.componentObjectBinding.bind(this);

    const bindingFunctions = ['changeScreen', 'openUserBill', 'closeUserBill', 'toggleModal', 'activateCancelReservation'];
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
    activeScreen: 'reservation',
    reservationBill: '',
    reservationBillObject: null,
    userBillShow: false,
    modal: false,
  };

  logout() {
    unsetCookie('trilino-user-token');
    window.location.href = `${this.props.link["protocol"]}${this.props.link["host"]}/login?language=${this.props.lang}`;
  }

  changeScreen(screen: string){
    if (screen !== this.state.activeScreen) {
      this.setState({ activeScreen: screen });
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

  activateCancelReservation(){
    this.setState({loader: true}, () => {
      this.props.cancelReservation(this.props.link, {language: this.props.lang, doubleReference: this.state.reservationBillObject['doubleReference'], id: this.state.reservationBillObject['_id']}, this.props.token);
    })
  }

  componentDidUpdate(prevProps: MyProps, prevState:  MyState){ 
    if (!this.props.cancelReservationStart && prevProps.cancelReservationStart && !this.props.cancelReservationError && this.props.cancelReservationSuccess && !prevProps.cancelReservationSuccess) {
      this.props.getReservationsForUser(this.props.link, {language: this.props.lang, type: 'user'}, this.props.token);
    }

    if (!this.props.getUserReservationStart && prevProps.getUserReservationStart && !this.props.getUserReservationError && this.props.getUserReservationSuccess && !prevProps.getUserReservationSuccess) {
      this.setState({loader: false, modal: false, reservationBillObject: null });
    }

  }

	componentDidMount(){
		this.props.setUserLanguage(this.props.lang);
    this.props.getReservationsForUser(this.props.link, {language: this.props.lang, type: 'user'}, this.props.token);
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
          title={"Otkazivanje rezervacije"}
          text={this.state.reservationBillObject ? this.state.reservationBillObject['cancelPolicy']['free'] ? "Ukoliko otkažete ovu rezervaciju, gubite pravo na rezervisani termin u datom prostoru. U ovom trenutku otkazivanje rezervacije je praktično besplatno, plaćaju se samo troškovi obrade transakcije 2%-5% uplaćenog depozita. Da li i dalje želite da otkažete ovu rezervaciju?" : "Ukoliko otkažete ovu rezervaciju, gubite pravo na rezervisani termin u datom prostoru i gubite novac koji ste uplatili kao depozit. Da li i dalje želite da otkažete ovu rezervaciju?" : ''}
          buttonColor="danger"
          buttonText={"Da, otkažite"}
          toggle={ this.toggleModal }
          clickFunction={ this.activateCancelReservation }
        />

    		<div>
          <Container>
              <Row className="userProfileScreen">
                <Col xs='12'>
                  <Alert color="success" isOpen={ this.state.passwordChange } toggle={() => this.closePassChangeAlert()} >
                    <h3>Vaša lozinka je uspešno promenjena</h3>
                  </Alert>
                </Col>

                {
                  this.state.activeScreen === 'reservation'
                  ?
                  (
                    <Col xs='12'>
                      <div className="middle">
                        <h3 className="screenTitle">Vaše rezervacije</h3>
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
                                          <button onClick={ () => this.openUserBill(index)}>Detaljnije</button>
                                          {
                                            reser['isForRate']
                                            ?
                                            <button>Ocenite</button>
                                            :
                                            null
                                          }

                                          {
                                            reser['isForTrilino']
                                            ?
                                            <button>Ketering</button>
                                            :
                                            null
                                          }
                                          
                                          {
                                            reser['cancelPolicy']['cancel']
                                            ?
                                            <button className="decline" onClick={ () => this.toggleModal(index) }>Otkažite</button>
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
                              <h4 className="noMatch">Do sada nije kreirana nijedna rezervacija</h4>
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
    		/>

    	</div>
    	
    ) 
  }
}

const mapStateToProps = (state) => ({
  userLanguage: state.UserReducer.language,

  getUserReservationStart: state.ReservationReducer.getUserReservationStart,
  getUserReservationError: state.ReservationReducer.getUserReservationError,
  getUserReservationSuccess: state.ReservationReducer.getUserReservationSuccess,

  cancelReservationStart: state.ReservationReducer.cancelReservationStart,
  cancelReservationError: state.ReservationReducer.cancelReservationError,
  cancelReservationSuccess: state.ReservationReducer.cancelReservationSuccess,

  reservations: state.ReservationReducer.reservations,
});


const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setUserLanguage,
    getReservationsForUser,
    cancelReservation,
  },
  dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(UserProfileView)