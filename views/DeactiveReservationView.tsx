import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from '../components/loader';
import { Container, Row, Col, } from 'reactstrap';
import { deactivateReservation } from '../actions/reservation-actions';
import { getLanguage } from '../lib/language';
import { isMobile, setUpLinkBasic, errorExecute, getCookie } from '../lib/helpers/generalFunctions';
import NavigationBar from '../components/navigation/navbar';
import Footer from '../components/navigation/footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface MyProps {
  // using `interface` is also ok
  userLanguage: string;
  globalError: boolean;
  deactivateReservationStart: boolean;
  deactivateReservationError: object | boolean;
  deactivateReservationSuccess: null | object;
  deactivateReservation(link: object, data: object, auth: string): void;
  userAgent: string;
  path: string;
  fullPath: string;
  lang: string;
  link: null | object;
};
interface MyState {
	language: string;
	dictionary: object;
	isMobile: boolean;
  loader: boolean;
};

class DeactiveReservationView extends React.Component <MyProps, MyState>{

	state: MyState = {
    language: this.props.lang.toUpperCase(),
    dictionary: getLanguage(this.props.lang),
    isMobile: isMobile(this.props.userAgent),
    loader: true,
  };

  componentDidUpdate(prevProps: MyProps, prevState:  MyState){ 
    if (!this.props.deactivateReservationStart && prevProps.deactivateReservationStart && this.props.deactivateReservationSuccess && !prevProps.deactivateReservationSuccess && !this.props.deactivateReservationError) {
      window.location.href = `${this.props.link["protocol"]}${this.props.link["host"]}?language=${this.props.lang}`;
    }
    
  }

	componentDidMount(){
    if (this.props.link['queryObject']['deactive'] === 'true') {
      if (this.props.link['queryObject']['reservation']) {
        const token = getCookie('trilino-user-token');
      this.props.deactivateReservation(this.props.link, {type: 'single', language: this.props.lang, id: this.props.link['queryObject']['reservation']}, token);
      }else{
        window.location.href = `${this.props.link["protocol"]}${this.props.link["host"]}?language=${this.props.lang}`;
      }
    }else{
      window.location.href = `${this.props.link["protocol"]}${this.props.link["host"]}?language=${this.props.lang}`;
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
    		<div className="registrationWrapper">
          <Container>
              <Row>
                <Col xs='12'>
                  <div className="deactiveBox">
                    <div className="middle">
                      <h2>{ this.state.dictionary['paymentDeactivateTitle'] }</h2>
                      <p>{ this.state.dictionary['paymentDeactivateText'] }</p>
                    </div>
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
          terms={ this.state.dictionary['navigationTerms'] }
    		/>

    	</div>
    	
    ) 
  }
}

const mapStateToProps = (state) => ({
  userLanguage: state.UserReducer.language,
  globalError: state.UserReducer.globalError,

  deactivateReservationStart: state.ReservationReducer.deactivateReservationStart,
  deactivateReservationError: state.ReservationReducer.deactivateReservationError,
  deactivateReservationSuccess: state.ReservationReducer.deactivateReservationSuccess,
});


const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
    deactivateReservation,
  },
  dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(DeactiveReservationView)