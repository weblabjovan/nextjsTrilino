import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { getLanguage } from '../lib/language';
import { isMobile } from '../lib/helpers/generalFunctions';
import NavigationBar from '../components/navigation/navbar';
import Footer from '../components/navigation/footer';


type MyProps = {
	userAgent: string;
  path: string;
  fullPath: string;
  lang: string;
  userIsLogged: boolean;
  // using `interface` is also ok
};
interface MyState {
	language: string;
	dictionary: object;
	isMobile: boolean;
};

export default class OnlinePaymentsView extends React.Component <MyProps, MyState> {

	state: MyState = {
    language: this.props.lang.toUpperCase(),
    dictionary: getLanguage(this.props.lang),
    isMobile: isMobile(this.props.userAgent),
  };

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
    			user={ this.props.userIsLogged }
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
    			payment={ this.state.dictionary['navigationOnline'] }
          		privacy={ this.state.dictionary['navigationPrivacy'] }
    		/>
			</div>
		)
	}
}