import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import CheckBox from '../form/checkbox';

type MyProps = {
	title: string;
  text: string;
  isOpen: boolean;
  toggle(): void;
  buttonColor: string;
  buttonText: string;
  checkboxLabel: string;
  vatInfo: string;
  clickFunction?(data: any): void;
};

interface MyState {
  check: boolean;
  buttonDisable: boolean;
};


export default class PaymentModal extends React.Component <MyProps, MyState> {
  state: MyState = {
    check: false,
    buttonDisable: true,
  }

  changePaymentReady(){
    this.setState({check: !this.state.check, buttonDisable: !this.state.buttonDisable})
  }

  render() {
    return (
     <div>
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle}>{this.props.title}</ModalHeader>
        <ModalBody>
          {this.props.text}
          <div className="paymentModal">
            <CheckBox
              disabled={ false }
              checked={ this.state.check }
              field="paymentReady"
              onChange={ () => this.changePaymentReady() }
              label={ this.props.checkboxLabel }
              orientation="back"
            />
          </div>
          
        </ModalBody>
        <ModalFooter>
          <Button disabled={this.state.buttonDisable} color={ this.props.buttonColor } onClick={ this.props.clickFunction }>{ this.props.buttonText }</Button>
        </ModalFooter>
        <p className="paymentModalVAT">{this.props.vatInfo}</p>
      </Modal>
    </div>
      
    );
  }
}


