import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col, Button } from 'reactstrap';
import { setUserLanguage } from '../actions/user-actions';
import { getLanguage } from '../lib/language';
import { isMobile } from '../lib/helpers/generalFunctions';
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
  userIsLogged: boolean;
};
interface MyState {
	language: string;
	dictionary: object;
	isMobile: boolean;
};

class ContactView extends React.Component <MyProps, MyState>{

	state: MyState = {
      language: this.props.lang.toUpperCase(),
      dictionary: getLanguage(this.props.lang),
      isMobile: isMobile(this.props.userAgent),
    };

	componentDidMount(){
		this.props.setUserLanguage(this.props.lang);
	}
	
  render() {
    return(
    	<div className="totalWrapper">
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

		    <div className="contactHead">
          <Container>
            <Row>
              <Col xs="12">
                <h1>{this.state.dictionary['contactHeadTitle']}</h1>
              </Col>
                
            </Row>

          </Container>
        </div>

        <div className="contactRegularWhite">
          <Container>
            <Row>
              <Col xs="12">
                <h3>{this.state.dictionary['contactGeneralSub']}</h3>
                <p><strong>{this.state.dictionary['contactGeneralPart']}</strong></p>
                <p><strong>{this.state.dictionary['contactGeneralAddress']}</strong> Džordža Vašingtona 40, 11000 Beograd </p>
                <p><strong>{this.state.dictionary['contactGeneralPhone']}</strong> 06512345678</p>
                <p><strong>{this.state.dictionary['contactGeneralWebsite']}</strong> https://www.adalgogroup.com/ </p>
                <p><strong>{this.state.dictionary['contactGeneralCompanyNum']}</strong> 21131121</p>
                <p><strong>{this.state.dictionary['contactGeneralTaxNum']}</strong> 109137875</p>
                <p><strong>{this.state.dictionary['contactGeneralDirector']}</strong> Dragan Djokić</p>
              </Col>
                
            </Row>

          </Container>
        </div>

       

        <div className="contactRegularWhite">
          <Container>
            <Row>
              <Col xs="12">
                <h3>{this.state.dictionary['contactContactSub']}</h3>
                <p><strong>{this.state.dictionary['contactContactGeneralEmail']}</strong> info@trilino.com</p>
                <p><strong>{this.state.dictionary['contactContactUserEmail']}</strong> aleksandar.djokic@trilino.com</p>
                <p><strong>{this.state.dictionary['contactContactPartnerEmail']}</strong> dragan.djokic@trilino.com</p>
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
});


const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setUserLanguage,
  },
  dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(ContactView)