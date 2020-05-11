import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { getLanguage } from '../../lib/language';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style/style.scss';

interface MyProps {
  // using `interface` is also ok
  lang: string;
  isMobile: boolean;
  changeScreen(screen: string): void;
  screen: string;
};

interface MyState {
	dictionary: object;
	mobileOptions: boolean;
};

export default class UserSubNavigation extends React.Component <MyProps, MyState>{

	constructor(props){
    super(props);

    this.componentObjectBinding = this.componentObjectBinding.bind(this);

    const bindingFunctions = ['toggleMobileOptions', 'chooseMobileOption'];
    this.componentObjectBinding(bindingFunctions);
  }

  componentObjectBinding(array){
    array.map( item => {
      this[item] = this[item].bind(this);
    })
  }

	state: MyState = {
    dictionary: getLanguage(this.props.lang),
    mobileOptions: false,
  };

  toggleMobileOptions(){
  	this.setState({mobileOptions: !this.state.mobileOptions});
  }

  chooseMobileOption(option: string){
  	this.setState({mobileOptions: !this.state.mobileOptions}, () => {
  		this.props.changeScreen(option);
  	});
  }

	
  render() {
    return(
    	<Container>
        <div className="userSubNav">
      	{
      		this.props.isMobile
      		?
      		(
      			<Row className="mobileSubNav">
        			
        			{
        				!this.state.mobileOptions
        				?
        				(
        					<Col xs="12">
        						<div className="options-btn" onClick={ this.toggleMobileOptions }>
	        						<label></label>
	        					</div>
        					</Col>
        					
        				)
        				:
        				(
        					<div className="darkCover" >
        						<Col xs="12">
        							<Row>
        								<Col xs="12">
        									<div className="close">
		        								<label onClick={ this.toggleMobileOptions }></label>
		        							</div>
        								</Col>
        							</Row>
        							
	        					</Col>

	        					<Col xs="12">
	        						<Row>
	        							<Col xs="6" sm="4" lg="3" >
	        								<div className="mobileOption" onClick={ () => this.chooseMobileOption('reservation')}>
	        									<label className="reservation-option"></label>
	        									<p>{this.state.dictionary['userProfileSubNavReservation']}</p>
	        								</div>
	        							</Col>

	        							<Col xs="6" sm="4" lg="3">
	        								<div className="mobileOption" onClick={ () => this.chooseMobileOption('message')}>
	        									<label className="message-option"></label>
	        									<p>{this.state.dictionary['userProfileSubNavMessage']}</p>
	        								</div>
	        							</Col>

	        							<Col xs="6" sm="4" lg="3">
	        								<div className="mobileOption" onClick={ () => this.chooseMobileOption('logout')}>
	        									<label className="logout-option"></label>
	        									<p>{this.state.dictionary['userProfileSubNavLogout']}</p>
	        								</div>
	        							</Col>
	        						</Row>
	        					</Col>
        					</div>
        				)
        			}
      			</Row>
      		)
      		:
      		(
      			<Row className="desktopSubNav" hidden={ this.props.screen === 'rating' ? true : false }>
      				<div className={`${this.props.screen === 'reservation' ? "active" : ''} item`} onClick={() => this.props.changeScreen('reservation')} >
      					<p>{this.state.dictionary['userProfileSubNavReservation']}</p>
      				</div>
      				<div className={`${this.props.screen === 'message' ? "active" : ''} item`} onClick={() => this.props.changeScreen('message')}>
      					<p>{this.state.dictionary['userProfileSubNavMessage']}</p>
      				</div>
      				<div className={`${this.props.screen === 'logout' ? "active" : ''} item`} onClick={() => this.props.changeScreen('logout')}>
      					<p>{this.state.dictionary['userProfileSubNavLogout']}</p>
      				</div>
      			</Row>
      		)
      	}
      	</div>
      </Container>
    ) 
  }
}