import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col, Button, Alert } from 'reactstrap';
import { getLanguage } from '../../lib/language';
import generalOptions from '../../lib/constants/generalOptions';
import { isFieldInObject, getGeneralOptionLabelByValue } from '../../lib/helpers/specificPartnerFunctions';
import { setUpLinkBasic } from '../../lib/helpers/generalFunctions';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style/style.scss';

interface MyProps {
  // using `interface` is also ok
  lang: string;
	partnerObject: null | object;
  partnerGeneral: object;
  closeLoader(): void;
};
interface MyState {
	dictionary: object;
};

class PreviewScreen extends React.Component <MyProps, MyState>{

	constructor(props){
    super(props);

    this.componentObjectBinding = this.componentObjectBinding.bind(this);

    const bindingFunctions = [];
    this.componentObjectBinding(bindingFunctions);
  }

  componentObjectBinding(array){
    array.map( item => {
      this[item] = this[item].bind(this);
    })
  }

	state: MyState = {
    dictionary: getLanguage(this.props.lang),
  };

  componentDidUpdate(prevProps: MyProps, prevState:  MyState){
    if (prevProps.lang !== this.props.lang) {
      let dictionary = getLanguage(this.props.lang);
      this.setState({ dictionary });
    }

    if (this.props.partnerObject && !prevProps.partnerObject) {
      this.props.closeLoader();
    }
  }

