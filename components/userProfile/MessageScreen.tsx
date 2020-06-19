import React from 'react';
import { Container, Row, Col, Button, Alert } from 'reactstrap';
import { getLanguage } from '../../lib/language';
import { getArrayObjectByFieldValue, currencyFormat, renderDate, renderDateWithTime } from '../../lib/helpers/generalFunctions';
import PlainText from '../form/textField';

interface MyProps {
  // using `interface` is also ok
  lang: string;
  isMobile: boolean;
  getConversations(): void;
  sendMessage(data:object):void;
  conversations?: Array<object>;
  target: string;
};

interface MyState {
	dictionary: object;
	viewExplain: boolean;
	disableMessage: boolean;
	messageTxt: string;
	activeConversation: string;
	activeConversationObj: object;
	hiddenConversations: object;
	activeMessages: Array<object>;
	error: boolean;
	nameCatcher: string;
	messageAlert: boolean;
};

export default class MessageScreen extends React.Component <MyProps, MyState>{

	constructor(props){
    super(props);

    this.componentObjectBinding = this.componentObjectBinding.bind(this);

    const bindingFunctions = ['toggleMobileOptions', 'setMessage', 'toggleExplain', 'activateConversation', 'getBackToCon', 'goSendMessage', 'countSentMessages', 'closeMessageAlert'];
    this.componentObjectBinding(bindingFunctions);
  }

  componentObjectBinding(array){
    array.map( item => {
      this[item] = this[item].bind(this);
    })
  }

	state: MyState = {
    dictionary: getLanguage(this.props.lang),
    viewExplain: false,
    disableMessage: false,
    messageTxt: '',
    activeConversation: '',
    activeConversationObj: {},
    hiddenConversations: {},
    activeMessages: [],
    error: false,
    nameCatcher: this.props.target === 'partner' ? 'userName' : 'partnerName',
    messageAlert: false,
  };


  toggleMobileOptions(){
  	console.log()
  }

  setMessage(text){
  	this.setState({ messageTxt: text });
  }

  toggleExplain(){
  	this.setState({ viewExplain: !this.state.viewExplain });
  }

  activateConversation(conversation: object){

  	if (this.state.activeConversation) {
  		let old = document.getElementById(this.state.activeConversation);
  		old.classList.remove("active");
  	}

  	let el = document.getElementById(conversation['_id']);
  	el.classList.add("active");

  	const hiddenObj = {};

  	if (window.innerWidth < 450) {
  		const messenger = document.getElementById('messagePartID');
  		messenger.classList.add("display");

  		const back = document.getElementById('backToConversationID');
  		back.classList.add("display");

  		for (var i = 0; i < this.props.conversations.length; i++) {
  			if (this.props.conversations[i]['_id'] === conversation['_id']) {
  				hiddenObj[this.props.conversations[i]['_id']] = false;
  			}else{
  				hiddenObj[this.props.conversations[i]['_id']] = true;
  			}
  		}
  	}

  	this.setState({ activeConversation: conversation['_id'], hiddenConversations: hiddenObj, activeMessages: conversation['messages'], activeConversationObj: conversation }, () => {
  		const element = document.getElementById("messenger");
			element.scrollTop = element.scrollHeight;
  	});
  }

  getBackToCon(){
  	if (window.innerWidth < 450) {
  		let old = document.getElementById(this.state.activeConversation);
  		old.classList.remove("active");

  		const messenger = document.getElementById('messagePartID');
  		messenger.classList.remove("display");

  		const back = document.getElementById('backToConversationID');
  		back.classList.remove("display");
  	}
  	
  	this.setState({ activeConversation: '', hiddenConversations: {}, activeMessages: [], activeConversationObj: {} });
  }

  goSendMessage(){
  	if (this.state.messageTxt && this.state.activeConversation) {
  		if (this.countSentMessages(this.state.activeConversationObj['messages']) < 10) {
  			const now = new Date();
		  	const data = {
		  		language: this.props.lang,
		  		id: this.state.activeConversationObj['_id'],
		  		time: renderDateWithTime(now),
		  		message: this.state.messageTxt,
		  		sender: this.props.target,
		  	}

		  	const activeConversationObjCopy = JSON.parse(JSON.stringify(this.state.activeConversationObj));
		  	activeConversationObjCopy['messages'].push(data);
		  	this.props.sendMessage(data);
		  	this.setState({ messageTxt: '',  activeMessages: [...this.state.activeMessages, data], activeConversationObj: activeConversationObjCopy}, () => {
		  		const element = document.getElementById("messenger");
					element.scrollTop = element.scrollHeight;
		  	});
  		}else{
  			this.setState({ messageAlert: true, messageTxt: '' });
  		}
  		
  	}
  }

