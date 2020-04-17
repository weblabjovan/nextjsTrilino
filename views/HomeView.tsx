import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col, Button } from 'reactstrap';
import YouTube from 'react-youtube';
import Loader from '../components/loader';
import Select from 'react-select';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { datePickerLang } from '../lib/language/dateLanguage';
import { setUserLanguage } from '../actions/user-actions';
import { getLanguage } from '../lib/language';
import { isMobile, setUpLinkBasic, errorExecute } from '../lib/helpers/generalFunctions';
import { addDaysToDate } from '../lib/helpers/specificPartnerFunctions';
import genOptions from '../lib/constants/generalOptions';
import NavigationBar from '../components/navigation/navbar';
import Footer from '../components/navigation/footer';
import 'react-day-picker/lib/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';


interface MyProps {
  // using `interface` is also ok
  userLanguage: string;
  globalError: boolean;
  setUserDevice(userAgent: string): boolean;
  setUserLanguage(language: string): string;
  userAgent: string;
  lang: string;
  fullPath: string;
  path: string;
  error: boolean;
  router: any;
  userIsLogged: boolean;
};

interface MyState {
	language: string;
	dictionary: object;
	isMobile: boolean;
  date: Date;
  city: null | object;
  district: null | object;
  loader: boolean;
};

class HomeView extends React.Component <MyProps, MyState>{

  constructor(props){
    super(props);

    this.dateChange = this.dateChange.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this._onReady = this._onReady.bind(this);
  }

	state: MyState = {
      language: this.props.lang.toUpperCase(),
      dictionary: getLanguage(this.props.lang),
      isMobile: isMobile(this.props.userAgent),
      date: new Date(),
      city: null,
      district: null,
      loader: false,

    };

  componentDidUpdate(prevProps: MyProps, prevState:  MyState){ 
    errorExecute(window, this.props.globalError);
  }

	componentDidMount(){
		this.props.setUserLanguage(this.props.lang);
	}

  formatDate(date, format, locale) {
    if (this.props.lang === 'en') {
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    }
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  }

  handleInputChange(field, value){
     this.setState(prevState => ({
      ...prevState,
      [field]: value // No error here, but can't ensure that key is in StateKeys
    }));
  }

  handleSearch(){
    this.setState({ loader: true }, () => {
      const link = setUpLinkBasic(window.location.href);
      const date = `${this.state.date.getDate()}-${this.state.date.getMonth() + 1}-${this.state.date.getFullYear()}`;
      const url = `${link['protocol']}${link['host']}/search?language=${this.props.lang}&city=${this.state.city ? this.state.city['value'] : null }&district=${this.state.district ? this.state.district['value'] : null }&date=${date}`;
      window.location.href =  url;
    })
  }

  dateChange = date => {
    this.setState({ date });
  }

