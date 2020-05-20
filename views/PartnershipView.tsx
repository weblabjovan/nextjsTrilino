import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import queryString  from 'query-string';
import { Container, Row, Col, Button } from 'reactstrap';
import { setUserLanguage } from '../actions/user-actions';
import { getLanguage } from '../lib/language';
import { isMobile, errorExecute } from '../lib/helpers/generalFunctions';
import NavigationBar from '../components/navigation/navbar';
import Footer from '../components/navigation/footer';

interface MyProps {
  // using `interface` is also ok
  userLanguage: string;
  globalError: boolean;
  setUserDevice(userAgent: string): boolean;
  setUserLanguage(language: string): string;
  userAgent: string;
  path: string;
  fullPath: string;
  lang: string;
  userIsLogged: boolean;
};
interface MyState {
	language: string;
	dictionary: object;
	isMobile: boolean;
};

class PartnershipView extends React.Component <MyProps, MyState>{

	state: MyState = {
      language: this.props.lang.toUpperCase(),
      dictionary: getLanguage(this.props.lang),
      isMobile: isMobile(this.props.userAgent),
    };

	componentDidMount(){
		this.props.setUserLanguage(this.props.lang);
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
          user={ this.props.userIsLogged }
          userProfile={ this.state.dictionary['navigationProfile'] }
    		/>

		    <div className="partnershipHead">
          <Container>
            <Row>
              <Col xs="12">
                <h1>{ this.state.dictionary['partnershipTitle'] }</h1>
              </Col>
                
            </Row>

          </Container>
        </div>

        <div className="partnershipRegularWhite">
          <Container>
            <Row>
              <Col xs="12">
                <h3>{ this.state.dictionary['partnershipTitle_1'] }</h3>
                <p> { this.state.dictionary['partnershipDescription_1'] }</p>
              </Col>
                
            </Row>

          </Container>
        </div>

        <div className="colorGrey">
          <Container>
            <Row>
                <Col xs="12">
                  <div className="partnershipStripe">
                    <h2>{ this.state.dictionary['partnershipStripe_1'] }</h2>
                    <Button color="success" href={`/login?page=partner&stage=register&language=${this.props.lang}`}>{this.state.dictionary['uniRegister']}</Button>
                  </div>
                  
                </Col>
              </Row>

          </Container>
        </div>


         <div className="partnerThree">
          <Container>
            <Row>
                <Col xs="12" sm="6" lg="4">
                  <Container>
                    <Row>
                      <Col xs="12" className="partnerWhatItem">
                        <div className="face">
                          <span className="icon sale"></span>
                        </div>
                        <h4>{ this.state.dictionary['partnershipSubTitle_1'] }</h4>
                        <p>{ this.state.dictionary['partnershipSubDescription_1'] }</p>
                        
                      </Col>
                    </Row>
                  </Container>
                </Col>

                 <Col xs="12" sm="6" lg="4">
                  <Container>
                    <Row>
                      <Col xs="12" className="partnerWhatItem">
                        <div className="face">
                          <span className="icon internet"></span>
                        </div>
                        <h4>{ this.state.dictionary['partnershipSubTitle_2'] }</h4>
                        <p>{ this.state.dictionary['partnershipSubDescription_2'] }</p>
                      </Col>
                    </Row>
                  </Container>
                </Col>

                 <Col xs="12" sm="6" lg="4">
                  <Container>
                    <Row>
                      <Col xs="12" className="partnerWhatItem">
                        <div className="face">
                          <span className="icon proces"></span>
                        </div>
                        <h4>{ this.state.dictionary['partnershipSubTitle_3'] }</h4>
                        <p>{ this.state.dictionary['partnershipSubDescription_3'] }</p>
                        
                      </Col>
                    </Row>
                  </Container>
                </Col>
                
              </Row>

          </Container>
        </div>


        <div className="partnerThree colorGrey">
          <Container>
            <Row>
                <Col xs="12" sm="6" lg="6">
                  <Container>
                    <Row>
                      <Col xs="12" className="partnerWhatItem no-margin">
                        <div className="screen">
                          <img src="/static/ipad.png" alt={ this.state.dictionary['homeImg_2'] } ></img>
                        </div>
                      </Col>
                    </Row>
                  </Container>
                </Col>

                 <Col xs="12" sm="6" lg="6">
                  <Container>
                    <Row>
                      <Col xs="12" className="partnerWhatItem no-margin">
                        <h5>{this.state.dictionary['partnershipTitle_2']}</h5>
                      </Col>
                    </Row>
                  </Container>
                </Col>
                
              </Row>

          </Container>
        </div>


        <div className="partnerThree">
          <Container>
            <Row>
              <Col xs="12">
                <div className="headline">
                  <h2>{this.state.dictionary['partnershipStripe_2']}</h2>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs="12" sm="6" lg="4">
                <Container>
                  <Row>
                    <Col xs="12" className="partnerWhatItem">
                      
                      <div className="double">
                        <div className="iconHolder">
                          <span className="icon registration"></span>
                        </div>
                        <h4>{this.state.dictionary['partnershipStepsTitle_1']}</h4>
                       </div>
                      <p>{this.state.dictionary['partnershipStepsDescription_1']}</p>
                      
                    </Col>
                  </Row>
                </Container>
              </Col>

               <Col xs="12" sm="6" lg="4">
                <Container>
                  <Row>
                    <Col xs="12" className="partnerWhatItem">
                      <div className="double">
                        <div className="iconHolder">
                          <span className="icon photo"></span>
                        </div>
                        <h4>{this.state.dictionary['partnershipStepsTitle_2']}</h4>
                       </div>
                      <p>{this.state.dictionary['partnershipStepsDescription_2']}</p>
                    </Col>
                  </Row>
                </Container>
              </Col>

               <Col xs="12" sm="6" lg="4">
                <Container>
                  <Row>
                    <Col xs="12" className="partnerWhatItem">
                      <div className="double">
                        <div className="iconHolder">
                          <span className="icon activation"></span>
                        </div>
                        <h4>{this.state.dictionary['partnershipStepsTitle_3']}</h4>
                      </div>
                      <p>{this.state.dictionary['partnershipStepsDescription_3']}</p>
                      
                    </Col>
                  </Row>
                </Container>
              </Col>
              
            </Row>

          </Container>
        </div>

         <div className="colorBrand">
          <Container>
            <Row>
                <Col xs="12">
                  <div className="partnershipStripe">
                    <h2 className="white">{this.state.dictionary['partnershipStripe_3']}</h2>
                    <a href={`/login?page=partner&stage=register&language=${this.props.lang}`} className="white link">{this.state.dictionary['uniRegister']}</a>
                  </div>
                  
                </Col>
              </Row>

          </Container>
        </div>


        <div className="partnershipRegularWhite">
          <Container>
            <Row>
              <Col xs="12">
                <h3>{this.state.dictionary['partnershipContactTitle']}</h3>
                <p>{this.state.dictionary['partnershipContactDescription']}<span className="colorLink">admin@trilino.com</span> </p>
              </Col>
                
            </Row>

          </Container>
        </div>


        <div className="colorGrey">
          <Container>
            <Row>
                <Col xs="12">
                  <div className="partnershipStripe">
                    <h2>{this.state.dictionary['partnershipPartner']}</h2>
                    <Button color="success" href={`/login?page=partner&stage=login&language=${this.props.lang}`}>{this.state.dictionary['uniLogin']}</Button>
                  </div>
                  
                </Col>
              </Row>

          </Container>
        </div>
        
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

export default connect(mapStateToProps, matchDispatchToProps)(PartnershipView)