import React from 'react';
import { Container, Row, Col, Button, Alert, Table } from 'reactstrap';
import { getLanguage } from '../../lib/language';

type MyProps = {
  partner?: string;
  time?: string;
  date?: string;
  price?: number;
  deposit: number;
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
    const base = this.props.mobile ? 260 : 340;
    const line = this.props.mobile ? 30 : 35;
    const add = (this.props.catering.length + this.props.addon.length) * line;
    const total = base + add;
    return `${total}px`;
  }

  render() {

    return (
        <Row className="reservationFix">
          <Col xs="12" className="title">
            <p className="little">{this.state.dictionary['reservationInfoTitle']}</p>
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
                <span className="price">{`${this.props.price.toLocaleString('en')} rsd`}</span>
              </Col>
              <Col xs="12">
                <p className="deposit">{`${this.state.dictionary['uniDeposit']}: ${this.props.deposit.toLocaleString('en')} rsd`}</p>
              </Col>
            </Row>

            <Row className="basic"> 
              <Col xs="12">
                <div className="middle">
                  <span className="linkDown" onClick={ () => this.toggleAdditional() }>{`${this.state.additional ? this.state.dictionary['reservationInfoBasicLess'] : this.state.dictionary['reservationInfoBasicMore'] }`}</span>
                </div>
              </Col>
             
            </Row>
          </Col>
          <Col xs="12" id={`additional_${this.state.num}`} className="additional hide">
            <Row >
              <Col xs="12" className="general">
                <Row>
                  <Col xs="5">{this.state.dictionary['reservationInfoAdditionalName']}</Col>
                  <Col xs="7">{this.props.general['name']}</Col>
                </Row>
                <Row>
                  <Col xs="5">{this.state.dictionary['reservationInfoAdditionalRoom']}</Col>
                  <Col xs="7">{this.props.general['room']}</Col>
                </Row>
                <Row>
                  <Col xs="5">{this.state.dictionary['reservationInfoAdditionalAdultsNum']}</Col>
                  <Col xs="7">{this.props.general['adultsNum']}</Col>
                </Row>
                <Row>
                  <Col xs="5">{this.state.dictionary['reservationInfoAdditionalKidsNum']}</Col>
                  <Col xs="7">{this.props.general['kidsNum']}</Col>
                </Row>
              </Col>

              <Col xs="12">
                <h4>{this.state.dictionary['reservationInfoAdditionalCateringTitle']}</h4>
                <Table>
                  <thead>
                    <tr>
                      <th>{this.state.dictionary['reservationInfoAdditionalCateringDeal']}</th>
                      <th>{this.state.dictionary['reservationInfoAdditionalCateringQuantity']}</th>
                      <th>{this.state.dictionary['reservationInfoAdditionalCateringPrice']}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.props.catering.length
                      ?
                      this.props.catering.map((deal, index) => {
                        return(
                          <tr key={`cateringKey_${index}`}>
                            <td>{deal['name']}</td>
                            <td>{deal['quantity']}</td>
                            <td>{`${deal['total'].toLocaleString('en')} rsd`}</td>
                          </tr>
                        )
                      })
                      :
                      <tr><td><p>{this.state.dictionary['reservationInfoAdditionalCateringNone']}</p></td></tr>
                    }
                  </tbody>
                </Table>
              </Col>

              <Col xs="12">
                <h4>{this.state.dictionary['reservationInfoAdditionalAddonTitle']}</h4>
                <Table>
                  <thead>
                    <tr>
                      <th>{this.state.dictionary['reservationInfoAdditionalAddonContent']}</th>
                      <th>{this.state.dictionary['reservationInfoAdditionalAddonPrice']}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {
                      this.props.addon.length
                      ?
                      this.props.addon.map( (addon, index) => {
                        return(
                          <tr key={`cateringKey_${index}`}>
                            <td>{addon['name']}</td>
                            <td>{`${parseInt(addon['total']).toLocaleString('en')} rsd`}</td>
                          </tr>
                        )
                      })
                      :
                      <tr><td><p>{this.state.dictionary['reservationInfoAdditionalAddonNone']}</p></td></tr>
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


