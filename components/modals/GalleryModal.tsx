import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

type MyProps = {
	title: string;
  isOpen: boolean;
  toggle(): void;
  photo: string;
  index: number;
  max: number;
  text: string;
  from: string;
  changePhoto(action: string): void;
};

interface MyState {
  
};


export default class ConfirmationModal extends React.Component <MyProps, MyState> {

  render() {
    return (
     <div>
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} className="galleryModal">
        <ModalHeader toggle={this.props.toggle}>{this.props.title}</ModalHeader>
        <ModalBody>
          <div className="photo" style={ {'background': 'url('+this.props.photo+') center / cover no-repeat'}}>
            <span className="goBack" onClick={ () => this.props.changePhoto('back')}></span>
            <span className="goNext" onClick={ () => this.props.changePhoto('next')}></span>
          </div>
        </ModalBody>
        <ModalFooter>
        	<div className="actionHolder">
        	</div>
        	<span className="numbers">{`${this.props.index + 1} ${this.props.from} ${this.props.max} ${this.props.text}`}</span>
        </ModalFooter>
      </Modal>
    </div>
      
    );
  }
}


