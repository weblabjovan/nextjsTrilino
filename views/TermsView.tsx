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

export default class TermsView extends React.Component <MyProps, MyState> {

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
		    				<h2>{this.state.dictionary['termsHeadTitle']}</h2>
		    				<div className="section" >
		    					<h4>{this.state.dictionary['termsIntroTitle']}</h4>
		    					<p>{this.state.dictionary['termsIntroText_1']}</p>
		    					<p>{this.state.dictionary['termsIntroText_2']}</p>
		    					<p>{this.state.dictionary['termsIntroText_3']}</p>
		    					<p>{this.state.dictionary['termsIntroText_4']}</p>
		    					<p>{this.state.dictionary['termsIntroText_5']}</p>
		    					<p>{this.state.dictionary['termsIntroText_6']}</p>
		    					<p>{this.state.dictionary['termsIntroText_7']}</p>
		    				</div>

		    				<div className="section" >
		    					<h4>{this.state.dictionary['termsRegTitle']}</h4>
		    					<p>{this.state.dictionary['termsRegText_1']}</p>
		    					<p>{this.state.dictionary['termsRegText_2']}</p>
		    					<p>{this.state.dictionary['termsRegText_3']}</p>
		    				</div>

		    				<div className="section" >
		    					<h4>{this.state.dictionary['termsAuthTitle']}</h4>
		    					<p>{this.state.dictionary['termsAuthText_1']}</p>
		    					<p>{this.state.dictionary['termsAuthText_2']}</p>
		    					<p>{this.state.dictionary['termsAuthText_3']}</p>
		    				</div>

		    				<div className="section" >
		    					<h4>{this.state.dictionary['termsChangeTitle']}</h4>
		    					<p>{this.state.dictionary['termsChangeText_1']}</p>
		    					<p>{this.state.dictionary['termsChangeText_2']}</p>
		    				</div>

		    				<div className="section" >
		    					<h4>{this.state.dictionary['termsInfoTitle']}</h4>
		    					<p>{this.state.dictionary['termsInfoText_1']}</p>
		    				</div>

		    				<div className="section" >
		    					<h4>{this.state.dictionary['termsUseTitle']}</h4>
		    					<p>{this.state.dictionary['termsUseText_1']}</p>
		    					<p>{this.state.dictionary['termsUseText_2']}</p>
		    					<p>{this.state.dictionary['termsUseText_3']}</p>
		    					<p>{this.state.dictionary['termsUseText_4']}</p>
		    					<p>{this.state.dictionary['termsUseText_5']}</p>
		    				</div>

		    				<div className="section" >
		    					<h4>{this.state.dictionary['termsContentTitle']}</h4>

		    					<h5>{this.state.dictionary['termsContentSub_1']}</h5>
		    					<p>{this.state.dictionary['termsContentText_1']}</p>

		    					<h5>{this.state.dictionary['termsContentSub_2']}</h5>
		    					<p>{this.state.dictionary['termsContentText_2']}</p>
		    					<p>{this.state.dictionary['termsContentText_3']}</p>

		    					<h5>{this.state.dictionary['termsContentSub_3']}</h5>
		    					<p>{this.state.dictionary['termsContentText_4']}</p>
		    					<p>{this.state.dictionary['termsContentText_5']}</p>

		    					<h5>{this.state.dictionary['termsContentSub_4']}</h5>
		    					<p>{this.state.dictionary['termsContentText_6']}</p>
		    					<p>{this.state.dictionary['termsContentText_7']}</p>
		    					<p>{this.state.dictionary['termsContentText_8']}</p>
		    					<p>{this.state.dictionary['termsContentText_9']}</p>
		    					<p>{this.state.dictionary['termsContentText_10']}</p>
		    					<p>{this.state.dictionary['termsContentText_11']}</p>
		    					<p>{this.state.dictionary['termsContentText_12']}</p>
		    					<p>{this.state.dictionary['termsContentText_13']}</p>
		    				</div>

