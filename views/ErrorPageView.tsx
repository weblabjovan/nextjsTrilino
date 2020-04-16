import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { getLanguage } from '../lib/language';
import { isMobile, setUpLinkBasic } from '../lib/helpers/generalFunctions';
import { isDevEnvLogged } from '../lib/helpers/specificAdminFunctions';
import NavigationBar from '../components/navigation/navbar';
import Footer from '../components/navigation/footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';


type MyProps = {
  path: string;
  fullPath: string;
  lang: string;
  error: string;

  // using `interface` is also ok
};
interface MyState {
	language: string;
	dictionary: object;
	isMobile: boolean;
};

export default class ErrorPageView extends React.Component <MyProps, MyState> {

	state: MyState = {
    language: this.props.lang.toUpperCase(),
    dictionary: getLanguage(this.props.lang),
    isMobile: false,
  };

  async componentDidMount(){
    const devIsLogged = await isDevEnvLogged(window.location.href);
    if (devIsLogged) {
      this.setState({isMobile: isMobile(navigator.userAgent) });
    }else{
      const link = setUpLinkBasic(window.location.href);
      window.location.href =  `${link['protocol']}${link['host']}/devLogin`;
    }
  }

	render(){
    const message = this.props.error === '1' ? this.state.dictionary['uniErrorMessage1'] : this.state.dictionary['uniErrorMessage2'] ;
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
    			user={ false }
    			userProfile={ this.state.dictionary['navigationProfile'] }
    		/>
				<Container>
					<Row>
		    		<Col xs="12">
		    			<div className="helpPage terms">
		    				<div className="section" style={{'textAlign': 'center'}}>
		    					<img src="/static/error_gif.gif" alt="error" style={{'maxWidth': '300px !important'}}></img>
		    				</div>
		    				<h2>{message}</h2>
                <div className="section" style={{'textAlign': 'center'}}>
                  <h4>{this.state.dictionary['uniErrorGoBack']} <a href={`/?language=${this.props.lang}`}>{this.state.dictionary['uniErrorHome']}</a></h4>
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