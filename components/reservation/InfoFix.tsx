import React from 'react';
import { Container, Row, Col, Button, Alert, Table } from 'reactstrap';
import { getLanguage } from '../../lib/language';

type MyProps = {
  partner?: string;
  time?: string;
  date?: string;
  price?: number;
  lang: string;
  num?: string;
  catering?:Array<object>; 
  addon?:Array<object>; 
  general?: object | null;
  mobile: boolean;
  // using `interface` is also ok
};
type MyState = {
  additional: boolean;
  dictionary: object;
  num: string;
};


export default class InfoFix extends React.Component <MyProps, MyState> {

  state: MyState = {
    additional: false,
    dictionary: getLanguage(this.props.lang),
    num: this.props.num ? this.props.num : '1',
  }

  toggleAdditional() {
    this.setState({ additional: !this.state.additional }, () => {
      const elem = document.getElementById(`additional_${this.state.num}`);
      if (this.state.additional) {
        elem.style.height = this.calculateAdditionalElementHeight();
      }else{
        elem.style.height = '0px';
      }
      elem.classList.toggle('hide');
      const time = this.state.additional ? 600 : 1;
      setTimeout(() => {
        elem.classList.toggle('overflow');
      }, time);
      
    })
  }

  calculateAdditionalElementHeight(){
    const base = this.props.mobile ? 260 : 300;
    const line = this.props.mobile ? 30 : 35;
    const add = (this.props.catering.length + this.props.addon.length) * line;
    const total = base + add;
    return `${total}px`;
  }

  render() {

    return (
        <Row className="reservationFix">
          <Col xs="12" className="title">
            <p className="little">Podaci o rezervaciji</p>
          </Col>
          <Col xs="12">
            <Row className="basic">
              <Col xs="12" sm="5" className="smallColPadd">
                <h3>{`${this.props.partner}`}</h3>
              </Col>
              <Col xs="8" sm="5" className="smallColPadd">
                <p>{`${this.props.date}, ${this.props.time}`}</p>
              </Col>
               <Col xs="4" sm="2" className="smallColPadd">
                <span className="price">{`${this.props.price} rsd`}</span>
              </Col>
            </Row>

            <Row className="basic"> 
              <Col xs="12">
                <div className="middle">
                  <span className="linkDown" onClick={ () => this.toggleAdditional() }>Detaljnije</span>
                </div>
              </Col>
             
            </Row>
          </Col>
          <Col xs="12" id={`additional_${this.state.num}`} className="additional hide">
            <Row >
              <Col xs="12" className="general">
                <Row>
                  <Col xs="5">Slavljenik:</Col>
                  <Col xs="7">{this.props.general['name']}</Col>
                </Row>
                <Row>
                  <Col xs="5">Sala:</Col>
                  <Col xs="7">{this.props.general['room']}</Col>
                </Row>
                <Row>
                  <Col xs="5">Broj odraslih:</Col>
                  <Col xs="7">{this.props.general['adultsNum']}</Col>
                </Row>
                <Row>
                  <Col xs="5">Broj dece:</Col>
                  <Col xs="7">{this.props.general['kidsNum']}</Col>
                </Row>
              </Col>

              <Col xs="12">
                <h4>Ketering:</h4>
                <Table>
                  <thead>
                    <tr>
                      <th>Paket</th>
                      <th>Količina</th>
                      <th>Cena</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.props.catering.map((deal, index) => {
                        return(
                          <tr key={`cateringKey_${index}`}>
                            <td>{deal['name']}</td>
                            <td>{deal['quantity']}</td>
                            <td>{`${deal['total']}rsd`}</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </Table>
              </Col>

              <Col xs="12">
                <h4>Dodatno:</h4>
                <Table>
                  <thead>
                    <tr>
                      <th>Sadržaj</th>
                      <th>Cena</th>
                    </tr>
                  </thead>

                  <tbody>
                    {
                      this.props.addon.map( (addon, index) => {
                        return(
                          <tr key={`cateringKey_${index}`}>
                            <td>{addon['name']}</td>
                            <td>{`${addon['total']}rsd`}</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </Table>
              </Col>
              
            </Row>
          </Col>
        </Row>
      
    );
  }
}


