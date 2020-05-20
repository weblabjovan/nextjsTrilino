import React from 'react';
import Select from 'react-select';
import { Row, Col, Container, Button } from 'reactstrap';
import { getLanguage } from '../../../lib/language';
import generalOptions from '../../../lib/constants/generalOptions';
import { isFieldInObject, getGeneralOptionLabelByValue, isolateByArrayFieldValue, getLayoutNumber } from '../../../lib/helpers/specificPartnerFunctions';
import PlainInput from '../../form/input';
import CheckBox from '../../form/checkbox';
import Keys from '../../../server/keys';
interface MyProps {
	partner: null | object;
  show: boolean;
  closeInfo(outcome: boolean, partner: string):void;
  saveMap(map: object):void;
};
interface MyState {
  dictionary: object;
  lang: string;
  lockMapFields: boolean;
  mapInfo: object;
};

export default class AdminPartnerInfo extends React.Component <MyProps, MyState>{

	constructor(props){
    super(props);

    this.componentObjectBinding = this.componentObjectBinding.bind(this);

    const bindingFunctions = ['toggleMapLock', 'changeMap'];
    this.componentObjectBinding(bindingFunctions);
  }

  componentObjectBinding(array){
    array.map( item => {
      this[item] = this[item].bind(this);
    })
  }

	state: MyState = {
    dictionary: getLanguage('sr'),
    lang: 'sr',
    lockMapFields: true,
    mapInfo: { lat: 0, lng: 0},
  };

  toggleMapLock(){
  	this.setState({lockMapFields: !this.state.lockMapFields});
  }

  changeMap(val: string, field: string){
  	const mapCopy = JSON.parse(JSON.stringify(this.state.mapInfo));
  	mapCopy[field] = parseFloat(val);
  	this.setState({mapInfo: mapCopy});
  }

  componentDidUpdate(prevProps: MyProps, prevState:  MyState){
  	if (this.props.show && !prevProps.show) {
  		if (this.props.partner) {
  			if (this.props.partner['map']) {
  				this.setState({mapInfo: this.props.partner['map']})
  			}
  		}
  	}
  }

	
  render() {

    return(
      this.props.show 
      ?
      (
        <div className="darkCover" >
          <div className="partnerActions">
              <Container fluid>
                <Row>
                  <span className="icon closeIt absol" onClick={ () => this.props.closeInfo(false, '')}></span>
                  <Col xs="10">
                    <div className="pageHeader">
                      <h2>Akcije</h2>
                    </div>
                  </Col>
                  
                </Row>

                <Row>
                	<Col xs="12" lg="6">
                		<Row className="maps">
                			<Col xs="12">
                				<h4>Mape:</h4>
                			</Col>
                			<Col xs="12" lg="3">
                				<label>Geografska širina</label>
					            	<PlainInput 
					                placeholder="lat"
					                onChange={(event) => this.changeMap(event.target.value, 'lat')} 
					                value={this.state.mapInfo['lat']} 
					                type="text"
					                disabled={ this.state.lockMapFields }
					                className="logInput" />
                			</Col>
                			<Col xs="12" lg="3">
                				<label>Geografska dužina</label>
                				<PlainInput 
					                placeholder="lng"
					                onChange={(event) => this.changeMap(event.target.value, 'lng')} 
					                value={this.state.mapInfo['lng']} 
					                type="text"
					                disabled={ this.state.lockMapFields }
					                className="logInput" />
                			</Col>
                			
                			<Col xs="12" lg="2" style={{'textAlign': 'center'}}>
                				<label>Zaključaj</label>
                				<CheckBox
                          disabled={ false }
                          checked={ this.state.lockMapFields }
                          field={ 'mapLock' }
                          onChange={ this.toggleMapLock }
                        />
                			</Col>

                			<Col xs="12" lg="4">
                				<Button color="success" onClick={ () => this.props.saveMap(this.state.mapInfo) }>Sačuvaj</Button>
                			</Col>
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