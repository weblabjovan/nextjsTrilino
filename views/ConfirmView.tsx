import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col } from 'reactstrap';
import { getLanguage } from '../lib/language';
import { isMobile, setUpLinkBasic } from '../lib/helpers/generalFunctions';
import NavigationBar from '../components/navigation/navbar';
import Footer from '../components/navigation/footer';

interface MyProps {
  // using `interface` is also ok
  path: string;
  fullPath: string;
  lang: string;
};
interface MyState {
	language: string;
	dictionary: object;
	isMobile: boolean;
};

export default class ConfirmView extends React.Component <MyProps, MyState>{

	state: MyState = {
    language: this.props.lang.toUpperCase(),
    dictionary: getLanguage(this.props.lang),
    isMobile: false,
  };

  componentDidUpdate(prevProps: MyProps, prevState:  MyState){ 
    if (prevProps.lang !== this.props.lang) {
      this.setState({dictionary: getLanguage(this.props.lang), language: this.props.lang.toUpperCase() })
    }
  }

  componentDidMount(){
    this.setState({ isMobile: isMobile(navigator.userAgent)});
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
          languagePrevent={ true }
    		/>
    		<Container>
    			<div className="confirmRegistration">
            <Row>
              <Col xs='12'>
                <h2 className="middle">{ this.state.dictionary['confirmPartnerRegTitle'] }</h2>
                <p>{ this.state.dictionary['confirmPartnerRegContent'] }<br/><br/><br/><br/></p>
                <p className="middle">{ this.state.dictionary['uniCheckEmail'] }</p>
              </Col>
            </Row>
          </div>
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
          payment={ this.state.dictionary['navigationOnline'] }
          privacy={ this.state.dictionary['navigationPrivacy'] }
    		/>

    	</div>
    	
    ) 
  }
}