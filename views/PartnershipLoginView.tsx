import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PlainInput from '../components/form/input';
import Select from 'react-select';
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
  setUserLanguage(language: string): string;
  userAgent: string;
  path: string;
  fullPath: string;
  lang: string;
  option: string;
};
interface MyState {
	language: string;
	dictionary: object;
	isMobile: boolean;
};

class PartnershipLoginView extends React.Component <MyProps, MyState>{

	state: MyState = {
      language: this.props.lang.toUpperCase(),
      dictionary: getLanguage(this.props.lang),
      isMobile: isMobile(this.props.userAgent),
    };

	componentDidMount(){
		this.props.setUserLanguage(this.props.lang);
	}
	
  render() {

  	const options = [
      { value: '1', label: 'Beograd' },
      { value: '2', label: 'Novi sad' },
      { value: '3', label: 'Niš' }
    ];

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
    		/>
    		
    			{this.props.option === 'register'
    			?
    			<div className="registrationWrapper">
    				<Container>
    					<Row>
			              <Col xs='12'>
			              	<div className="box">
			              		<h2>{this.state.dictionary['partnerRegTitle']}</h2>
			              		<p>{this.state.dictionary['partnerRegExplanation']}</p>
    							<PlainInput placeholder={ this.state.dictionary['partnerRegName'] } className="logInput" />
    							<PlainInput placeholder={ this.state.dictionary['partnerRegTax'] } className="logInput" />
    							<Select options={options} instanceId="homeCity" className="logInput" placeholder={ this.state.dictionary['uniCity'] }/>
    							<PlainInput placeholder={ this.state.dictionary['partnerRegContactPerson'] } className="logInput" />
    							<PlainInput placeholder={ this.state.dictionary['partnerRegContactEmail'] } className="logInput" type="email" />
    							<PlainInput placeholder={ this.state.dictionary['partnerRegContactPhone'] } className="logInput" />

    							<div className="middle marginSmall">
    								<a href="/">{this.state.dictionary['uniTerms']}</a>
    							</div>

    							<div className="middle">
    								<Button color="success">{this.state.dictionary['uniRegister']}</Button>
    							</div>

    							
			              	</div>
			              	<div className="middle">
			              		<p>{this.state.dictionary['partnerRegFinalWarning']} <a id="loginRedirection" href={`/partnershipLogin?language=${this.props.lang}&option=login`}>{this.state.dictionary['uniLogin']}</a>{this.state.dictionary['partnerLogThank']}</p>
			              		
			              	</div>
			              </Col>
			            </Row>
    				</Container>
    				
    			</div> 
    			: null
    			}

    			{this.props.option === 'login'
    			?
    			<div className="registrationWrapper">
    				<Container>
    					<Row>
			              <Col xs='12'>
			              	<div className="box">
			              		<h2>{this.state.dictionary['partnerLogTitle']}</h2>
			              		<p>{this.state.dictionary['partnerLogExplanation']}</p>
    							<PlainInput placeholder={this.state.dictionary['uniEmail']} className="logInput" type="email" />
    							<PlainInput placeholder={this.state.dictionary['uniPass']} className="logInput" type="password" />

    							<div className="middle marginSmall">
    								<a href="/">{this.state.dictionary['uniForgotPass']}</a>
    							</div>

    							<div className="middle">
    								<Button color="success">{this.state.dictionary['uniLogin']}</Button>
    							</div>

    							
			              	</div>
			              	<div className="middle">
			              		<p>{this.state.dictionary['partnerLogFinalWarning']}<a id="registrationRedirection" href={`/partnershipLogin?language=${this.props.lang}&option=register`}>{this.state.dictionary['uniRegister']}</a>{this.state.dictionary['partnerLogThank']}</p>
			              		
			              	</div>
			              	
			              </Col>
			            </Row>
    				</Container>
    				
    			</div> 
    			: null
    			}

		    <Footer 
    			isMobile={ this.state.isMobile } 
    			language={ this.state.language } 
    			page={ this.props.path ? this.props.path : '' }
    			contact={ this.state.dictionary['navigationContact'] }
    			login={ this.state.dictionary['navigationLogin'] }
    			search={ this.state.dictionary['navigationSearch'] }
    			partnership={ this.state.dictionary['navigationPartnership'] }
    			faq={ this.state.dictionary['navigationFaq'] }
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

export default connect(mapStateToProps, matchDispatchToProps)(PartnershipLoginView)