import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col, Button } from 'reactstrap';
import YouTube from 'react-youtube';
import Select from 'react-select';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { datePickerLang } from '../lib/language/dateLanguage';
import { setUserLanguage } from '../actions/user-actions';
import { getLanguage } from '../lib/language';
import { isMobile } from '../lib/helpers/generalFunctions';
import NavigationBar from '../components/navigation/navbar';
import PlainInput from '../components/form/input';
import Footer from '../components/navigation/footer';
import 'react-day-picker/lib/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
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

    };

	componentDidMount(){
		this.props.setUserLanguage(this.props.lang);
	}

  formatDate(date, format, locale) {
    if (this.props.lang === 'en') {
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    }
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  }

  dateChange = date => {
    this.setState({ date });
  };

   _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }
	
  render() {
    const options = [
      { value: 'chocolate', label: 'Chocolate' },
      { value: 'strawberry', label: 'Strawberry' },
      { value: 'vanilla', label: 'Vanilla' }
    ];

    const opts = {
      height: this.state.isMobile ? '320' : '690',
      width: '100%',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1
      }
    };

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
                <Col xs='12' sm="12" lg="6">
                  <div className="homeSearchWrapper">
                      <div className="box">
                        <h2>{ this.state.dictionary['homeTitle'] }</h2>
                        <form>
                          <Select options={options} instanceId="homeCity" className="homeInput" placeholder={ this.state.dictionary['uniCity'] }/>
                          <Select options={options} instanceId="homeDistrict" className="homeInput" placeholder={ this.state.dictionary['uniDistrict'] } />
                          <DayPickerInput 
                            value={ this.state.date }
                            formatDate={ this.formatDate }
                            placeholder="Izaberite datum"
                            onDayChange= { this.dateChange }
                            format="dd/mm/yyyy"
                            hideOnDayClick={ true }
                            keepFocus={ false }
                            dayPickerProps={{
                              todayButton: datePickerLang[this.props.lang]['today'],
                              selectedDays: [ this.state.date ],
                              weekdaysShort: datePickerLang[this.props.lang]['daysShort'],
                              months: datePickerLang[this.props.lang]['months']
                            }}
                           />
                        </form>
                        <Button color="success">{ this.state.dictionary['uniSearch'] }</Button>
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

        <div className="">
          <Container>
            <Row>
                <Col xs="12" sm="6" className="homeWhatImage">
                  <div className="homeWhatImageInsert hidden-xs-up">
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
                  <Container fluid>
                    <Row>
                      <Col xs="12" className="homeWhatLine">
                        <div className="item">
                          <div className="photo">
                            <img src="/static/clock.png" alt={ this.state.dictionary['homeImg_3'] } ></img>
                          </div>
                          <div className="text">
                            <p>Naš sistem vam štedi vreme i omogućuje da organizujete dečiji rođendan za svega nekoliko minuta.</p>
                          </div>
                          <div style={{'clear': 'both'}}></div>
                        </div>

                        <div className="item">
                          <div className="photo">
                            <img src="/static/color-wheel.png" alt={ this.state.dictionary['homeImg_3'] } ></img>
                          </div>
                          <div className="text">
                            <p>U našoj raznovrsnoj ponudi sigurno ćete pronaći ono što je najbolje za vas i vaše dete.</p>
                          </div>
                          <div style={{'clear': 'both'}}></div>
                        </div>
                        
                        <div className="item">
                          <div className="photo">
                            <img src="/static/savings.png" alt={ this.state.dictionary['homeImg_3'] } ></img>
                          </div>
                          <div className="text">
                            <p>Naš sistem i usluga koju nudimo je za vas u potpunosti besplatna.</p>
                          </div>
                          <div style={{'clear': 'both'}}></div>
                        </div>
                      </Col>
                    </Row>
                  </Container>
                </Col>

                 <Col xs="12" sm="6">
                  <Container fluid >
                    <Row>
                      <Col xs="12" className="homeWhatLine">
                        <div className="item">
                          <div className="photo">
                            <img src="/static/button.png" alt={ this.state.dictionary['homeImg_3'] } ></img>
                          </div>
                          <div className="text">
                            <p>Trudimo se da proces ogranizacije dečijih rodjendana učinimo jednostavnim.</p>
                          </div>
                          <div style={{'clear': 'both'}}></div>
                        </div>

                        <div className="item">
                          <div className="photo">
                            <img src="/static/brochure.png" alt={ this.state.dictionary['homeImg_3'] } ></img>
                          </div>
                          <div className="text">
                            <p>Pružamo vam sve informacije koje su vam neophodne da donesete kvalitetnu odluku.</p>
                          </div>
                          <div style={{'clear': 'both'}}></div>
                        </div>

                        <div className="item">
                          <div className="photo">
                            <img src="/static/positive-comment.png" alt={ this.state.dictionary['homeImg_3'] } ></img>
                          </div>
                          <div className="text">
                            <p>Dajemo vam mogućnost da ocenite vaše iskustvo i saznate iskustva drugih.</p>
                          </div>
                          <div style={{'clear': 'both'}}></div>
                        </div>
                      </Col>
                    </Row>
                  </Container>
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

        <div >
          <Container>
            <Row>
                <Col xs="12">
                  <div className="homeInfographicWrapper hidden-xs">
                    <img src="/static/infographic.png" alt={ this.state.dictionary['homeImg_3'] } ></img>
                  </div>
                  <div className="homeInfographicWrapper hidden-xs-up">
                    <img src="/static/infographicsMob.png" alt={ this.state.dictionary['homeImg_3'] } ></img>
                  </div>
                </Col>
              </Row>

          </Container>
        </div>

        <div >
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
        </div>
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
            <Row>
                <Col xs="12" sm="6" lg="4">
                  <Container>
                    <Row>
                      <Col xs="12" className="homeWhatItem colorGrey">
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
                      <Col xs="12" className="homeWhatItem colorGrey">
                        <div className="face">
                          <img src="/static/testemonial_photo_1.png" alt={ this.state.dictionary['homeImg_2'] } ></img>
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
                      <Col xs="12" className="homeWhatItem colorGrey">
                        <div className="face">
                          <img src="/static/testemonial_photo_1.png" alt={ this.state.dictionary['homeImg_2'] } ></img>
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
                <Button color="success">{ this.state.dictionary['uniMore'] }</Button>
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