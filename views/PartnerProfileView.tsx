import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from '../components/loader';
import { Container, Row, Col } from 'reactstrap';
import { setUserLanguage } from '../actions/user-actions';
import { getPartnerProfile } from '../actions/partner-actions';
import { getLanguage } from '../lib/language';
import { setUpLinkBasic } from '../lib/helpers/generalFunctions';
import { isMobile } from '../lib/helpers/generalFunctions';
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
  getPartnerProfile(link: object, auth: string): object;
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
      isMobile: isMobile(this.props.userAgent),
      activeScreen: 'offer',
      loader: true,
    };

  changeScreen(event){
    this.setState({ activeScreen: event.target.id});
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
  },
  dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(PartnerProfileView)