  componentDidMount(){
    
  }

	
  render() {
    return(
    	<div className="partnerProflePage preview">
        <Container fluid>
          <Row>
            <Col xs="12">
              <div className="pageHeader">
                <h2>{this.state.dictionary['partnerProfilePreviewTitle']}</h2>
                <p>{this.state.dictionary['partnerProfilePreviewDescription']}</p>
              </div>
            </Col>
          </Row>

          <Row>
            <Col xs="12" sm="6">
              <div className="mainPhoto" style={{'background': 'url(../../static/home_1.jpg) center no-repeat', 'backgroundSize':'cover'}}></div>
            </Col>
            <Col xs="12" sm="6" className="mobileHide">
              <Row>
                <Col xs="12" sm="4" className="smallColPadd">
                  <div className="supportPhoto"></div>
                </Col>
                <Col xs="12" sm="4" className="smallColPadd">
                  <div className="supportPhoto"></div>
                </Col>
                <Col xs="12" sm="4" className="smallColPadd">
                  <div className="supportPhoto"></div>
                </Col>
              </Row>

              <Row>
                <Col xs="4" className="smallColPadd">
                  <div className="supportPhoto"></div>
                </Col>
                <Col xs="4" className="smallColPadd">
                  <div className="supportPhoto"></div>
                </Col>
                <Col xs="4" className="smallColPadd">
                  <div className="supportPhoto"></div>
                </Col>
              </Row>

            </Col>
          </Row>

          <Row>
            <Col xs="12" sm="8">
              <div className="generalFirst">
                {
                  isFieldInObject(this.props.partnerObject, 'name')
                  ?
                  <h3>{this.props.partnerObject['general']['spaceType'] ? getGeneralOptionLabelByValue(generalOptions['spaceType_' + this.props.lang], this.props.partnerObject['general']['spaceType']) + ' ' + this.props.partnerObject['name'] : `${this.props.partnerObject['name']}`}</h3>
                  :
                  <h3 className="fadedPrev">{this.state.dictionary['partnerProfilePreviewNonName']}</h3>
                }

                {
                  isFieldInObject(this.props.partnerObject, 'address', 'general')
                  ?
                  <h5>{this.props.partnerObject['general']['address']}, {getGeneralOptionLabelByValue(generalOptions['cities'], this.props.partnerObject['city'])}</h5>
                  :
                  <h5 className="fadedPrev">{this.state.dictionary['partnerProfilePreviewNonAddress']}</h5>
                }

                {
                  isFieldInObject(this.props.partnerObject, 'description', 'general')
                  ?
                  <p>{this.props.partnerObject['general']['description']}</p>
                  :
                  <p className="fadedPrev">{this.state.dictionary['partnerProfilePreviewNonDescription']}</p>
                }

              </div>
              
            </Col>
            <Col xs="12" sm="4">
              <div className="generalSecond">
                <ul>
                  {
                    isFieldInObject(this.props.partnerObject, 'size', 'general')
                    ?
                    <li>{`${this.state.dictionary['partnerProfilePreviewSideSize']} ${this.props.partnerObject['general']['size']}m2`}</li>
                    :
                    <li className="fadedPrev">{this.state.dictionary['partnerProfilePreviewNonSize']}</li>
                  }

                  {
                    isFieldInObject(this.props.partnerObject, 'playSize', 'general')
                    ?
                    <li>{`${this.state.dictionary['partnerProfilePreviewSidePlaysize']} ${this.props.partnerObject['general']['playSize']}m2`}</li>
                    :
                    <li className="fadedPrev">{this.state.dictionary['partnerProfilePreviewNonPlaysize']}</li>
                  }

                  {
                    (isFieldInObject(this.props.partnerObject, 'ageFrom', 'general') && isFieldInObject(this.props.partnerObject, 'ageTo', 'general'))
                    ?
                    <li>{`${this.state.dictionary['partnerProfilePreviewSideAges']} ${this.props.partnerObject['general']['ageFrom']} - ${this.props.partnerObject['general']['ageTo']}`}</li>
                    :
                    <li className="fadedPrev">{this.state.dictionary['partnerProfilePreviewNonAges']}</li>
                  }
                </ul>
              </div>
            </Col>
          </Row>

          <Row>
            {
              isFieldInObject(this.props.partnerObject, 'parking', 'general')
              ?
              this.props.partnerObject['general']['parking'] === '1'
              ?
              (<Col xs="4" sm="2" lg="1" className="smallColPadd">
                <div className="iconHolder">
                  <span className="icon parking" />
                  <p>{this.state.dictionary['partnerProfilePreviewIconParking']}</p>
                </div>
              </Col>)
              :
              null
              :
              null
            }

            {
              isFieldInObject(this.props.partnerObject, 'yard', 'general')
              ?
              this.props.partnerObject['general']['yard'] === '1'
              ?
              (<Col xs="4" sm="2" lg="1" className="smallColPadd">
                <div className="iconHolder">
                  <span className="icon yard" />
                  <p>{this.state.dictionary['partnerProfilePreviewIconYard']}</p>
                </div>
              </Col>)
              :
              null
              :
              null
            }

            {
              isFieldInObject(this.props.partnerObject, 'balcon', 'general')
              ?
              this.props.partnerObject['general']['balcon'] === '1'
              ?
              (<Col xs="4" sm="2" lg="1" className="smallColPadd">
                <div className="iconHolder">
                  <span className="icon balcon" />
                  <p>{this.state.dictionary['partnerProfilePreviewIconBalcon']}</p>
                </div>
              </Col>)
              :
              null
              :
              null
            }

            {
              isFieldInObject(this.props.partnerObject, 'pool', 'general')
              ?
              this.props.partnerObject['general']['pool'] === '1'
              ?
              (<Col xs="4" sm="2" lg="1" className="smallColPadd">
                <div className="iconHolder">
                  <span className="icon pool" />
                  <p>{this.state.dictionary['partnerProfilePreviewIconPool']}</p>
                </div>
              </Col>)
              :
              null
              :
              null
            }

            {
              isFieldInObject(this.props.partnerObject, 'wifi', 'general')
              ?
              this.props.partnerObject['general']['wifi'] === '1'
              ?
              (<Col xs="4" sm="2" lg="1" className="smallColPadd">
                <div className="iconHolder">
                  <span className="icon wifi" />
                  <p>{this.state.dictionary['partnerProfilePreviewIconWifi']}</p>
                </div>
              </Col>)
              :
              null
              :
              null
            }

            {
              isFieldInObject(this.props.partnerObject, 'animator', 'general')
              ?
              this.props.partnerObject['general']['animator'] === '1'
              ?
              (<Col xs="4" sm="2" lg="1" className="smallColPadd">
                <div className="iconHolder">
                  <span className="icon animator" />
                  <p>{this.state.dictionary['partnerProfilePreviewIconAnimator']}</p>
                </div>
              </Col>)
              :
              null
              :
              null
            }

            {
              isFieldInObject(this.props.partnerObject, 'food', 'general')
              ?
              this.props.partnerObject['general']['food'] === '1'
              ?
              (<Col xs="4" sm="2" lg="1" className="smallColPadd">
                <div className="iconHolder">
                  <span className="icon food" />
                  <p>{this.state.dictionary['partnerProfilePreviewIconFood']}</p>
                </div>
              </Col>)
              :
              null
              :
              null
            }

            {
              isFieldInObject(this.props.partnerObject, 'drink', 'general')
              ?
              this.props.partnerObject['general']['drink'] === '1'
              ?
              (<Col xs="4" sm="2" lg="1" className="smallColPadd">
                <div className="iconHolder">
                  <span className="icon drink" />
                  <p>{this.state.dictionary['partnerProfilePreviewIconDrink']}</p>
                </div>
              </Col>)
              :
              null
              :
              null
            }

            {
              isFieldInObject(this.props.partnerObject, 'cake', 'general')
              ?
              this.props.partnerObject['general']['cake'] === '1'
              ?
              (<Col xs="4" sm="2" lg="1" className="smallColPadd">
                <div className="iconHolder">
                  <span className="icon cake" />
                  <p>{this.state.dictionary['partnerProfilePreviewIconCake']}</p>
                </div>
              </Col>)
              :
              null
              :
              null
            }

            {
              isFieldInObject(this.props.partnerObject, 'smoking', 'general')
              ?
              this.props.partnerObject['general']['smoking'] === '1'
              ?
              (<Col xs="4" sm="2" lg="1" className="smallColPadd">
                <div className="iconHolder">
                  <span className="icon smoking" />
                  <p>{this.state.dictionary['partnerProfilePreviewIconSmoking']}</p>
                </div>
              </Col>)
              :
              null
              :
              null
            }

          </Row>

          <Row className="selfRemarks">
            {
              isFieldInObject(this.props.partnerObject, 'selfFood', 'general')
              ?
              this.props.partnerObject['general']['selfFood'] === '1'
              ?
              (<Col xs="12" sm="6">
                <h5>{this.state.dictionary['partnerProfilePreviewSelfremarkFoodYes']}</h5>
              </Col>)
              :
              (<Col xs="12" sm="6">
                <h5>{this.state.dictionary['partnerProfilePreviewSelfremarkFoodNo']}</h5>
              </Col>)
              :
              null
            }

            {
              isFieldInObject(this.props.partnerObject, 'selfDrink', 'general')
              ?
              this.props.partnerObject['general']['selfDrink'] === '1'
              ?
              (<Col xs="12" sm="6">
                <h5>{this.state.dictionary['partnerProfilePreviewSelfremarkDrinkYes']}</h5>
              </Col>)
              :
              (<Col xs="12" sm="6">
                <h5>{this.state.dictionary['partnerProfilePreviewSelfremarkDrinkNo']}</h5>
              </Col>)
              :
              null
            }

            {
              isFieldInObject(this.props.partnerObject, 'selfCake', 'general')
              ?
              this.props.partnerObject['general']['selfCake'] === '1'
              ?
              (<Col xs="12" sm="6">
                <h5>{this.state.dictionary['partnerProfilePreviewSelfremarkCakeYes']}</h5>
              </Col>)
              :
              (<Col xs="12" sm="6">
                <h5>{this.state.dictionary['partnerProfilePreviewSelfremarkCakeNo']}</h5>
              </Col>)
              :
              null
            }

            {
              isFieldInObject(this.props.partnerObject, 'selfAnimator', 'general')
              ?
              this.props.partnerObject['general']['selfAnimator'] === '1'
              ?
              (<Col xs="12" sm="6">
                <h5>{this.state.dictionary['partnerProfilePreviewSelfremarkAnimatorYes']}</h5>
              </Col>)
              :
              (<Col xs="12" sm="6">
                <h5>{this.state.dictionary['partnerProfilePreviewSelfremarkAnimatorNo']}</h5>
              </Col>)
              :
              null
            }

            {
              (!isFieldInObject(this.props.partnerObject, 'selfAnimator', 'general') && !isFieldInObject(this.props.partnerObject, 'selfCake', 'general') && !isFieldInObject(this.props.partnerObject, 'selfDrink', 'general') && !isFieldInObject(this.props.partnerObject, 'selfFood', 'general'))
              ?
              (<Col xs="12">
                <h5 className="fadedPrev">Restrikcije u vezi hrane, pića, torte i animatora još nisu upisane.</h5>
              </Col>)
              : 
              null
            }
          </Row>

          <Row className="contentFree">
            <Col xs="12" sm="6">
              <Row>
                <Col xs="12" className="no-pading">
                  <h3>Besplatni sadržaji:</h3>
                </Col>
                <Col xs="12" sm="6">
                  <div className="item"><span></span><span>Laser tag</span></div>
                </Col>
                <Col xs="12" sm="6">
                  <div className="item"><span></span><span>Trampolina</span></div>
                </Col>
                <Col xs="12" sm="6">
                  <div className="item"><span></span><span>Dvorac na naduvavanje</span></div>
                </Col>
                <Col xs="12" sm="6">
                  <div className="item"><span></span><span>Face painting</span></div>
                </Col>
                <Col xs="12" sm="6">
                  <div className="item"><span></span><span>Jump arena</span></div>
                </Col>
                <Col xs="12" sm="6">
                  <div className="item"><span></span><span>Veliki teren za košarku</span></div>
                </Col>
                <Col xs="12" sm="6">
                  <div className="item"><span></span><span>Dvorac na naduvavanje</span></div>
                </Col>
                <Col xs="12" sm="6">
                  <div className="item"><span></span><span>Fudbalski teren</span></div>
                </Col>
              </Row>
            </Col>

            <Col xs="12" sm="6">
              <Row>
                <Col xs="12" className="no-pading">
                  <h3>Sadržaji uz doplatu:</h3>
                </Col>
                <Col xs="12">
                  <div className="item"><span></span><span>Laser tag / cena: 2800 rsd</span></div>
                  <div className="payRemark">*cena je za 20 min igranja i maximum 16 igrača po jednoj igri</div>
                </Col>
                <Col xs="12">
                  <div className="item"><span></span><span>Trampolina / cena: 2800 rsd</span></div>
                  <div className="payRemark">*cena je za 20 min igranja i maximum 16 igrača po jednoj igri</div>
                </Col>
                <Col xs="12">
                  <div className="item"><span></span><span>Dvorac na naduvavanje / cena: 2800 rsd</span></div>
                  <div className="payRemark">*cena je za 20 min igranja i maximum 16 igrača po jednoj igri</div>
                </Col>
              </Row>
            </Col>
          </Row> 
        </Container>    
    	</div>
    	
    ) 
  }
}

const mapStateToProps = (state) => ({
	partnerObject: state.PartnerReducer.partner,
  partnerGeneral: state.PartnerReducer.partnerGeneral,
});


const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({

  },
  dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(PreviewScreen)