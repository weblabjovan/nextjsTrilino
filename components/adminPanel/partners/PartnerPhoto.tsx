import React from 'react';
import Select from 'react-select';
import { Row, Col, Container, Button, CustomInput, Alert } from 'reactstrap';
import { getLanguage } from '../../../lib/language';
import generalOptions from '../../../lib/constants/generalOptions';
import { isFieldInObject, getGeneralOptionLabelByValue, isolateByArrayFieldValue, getLayoutNumber } from '../../../lib/helpers/specificPartnerFunctions';
import PlainInput from '../../form/input';
import Keys from '../../../server/keys';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../style/style.scss';

interface MyProps {
	partner: null | object;
  show: boolean;
  closePhoto(outcome: boolean, partner: string):void;
  onPhotoChange(event: any): void;
  preSignPhoto(link: object, data: object, auth: string): void;
  photo?: null | string;
  openPhotoGallery(photo: string): void;
  changeMainPhoto(event: any): void;
  changeSelectionPhoto(event: any): void;
  openConfirmationModal(photo: string): void;
  mainPhotoError: boolean;
  selectionPhotoError: boolean;
};

interface MyState {
  dictionary: object;
  lang: string;
  alert: boolean;
};

export default class AdminPartnerPhoto extends React.Component <MyProps, MyState>{

	state: MyState = {
    dictionary: getLanguage('sr'),
    lang: 'sr',
    alert: false,
  };

  componentDidUpdate(prevProps: MyProps, prevState:  MyState){
    if ((this.props.mainPhotoError || this.props.selectionPhotoError) && !this.state.alert) {
      this.setState({ alert: true })
    }
  }

  closeAlert(){
    this.setState({alert: false})
  }

	
  render() {
    return(
      this.props.show 
      ?
      (
        <div className="darkCover" >
          <div className="partnerPhoto">
            <Container fluid>

              <Row>
                <span className="icon closeIt absol" onClick={ () => this.props.closePhoto(false, '')}></span>
                <Col xs="10">
                  <div className="pageHeader">
                    <h2>Slike partnera</h2>
                  </div>
                </Col>

              </Row>

              <Row>
                <Col xs='12'>
                  <Alert color="danger" isOpen={ this.state.alert } toggle={() => this.closeAlert()}>
                    <p hidden={ !this.props.mainPhotoError }>Problem sa glavnom slikom</p>
                    <p hidden={ !this.props.selectionPhotoError }>Problem sa sporednim slikama</p>
                  </Alert>
                </Col>
              </Row>

              

              <Row>
                <Col xs="12" sm="6">
                  <Row>
                    <Col xs="12">
                      <div className="mainPhoto" style={this.props.photo ? {'background': 'url('+this.props.photo+') center / cover no-repeat' } : {'background': '#ccc'}}></div>
                    </Col>
                  </Row>
                  <Row className="justify-content-sm-center">
                    <Col xs="12" sm="6">
                      <CustomInput onChange={ (event) => this.props.onPhotoChange(event) } type="file" id="exampleCustomFileBrowser" name="customFile" label="Izaberite sliku" />
                    </Col>
                  </Row>

                  <Row>
                    <Col xs="12">
                      <div className="middle">
                        <Button color="success" onClick={ this.props.preSignPhoto }>Sačuvaj sliku</Button>
                      </div>
                    </Col>
                  </Row>
                  
                </Col>

                <Col xs="12" sm="6">
                  <Row className="justify-content-sm-center">
                    {
                      isFieldInObject(this.props.partner, 'photos')
                      ?
                      this.props.partner['photos'].length
                      ?
                      this.props.partner['photos'].map( (photo, index) => {
                        return(
                          <Col xs="6" key={`smallPhoto_${index}`} className="photoBox">
                            <div className="smallPhoto" onClick={ () => this.props.openPhotoGallery(photo['name']) } style={ {'background': 'url('+Keys.AWS_PARTNER_PHOTO_LINK+photo['name']+') center /cover no-repeat'}}></div>
                             <Row>
                              <Col xs="6">
                                <CustomInput type="checkbox" id={`photoMain_${index}`} name={photo['name']} onChange={ (event) => this.props.changeMainPhoto(event)} label="Glavna slika" checked={ photo['main'] } inline />
                              </Col>
                              <Col xs="6">
                                <CustomInput type="checkbox" id={`photoSelect_${index}`} name={photo['name']} onChange={ (event) => this.props.changeSelectionPhoto(event)} label="Sporedna slika" checked={ photo['selection'] }  inline />
                              </Col>
                              <Col xs="12">
                                <div className="middle">
                                  <button className="deletBtn" onClick={ () => this.props.openConfirmationModal(photo['name']) } >obriši</button>
                                </div>
                              </Col>
                             </Row>
                          </Col>
                         )
                        
                      })
                      :
                      <h3 className="fadedPrev">Odabrani partner još uvek nema sačuvanih fotografija</h3>
                      :
                      <h3 className="fadedPrev">Odabrani partner još uvek nema sačuvanih fotografija</h3>
                    }
                  </Row>
                </Col>
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