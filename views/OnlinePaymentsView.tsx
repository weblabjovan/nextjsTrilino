import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { getLanguage } from '../lib/language';
import { isMobile } from '../lib/helpers/generalFunctions';
import NavigationBar from '../components/navigation/navbar';
import Footer from '../components/navigation/footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';


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
		    				<h2>Plaćanje karticama</h2>
		    				<div className="section" >
		    					<h4>Instrukcija za plaćanje na Trilino internet stranici</h4>
		    					<p>{this.state.dictionary['termsIntroText_1']}</p>
		    					<img src="/static/intesaPayment.jpg" alt="intesa-payment-instruction" title="instrukcija za plaćanje"></img>
		    				</div>

		    				<div className="section" >
		    					<h4>Podaci na vašoj platnoj kartici</h4>
		    					<p>{this.state.dictionary['termsIntroText_1']}</p>
		    					<img src="/static/cardExplain.jpg" alt="payment-card-information" title="podaci sa platne kartice"></img>
		    					<p>{this.state.dictionary['termsIntroText_1']}</p>
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