  countSentMessages(messages: Array<object>){
  	let count = 0;
  	for (var i = 0; i < messages.length; i++) {
  		if (messages[i]['sender'] === this.props.target) {
  			count = count + 1;
  		}
  	}

  	return count;
  }

  closeMessageAlert(){
  	this.setState({ messageAlert: false });
  }


  componentDidMount(){
  	this.props.getConversations();
  	const element = document.getElementById("messenger");
		element.scrollTop = element.scrollHeight;
  }


	
  render() {
    return(

    	<Container>
    		{
    			<div className="messageScreen">

		        <Row>
		        	<Col xs ="12" className="headline">
		        		<h2>{this.state.dictionary['messageScreenTitle']}</h2>
		        		<span onClick={ this.toggleExplain }>{this.state.dictionary['messageScreenShowExplain']}</span>
		        		<p style={!this.state.viewExplain && this.props.isMobile ? {"display": "none"} : {"display": "block"} }>{this.props.target === 'user' ? this.state.dictionary['messageScreenExplainUser'] : this.state.dictionary['messageScreenExplainPartner'] }</p>
		        		<span className="backIcon" id="backToConversationID" onClick={ this.getBackToCon }></span>
		        	</Col>
		        </Row>

		        <Row className="conversation">
		        	<Col xs="12" sm="4" className="conversationList">
		        		{
		        			this.props.conversations.length
		        			?
		        			this.props.conversations.map((conver, index) => {
		        				return(
		        					<div hidden={Object.keys(this.state.hiddenConversations).length ? this.state.hiddenConversations[conver['_id']] : false } className="conversationItem" id={conver['_id']} onClick={() => this.activateConversation(conver)} key={`conversation_${index}`}>
					        			<p><strong>{this.state.dictionary['paymentUserEmailOrderId']} </strong>{conver['reservation']}</p>
					        			<p><strong>{this.state.dictionary['paymentUserEmailDate']} </strong>{renderDate(conver['validUntil'])}</p>
					        			<p><strong>{this.state.dictionary['paymentUserEmailPartnerName']} </strong>{conver['partnerName']}</p>
					        		</div>
		        				)
		        			})
		        			:
		        			<p className="noOptions">{this.state.dictionary['messageScreenNoActiveRes']}</p>
		        		}
		        	</Col>
		        	<Col xs="12" sm="8" className="messagePart" id="messagePartID">
		        		<div className="messageList" id="messenger">
		        			{
		        				this.state.activeConversation
			        			?
			        			this.state.activeMessages.length
			        			?
			        			this.state.activeMessages.map( (item, index) => {
			        				return(
			        					<div className="message" key={`message_${index}`}>
			        						<div className={`content ${item['sender'] !== this.props.target  ? 'notYou' : '' }`}>
			        							<span>{`${item['sender'] !== this.props.target ? this.state.activeConversationObj[this.state.nameCatcher] : this.state.dictionary['messageScreenYourside'] } ${item['time']}`}</span>
						        				<p>{item['message']}</p>
			        						</div>
						        			<br/>
						        		</div>
			        				)
			        			})
			        			:
			        			<p className="noOptions">{this.state.dictionary['messageScreenNoMessages']}</p>
			        			:
			        			<p className="noOptions">{this.state.dictionary['messageScreenChooseConvers']}</p>
			        		}
		        		</div>

		        		<Alert color="danger" isOpen={ this.state.messageAlert } toggle={this.closeMessageAlert} >
	                <p style={{"textAlign":"center", "fontSize":"16px"}}>{this.state.dictionary['messageScreenAlertText']}</p>
	              </Alert>
		        		
		        		<div className="texter">
		        			<PlainText
		        				placeholder={this.state.dictionary['messageScreenTextPlaceholder']}
										className="textField"
										disabled={ this.state.disableMessage } 
										onChange={ (event) => this.setMessage(event.target.value)} 
										value={this.state.messageTxt} 
										max={256} 		
		        			/>

		        			<div className="sndText" onClick={ this.goSendMessage }>
		        				<span></span>
		        			</div>
		        		</div>
		        		
		        	</Col>

		        </Row>
	        </div>
    		}
      </Container>
    ) 
  }
}