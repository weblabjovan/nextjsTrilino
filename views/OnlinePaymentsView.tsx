import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { getLanguage } from '../lib/language';
import { isMobile, setUpLinkBasic } from '../lib/helpers/generalFunctions';
import { isUserLogged } from '../lib/helpers/specificUserFunctions';
import { isDevEnvLogged } from '../lib/helpers/specificAdminFunctions';
import NavigationBar from '../components/navigation/navbar';
import Footer from '../components/navigation/footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';


type MyProps = {
  path: string;
  fullPath: string;
  lang: string;
  
  // using `interface` is also ok
};
interface MyState {
	language: string;
	dictionary: object;
	isMobile: boolean;
	userIsLogged: boolean;
};

export default class OnlinePaymentsView extends React.Component <MyProps, MyState> {

	state: MyState = {
    language: this.props.lang.toUpperCase(),
    dictionary: getLanguage(this.props.lang),
    isMobile: false,
    userIsLogged: false,
  };

  async componentDidMount(){
    const devIsLogged = await isDevEnvLogged(window.location.href);
    if (devIsLogged) {
      const userIsLogged = await isUserLogged(window.location.href);
      this.setState({isMobile: isMobile(navigator.userAgent), userIsLogged });
    }else{
      const link = setUpLinkBasic(window.location.href);
      window.location.href =  `${link['protocol']}${link['host']}/devLogin`;
    }
	}

	render(){
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
    			user={ this.state.userIsLogged }
    			userProfile={ this.state.dictionary['navigationProfile'] }
    		/>
				<Container>
					<Row>
		    		<Col xs="12">
		    			<div className="helpPage terms">
		    				<h2>{ this.state.dictionary['onlinePaymentTitle'] }</h2>
		    				<div className="section" >
		    					<h4>{ this.state.dictionary['onlinePaymentSub1'] }</h4>
		    					<p>{ this.state.dictionary['onlinePaymentText1'] }</p>
		    					<img src="/static/intesaPayment.jpg" alt="intesa-payment-instruction" title={ this.state.dictionary['onlinePaymentPhotoTitle1'] }></img>
		    				</div>

		    				<div className="section" >
		    					<h4>{ this.state.dictionary['onlinePaymentSub2'] }</h4>
		    					<p>{ this.state.dictionary['onlinePaymentText2'] }</p>
		    					<img src="/static/cardExplain.jpg" alt="payment-card-information" title={ this.state.dictionary['onlinePaymentPhotoTitle2'] }></img>
		    					<p>{ this.state.dictionary['onlinePaymentText3'] }</p>
		    				</div>
		    			</div>
		    		</Col>
		    	</Row>
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