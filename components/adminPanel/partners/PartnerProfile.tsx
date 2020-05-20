import React from 'react';
import Select from 'react-select';
import { Row, Col, Container, Button } from 'reactstrap';
import { getLanguage } from '../../../lib/language';
import generalOptions from '../../../lib/constants/generalOptions';
import { isFieldInObject, getGeneralOptionLabelByValue, isolateByArrayFieldValue, getLayoutNumber, createDisplayPhotoListObject } from '../../../lib/helpers/specificPartnerFunctions';
import PlainInput from '../../form/input';
import Keys from '../../../server/keys';

interface MyProps {
	partner: null | object;
  show: boolean;
  closeProfile(outcome: boolean, partner: string):void;
};
interface MyState {
  dictionary: object;
  lang: string;
};

export default class AdminPartnerProfile extends React.Component <MyProps, MyState>{

	state: MyState = {
    dictionary: getLanguage('sr'),
    lang: 'sr',
  };

	
  render() {
    const cer  = this.props.partner ? this.props.partner : {};
    const photoList = createDisplayPhotoListObject(cer);

    return(
      this.props.show 
      ?
      (
        <div className="darkCover" >
          <div className="partnerProflePreview">
              <Container fluid>
                <Row>
                  <span className="icon closeIt absol" onClick={ () => this.props.closeProfile(false, '')}></span>
                  <Col xs="10">
                    <div className="pageHeader">
                      <h2>{this.state.dictionary['partnerProfilePreviewTitle']}</h2>
                    </div>
                  </Col>

                </Row>

                <Row>
                  <Col xs="12" sm="6">
                    <div className="mainPhoto" style={ photoList['main'] ? {'background': 'url('+Keys.AWS_PARTNER_PHOTO_LINK+photoList['main']+') center / cover no-repeat'} : {'background': '#ccc'}}></div>
                  </Col>
                  <Col xs="12" sm="6" className="mobileHide">
                    <Row>
                      <Col xs="12" sm="4" className="smallColPadd">
                        <div className="supportPhoto" style={ photoList['sel_1'] ? {'background': 'url('+Keys.AWS_PARTNER_PHOTO_LINK+photoList['sel_1']+') center / cover no-repeat'} : {'background': '#ccc'}}></div>
                      </Col>
                      <Col xs="12" sm="4" className="smallColPadd">
                        <div className="supportPhoto" style={ photoList['sel_2'] ? {'background': 'url('+Keys.AWS_PARTNER_PHOTO_LINK+photoList['sel_2']+') center / cover no-repeat'} : {'background': '#ccc'}}></div>
                      </Col>
                      <Col xs="12" sm="4" className="smallColPadd">
                        <div className="supportPhoto" style={ photoList['sel_3'] ? {'background': 'url('+Keys.AWS_PARTNER_PHOTO_LINK+photoList['sel_3']+') center / cover no-repeat'} : {'background': '#ccc'}}></div>
                      </Col>
                    </Row>

                    <Row>
                      <Col xs="4" className="smallColPadd">
                        <div className="supportPhoto" style={ photoList['sel_4'] ? {'background': 'url('+Keys.AWS_PARTNER_PHOTO_LINK+photoList['sel_4']+') center / cover no-repeat'} : {'background': '#ccc'}}></div>
                      </Col>
                      <Col xs="4" className="smallColPadd">
                        <div className="supportPhoto" style={ photoList['sel_5'] ? {'background': 'url('+Keys.AWS_PARTNER_PHOTO_LINK+photoList['sel_5']+') center / cover no-repeat'} : {'background': '#ccc'}}></div>
                      </Col>
                      <Col xs="4" className="smallColPadd">
                        <div className="supportPhoto" style={ photoList['sel_6'] ? {'background': 'url('+Keys.AWS_PARTNER_PHOTO_LINK+photoList['sel_6']+') center / cover no-repeat'} : {'background': '#ccc'}}></div>
                      </Col>
                    </Row>

                  </Col>
                </Row>

                <Row>
                  <Col xs="12" sm="8">
                    <div className="generalFirst">
                      {
                        isFieldInObject(this.props.partner, 'name') && isFieldInObject(this.props.partner, 'spaceType', 'general')
                        ?
                        <h3>{this.props.partner['general']['spaceType'] ? getGeneralOptionLabelByValue(generalOptions['spaceType_' + this.state.lang], this.props.partner['general']['spaceType']) + ' ' + this.props.partner['name'] : `${this.props.partner['name']}`}</h3>
                        :
                        <h3 className="fadedPrev">{this.state.dictionary['partnerProfilePreviewNonName']}</h3>
                      }

                      {
                        isFieldInObject(this.props.partner, 'address', 'general')
                        ?
                        <h5>{this.props.partner['general']['address']}, {getGeneralOptionLabelByValue(generalOptions['cities'], this.props.partner['city'])}</h5>
                        :
                        <h5 className="fadedPrev">{this.state.dictionary['partnerProfilePreviewNonAddress']}</h5>
                      }

                      {
                        isFieldInObject(this.props.partner, 'description', 'general')
                        ?
                        <p>{this.props.partner['general']['description']}</p>
                        :
                        <p className="fadedPrev">{this.state.dictionary['partnerProfilePreviewNonDescription']}</p>
                      }

                    </div>
                    
                  </Col>
                  <Col xs="12" sm="4">
                    <div className="generalSecond">
                      <ul>
                        {
                          isFieldInObject(this.props.partner, 'size', 'general')
                          ?
                          <li>{`${this.state.dictionary['partnerProfilePreviewSideSize']} ${this.props.partner['general']['size']}m2`}</li>
                          :
                          <li className="fadedPrev">{this.state.dictionary['partnerProfilePreviewNonSize']}</li>
                        }

                        {
                          isFieldInObject(this.props.partner, 'playSize', 'general')
                          ?
                          <li>{`${this.state.dictionary['partnerProfilePreviewSidePlaysize']} ${this.props.partner['general']['playSize']}m2`}</li>
                          :
                          <li className="fadedPrev">{this.state.dictionary['partnerProfilePreviewNonPlaysize']}</li>
                        }

                        {
                          (isFieldInObject(this.props.partner, 'ageFrom', 'general') && isFieldInObject(this.props.partner, 'ageTo', 'general'))
                          ?
                          <li>{`${this.state.dictionary['partnerProfilePreviewSideAges']} ${this.props.partner['general']['ageFrom']} - ${this.props.partner['general']['ageTo']}`}</li>
                          :
                          <li className="fadedPrev">{this.state.dictionary['partnerProfilePreviewNonAges']}</li>
                        }
                      </ul>
                    </div>
                  </Col>
                </Row>

                <Row>
                  {
                    isFieldInObject(this.props.partner, 'parking', 'general')
                    ?
                    this.props.partner['general']['parking'] === '1'
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
                    isFieldInObject(this.props.partner, 'yard', 'general')
                    ?
                    this.props.partner['general']['yard'] === '1'
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
                    isFieldInObject(this.props.partner, 'balcon', 'general')
                    ?
                    this.props.partner['general']['balcon'] === '1'
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
                    isFieldInObject(this.props.partner, 'pool', 'general')
                    ?
                    this.props.partner['general']['pool'] === '1'
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
                    isFieldInObject(this.props.partner, 'wifi', 'general')
                    ?
                    this.props.partner['general']['wifi'] === '1'
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
                    isFieldInObject(this.props.partner, 'animator', 'general')
                    ?
                    this.props.partner['general']['animator'] === '1'
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
                    isFieldInObject(this.props.partner, 'movie', 'general')
                    ?
                    this.props.partner['general']['movie'] === '1'
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
                    isFieldInObject(this.props.partner, 'gaming', 'general')
                    ?
                    this.props.partner['general']['gaming'] === '1'
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
                    isFieldInObject(this.props.partner, 'food', 'general')
                    ?
                    this.props.partner['general']['food'] === '1'
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
                    isFieldInObject(this.props.partner, 'drink', 'general')
                    ?
                    this.props.partner['general']['drink'] === '1'
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
                    isFieldInObject(this.props.partner, 'smoking', 'general')
                    ?
                    this.props.partner['general']['smoking'] === '1'
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
                    isFieldInObject(this.props.partner, 'selfFood', 'general')
                    ?
                    this.props.partner['general']['selfFood'] === '1'
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
                    isFieldInObject(this.props.partner, 'selfDrink', 'general')
                    ?
                    this.props.partner['general']['selfDrink'] === '1'
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
                    isFieldInObject(this.props.partner, 'selfAnimator', 'general')
                    ?
                    this.props.partner['general']['selfAnimator'] === '1'
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
                    (!isFieldInObject(this.props.partner, 'selfAnimator', 'general') && !isFieldInObject(this.props.partner, 'selfCake', 'general') && !isFieldInObject(this.props.partner, 'selfDrink', 'general') && !isFieldInObject(this.props.partner, 'selfFood', 'general'))
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
                    isFieldInObject(this.props.partner, 'rooms', 'general')
                    ?
                    this.props.partner['general']['rooms'].length
                    ?
                    <Col xs="12" className="roomList">
                      
                      {
                        this.props.partner['general']['rooms'].map((room, index) => {
                          return(
                            <Col xs="12" key={`roomKey_${index}`}>
                              <Row className="item">
                                {
                                  this.props.partner['general']['rooms'].length > 1
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
                        isFieldInObject(this.props.partner, 'contentOffer')
                        ?
                        this.props.partner['contentOffer'].length
                        ?
                        this.props.partner['contentOffer'].map( (offer, index) => {
                          return(
                            <Col xs="12" sm="6" key={`offerKey_${index}`}>
                              <div className="item"><span></span><span>{getGeneralOptionLabelByValue(generalOptions[`contentOffer_${this.state.lang}`], offer.toString())}</span></div>
                            </Col>
                           )
                        })
                        :
                        (<Col xs="12">
                          <h5 className="fadedPrev">{this.state.dictionary['partnerProfilePreviewOfferFreeEmpty']}</h5>
                        </Col>)
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
                        isFieldInObject(this.props.partner, 'contentAddon')
                        ?
                        this.props.partner['contentOffer'].length
                        ?
                        this.props.partner['contentAddon'].map( (addon, index) => {
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
                    isFieldInObject(this.props.partner, 'decoration')
                  ?
                  Object.keys(this.props.partner['decoration']).map( (item, index) => {
                    const decor = this.props.partner['decoration'][item];
                    return(
                      <Col xs="12" sm="6" lg="4" key={`decorKey_${index}`}>
                        <div className="item"><span className="icon"></span><span>{`${generalOptions['decorType'][decor['value']]['name_'+this.state.lang]} / ${decor['price'] ? (decor['price'] + 'rsd') : this.state.dictionary['partnerProfilePreviewDecorationFree']}`}</span></div>
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
                  isFieldInObject(this.props.partner, 'deals', 'catering')
                  ?
                  this.props.partner['catering']['deals'].length
                  ?
                  this.props.partner['catering']['deals'].map( (deal, index) => {
                    return(
                      <Row className="cateringDealsPr" key={`cateringDealKey_${index}`}>
                        <Col xs="12" sm="4" lg="3">
                          <h6>{`${this.state.dictionary['partnerProfileCateringDealsDeal']} ${index+1}`}</h6>
                          <h6>{getGeneralOptionLabelByValue(generalOptions[`dealType_${this.state.lang}`], deal['type'].toString())}</h6>
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
                    isFieldInObject(this.props.partner, 'drinkCard', 'catering')
                    ?
                    this.props.partner['catering']['drinkCard'].length
                    ?
                    (
                      <Col xs="12">
                      <Row>
                        <Col xs="12" sm="4">
                          <div className="middle">
                            <h5>{this.state.dictionary['partnerProfilePreviewCateringCardPillarNon']}</h5>
                          </div>
                          {
                            isolateByArrayFieldValue(this.props.partner['catering']['drinkCard'], 'type', '1').length
                            ?
                            isolateByArrayFieldValue(this.props.partner['catering']['drinkCard'], 'type', '1').map( (drink, index) => {
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
                            isolateByArrayFieldValue(this.props.partner['catering']['drinkCard'], 'type', '2').length
                            ?
                            isolateByArrayFieldValue(this.props.partner['catering']['drinkCard'], 'type', '2').map( (drink, index) => {
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
                            isolateByArrayFieldValue(this.props.partner['catering']['drinkCard'], 'type', '3').length
                            ?
                            isolateByArrayFieldValue(this.props.partner['catering']['drinkCard'], 'type', '3').map( (drink, index) => {
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
        </div>
      )
      :
      null
    ) 
  }
}