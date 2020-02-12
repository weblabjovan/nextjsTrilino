import React from 'react';
import { Container, Row, Col } from 'reactstrap';

type MyProps = {
  num: number;
  name: string;
  active: boolean;
  clickable: boolean;
  clickFunction(step: number): void;
  id: string;
  
  // using `interface` is also ok
};
type MyState = {

}

export default class ResStep extends React.Component <MyProps, MyState> {



  render() {

    return (
      <Row className="resStep" id={this.props.id}>
        <Col xs="12">
          <div className={`stepHeadline ${this.props.active ? " active " : null} ${this.props.clickable ? " click " : null}`} onClick={ () => this.props.clickFunction(this.props.num) }>
            <div className="allWhite">
              <div className="numWrapper">
                <h4>{this.props.num}</h4>
              </div>
            </div>
          </div>
        </Col>
        <Col xs="12"><h5>{this.props.name}</h5></Col>
      </Row>
      
    );
  }
}


