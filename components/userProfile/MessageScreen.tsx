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
};

export default class MessageScreen extends React.Component <MyProps, MyState>{

	constructor(props){
    super(props);

    this.componentObjectBinding = this.componentObjectBinding.bind(this);

    const bindingFunctions = ['toggleMobileOptions', 'setMessage', 'toggleExplain', 'activateConversation', 'getBackToCon', 'goSendMessage'];
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

  	this.setState({ activeConversation: conversation['_id'], hiddenConversations: hiddenObj, activeMessages: conversation['messages'], activeConversationObj: conversation });
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
  	}
  	
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
		        		<h2>Poruke</h2>
		        		<span onClick={ this.toggleExplain }>Pogledajte objašnjenje</span>
		        		<p style={!this.state.viewExplain && this.props.isMobile ? {"display": "none"} : {"display": "block"} }>Opcija poruka služi da biste sa prostorom gde se organizuje proslava (prostor) razmenili ključne informacije u vezi sa eventualnim promenama na aktivnoj rezervaciji. Kao i da bi o nekom potencijalnom dogovoru postojao pismeni trag u našem sistemu. Kada poruku pošaljete, prostor odmah dobija njenu sadržinu i potrudiće se da odgovori u najkraćem mogućem roku. Na raspolaganju vam je 10 poruka po aktivnoj rezervaciji, iskoristite ih samo za one najbitnije informacije. Ukoliko vam ovih 10 poruka nije dovoljno detaljnom pregledu vaše rezervacije možete videti kontakt telefon prostora.</p>
		        		<span className="backIcon" id="backToConversationID" onClick={ this.getBackToCon }></span>
		        		<a href="viber://pa?chatURI=trilino">Viber bot</a>
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
					        			<p><strong>Rezervacija: </strong>{conver['reservation']}</p>
					        			<p><strong>Datum: </strong>{renderDate(conver['validUntil'])}</p>
					        			<p><strong>Prostor: </strong>{conver['partnerName']}</p>
					        		</div>
		        				)
		        			})
		        			:
		        			<p className="noOptions">Trenutno ne postoji nijedna aktivna rezervacija</p>
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
			        							<span>{`${item['sender'] !== this.props.target ? this.state.activeConversationObj[this.state.nameCatcher] : 'You' } ${item['time']}`}</span>
						        				<p>{item['message']}</p>
			        						</div>
						        			<br/>
						        		</div>
			        				)
			        			})
			        			:
			        			<p className="noOptions">Trenutno ne postoji nijedna poruka u vezi sa ovom rezervacijom</p>
			        			:
			        			<p className="noOptions">Izaberite rezervaciju za koju želite da vidite poruke</p>
			        		}
		        		</div>
		        		
		        		<div className="texter">
		        			<PlainText
		        				placeholder="Vaša poruke (maks. 256 karaktera)" 
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