import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import queryString  from 'query-string';
import { Container, Row, Col, Button } from 'reactstrap';
import Select from 'react-select';
import hr from 'date-fns/locale/hr';
import enUS from 'date-fns/locale/en-US';
import DatePicker, { registerLocale } from 'react-datepicker';
import { setUserLanguage } from '../actions/user-actions';
import { getLanguage } from '../lib/language';
import { isMobile } from '../lib/helpers/generalFunctions';
import NavigationBar from '../components/navigation/navbar';
import PlainInput from '../components/form/input';
import Footer from '../components/navigation/footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-datepicker/dist/react-datepicker.css";
import '../style/style.scss';

interface MyProps {
  // using `interface` is also ok
  userLanguage: string;
  setUserDevice(userAgent: string): boolean;
  setUserLanguage(language: string): string;
  userAgent: string;
  lang: string;
  path: string;
};
interface MyState {
	language: string;
	dictionary: object;
	isMobile: boolean;
  date: Date;
  locale: string;
};

class HomeView extends React.Component <MyProps, MyState>{

  constructor(props){
    super(props);

    this.dateChange = this.dateChange.bind(this);
    this.localize = this.localize.bind(this);
  }

	state: MyState = {
      language: this.props.lang.toUpperCase(),
      dictionary: getLanguage(this.props.lang),
      isMobile: isMobile(this.props.userAgent),
       date: new Date(),
      locale: 'hr',

    };

  localize(){
    if (this.props.lang === 'en') {
      registerLocale('en-us', enUS);
      this.setState({locale: 'en-us'})
    }else{
      registerLocale('hr', hr);
      this.setState({locale: 'hr'})
    }
  }

	componentDidMount(){
		this.props.setUserLanguage(this.props.lang);
    this.localize();
	}

  dateChange = date => {
    this.setState({ date });
  };
	
