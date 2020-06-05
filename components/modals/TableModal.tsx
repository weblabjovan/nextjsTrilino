import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table } from 'reactstrap';

type MyProps = {
  isOpen: boolean;
  toggle(): void;
  data: object;
};

interface MyState {
  
};


export default class ConfirmationModal extends React.Component <MyProps, MyState> {

  render() {
    return (
     <div>
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle}>Info za fakturu</ModalHeader>
        <ModalBody>
        	<Table>
        		<tbody>
        			{
        				Object.keys(this.props.data).map( (key, index) => {
        					return(
        						<tr key={`modalTab_${index}`}>
						          <td>{this.props.data[key]['placeholder']}</td>
						          <td>{this.props.data[key]['value']}</td>
						        </tr>
        					)
        				})
        			}
        		</tbody>
        	</Table>
        </ModalBody>
        <ModalFooter>

        </ModalFooter>
      </Modal>
    </div>
      
    );
  }
}