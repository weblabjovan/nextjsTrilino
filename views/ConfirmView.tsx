import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import queryString  from 'query-string';
import { Container, Row, Col } from 'reactstrap';
import { setUserLanguage } from '../actions/user-actions';
import { getLanguage } from '../lib/language';
import { isMobile, errorExecute, setUpLinkBasic } from '../lib/helpers/generalFunctions';
import { isDevEnvLogged } from '../lib/helpers/specificAdminFunctions';
import NavigationBar from '../components/navigation/navbar';
import Footer from '../components/navigation/footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface MyProps {
  // using `interface` is also ok
  userLanguage: string;
  globalError: boolean;
  page: string;
  setUserDevice(userAgent: string): boolean;
  setUserLanguage(language: string): string;
  path: string;
  fullPath: string;
  lang: string;
  error: boolean;
};
interface MyState {
	language: string;
	dictionary: object;
	isMobile: boolean;
};

class ConfirmView extends React.Component <MyProps, MyState>{

	state: MyState = {
      language: this.props.lang.toUpperCase(),
      dictionary: getLanguage(this.props.lang),
      isMobile: false,
    };

	async componentDidMount(){
    const devIsLogged = await isDevEnvLogged(window.location.href);
    if (devIsLogged) {
      this.setState({isMobile: isMobile(navigator.userAgent) });
      this.props.setUserLanguage(this.props.lang);
    }else{
      const link = setUpLinkBasic(window.location.href);
      window.location.href =  `${link['protocol']}${link['host']}/devLogin`;
    }
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
    		/>
    		<Container>
    			{
    				this.props.page === 'partner_registration' 
    				? 
    				(
    					<div className="confirmRegistration">
	    					<Row>
		              <Col xs='12'>
		                <h2 className="middle">{ this.state.dictionary['confirmPartnerRegTitle'] }</h2>
		                <p>{ this.state.dictionary['confirmPartnerRegContent'] }<br/><br/><br/><br/></p>
		                <p className="middle">{ this.state.dictionary['uniCheckEmail'] }</p>
		              </Col>
		            </Row>
	            </div>
    				) : null
    			}
            
          {
    				this.props.page === 'error' 
    				? 
    				(
    					<div className="confirmRegistration">
	    					<Row>
		              <Col xs='12'>
		                <h2 className="middle">Error</h2>
		                <p className="middle">You are trying to reach page that does not exist. Please go back or go to Home page.</p>
		              </Col>
		            </Row>
	            </div>
    				) : null
    			}
		    </Container>

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
});


const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setUserLanguage,
  },
  dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(ConfirmView)