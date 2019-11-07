import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import queryString  from 'query-string';
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
  setUserDevice(userAgent: string): boolean;
  setUserLanguage(language: string): string;
  userAgent: string;
  path: string;
  fullPath: string;
  lang: string;
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
    		/>

		    <div className="partnershipHead">
          <Container>
            <Row>
              <Col xs="12">
                <h1>Organizujte veći broj proslava sa Trilinom</h1>
              </Col>
                
            </Row>

          </Container>
        </div>

        <div className="partnershipRegularWhite">
          <Container>
            <Row>
              <Col xs="12">
                <h3>Profesionalna podrška u razvijanju vašeg biznisa</h3>
                <p> It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing</p>
              </Col>
                
            </Row>

          </Container>
        </div>

        <div className="colorGrey">
          <Container>
            <Row>
                <Col xs="12">
                  <div className="partnershipStripe">
                    <h2> Želite da postanete deo Trilina?</h2>
                    <Button color="success" href={`/partnershipLogin?language=${this.props.lang}&page=register`}>registrujte se</Button>
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
                          <img src="/static/connectIcon.png" alt={ this.state.dictionary['homeImg_2'] } ></img>
                        </div>
                        <h4>Dodatni kanal prodaje</h4>
                        <p> It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing</p>
                        
                      </Col>
                    </Row>
                  </Container>
                </Col>

                 <Col xs="12" sm="6" lg="4">
                  <Container>
                    <Row>
                      <Col xs="12" className="partnerWhatItem">
                        <div className="face">
                          <img src="/static/connectIcon.png" alt={ this.state.dictionary['homeImg_2'] } ></img>
                        </div>
                        <h4>Vidljivost na internetu</h4>
                        <p> It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing</p>
                      </Col>
                    </Row>
                  </Container>
                </Col>

                 <Col xs="12" sm="6" lg="4">
                  <Container>
                    <Row>
                      <Col xs="12" className="partnerWhatItem">
                        <div className="face">
                          <img src="/static/connectIcon.png" alt={ this.state.dictionary['homeImg_2'] } ></img>
                        </div>
                        <h4>Optimizacija procesa</h4>
                        <p> It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing</p>
                        
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
                        <h5>Jedinstven sistem napravljen da odgovori na specifične zahteve vašeg biznisa</h5>
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
                  <h2>Pridružite nam se u samo 3 jednostavna koraka</h2>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs="12" sm="6" lg="4">
                <Container>
                  <Row>
                    <Col xs="12" className="partnerWhatItem">
                      
                      <div className="double">
                        <img src="/static/connectIcon.png" alt={ this.state.dictionary['homeImg_2'] } ></img>
                        <h4>Registracija</h4>
                       </div>
                      <p> It has survived not only five centuries, but also the leap into electronic</p>
                      
                    </Col>
                  </Row>
                </Container>
              </Col>

               <Col xs="12" sm="6" lg="4">
                <Container>
                  <Row>
                    <Col xs="12" className="partnerWhatItem">
                      <div className="double">
                        <img src="/static/connectIcon.png" alt={ this.state.dictionary['homeImg_2'] } ></img>
                        <h4>Multimedija</h4>
                       </div>
                      <p> It has survived not only five centuries, but also the leap into electronic</p>
                    </Col>
                  </Row>
                </Container>
              </Col>

               <Col xs="12" sm="6" lg="4">
                <Container>
                  <Row>
                    <Col xs="12" className="partnerWhatItem">
                      <div className="double">
                        <img src="/static/connectIcon.png" alt={ this.state.dictionary['homeImg_2'] } ></img>
                        <h4>Aktivacija</h4>
                      </div>
                      <p> It has survived not only five centuries, but also the leap into electronic</p>
                      
                    </Col>
                  </Row>
                </Container>
              </Col>
              
            </Row>

          </Container>
        </div>

         <div className="colorPurple">
          <Container>
            <Row>
                <Col xs="12">
                  <div className="partnershipStripe">
                    <h2 className="white">Napravite prvi korak</h2>
                    <a href={`/partnershipLogin?language=${this.props.lang}&page=register`} className="white link">registrujte se</a>
                  </div>
                  
                </Col>
              </Row>

          </Container>
        </div>


        <div className="partnershipRegularWhite">
          <Container>
            <Row>
              <Col xs="12">
                <h3>Potrebne su vam dodatne informacije?</h3>
                <p>Možemo vas detaljnije uputiti u Trilino funkcionalnosti ili odgovoriti na vaša pitanja. Pišite nam na <span className="colorLink">support@trilino.com</span> </p>
              </Col>
                
            </Row>

          </Container>
        </div>


        <div className="colorGrey">
          <Container>
            <Row>
                <Col xs="12">
                  <div className="partnershipStripe">
                    <h2>Ukoliko ste već Trilino partner</h2>
                    <Button color="success" href={`/partnershipLogin?language=${this.props.lang}&page=login`}>prijavite se</Button>
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

export default connect(mapStateToProps, matchDispatchToProps)(PartnershipView)