   _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }
	
  render() {

    const opts = {
      height: this.state.isMobile ? '320' : '690',
      width: '100%',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1
      }
    };

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
          terms={ this.state.dictionary['navigationTerms'] }
          user={ this.props.userIsLogged }
          userProfile={ this.state.dictionary['navigationProfile'] }
    		/>
        <div className="homescreen colorWhite">
          <Container>
            <Row>
                <Col xs='12' sm="12" lg="6">
                  <div className="homeSearchWrapper">
                      <div className="box">
                        <h2>{ this.state.dictionary['homeTitle'] }</h2>
                        <form>
                          <Select 
                            options={genOptions['cities']} 
                            instanceId="homeCity" 
                            value={ this.state.city }
                            onChange={ (val) => this.handleInputChange('city', val)}
                            className="homeInput" 
                            placeholder={ this.state.dictionary['uniCity'] }/>
                          <Select 
                            options={genOptions['quarter'][this.state.city ? this.state.city['value'].toString() : 0]} 
                            instanceId="homeDistrict" 
                            value={ this.state.district }
                            onChange={ (val) => this.handleInputChange('district', val)}
                            className="homeInput" 
                            placeholder={ this.state.dictionary['uniDistrict'] } />
                          <DayPickerInput 
                            value={ this.state.date }
                            formatDate={ this.formatDate }
                            placeholder="Izaberite datum"
                            onDayChange= { this.dateChange }
                            format="dd/mm/yyyy"
                            hideOnDayClick={ true }
                            keepFocus={ false }
                            dayPickerProps={{
                              disabledDays: {
                                  before: new Date(),
                                  after: addDaysToDate(null, 180),
                              },
                              todayButton: datePickerLang[this.props.lang]['today'],
                              selectedDays: [ this.state.date ],
                              weekdaysShort: datePickerLang[this.props.lang]['daysShort'],
                              months: datePickerLang[this.props.lang]['months']
                            }}
                           />
                        </form>
                        <Button color="success" onClick={() => this.handleSearch() }>{ this.state.dictionary['uniSearch'] }</Button>
                      </div>
                  </div>
                  <div className="homeHeading bottomPos hidden-xs">
                    <h3>{ this.state.dictionary['homeHeader_1'] }</h3>
                  </div>
                </Col>
                <Col lg="6" className="hidden-sm">
                  <img src="/static/home_1.jpg" alt={ this.state.dictionary['homeImg_1'] } ></img>
                </Col>
              </Row>

          </Container>
        </div>

        <div >
          <Container>
            <Row>
                <Col xs="12">
                  <div className="homeHeading hidden-xs-up">
                    <h3>{ this.state.dictionary['homeHeader_1'] }</h3>
                  </div>
                </Col>
              </Row>

          </Container>
        </div>

        <div className="colorWhoo">
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

        <div className="">
          <Container>
            <Row>
                <Col xs="12" sm="5" className="homeWhatImage">
                  <div className="homeWhatImageInsert hidden-xs-up">
                    <h4>{ this.state.dictionary['homeWhatBenTitle'] }</h4>
                    <p>{ this.state.dictionary['homeWhatBenMini'] }</p>
                  </div>
                  <img src="/static/woman_phone_1.png" alt={ this.state.dictionary['homeImg_2'] } ></img>
                </Col>

                <Col xs="12" sm="7" className="hidden-xs">
                  <div className="homeWhat">
                    <h4>{ this.state.dictionary['homeWhatBenTitle'] }</h4>
                    <p>{ this.state.dictionary['homeWhatBen'] }</p>
                  </div>
                </Col>

              </Row>

          </Container>
        </div>

        <div className="">
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

        <div>
          <Container>
            <Row>
              <Col xs="12" sm="6">
                <Row className="homeWhatNewLine">
                  <Col xs="12" lg="3"><div className="photo" style={{'background': 'url(static/watch.png) center / cover no-repeat'}}></div></Col>
                  <Col xs="12" lg="9"><p>{ this.state.dictionary['homeWhy1'] }</p></Col>
                  <hr></hr>
                </Row>
              </Col>

               <Col xs="12" sm="6">
                <Row className="homeWhatNewLine">
                  <Col xs="12" lg="3"><div className="photo" style={{'background': 'url(static/toys.png) center / cover no-repeat'}}></div></Col>
                  <Col xs="12" lg="9"><p>{ this.state.dictionary['homeWhy2'] }</p></Col>
                </Row>
              </Col>
            </Row>

            <Row>
              <Col xs="12" sm="6">
                <Row className="homeWhatNewLine">
                  <Col xs="12" lg="3"><div className="photo" style={{'background': 'url(static/gift.png) center / cover no-repeat'}}></div></Col>
                  <Col xs="12" lg="9"><p>{ this.state.dictionary['homeWhy3'] }</p></Col>
                </Row>
              </Col>

               <Col xs="12" sm="6">
                <Row className="homeWhatNewLine">
                  <Col xs="12" lg="3"><div className="photo" style={{'background': 'url(static/simple.png) center / cover no-repeat'}}></div></Col>
                  <Col xs="12" lg="9"><p>{ this.state.dictionary['homeWhy4'] }</p></Col>
                </Row>
              </Col>
            </Row>

            <Row>
              <Col xs="12" sm="6">
                <Row className="homeWhatNewLine">
                  <Col xs="12" lg="3"><div className="photo" style={{'background': 'url(static/paper.png) center / cover no-repeat'}}></div></Col>
                  <Col xs="12" lg="9"><p>{ this.state.dictionary['homeWhy5'] }</p></Col>
                </Row>
              </Col>

               <Col xs="12" sm="6">
                <Row className="homeWhatNewLine">
                  <Col xs="12" lg="3"><div className="photo" style={{'background': 'url(static/smile.png) center / cover no-repeat'}}></div></Col>
                  <Col xs="12" lg="9"><p>{ this.state.dictionary['homeWhy6'] }</p></Col>
                </Row>
              </Col>
            </Row>

          </Container>
        </div>

        <div >
          <Container>
            <Row>
                <Col xs="12">
                  <div className="homeHeading">
                    <h3>{ this.state.dictionary['homeHeader_5'] }</h3>
                  </div>
                </Col>
              </Row>

          </Container>
        </div>

         <div style={{'backgroundImage': 'radial-gradient(circle, #325390, #3c62a9, #4672c3, #5082dd, #5b92f8)' }}>
          <Container>
            <Row className="processWrapper">
                <Col xs="12">
                  <div className="item">
                    <h4>{this.state.dictionary['homeProcessTitle_1']}</h4>
                    <p>{this.state.dictionary['homeProcessText_1']}</p>
                  </div>
                  <div className="iconHolder">
                    <span className="icon down"></span>
                  </div>

                  <div className="item">
                    <h4>{this.state.dictionary['homeProcessTitle_2']}</h4>
                    <p>{this.state.dictionary['homeProcessText_2']}</p>
                  </div>
                  <div className="iconHolder">
                    <span className="icon down"></span>
                  </div>

                  <div className="item">
                    <h4>{this.state.dictionary['homeProcessTitle_3']}</h4>
                    <p>{this.state.dictionary['homeProcessText_3']}</p>
                  </div>
                  <div className="iconHolder">
                    <span className="icon down"></span>
                  </div>

                  <div className="item">
                    <h4>{this.state.dictionary['homeProcessTitle_4']}</h4>
                    <p>{this.state.dictionary['homeProcessText_4']}</p>
                  </div>
                </Col>
              </Row>

          </Container>
        </div>

        {/*<div >
          <Container>
            <Row>
                <Col xs="12">
                  <div className="homeInfographicWrapper">
                    <YouTube
                      videoId="Mu0yftdkJvM"
                      opts={opts}
                      onReady={this._onReady}
                    />
                  </div>
                </Col>
              </Row>

          </Container>
        </div>*/}
        <div >
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

         <div className=" bigPadDown">
          <Container>
            <Row className="justify-content-sm-center">
                <Col xs="12" sm="6" lg="4">
                  <Container>
                    <Row>
                      <Col xs="12" className="homeWhatItem">
                        <div className="face">
                          <img src="/static/testemonial_photo_1.png" alt={ this.state.dictionary['homeImg_2'] } ></img>
                        </div>
                        <p>{ this.state.dictionary['homeComment_1'] }</p>
                        <div className="signature">
                          <p>{ this.state.dictionary['homeCommentName_1'] }</p>
                        </div>
                      </Col>
                    </Row>
                  </Container>
                </Col>

                 <Col xs="12" sm="6" lg="4">
                  <Container>
                    <Row>
                      <Col xs="12" className="homeWhatItem">
                        <div className="face">
                          <img src="/static/testemonial_photo_2.png" alt={ this.state.dictionary['homeImg_2'] } ></img>
                        </div>
                        <p>{ this.state.dictionary['homeComment_2'] }</p>
                        <div className="signature">
                          <p>{ this.state.dictionary['homeCommentName_2'] }</p>
                        </div>
                      </Col>
                    </Row>
                  </Container>
                </Col>

                 <Col xs="12" sm="6" lg="4">
                  <Container>
                    <Row>
                      <Col xs="12" className="homeWhatItem">
                        <div className="face">
                          <img src="/static/testemonial_photo_3.png" alt={ this.state.dictionary['homeImg_2'] } ></img>
                        </div>
                        <p>{ this.state.dictionary['homeComment_3'] }</p>
                        <div className="signature">
                          <p>{ this.state.dictionary['homeCommentName_3'] }</p>
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
                <h4>{ this.state.dictionary['homeHeader_4'] }</h4>
                <p>{ this.state.dictionary['homePartner'] }</p>
                <Button color="success" href={`/partnership?language=${this.props.lang}`} >{ this.state.dictionary['uniMore'] }</Button>
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

export default connect(mapStateToProps, matchDispatchToProps)(HomeView)