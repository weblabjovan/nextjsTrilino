import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

type MyProps = {
	title: string;
  text: string;
  isOpen: boolean;
  toggle(): void;
  buttonColor: string;
  buttonText: string;
  clickFunction?(data: any): void;
};

interface MyState {
  
};


export default class ConfirmationModal extends React.Component <MyProps, MyState> {

  render() {
    return (
     <div>
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle}>{this.props.title}</ModalHeader>
        <ModalBody>
          {this.props.text}
        </ModalBody>
        <ModalFooter>
          <Button color={ this.props.buttonColor } onClick={ this.props.clickFunction }>{ this.props.buttonText }</Button>
        </ModalFooter>
      </Modal>
    </div>
      
    );
  }
}