		    				<div className="section" >
		    					<h4>{this.state.dictionary['termsBuyTitle']}</h4>

		    					<h5>{this.state.dictionary['termsBuySub_1']}</h5>
		    					<p>{this.state.dictionary['termsBuyText_1']}</p>
		    					<p>{this.state.dictionary['termsBuyText_2']}</p>

		    					<h5>{this.state.dictionary['termsBuySub_2']}</h5>
		    					<p>{this.state.dictionary['termsBuyText_3']}</p>
		    					<p>{this.state.dictionary['termsBuyText_4']}</p>
		    					<p>{this.state.dictionary['termsBuyText_5']}</p>
		    					<p>{this.state.dictionary['termsBuyText_6']}</p>
		    					<p>{this.state.dictionary['termsBuyText_7']}</p>
		    				</div>

		    				<div className="section" >
		    					<h4>{this.state.dictionary['termsChangeBuyTitle']}</h4>
		    					<p>{this.state.dictionary['termsChangeBuyText_1']}</p>
		    				</div>

		    				<div className="section" >
		    					<h4>{this.state.dictionary['termsReclamationTitle']}</h4>
		    					<p>{this.state.dictionary['termsReclamationText_1']}</p>
		    					<p>{this.state.dictionary['termsReclamationText_2']}</p>
		    					<p>{this.state.dictionary['termsReclamationText_3']}</p>
		    					<p>{this.state.dictionary['termsReclamationText_4']}</p>
		    				</div>

		    				<div className="section" >
		    					<h4>{this.state.dictionary['termsPartnersTitle']}</h4>
		    					<p>{this.state.dictionary['termsPartnersText_1']}</p>
		    					<p>{this.state.dictionary['termsPartnersText_2']}</p>
		    					<p>{this.state.dictionary['termsPartnersText_3']}</p>
		    					<p>{this.state.dictionary['termsPartnersText_4']}</p>
		    					<p>{this.state.dictionary['termsPartnersText_5']}</p>
		    					<p>{this.state.dictionary['termsPartnersText_6']}</p>
		    					<p>{this.state.dictionary['termsPartnersText_7']}</p>
		    					<p>{this.state.dictionary['termsPartnersText_8']}</p>
		    				</div>

		    				<div className="section" >
		    					<h4>{this.state.dictionary['termsConfidentTitle']}</h4>
		    					<h5>{this.state.dictionary['termsConfidentSub_1']}</h5>
		    					<p>{this.state.dictionary['termsConfidentText_1']}</p>
		    					<p>{this.state.dictionary['termsConfidentText_2']}</p>
		    					<p>{this.state.dictionary['termsConfidentText_3']}</p>
		    					<p>{this.state.dictionary['termsConfidentText_4']}</p>
		    					<p>{this.state.dictionary['termsConfidentText_5']}</p>
		    				</div>

		    				<div className="section" >
		    					<h4>{this.state.dictionary['termsPersonalTitle']}</h4>
		    					<p>{this.state.dictionary['termsPersonaltText_1']}</p>
		    					<p>{this.state.dictionary['termsPersonaltText_2']}</p>
		    					<p>{this.state.dictionary['termsPersonaltText_3']}</p>
		    					<p>{this.state.dictionary['termsPersonaltText_4']}</p>
		    					<p>{this.state.dictionary['termsPersonaltText_5']}</p>
		    					<p>{this.state.dictionary['termsPersonaltText_6']}</p>
		    					<p>{this.state.dictionary['termsPersonaltText_7']}</p>
		    				</div>

		    				<div className="section" >
		    					<h4>{this.state.dictionary['termsGenInfoTitle']}</h4>
		    					<p>{this.state.dictionary['termsGenInfoText_1']}</p>
		    					<p>{this.state.dictionary['termsGenInfoText_2']}</p>
		    					<p>{this.state.dictionary['termsGenInfoText_3']}</p>
		    				</div>

