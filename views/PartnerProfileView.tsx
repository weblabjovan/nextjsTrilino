import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from '../components/loader';
import { Container, Row, Col } from 'reactstrap';
import { setUserLanguage } from '../actions/user-actions';
import { getPartnerProfile, changeSinglePartnerField } from '../actions/partner-actions';
import { getLanguage } from '../lib/language';
import { isMobile, getCookie, setUpLinkBasic } from '../lib/helpers/generalFunctions';
import { isPartnerLoggedNew } from '../lib/helpers/specificPartnerFunctions';
import { isDevEnvLogged } from '../lib/helpers/specificAdminFunctions';
import PartnerNavigationBar from '../components/navigation/partnerNavbar';
import PartnerProfileScreen from '../components/partnerProfile/partnerProfileScreen';
import Footer from '../components/navigation/partnerFooter';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface MyProps {
  // using `interface` is also ok
  userLanguage: string;
  setUserDevice(userAgent: string): boolean;
  setUserLanguage(language: string): string;
  changeSinglePartnerField(field: string, value: any): any;
  getPartnerProfile(link: object, auth: string): object;
  path: string;
  fullPath: string;
  lang: string;
  partnerObject: object;
};
interface MyState {
	language: string;
	dictionary: object;
	isMobile: boolean;
  activeScreen: string;
  loader: boolean;
  link: object;
  token: string;
};

class PartnerProfileView extends React.Component <MyProps, MyState>{

  constructor(props){
    super(props);

    this.componentObjectBinding = this.componentObjectBinding.bind(this);

    const bindingFunctions = ['changeScreen', 'changeLanguage', 'openLoader', 'closeLoader' ];
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
    isMobile: false,
    activeScreen: 'calendar',
    loader: true,
    link: {},
    token: '',
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

  async componentDidMount(){
    const devIsLogged = await isDevEnvLogged(window.location.href);
    if (devIsLogged) {
      const partnerIsLogged = await isPartnerLoggedNew(window.location.href);
      if (partnerIsLogged) {
        const link = setUpLinkBasic(window.location.href);
        const token = getCookie('trilino-partner-token');
        this.setState({isMobile: isMobile(navigator.userAgent), link, token }, () => {
          this.props.getPartnerProfile(link, token);
        });
        this.props.setUserLanguage(this.props.lang);
      }else{
        const link = setUpLinkBasic(window.location.href);
        window.location.href = `${link["protocol"]}${link["host"]}/partnershipLogin?language=${this.props.lang}&page=login`;
      }
    }else{
      const link = setUpLinkBasic(window.location.href);
      window.location.href = `${link["protocol"]}${link["host"]}/devLogin`;
    }
  }
	
  render() {
    return(
    	<div className="totalWrapper">
        <Loader  show={ this.state.loader } />
    		<PartnerNavigationBar 
    			isMobile={ this.state.isMobile } 
    			language={ this.state.language } 
          fullPath={ this.props.fullPath }
    			link={ this.state.link }
          changeScreen={ this.changeScreen }
          activeScreen={ this.state.activeScreen }
          changeLanguage={ this.changeLanguage }
          partner={ this.props.partnerObject ? this.props.partnerObject['name'] : '' }
    		/>
    		<PartnerProfileScreen
          lang={ this.state.language } 
          link={ this.state.link }
          screen={ this.state.activeScreen }
          openLoader={ this.openLoader }
          closeLoader={ this.closeLoader }
          token={ this.state.token }
          loader={ this.state.loader }
        />

		    <Footer 
    			isMobile={ this.state.isMobile } 
    			language={ this.state.language } 
    			page={ this.props.path ? this.props.path : '' }
    			contact={ this.state.dictionary['navigationContact'] }
    			login={ this.state.dictionary['navigationLogin'] }
    			search={ this.state.dictionary['navigationSearch'] }
    			partnership={ this.state.dictionary['navigationPartnership'] }
    			faq={ this.state.dictionary['navigationFaq'] }
    		/>

    	</div>
    	
    ) 
  }
}

const mapStateToProps = (state) => ({
  userLanguage: state.UserReducer.language,
  partnerObject: state.PartnerReducer.partner,
});


const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setUserLanguage,
    getPartnerProfile,
    changeSinglePartnerField,
  },
  dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(PartnerProfileView)