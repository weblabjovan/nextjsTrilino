import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from '../components/loader';
import { Container, Row, Col, Button } from 'reactstrap';
import { setUserLanguage } from '../actions/user-actions';
import { verifyPartner } from '../actions/partner-actions';
import { getLanguage } from '../lib/language';
import { isMobile, setUpLinkBasic } from '../lib/helpers/generalFunctions';
import NavigationBar from '../components/navigation/navbar';
import Footer from '../components/navigation/footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface MyProps {
  // using `interface` is also ok
  userLanguage: string;
  page: string;
  verifyPartner(param: string, data: object, link: object): any;
  setUserLanguage(language: string): string;
  partnerVerificationStart: boolean;
  partnerVerificationError: boolean | object;
  partnerVerificationSuccess: null | object;
  userAgent: string;
  path: string;
  fullPath: string;
  lang: string;
  verifyObject: object;
  resolution: number;
  router: any;
  type: string;
};
interface MyState {
	language: string;
	dictionary: object;
	isMobile: boolean;
  loader: boolean;
  error: boolean;
  update: boolean;
};

class EmailVerificationView extends React.Component <MyProps, MyState>{

	state: MyState = {
      language: this.props.lang.toUpperCase(),
      dictionary: getLanguage(this.props.lang),
      isMobile: isMobile(this.props.userAgent),
      loader: true,
      error: false,
      update: false,
    };

  componentDidUpdate(prevProps: MyProps, prevState:  MyState){
    if (!this.props.partnerVerificationStart && this.props.partnerVerificationSuccess && this.props.partnerVerificationSuccess !== prevProps.partnerVerificationSuccess && this.state.loader) {
      if (this.props.partnerVerificationSuccess['success']) {
        this.setState({ loader: false, update: true });
      }else{
        this.setState({ loader: false, error: true });
      }
    }

    if (this.props.partnerVerificationError && !prevProps.partnerVerificationError) {
      this.setState({ loader: false, error: true });
    }
  }

	componentDidMount(){
		if (this.props.resolution === 1) {
      const link = setUpLinkBasic(window.location.href);
      const data = {id: this.props.page, options:{"verified": true}, language: this.props.lang };
      this.props.verifyPartner('_id', data, link);
    }else{
      this.setState({ loader: false });
    }
		this.props.setUserLanguage(this.props.lang);
	}
	
  render() {
    return(

    	<div className="totalWrapper">
        <Loader  show={ this.state.loader } />
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
    		<Container>
    			{
    				this.props.type === 'partner' 
    				? 
    				(
              (this.props.resolution === 1 && !this.state.update && !this.state.error)
              ?
              (
                <div className="confirmRegistration">
                  <Row>
                    <Col xs='12'>
                      <h2 className="middle">{this.state.dictionary['emailVerificationPartnerVerificTitle']}</h2>
                      <p className="middle">{this.state.dictionary['emailValidationPartnerVerificArticle']}</p>
                    </Col>
                  </Row>
                </div>
              )
              :
              ((this.props.resolution === 2 || this.state.update) && !this.state.error )
              ?
              (
                <div className="confirmRegistration">
                  <Row>
                    <Col xs='12'>
                      <h2 className="middle">{this.state.dictionary['emailVerificationPartnerPassTitle']}</h2>
                      <p className="middle">{this.state.dictionary['emailValidationPartnerPassArticle']}</p>
                      <div className="middle">
                        <Button color="success" href={`/password?language=${this.props.lang}&page=${this.props.page}&type=${this.props.type}`}>{this.state.dictionary['emailVerificationPartnerPassButton']}</Button>
                      </div>
                    </Col>
                  </Row>
                </div>
              )
              :
              (this.props.resolution === 3 && !this.state.error)
              ?
              (
                <div className="confirmRegistration">
                  <Row>
                    <Col xs='12'>
                      <h2 className="middle">{this.state.dictionary['emailVerificationPartnerLogTitle']}</h2>
                      <p className="middle">{this.state.dictionary['emailValidationPartnerLogArticle']}</p>
                      <div className="middle">
                        <Button color="success" href={`/partnershipLogin?language=${this.props.lang}&page=login`}>{this.state.dictionary['emailVerificationPartnerLogButton']}</Button>
                      </div>
                    </Col>
                  </Row>
                </div>
              )
              :
              (this.props.resolution === 4 || this.state.error)
              ?
              (
                <div className="confirmRegistration">
                  <Row>
                    <Col xs='12'>
                      <h2 className="middle">{this.state.dictionary['emailVerificationPartnerErrorTitle']}</h2>
                      <p className="middle">{this.state.dictionary['emailValidationPartnerErrorArticle']}</p>
                      <div className="middle">
                        <Button color="success">{this.state.dictionary['emailVerificationPartnerErrorButton']}</Button>
                      </div>
                    </Col>
                  </Row>
                </div>
              )
              :
              null
    					
    				) : null
    			}
            
          {
    				this.props.type === 'user' 
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
    		/>

    	</div>
    	
    ) 
  }
}

const mapStateToProps = (state) => ({
  userLanguage: state.UserReducer.language,

  partnerVerificationStart: state.PartnerReducer.partnerVerificationStart,
  partnerVerificationError: state.PartnerReducer.partnerVerificationError,
  partnerVerificationSuccess: state.PartnerReducer.partnerVerificationSuccess,
});


const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setUserLanguage,
    verifyPartner,
  },
  dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(EmailVerificationView)