		    				<div className="section" >
		    					<h4>{this.state.dictionary['termsEmailTitle']}</h4>
		    					<p>{this.state.dictionary['termsEmailText_1']}</p>
		    					<p>{this.state.dictionary['termsEmailText_2']}</p>
		    					<p>{this.state.dictionary['termsEmailText_3']}</p>
		    					<p>{this.state.dictionary['termsEmailText_4']}</p>
		    					<p>{this.state.dictionary['termsEmailText_5']}</p>
		    					<p>{this.state.dictionary['termsEmailText_6']}</p>
		    				</div>

		    				<div className="section" >
		    					<h4>{this.state.dictionary['termsPaySecTitle']}</h4>
		    					<p>{this.state.dictionary['termsPaySecText_1']}</p>
		    				</div>

		    				<div className="section" >
		    					<h4>{this.state.dictionary['termsCommTitle']}</h4>
		    					<p>{this.state.dictionary['termsCommText_1']}</p>
		    					<p>{this.state.dictionary['termsCommText_2']}</p>
		    				</div>

		    				<div className="section" >
		    					<h4>{this.state.dictionary['termsJuvenTitle']}</h4>
		    					<p>{this.state.dictionary['termsJuvenText_1']}</p>
		    					<p>{this.state.dictionary['termsJuvenText_2']}</p>
		    				</div>

		    				<div className="section" >
		    					<h4>{this.state.dictionary['termsResponsaTitle']}</h4>
		    					<p>{this.state.dictionary['termsResponsaText_1']}</p>
		    					<p>{this.state.dictionary['termsResponsaText_2']}</p>
		    					<p>{this.state.dictionary['termsResponsaText_3']}</p>
		    					<p>{this.state.dictionary['termsResponsaText_4']}</p>
		    					<p>{this.state.dictionary['termsResponsaText_5']}</p>
		    					<p>{this.state.dictionary['termsResponsaText_6']}</p>
		    					<p>{this.state.dictionary['termsResponsaText_7']}</p>
		    					<p>{this.state.dictionary['termsResponsaText_8']}</p>
		    					<p>{this.state.dictionary['termsResponsaText_9']}</p>
		    					<p>{this.state.dictionary['termsResponsaText_10']}</p>
		    					<p>{this.state.dictionary['termsResponsaText_11']}</p>
		    				</div>

		    				<div className="section" >
		    					<h4>{this.state.dictionary['termsDisclaimUserTitle']}</h4>
		    					<p>{this.state.dictionary['termsDisclaimUserText_1']}</p>
		    					<p>{this.state.dictionary['termsDisclaimUserText_2']}</p>
		    					<p>{this.state.dictionary['termsDisclaimUserText_3']}</p>
		    					<p>{this.state.dictionary['termsDisclaimUserText_4']}</p>
		    					<p>{this.state.dictionary['termsDisclaimUserText_5']}</p>
		    				</div>

		    				<div className="section" >
		    					<h4>{this.state.dictionary['termsDisclaimPartnerTitle']}</h4>
		    					<p>{this.state.dictionary['termsDisclaimPartnerText_1']}</p>
		    				</div>

		    				<div className="section" >
		    					<h4>{this.state.dictionary['termsTerminationTitle']}</h4>
		    					<p>{this.state.dictionary['termsTerminationText_1']}</p>
		    				</div>

		    				<div className="section" >
		    					<h4>{this.state.dictionary['termsNullTitle']}</h4>
		    					<p>{this.state.dictionary['termsNullText_1']}</p>
		    					<p>{this.state.dictionary['termsNullText_2']}</p>
		    				</div>

		    				<div className="section" >
		    					<h4>{this.state.dictionary['termsDisputeTitle']}</h4>
		    					<p>{this.state.dictionary['termsDisputeText_1']}</p>
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