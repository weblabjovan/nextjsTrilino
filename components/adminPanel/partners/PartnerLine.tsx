import React from 'react';
import Select from 'react-select';
import { Row, Col, CustomInput, Button } from 'reactstrap';
import { getLanguage } from '../../../lib/language';
import genOptions from '../../../lib/constants/generalOptions';
import PlainInput from '../../form/input';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../style/style.scss';

interface MyProps {
	key: string;
	index: number;
	name: string;
	taxNum: string | number;
	percent: number;
	city: string;
	partnerId: string;
	active: boolean;
    photoNumber: number;
	openProfile(outcome: boolean, partner: string): void;
	openPhoto(outcome: boolean, partner: string): void;
	partnerActivation(event: any): void;
};
interface MyState {
};

export default class PartnerLine extends React.Component <MyProps, MyState>{

	state: MyState = {
  };

	
  render() {
    return(
    	<Row key={`adminPar_${this.props.index}`}>
				<Col xs="12" className="listLine">
        	<Row className="headLine">
        		<Col xs="12" sm="4">
        			<p className="middle">INFO</p>
        		</Col>
        		<Col xs="12" sm="2">
        			<p className="middle">AKTIVACIJA</p>
        		</Col>
        		<Col xs="12" sm="3">
        			<p className="middle">SLIKE</p>
        		</Col>
        		<Col xs="12" sm="3">
        			<p className="middle">PROFIL</p>
        		</Col>
        	</Row>
        	<Row className="infoLine">
        		<Col xs="12" sm="4" className="info">

        			<h5><span>Naziv: </span>{this.props.name}</h5>
        			<p><span>PIB: </span>{this.props.taxNum}</p>
        			<p><span>Grad: </span>{this.props.city}</p>
        		</Col>
        		<Col xs="12" sm="2" className="activation">
        			<p className="middle">Popunjenost profila</p>
        			<h4 className="middle">{`${this.props.percent}%`}</h4>
        			<CustomInput type="switch" className="middle" id={`activateSwitch_${this.props.index}`} onClick={(event) => this.props.partnerActivation(event) } checked={ this.props.active } name={`${this.props.partnerId}`} label={this.props.active ? 'Deaktiviraj' : 'Aktiviraj'} />
        		</Col>
        		<Col xs="12" sm="3" className="photo">
        			<p className="middle">{`Broj slika: ${this.props.photoNumber}`}</p>
        			<div className="middle">
        				<Button onClick={(event)=> this.props.openPhoto(true, this.props.partnerId)}>PREGLED SLIKA</Button>
        			</div>
        		</Col>
        		<Col xs="12" sm="3" className="preview">
        			<div className="middle">
        				<Button onClick={(event)=> this.props.openProfile(true, this.props.partnerId)}>PREGLED PROFILA</Button>
        			</div>
        		</Col>
        	</Row>
        </Col>
			</Row>
    	
    ) 
  }
}