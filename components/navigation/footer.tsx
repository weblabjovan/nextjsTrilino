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
			<div className="footerWrapper">
				<Container fluid>
		        <Row>
		        <Col xs='12' sm="6" >
		          	<ul>
		          		<li><a href={`/login?language=${this.props.language.toLowerCase()}`}>{this.props.login}</a></li>
		          		<li><a href={`/search?language=${this.props.language.toLowerCase()}`}>{this.props.search}</a></li>
		          		<li><a href="/">{this.props.faq}</a></li>
		          		<li><a href={`/partnership?language=${this.props.language.toLowerCase()}`}>{this.props.partnership}</a></li>
		          		<li><a href="/">{this.props.contact}</a></li>
		          	</ul>
		         </Col>
		         <Col xs='12' sm="6" >
		          	<div className="leftWrap">
		          		<div className="logo">
			          		<a href={`/?language=${this.props.language.toLowerCase()}`}><img src="/static/logo_bottom.png" alt="trilino-logo"></img></a>
			          	</div>
			          	<div className="socialWrapper">
			          		<a href="https://www.instagram.com/?hl=en"><img src="/static/inst.jpg" alt="trilino-instagram"></img></a>
			          		<a href="https://www.linkedin.com"><img src="/static/link.jpg" alt="trilino-linkedin"></img></a>
			          		<a href="https://twitter.com/?lang=en"><img src="/static/twitter.jpg" alt="trilino-twitter"></img></a>
			          	</div>
		          	</div>
		          </Col>
		          <Col xs='12' className="footerLastStripe">
		          	<p className="middle">&copy;   Trilino.com   2020</p>
		          </Col>
		        </Row>
		        </Container>
			</div>
		)
	}
}