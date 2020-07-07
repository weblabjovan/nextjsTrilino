import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from '../components/loader';
import { Container, Row, Col } from 'reactstrap';
import { setUserLanguage } from '../actions/user-actions';
import { getPartnerProfile, changeSinglePartnerField, getPartnerConversations, sendPartnerMessage } from '../actions/partner-actions';
import { getLanguage } from '../lib/language';
import { setUpLinkBasic } from '../lib/helpers/generalFunctions';
import { isMobile } from '../lib/helpers/generalFunctions';
import PartnerNavigationBar from '../components/navigation/partnerNavbar';
import PartnerProfileScreen from '../components/partnerProfile/partnerProfileScreen';
import Footer from '../components/navigation/partnerFooter';

interface MyProps {
  // using `interface` is also ok
  userLanguage: string;
  setUserDevice(userAgent: string): boolean;
  setUserLanguage(language: string): string;
  changeSinglePartnerField(field: string, value: any): any;
  getPartnerProfile(link: object, auth: string): object;
  getPartnerConversations(link: object, data: object, auth: string): void;
  sendPartnerMessage(link: object, data: object, auth: string): void;
  getPartnersConversationsStart: boolean;
  getPartnersConversationsError: object | boolean;
  getPartnersConversationsSuccess: null | number;
  sendPartnerMessageStart: boolean;
  sendPartnerMessageError: object | boolean;
  sendPartnerMessageSuccess: null | number;
  conversations: Array<object>;
  userAgent: string;
  path: string;
  fullPath: string;
  lang: string;
  link: object;
  partnerObject: object;
  token?: string | undefined;
};
interface MyState {
	language: string;
	dictionary: object;
	isMobile: boolean;
  activeScreen: string;
  loader: boolean;
};

class PartnerProfileView extends React.Component <MyProps, MyState>{

  constructor(props){
    super(props);

    this.componentObjectBinding = this.componentObjectBinding.bind(this);

    const bindingFunctions = ['changeScreen', 'changeLanguage', 'openLoader', 'closeLoader', 'getMyPartnerConversations', 'sendMessage' ];
    this.componentObjectBinding(bindingFunctions);
  }

  componentObjectBinding(array){
    array.map( item => {
      this[item] = this[item].bind(this);
    })
  }

	state: MyState = {
      language: this.props.lang,
      dictionary: getLanguage(this.props.lang),
      isMobile: isMobile(this.props.userAgent),
      activeScreen: 'calendar',
      loader: true,
    };

  changeScreen(event){
    this.setState({ activeScreen: event.target.id}, () => {
      if (!this.props.partnerObject['forActivation']) {
        this.props.changeSinglePartnerField('activationAlert', true);
      }
      
      window.scrollTo(0,0);
    });
  }

  changeLanguage(lang){
    let language = 'sr';
    if (lang === 'en') {
      language = 'en';
    }

    this.setState({ language })
  }

  openLoader(){
    this.setState({ loader: true });
  }

  closeLoader(){
    this.setState({ loader: false});
  }

  getMyPartnerConversations(){
    this.setState({ loader: true}, () => {
      if (this.props.token) {
        this.props.getPartnerConversations(this.props.link, {language: this.props.lang}, this.props.token);
      }
    })
  }

  sendMessage(data: object){
    this.setState({ loader: true}, () => {
      if (this.props.token) {
        this.props.sendPartnerMessage(this.props.link, data, this.props.token);
      }
    })
  }

  componentDidUpdate(prevProps: MyProps, prevState:  MyState){
    if (!this.props.getPartnersConversationsStart && prevProps.getPartnersConversationsStart && this.props.getPartnersConversationsSuccess && !prevProps.getPartnersConversationsSuccess && !this.props.getPartnersConversationsError) {
      this.setState({ loader: false });
    }

    if (!this.props.sendPartnerMessageStart && prevProps.sendPartnerMessageStart && this.props.sendPartnerMessageSuccess && !prevProps.sendPartnerMessageSuccess && !this.props.sendPartnerMessageError) {
      this.setState({ loader: false });
    }
  }

	componentDidMount(){
    const link = setUpLinkBasic(window.location.href);
    this.props.getPartnerProfile(link, this.props.token)
		this.props.setUserLanguage(this.props.lang);
	}
	
  render() {
    return(
    	<div className="totalWrapper">
        <Loader  show={ this.state.loader } />
    		<PartnerNavigationBar 
    			isMobile={ this.state.isMobile } 
    			language={ this.state.language } 
          fullPath={ this.props.fullPath }
    			link={ this.props.link }
          changeScreen={ this.changeScreen }
          activeScreen={ this.state.activeScreen }
          changeLanguage={ this.changeLanguage }
          partner={ this.props.partnerObject ? this.props.partnerObject['name'] : '' }
    		/>
    		<PartnerProfileScreen
          lang={ this.state.language } 
          link={ this.props.link }
          screen={ this.state.activeScreen }
          openLoader={ this.openLoader }
          closeLoader={ this.closeLoader }
          token={ this.props.token }
          loader={ this.state.loader }
          isMobile={ this.state.isMobile }
          getConversationFunc={ this.getMyPartnerConversations }
          partnerConversations={ this.props.conversations }
          sendPartnerMessage={ this.sendMessage }
        />

		    <Footer 
    			isMobile={ this.state.isMobile } 
    		/>

    	</div>
    	
    ) 
  }
}

const mapStateToProps = (state) => ({
  userLanguage: state.UserReducer.language,
  partnerObject: state.PartnerReducer.partner,
  conversations: state.PartnerReducer.conversations,

  getPartnersConversationsStart: state.PartnerReducer.getPartnersConversationsStart,
  getPartnersConversationsError: state.PartnerReducer.getPartnersConversationsError,
  getPartnersConversationsSuccess: state.PartnerReducer.getPartnersConversationsSuccess,

  sendPartnerMessageStart: state.PartnerReducer.sendPartnerMessageStart,
  sendPartnerMessageError: state.PartnerReducer.sendPartnerMessageError,
  sendPartnerMessageSuccess: state.PartnerReducer.sendPartnerMessageSuccess,
});


const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setUserLanguage,
    getPartnerProfile,
    changeSinglePartnerField,
    getPartnerConversations,
    sendPartnerMessage,
  },
  dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(PartnerProfileView)