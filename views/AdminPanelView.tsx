import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from '../components/loader';
import { Container, Row, Col } from 'reactstrap';
import { setUserLanguage } from '../actions/user-actions';
import { getLanguage } from '../lib/language';
import { isMobile } from '../lib/helpers/generalFunctions';
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
  userAgent: string;
  path: string;
  link: object;
  fullPath: string;
  lang: string;
  token: string | undefined;
};
interface MyState {
	language: string;
	dictionary: object;
	isMobile: boolean;
  activeScreen: string;
  loader: boolean;
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
      isMobile: isMobile(this.props.userAgent),
      activeScreen: 'partners',
      loader: false,
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

	componentDidMount(){
		this.props.setUserLanguage(this.props.lang);
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
          link={ this.props.link }
    		/>
    		<AdminPanelScreen
          lang={ this.props.lang } 
          link={ this.props.link }
          screen={ this.state.activeScreen }
          token={ this.props.token }
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
          payment={ this.state.dictionary['navigationOnline'] }
          privacy={ this.state.dictionary['navigationPrivacy'] }
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