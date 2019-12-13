import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col, Button, Alert } from 'reactstrap';
import { getLanguage } from '../../lib/language';
import generalOptions from '../../lib/constants/generalOptions';
import { isFieldInObject, getGeneralOptionLabelByValue, isolateByArrayFieldValue, getLayoutNumber } from '../../lib/helpers/specificPartnerFunctions';
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
              isFieldInObject(this.props.partnerObject, 'movie', 'general')
              ?
              this.props.partnerObject['general']['movie'] === '1'
              ?
              (<Col xs="4" sm="2" lg="1" className="smallColPadd">
                <div className="iconHolder">
                  <span className="icon movie" />
                  <p>{this.state.dictionary['partnerProfilePreviewIconMovie']}</p>
                </div>
              </Col>)
              :
              null
              :
              null
            }

            {
              isFieldInObject(this.props.partnerObject, 'gaming', 'general')
              ?
              this.props.partnerObject['general']['gaming'] === '1'
              ?
              (<Col xs="4" sm="2" lg="1" className="smallColPadd">
                <div className="iconHolder">
                  <span className="icon gaming" />
                  <p>{this.state.dictionary['partnerProfilePreviewIconGaming']}</p>
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
                <h5 className="fadedPrev">{this.state.dictionary['partnerProfilePreviewSelfremarkEmpty']}</h5>
              </Col>)
              : 
              null
            }
          </Row>

          <Row className="roomsPr">
            {
              isFieldInObject(this.props.partnerObject, 'rooms', 'general')
              ?
              this.props.partnerObject['general']['rooms'].length
              ?
              <Col xs="12" className="roomList">
                
                {
                  this.props.partnerObject['general']['rooms'].map((room, index) => {
                    return(
                      <Col xs="12" key={`roomKey_${index}`}>
                        <Row className="item">
                          {
                            this.props.partnerObject['general']['rooms'].length > 1
                            ?
                            <Col xs="12">
                              <p>{`${this.state.dictionary['partnerProfilePreviewRoomsSpace']} ${room['name']}`}</p>
                            </Col>
                            :
                            null
                          }
                          <Col xs="12" sm="4">
                            <label>{this.state.dictionary['partnerProfilePreviewRoomsSize']}</label>
                            <label>{`${room['size']}m2`}</label>
                          </Col>
                          <Col xs="12" sm="4">
                            <label>{this.state.dictionary['partnerProfilePreviewRoomsCapKids']}</label>
                            <label>{room['capKids']}</label>
                          </Col>
                          <Col xs="12" sm="4">
                            <label>{this.state.dictionary['partnerProfilePreviewRoomsCapAdults']}</label>
                            <label>{room['capAdults']}</label>
                          </Col>
                        </Row>
                      </Col>
                    )
                  })
                }
              </Col>
              :
              null
              :
              null

            }
          </Row>

          <Row className="contentFree">
            <Col xs="12" sm="6">
              <Row>
                <Col xs="12" className="no-pading">
                  <h3>{this.state.dictionary['partnerProfilePreviewOfferFreeSub']}</h3>
                </Col>
                {
                  isFieldInObject(this.props.partnerObject, 'contentOffer')
                  ?
                  this.props.partnerObject['contentOffer'].map( (offer, index) => {
                    return(
                      <Col xs="12" sm="6" key={`offerKey_${index}`}>
                        <div className="item"><span></span><span>{getGeneralOptionLabelByValue(generalOptions[`contentOffer_${this.props.lang}`], offer.toString())}</span></div>
                      </Col>
                     )
                  })
                  :
                  (<Col xs="12">
                    <h5 className="fadedPrev">{this.state.dictionary['partnerProfilePreviewOfferFreeEmpty']}</h5>
                  </Col>)
                }
              </Row>
            </Col>

            <Col xs="12" sm="6">
              <Row>
                <Col xs="12" className="no-pading">
                  <h3>{this.state.dictionary['partnerProfilePreviewOfferPayedSub']}</h3>
                </Col>
                {
                  isFieldInObject(this.props.partnerObject, 'contentAddon')
                  ?
                  this.props.partnerObject['contentAddon'].map( (addon, index) => {
                    return(
                      <Col xs="12" key={`addonKey_${index}`}>
                        <div className="item"><span></span><span>{`${addon['name']} / ${this.state.dictionary['partnerProfileOfferAddonPrice']} ${addon['price']} rsd`}</span></div>
                        <div className="payRemark">{addon['comment'] ? `*${addon['comment']}` : ''}</div>
                      </Col>
                     )
                  })
                  :
                  (<Col xs="12">
                    <h5 className="fadedPrev">{this.state.dictionary['partnerProfilePreviewOfferPayedEmpty']}</h5>
                  </Col>)
                }
              </Row>
            </Col>
          </Row> 

          <Row className="subHeadPr">
            <Col xs="12">
              <h3>{this.state.dictionary['partnerProfilePreviewDecorationSub']}</h3>
            </Col>
          </Row>

          <Row className="decorationPr">
            {
              isFieldInObject(this.props.partnerObject, 'decoration')
            ?
            Object.keys(this.props.partnerObject['decoration']).map( (item, index) => {
              const decor = this.props.partnerObject['decoration'][item];
              return(
                <Col xs="12" sm="6" lg="4" key={`decorKey_${index}`}>
                  <div className="item"><span className="icon"></span><span>{`${generalOptions['decorType'][decor['value']]['name_'+this.props.lang]} / ${decor['price'] ? (decor['price'] + 'rsd') : this.state.dictionary['partnerProfilePreviewDecorationFree']}`}</span></div>
                </Col>
              )
            })
            :
            (<Col xs="12">
              <h5 className="fadedPrev">{this.state.dictionary['partnerProfilePreviewDecorationEmpty']}</h5>
            </Col>)
            }
            <Col xs="12">
            </Col>
          </Row>



          <Row className="subHeadPr">
            <Col xs="12">
              <h3>{this.state.dictionary['partnerProfilePreviewCateringDealsSub']}</h3>
            </Col>
          </Row>

          {
            isFieldInObject(this.props.partnerObject, 'deals', 'catering')
            ?
            this.props.partnerObject['catering']['deals'].length
            ?
            this.props.partnerObject['catering']['deals'].map( (deal, index) => {
              return(
                <Row className="cateringDealsPr" key={`cateringDealKey_${index}`}>
                  <Col xs="12" sm="4" lg="3">
                    <h6>{`${this.state.dictionary['partnerProfileCateringDealsDeal']} ${index+1}`}</h6>
                    <h6>{getGeneralOptionLabelByValue(generalOptions[`dealType_${this.props.lang}`], deal['type'].toString())}</h6>
                    <h6>{`${deal['price']} ${this.state.dictionary['partnerProfilePreviewCateringDealsPer']}`}</h6>
                  </Col>
                  <Col xs="12" sm="8" lg="9">
                    <Row>
                      <Col xs="12">
                        <div className="middle">
                          <p className="sub-sm">{this.state.dictionary['partnerProfileCateringDealsDealCont']}</p>
                        </div>
                      </Col>
                      {
                        deal['items'].map((item, index) => {
                          return(
                            <Col xs="12" sm="6" lg="4" className="pillars" key={`dealItem_${index}`}>
                              <div>
                                <span className="icon bullet"></span>
                                <p>{item}</p>
                              </div>
                            </Col>
                           )
                        })
                      }

                    </Row>
                  </Col>
                </Row>
               )
            })
            :
            (<Row><Col xs="12">
              <h5 className="fadedPrev">{this.state.dictionary['partnerProfilePreviewCateringDealsEmpty']}</h5>
            </Col></Row>)
            :
            (<Row><Col xs="12">
              <h5 className="fadedPrev">{this.state.dictionary['partnerProfilePreviewCateringDealsEmpty']}</h5>
            </Col></Row>)
          }

          <Row className="subHeadPr">
            <Col xs="12">
              <h3>{this.state.dictionary['partnerProfilePreviewCateringCardSub']}</h3>
            </Col>
          </Row>


          <Row className="cateringCardPr">
            {
              isFieldInObject(this.props.partnerObject, 'drinkCard', 'catering')
              ?
              this.props.partnerObject['catering']['drinkCard'].length
              ?
              (
                <Col xs="12">
                <Row>
                  <Col xs="12" sm="4">
                    <div className="middle">
                      <h5>{this.state.dictionary['partnerProfilePreviewCateringCardPillarNon']}</h5>
                    </div>
                    {
                      isolateByArrayFieldValue(this.props.partnerObject['catering']['drinkCard'], 'type', '1').length
                      ?
                      isolateByArrayFieldValue(this.props.partnerObject['catering']['drinkCard'], 'type', '1').map( (drink, index) => {
                        return(
                          <p key={`non_${index}`}>{`${drink['name']}, ${drink['quantity']} ${getGeneralOptionLabelByValue(generalOptions['drinkScale'], drink['scale'].toString())} - ${drink['price']} rsd`}</p>
                         )
                      })
                      :
                      <div className="middle">
                         <h6 className="fadedPrev">{this.state.dictionary['partnerProfilePreviewCateringCardPillarNonEmpty']}</h6>
                      </div>
                    }
                  </Col>
                  <Col xs="12" sm="4">
                    <div className="middle">
                      <h5>{this.state.dictionary['partnerProfilePreviewCateringCardPillarAlco']}</h5>
                    </div>
                    {
                      isolateByArrayFieldValue(this.props.partnerObject['catering']['drinkCard'], 'type', '2').length
                      ?
                      isolateByArrayFieldValue(this.props.partnerObject['catering']['drinkCard'], 'type', '2').map( (drink, index) => {
                        return(
                          <p key={`alco_${index}`}>{`${drink['name']}, ${drink['quantity']} ${getGeneralOptionLabelByValue(generalOptions['drinkScale'], drink['scale'].toString())} - ${drink['price']} rsd`}</p>
                         )
                      })
                      :
                      <div className="middle">
                         <h6 className="fadedPrev">{this.state.dictionary['partnerProfilePreviewCateringCardPillarAlcoEmpty']}</h6>
                      </div>
                    }
                  </Col>
                  <Col xs="12" sm="4">
                    <div className="middle">
                      <h5>{this.state.dictionary['partnerProfilePreviewCateringCardPillarHot']}</h5>
                    </div>
                    {
                      isolateByArrayFieldValue(this.props.partnerObject['catering']['drinkCard'], 'type', '3').length
                      ?
                      isolateByArrayFieldValue(this.props.partnerObject['catering']['drinkCard'], 'type', '3').map( (drink, index) => {
                        return(
                          <p key={`hot_${index}`}>{`${drink['name']}, ${drink['quantity']} ${getGeneralOptionLabelByValue(generalOptions['drinkScale'], drink['scale'].toString())} - ${drink['price']} rsd`}</p>
                         )
                      })
                      :
                      <div className="middle">
                         <h6 className="fadedPrev">{this.state.dictionary['partnerProfilePreviewCateringCardPillarHotEmpty']}</h6>
                      </div>
                     
                    }
                  </Col>
                </Row>
                </Col>
              )
              :
              (<Col xs="12">
              <h5 className="fadedPrev">{this.state.dictionary['partnerProfilePreviewCateringCardEmpty']}</h5>
              </Col>)
              :
              (<Col xs="12">
              <h5 className="fadedPrev">{this.state.dictionary['partnerProfilePreviewCateringCardEmpty']}</h5>
              </Col>)
            }
            
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