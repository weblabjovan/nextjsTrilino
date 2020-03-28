import React from 'react';
import { Container, Row, Col, Table } from 'reactstrap';
import { getLanguage } from '../../lib/language';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style/style.scss';

interface MyProps {
  // using `interface` is also ok
  lang: string;
  isMobile: boolean;
  show: boolean;
  close(): void;
};

interface MyState {
	dictionary: object;
};

export default class UserBill extends React.Component <MyProps, MyState>{

	constructor(props){
    super(props);

    this.componentObjectBinding = this.componentObjectBinding.bind(this);

    const bindingFunctions = ['toggleMobileOptions'];
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

  toggleMobileOptions(){
  	console.log()
  }

	
  render() {
    return(

    	<Container>
    		{
    			this.props.show
    			?
    			(
    				<div className="darkCover">
	    				<Row className="userBill">
	    					<Col xs="12">
                  <Row>
                    <Col xs="12">
                      <div className="close">
                        <label onClick={ this.props.close }></label>
                      </div>
                    </Col>
                  </Row>
	    					</Col>

			        	<Col xs="12">
                  <div className="billTable">
                    <div className="middle">
                      <h4>Detaljne informacije</h4>
                    </div>
                    
                    <Table>
                      <thead>
                        <tr>
                        </tr>
                      </thead>

                      <tbody>
                        <tr>
                          <td>Lokacija:</td>
                          <td>Igraonica Adalgo Group</td>
                        </tr>
                        <tr>
                          <td>Adresa:</td>
                          <td>Ruzveltova 44, Beograd</td>
                        </tr>
                        <tr>
                          <td>Sala:</td>
                          <td>Neka sala</td>
                        </tr>
                        <tr>
                          <td>Datum i vreme:</td>
                          <td>30-03-2020, 07:00 - 09:30</td>
                        </tr>
                        <tr>
                          <td>Ukupna cena:</td>
                          <td>56.000 rsd</td>
                        </tr>
                        <tr>
                          <td>Cena termina:</td>
                          <td>10.000 rsd</td>
                        </tr>
                        <tr>
                          <td>Cena keteringa:</td>
                          <td>30.000 rsd</td>
                        </tr>
                        <tr>
                          <td>Cena dodatnih sadržaja:</td>
                          <td>16.000 rsd</td>
                        </tr>
                        <tr>
                          <td>Odabrani dodatni sadržaji:</td>
                          <td>Baloni, Klovn, Prskalice, Laser tag, Još neke stvari</td>
                        </tr>
                        <tr>
                          <td>Cena plaćenog depozita:</td>
                          <td>10.000 rsd</td>
                        </tr>
                        <tr>
                          <td>Za uplatu na licu mesta:</td>
                          <td>16.000 rsd</td>
                        </tr>
                         <tr>
                          <td>Za uplatu preko korisničkog profila:</td>
                          <td>30.000 rsd</td>
                        </tr>
                        <tr>
                          <td>Rok za uplatu preko korisničkog profila:</td>
                          <td>23-03-2020, 23:59</td>
                        </tr>
                         <tr>
                          <td>Tip uplate preko korisničkog profila:</td>
                          <td>Trilino ketering lux za 30 osoba</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>    
                </Col>
			        </Row>
		        </div>
    			)
    			:
    			null
    		}
      </Container>
    ) 
  }
}