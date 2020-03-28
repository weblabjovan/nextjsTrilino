import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from '../components/loader';
import { Container, Row, Col, Button, Alert } from 'reactstrap';
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
    loader: false,
    passwordChange: this.props.passChange,
    activeScreen: 'reservation',
    reservationBill: '',
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
    this.setState({ reservationBill: `bill_${reservationIndex}`, userBillShow: true });
  }

  closeUserBill(){
    this.setState({ reservationBill: '', userBillShow: false });
  }

  toggleModal(){
    this.setState({ modal: !this.state.modal });
  }

  activateCancelReservation(){
    console.log('otkazujem')
  }

  componentDidUpdate(prevProps: MyProps, prevState:  MyState){ 

  }

	componentDidMount(){
		this.props.setUserLanguage(this.props.lang);
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
        />

        <Modal
          isOpen={ this.state.modal }
          title={"Otkazivanje rezervacije"}
          text={"Otkazivanjem rezervacije dogadja se to to i to. Ne znam sada ali ćemo na vreme smisliti neki tekst koji će obavestiti korisnika šta ga čeka kada klikne dugme u nastavku."}
          buttonColor="danger"
          buttonText={"Otkazujem"}
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
                      <div className="reservationList">
                        {
                          [1,2,3,4,5,6].map( (item, index) => {
                            return(
                              <div className="item" key={`reservationItem_${index}`}>
                                <div className="info">
                                  <div className="date">
                                    <p>30-03-2020, 07:00 - 9:30</p>
                                  </div>

                                  <div className="restWrapper">
                                    <div className="venue">
                                      <p>Igraonica Adalgo Group</p>
                                      <p>Sala: Neka sala</p>
                                      <p>Puna cena: 56.000 rsd</p>
                                      <p>Rejting: Trenutno neocenjeno</p>
                                    </div>
                                    <div className="price">
                                      
                                      <p>Plaćen depozit: 6.000 rsd</p>
                                      <p>Za uplatu na licu mesta: 20.000 rsd</p>
                                      <p>Za Trilino ketring: 30.000 rsd</p>
                                      <p>Za uplatu do 23-03-2020: 30.000 rsd</p>
                                    </div>
                                    <div className="actions">
                                      <div className="middle">
                                        <button>Ocenite</button>
                                        <button>Platite Trilino Ketering</button>
                                        <button onClick={ () => this.openUserBill(index)}>Pogledajte detaljnije</button>
                                        <button className="decline" onClick={ this.toggleModal }>Otkažite</button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                             )
                          })
                        }
                        
                      </div>
                      
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
});


const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setUserLanguage,
  },
  dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(UserProfileView)