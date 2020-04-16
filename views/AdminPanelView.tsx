import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from '../components/loader';
import { Container, Row, Col } from 'reactstrap';
import { setUserLanguage } from '../actions/user-actions';
import { getLanguage } from '../lib/language';
import { isMobile, getCookie, setUpLinkBasic } from '../lib/helpers/generalFunctions';
import { isDevEnvLogged, isAdminLogged } from '../lib/helpers/specificAdminFunctions';
import AdminPanelScreen from '../components/adminPanel/adminPanelScreen';
import AdminNavigationBar from '../components/navigation/adminNavbar';
import Footer from '../components/navigation/partnerFooter';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface MyProps {
  // using `interface` is also ok
  userLanguage: string;
  setUserDevice(userAgent: string): boolean;
  setUserLanguage(language: string): string;
  path: string;
  fullPath: string;
  lang: string;
};
interface MyState {
	language: string;
	dictionary: object;
	isMobile: boolean;
  activeScreen: string;
  loader: boolean;
  token: string;
  link: object;
};

class AdminPanelView extends React.Component <MyProps, MyState>{

  constructor(props){
    super(props);

    this.componentObjectBinding = this.componentObjectBinding.bind(this);

    const bindingFunctions = ['changeScreen', 'openLoader', 'closeLoader'];
    this.componentObjectBinding(bindingFunctions);
  }

  componentObjectBinding(array){
    array.map( item => {
      this[item] = this[item].bind(this);
    })
  }

	state: MyState = {
    language: this.props.lang.toUpperCase(),
    dictionary: getLanguage(this.props.lang),
    isMobile: false,
    activeScreen: 'partners',
    loader: false,
    token: '',
    link: {},
  };

  changeScreen(event){
    this.setState({ activeScreen: event.target.id}, () => {
      window.scrollTo(0,0);
    });
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
      const adminIsLogged = await isAdminLogged(window.location.href);
      if (adminIsLogged) {
        const token = getCookie('trilino-admin-token');
        const link = setUpLinkBasic(window.location.href);
        this.setState({isMobile: isMobile(navigator.userAgent), token, link });
        this.props.setUserLanguage(this.props.lang);
      }else{
        const link = setUpLinkBasic(window.location.href);
        window.location.href =  `${link['protocol']}${link['host']}/adminLogin?language=${link['queryObject']['language']}`;
      }
    }else{
      const link = setUpLinkBasic(window.location.href);
      window.location.href =  `${link['protocol']}${link['host']}/devLogin`;
    }
  }
	
  render() {
    return(
    	<div className="totalWrapper">
        <Loader  show={ this.state.loader } />
    		<AdminNavigationBar 
    			isMobile={ this.state.isMobile } 
    			language={ this.state.language } 
          fullPath={ this.props.fullPath }
          changeScreen={ this.changeScreen }
    			activeScreen={ this.state.activeScreen }
          link={ this.state.link }
    		/>
    		<AdminPanelScreen
          lang={ this.props.lang } 
          link={ this.state.link }
          screen={ this.state.activeScreen }
          token={ this.state.token }
          openLoader={ this.openLoader }
          closeLoader={ this.closeLoader }
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
});


const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setUserLanguage,
  },
  dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(AdminPanelView)