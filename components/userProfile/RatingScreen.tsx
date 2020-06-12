import React from 'react';
import { Container, Row, Col, Button, Alert } from 'reactstrap';
import { getLanguage } from '../../lib/language';
import { getArrayObjectByFieldValue, currencyFormat } from '../../lib/helpers/generalFunctions';
import PlainText from '../form/textField';

interface MyProps {
  // using `interface` is also ok
  lang: string;
  isMobile: boolean;
  goBack(): void;
  sendRatingData(data: object): void;
  reservation?: null | object;
};

interface MyState {
	dictionary: object;
	rating: object;
	comment: string;
	error: boolean;
};

export default class UserBill extends React.Component <MyProps, MyState>{

	constructor(props){
    super(props);

    this.componentObjectBinding = this.componentObjectBinding.bind(this);

    const bindingFunctions = ['toggleMobileOptions', 'rateSingle', 'setComment', 'saveRating', 'validateRating', 'closeAlert', 'formatDate'];
    this.componentObjectBinding(bindingFunctions);
  }

  componentObjectBinding(array){
    array.map( item => {
      this[item] = this[item].bind(this);
    })
  }

	state: MyState = {
    dictionary: getLanguage(this.props.lang),
    rating: { },
    comment: '',
    error: false,
  };


  toggleMobileOptions(){
  	console.log()
  }

  validateRating(rating: object){
  	const ratingCategories = ['overall', 'trust', 'hygiene', 'space', 'content', 'staff', 'location', 'value'];
  	if (Object.keys(rating).length !== ratingCategories.length) {
  		return false;
  	}
  	for (let key in rating) {
  		if (ratingCategories.indexOf(key) === -1) {
  			return false;
  		}

  		if (!Number.isInteger(rating[key]) || rating[key] > 5|| rating[key] < 1) {
  			return false;
  		}
  	}

  	return true;
  }

  saveRating(){
  	const ratingCopy = JSON.parse(JSON.stringify(this.state.rating));
  	const commentCopy = JSON.parse(JSON.stringify(this.state.comment));
  	if (this.validateRating(ratingCopy)) {
  		this.setState({ error: false}, () => {
  			const ratingResult = { rating: ratingCopy, comment: commentCopy};
  			this.props.sendRatingData(ratingResult);
  		})
  		
  	}else{
  		this.setState({ error: true});
  	}
  }

  setComment(text){
  	this.setState({ comment: text });
  }

  
  rateSingle(event){
  	const obj = event.target.getAttribute('data-object');
  	const num = event.target.getAttribute('data-num');
  	const ratingCopy = JSON.parse(JSON.stringify(this.state.rating));

  	for (var i = 1; i < 6; ++i) {
  		const el = document.querySelector(`.${obj} [data-num="${i}"]`) as HTMLElement;
  		if (i <= num) {
  			el.style.color = "#f2af36";
  		}else{
  			el.style.color = "#afafaf";
  		}
  	}

  	ratingCopy[obj] = parseInt(num);

  	this.setState({ rating: ratingCopy });
  }

  formatDate(date: string){
  	const base = date.split('T');
  	return `${base[0].split('-')[2]}.${base[0].split('-')[1]}.${base[0].split('-')[0]}`; 
  }

