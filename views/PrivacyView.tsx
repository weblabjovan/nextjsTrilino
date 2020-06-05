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

export default class PrivacyView extends React.Component <MyProps, MyState> {

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
		    				<h2>{this.state.dictionary['privacyStatementTitle']}</h2>
		    				<div className="section" >
		    					<p>{this.state.dictionary['privacyStatementText1']}</p>
									<p>{this.state.dictionary['privacyStatementText2']}</p>
									<p>{this.state.dictionary['privacyStatementText3']}</p>
									<p>{this.state.dictionary['privacyStatementText4']}</p>
									<p>{this.state.dictionary['privacyStatementText5']}</p>
									<p>{this.state.dictionary['privacyStatementText6']}</p>
									<p>{this.state.dictionary['privacyStatementText7']}</p>
									<p>{this.state.dictionary['privacyStatementText8']}</p>
									<p>{this.state.dictionary['privacyStatementText9']}</p>
									<p>{this.state.dictionary['privacyStatementText10']}</p>
									<p>{this.state.dictionary['privacyStatementText11']}</p>
									<p>{this.state.dictionary['privacyStatementText12']}</p>
		    					<p>{this.state.dictionary['privacyStatementText13']}</p>
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