  render() {
    const options = [
      { value: 'chocolate', label: 'Chocolate' },
      { value: 'strawberry', label: 'Strawberry' },
      { value: 'vanilla', label: 'Vanilla' }
    ];

    return(
    	<div className="totalWrapper">
    		<NavigationBar 
    			isMobile={ this.state.isMobile } 
    			language={ this.state.language } 
    			page={ this.props.path ? this.props.path : '' }
    			contact={ this.state.dictionary['navigationContact'] }
    			login={ this.state.dictionary['navigationLogin'] }
    			search={ this.state.dictionary['navigationSearch'] }
    			partnership={ this.state.dictionary['navigationPartnership'] }
    			faq={ this.state.dictionary['navigationFaq'] }
    		/>
        <div className="homescreen colorWhite">
          <Container>
            <Row>
                <Col xs='12' sm="6">
                  <div className="homeSearchWrapper">
                      <div className="box">
                        <h2>{ this.state.dictionary['homeTitle'] }</h2>
                        <form>
                          <Select options={options} instanceId="homeCity" className="homeInput" placeholder={ this.state.dictionary['uniCity'] }/>
                          <Select options={options} instanceId="homeDistrict" className="homeInput" placeholder={ this.state.dictionary['uniDistrict'] } />
                          <DatePicker 
                            selected={ this.state.date } 
                            onChange={date => this.dateChange(date)} 
                            className="homeInput" 
                            locale={ this.state.locale }
                            minDate={new Date()}
                            />
                        </form>
                        <Button color="success">{ this.state.dictionary['uniSearch'] }</Button>
                      </div>
                  </div>
                  <div className="homeHeading bottomPos hidden-xs">
                    <h3>{ this.state.dictionary['homeHeader_1'] }</h3>
                  </div>
                </Col>
                <Col sm="6" className="hidden-xs">
                  <img src="/static/home_1.jpg" alt={ this.state.dictionary['homeImg_1'] } ></img>
                </Col>
              </Row>

          </Container>
        </div>

        <div >
          <Container>
            <Row>
                <Col xs="12">
                  <div className="homeHeading hidden-sm">
                    <h3>{ this.state.dictionary['homeHeader_1'] }</h3>
                  </div>
                </Col>
              </Row>

          </Container>
        </div>

        <div className="colorGrey">
          <Container>
            <Row>
                <Col xs="12">
                  <div className="homeStripe">
                    <p> { this.state.dictionary['homeWhatDescribe'] }</p>
                  </div>
                  
                </Col>
              </Row>

          </Container>
        </div>

        <div className="colorWhite">
          <Container>
            <Row>
                <Col xs="12" sm="6" className="homeWhatImage">
                  <div className="homeWhatImageInsert hidden-sm">
                    <h4>{ this.state.dictionary['homeWhatBenTitle'] }</h4>
                    <p>{ this.state.dictionary['homeWhatBenMini'] }</p>
                  </div>
                  <img src="/static/home_2.jpg" alt={ this.state.dictionary['homeImg_2'] } ></img>
                </Col>

                <Col xs="12" sm="6" className="hidden-xs">
                  <div className="homeWhat">
                    <h4>{ this.state.dictionary['homeWhatBenTitle'] }</h4>
                    <p>{ this.state.dictionary['homeWhatBen'] }</p>
                  </div>
                </Col>

              </Row>

          </Container>
        </div>

        <div className="colorWhite">
          <Container>
            <Row>
                <Col xs="12">
                  <div className="homeHeading">
                    <h3>{ this.state.dictionary['homeHeader_2'] }</h3>
                  </div>
                </Col>
              </Row>

          </Container>
        </div>

        <div className="colorWhite">
          <Container>
            <Row>
                <Col xs="12" sm="6">
                  <Container>
                    <Row>
                      <Col xs="12" className="homeWhatItem">
                        <div className="photo num_1"></div>
                        <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.</p>
                      </Col>
                    </Row>
                  </Container>
                </Col>

                 <Col xs="12" sm="6">
                  <Container>
                    <Row>
                      <Col xs="12" className="homeWhatItem">
                        <div className="photo num_2"></div>
                        <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.</p>
                      </Col>
                    </Row>
                  </Container>
                </Col>
                
              </Row>

          </Container>
        </div>

        <div className="colorWhite">
          <Container>
            <Row>
                <Col xs="12">
                  <div className="homeHeading">
                    <h3>{ this.state.dictionary['homeHeader_3'] }</h3>
                  </div>
                </Col>
              </Row>

          </Container>
        </div>

         <div className="colorWhite bigPadDown">
          <Container>
            <Row>
                <Col xs="12" sm="4">
                  <Container>
                    <Row>
                      <Col xs="12" className="homeWhatItem colorGrey">
                        <div className="face">
                          <img src="/static/testemonial_photo_1.png" alt={ this.state.dictionary['homeImg_2'] } ></img>
                        </div>
                        <p>There are many variations of passages of Lorem Ipsuma available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.</p>
                        <div className="signature">
                          <p>Petar Živković</p>
                        </div>
                      </Col>
                    </Row>
                  </Container>
                </Col>

                 <Col xs="12" sm="4">
                  <Container>
                    <Row>
                      <Col xs="12" className="homeWhatItem colorGrey">
                        <div className="face">
                          <img src="/static/testemonial_photo_1.png" alt={ this.state.dictionary['homeImg_2'] } ></img>
                        </div>
                        <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.</p>
                        <div className="signature">
                          <p>Petar Živković</p>
                        </div>
                      </Col>
                    </Row>
                  </Container>
                </Col>

                 <Col xs="12" sm="4">
                  <Container>
                    <Row>
                      <Col xs="12" className="homeWhatItem colorGrey">
                        <div className="face">
                          <img src="/static/testemonial_photo_1.png" alt={ this.state.dictionary['homeImg_2'] } ></img>
                        </div>
                        <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.</p>
                        <div className="signature">
                          <p>Petar Živković</p>
                        </div>
                      </Col>
                    </Row>
                  </Container>
                </Col>
                
              </Row>

          </Container>
        </div>

       <div className="homePartner">
          <Container>
            <Row>
              <Col xs="12">
                <h4>Imate igraonicu?</h4>
                <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. Vidi se promena</p>
                <Button color="success">Saznajte više</Button>
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

export default connect(mapStateToProps, matchDispatchToProps)(HomeView)