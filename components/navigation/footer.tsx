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
  terms: string;
  // using `interface` is also ok
};
type MyState = {

};

export default class Footer extends React.Component <MyProps, MyState> {

	render(){
		const date = new Date();
		return(
			<div className="footerWrapper">
				<Container fluid>
		        <Row>
			        <Col xs='12' sm="7" lg="6" className="menuOptions">
		          	<ul>
		          		<li><a href={`/login?language=${this.props.language.toLowerCase()}`}>{this.props.login}</a></li>
		          		<li><a href={`/search?language=${this.props.language.toLowerCase()}&date=${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}&city=null&district=null`}>{this.props.search}</a></li>
		          		<li><a href={`/partnership?language=${this.props.language.toLowerCase()}`}>{this.props.partnership}</a></li>
		          		<li><a href={`/contact?language=${this.props.language.toLowerCase()}`}>{this.props.contact}</a></li>
		          	</ul>
		          	<ul>
		          		<li><a href={`/terms?language=${this.props.language.toLowerCase()}`}>{this.props.terms}</a></li>
		          		<li><a href={`/`}>{this.props.faq}</a></li>
		          		<li><a href={`/onlinePayments?language=${this.props.language.toLowerCase()}`}>Online plaćanje</a></li>
		          		<li><a href={`/`}>Izjava privatnosti</a></li>
		          	</ul>
			        </Col>
			        <Col xs='12' sm="5" lg="6">
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
 
		        </Row>

		        <Row className="cardBrands">
		        	<Col xs="12" sm="4" className="cards">
	        			<img src="/static/visa.png" alt="visa" title="visa"></img>
	        			<img src="/static/mastercard.svg" alt="mastercard" title="mastercard"></img>
	        			<img src="/static/maestro.svg" alt="maestro" title="maestro"></img>
	        			<img src="/static/amex.svg" alt="american express" title="american express"></img>
	        		</Col>
	        		<Col xs="12" sm="4" className="banks">
	        			<a href="https://www.bancaintesa.rs/pocetna.1.html">
	        				<img src="/static/banca-intesa.svg" alt="banka intesa" title="banka intesa"></img>
	        			</a>
	        		</Col>
	        		<Col xs="12" sm="4" className="security">
	        			<a href="https://www.mastercard.rs/sr-rs/consumers/find-card-products/credit-cards.html">
	        				<img src="/static/mastercardsec.svg" alt="mastercard security" title="mastercard security"></img>
	        			</a>
	        			<a href="https://rs.visa.com/pay-with-visa/security-and-assistance/protected-everywhere.html">
	        				<img src="/static/verified-by-visa.svg" alt="verified-by-visa" title="verified by visa"></img>
	        			</a>
	        		</Col>
		        </Row>
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