  closeAlert(){
    this.setState({error: false});
  }

	
  render() {
    return(

    	<Container>
    		{
    			this.props.reservation
    			?
    			this.props.reservation['forRating']
    			?
    			(
    				<div className="userRating">

			        <Row className="headline">
			        	<Col xs="12">
			        		<h2>{this.state.dictionary['ratingHeadlineTitle']}</h2>
			        		<p className="reference">{`${this.state.dictionary['ratingHeadlineReference1']} ${this.props.reservation['guest']}${this.state.dictionary['ratingHeadlineReference2']} ${this.formatDate(this.props.reservation['date'])} ${this.state.dictionary['ratingHeadlineReference3']} ${this.props.reservation['partnerObj'][0]['name']}`}</p>
			        		<p className="instruction">{this.state.dictionary['ratingHeadlineInstruction']}</p>
			        		<div className="middle">
			        			<a onClick={ () => this.props.goBack() }>{this.state.dictionary['ratingHeadlineLink']}</a>
			        		</div>
			        		
			        	</Col>
			        </Row>

			        <Row className="form">
			        	<Col xs="12" sm="4" lg="2">
			        		<p className="main">{this.state.dictionary['ratingFormOverall']}</p>
			        		<p className="explain">{this.state.dictionary['ratingFormOverallText']}</p>
			        	</Col>
			        	<Col xs="12" sm="8" lg="4" className="overall stars">
			        		<span className="icon" data-num="1" data-object="overall" onClick={ (e) => this.rateSingle(e)}></span>
			        		<span className="icon" data-num="2" data-object="overall" onClick={ (e) => this.rateSingle(e)}></span>
			        		<span className="icon" data-num="3" data-object="overall" onClick={ (e) => this.rateSingle(e)}></span>
			        		<span className="icon" data-num="4" data-object="overall" onClick={ (e) => this.rateSingle(e)}></span>
			        		<span className="icon" data-num="5" data-object="overall" onClick={ (e) => this.rateSingle(e)}></span>
			        	</Col>

			        	<Col xs="12" sm="4" lg="2">
			        		<p className="main">{this.state.dictionary['ratingFormTrust']}</p>
			        		<p className="explain">{this.state.dictionary['ratingFormTrustText']}</p>
			        	</Col>
			        	<Col xs="12" sm="8" lg="4" className="trust stars">
			        		<span className="icon" data-num="1" data-object="trust" onClick={ (e) => this.rateSingle(e)}></span>
			        		<span className="icon" data-num="2" data-object="trust" onClick={ (e) => this.rateSingle(e)}></span>
			        		<span className="icon" data-num="3" data-object="trust" onClick={ (e) => this.rateSingle(e)}></span>
			        		<span className="icon" data-num="4" data-object="trust" onClick={ (e) => this.rateSingle(e)}></span>
			        		<span className="icon" data-num="5" data-object="trust" onClick={ (e) => this.rateSingle(e)}></span>
			        	</Col>
			        </Row>

			        <hr/>

			        <Row className="form">
			        	<Col xs="12" sm="4" lg="2">
			        		<p className="main">{this.state.dictionary['ratingFormSpace']}</p>
			        		<p className="explain">{this.state.dictionary['ratingFormSpaceText']}</p>
			        	</Col>
			        	<Col xs="12" sm="8" lg="4" className="space stars">
			        		<span className="icon" data-num="1" data-object="space" onClick={ (e) => this.rateSingle(e)}></span>
			        		<span className="icon" data-num="2" data-object="space" onClick={ (e) => this.rateSingle(e)}></span>
			        		<span className="icon" data-num="3" data-object="space" onClick={ (e) => this.rateSingle(e)}></span>
			        		<span className="icon" data-num="4" data-object="space" onClick={ (e) => this.rateSingle(e)}></span>
			        		<span className="icon" data-num="5" data-object="space" onClick={ (e) => this.rateSingle(e)}></span>
			        	</Col>

			        	<Col xs="12" sm="4" lg="2">
			        		<p className="main">{this.state.dictionary['ratingFormHygiene']}</p>
			        		<p className="explain">{this.state.dictionary['ratingFormHygieneText']}</p>
			        	</Col>
			        	<Col xs="12" sm="8" lg="4" className="hygiene stars">
			        		<span className="icon" data-num="1" data-object="hygiene" onClick={ (e) => this.rateSingle(e)}></span>
			        		<span className="icon" data-num="2" data-object="hygiene" onClick={ (e) => this.rateSingle(e)}></span>
			        		<span className="icon" data-num="3" data-object="hygiene" onClick={ (e) => this.rateSingle(e)}></span>
			        		<span className="icon" data-num="4" data-object="hygiene" onClick={ (e) => this.rateSingle(e)}></span>
			        		<span className="icon" data-num="5" data-object="hygiene" onClick={ (e) => this.rateSingle(e)}></span>
			        	</Col>
			        </Row>

			         <hr/>

			        <Row className="form">
			        	<Col xs="12" sm="4" lg="2">
			        		<p className="main">{this.state.dictionary['ratingFormContent']}</p>
			        		<p className="explain">{this.state.dictionary['ratingFormContentText']}</p>
			        	</Col>
			        	<Col xs="12" sm="8" lg="4" className="content stars">
			        		<span className="icon" data-num="1" data-object="content" onClick={ (e) => this.rateSingle(e)}></span>
			        		<span className="icon" data-num="2" data-object="content" onClick={ (e) => this.rateSingle(e)}></span>
			        		<span className="icon" data-num="3" data-object="content" onClick={ (e) => this.rateSingle(e)}></span>
			        		<span className="icon" data-num="4" data-object="content" onClick={ (e) => this.rateSingle(e)}></span>
			        		<span className="icon" data-num="5" data-object="content" onClick={ (e) => this.rateSingle(e)}></span>
			        	</Col>

			        	<Col xs="12" sm="4" lg="2">
			        		<p className="main">{this.state.dictionary['ratingFormStaff']}</p>
			        		<p className="explain">{this.state.dictionary['ratingFormStaffText']}</p>
			        	</Col>
			        	<Col xs="12" sm="8" lg="4" className="staff stars">
			        		<span className="icon" data-num="1" data-object="staff" onClick={ (e) => this.rateSingle(e)}></span>
			        		<span className="icon" data-num="2" data-object="staff" onClick={ (e) => this.rateSingle(e)}></span>
			        		<span className="icon" data-num="3" data-object="staff" onClick={ (e) => this.rateSingle(e)}></span>
			        		<span className="icon" data-num="4" data-object="staff" onClick={ (e) => this.rateSingle(e)}></span>
			        		<span className="icon" data-num="5" data-object="staff" onClick={ (e) => this.rateSingle(e)}></span>
			        	</Col>
			        </Row>

			        <hr/>

			        <Row className="form">
			        	<Col xs="12" sm="4" lg="2">
			        		<p className="main">{this.state.dictionary['ratingFormLocation']}</p>
			        		<p className="explain">{this.state.dictionary['ratingFormLocationText']}</p>
			        	</Col>
			        	<Col xs="12" sm="8" lg="4" className="location stars">
			        		<span className="icon" data-num="1" data-object="location" onClick={ (e) => this.rateSingle(e)}></span>
			        		<span className="icon" data-num="2" data-object="location" onClick={ (e) => this.rateSingle(e)}></span>
			        		<span className="icon" data-num="3" data-object="location" onClick={ (e) => this.rateSingle(e)}></span>
			        		<span className="icon" data-num="4" data-object="location" onClick={ (e) => this.rateSingle(e)}></span>
			        		<span className="icon" data-num="5" data-object="location" onClick={ (e) => this.rateSingle(e)}></span>
			        	</Col>

			        	<Col xs="12" sm="4" lg="2">
			        		<p className="main">{this.state.dictionary['ratingFormValue']}</p>
			        		<p className="explain">{this.state.dictionary['ratingFormValueText']}</p>
			        	</Col>
			        	<Col xs="12" sm="8" lg="4" className="value stars">
			        		<span className="icon" data-num="1" data-object="value" onClick={ (e) => this.rateSingle(e)}></span>
			        		<span className="icon" data-num="2" data-object="value" onClick={ (e) => this.rateSingle(e)}></span>
			        		<span className="icon" data-num="3" data-object="value" onClick={ (e) => this.rateSingle(e)}></span>
			        		<span className="icon" data-num="4" data-object="value" onClick={ (e) => this.rateSingle(e)}></span>
			        		<span className="icon" data-num="5" data-object="value" onClick={ (e) => this.rateSingle(e)}></span>
			        	</Col>
			        </Row>

			        <Row>
			        	<Col xs="12">
			        		<div className="comment">
			        			<h3>{this.state.dictionary['ratingFormComment']}</h3>
			        			<PlainText
				        			placeholder={this.state.dictionary['ratingFormCommentPlaceholder']}
				        			onChange={ (event) => this.setComment(event.target.value) }
				        			value={ this.state.comment }
				        			max={ 280 }
				        		/>
			        		</div>
			        		
			        	</Col>
			        </Row>

			        <Row>
          		<Col xs="12">
          			<Alert color="danger" isOpen={ this.state.error } toggle={this.closeAlert} >
                  <p>{this.state.dictionary['ratingAlert']}.</p>
                </Alert>
          		</Col>
          	</Row>

			        <Row>
		            <Col xs="12">
		            	<div className="middle">
										<Button color="success" onClick={ this.saveRating } >{this.state.dictionary['uniSend']}</Button>
									</div>
		            </Col>
		          </Row> 

		        </div>
    			)
    			:
    			(
    				<div className="userRating">

			        <Row className="headline">
			        	<Col xs="12">
			        		<h2>{this.state.dictionary['ratingNoRateTitle']}</h2>
			        		<p className="reference">{this.state.dictionary['ratingNoRateText']}</p>
			        		<p className="instruction"></p>
			        		<div className="middle">
			        			<a onClick={ () => this.props.goBack() }>{this.state.dictionary['ratingNoRateLink']}</a>
			        		</div>
			        		
			        	</Col>
			        </Row>
			      </div>
    			)
    			:
    			null
    		}
      </Container>
    ) 
  }
}