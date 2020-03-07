import React from 'react';
import { Container, Row, Col, Button } from 'reactstrap';


type MyProps = {
	isMobile: boolean;
  language: string;
  page: string;
  login: string;
  search: string;
  faq: string;
  partnership: string;
  contact: string; 
  // using `interface` is also ok
};
type MyState = {

};

export default class Footer extends React.Component <MyProps, MyState> {

	render(){
		return(
			<div className="footerWrapper partnerPadd">
				<Container fluid>
		        <Row>
		          <Col xs='12' className="footerLastStripe">
		          	<p className="middle">&copy;   Trilino.com   2020</p>
		          </Col>
		        </Row>
		        </Container>
			</div>
		)
	}
}