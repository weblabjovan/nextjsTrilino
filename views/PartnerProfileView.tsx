import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import queryString  from 'query-string';
import { Container, Row, Col } from 'reactstrap';
import { setUserLanguage } from '../actions/user-actions';
import { getLanguage } from '../lib/language';
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
  userAgent: string;
  path: string;
  fullPath: string;
  lang: string;
  link: object;
};
interface MyState {
	language: string;
	dictionary: object;
	isMobile: boolean;
  activeScreen: string;
};

class PartnerProfileView extends React.Component <MyProps, MyState>{

  constructor(props){
    super(props);

    this.componentObjectBinding = this.componentObjectBinding.bind(this);

    const bindingFunctions = ['changeScreen', 'changeLanguage' ];
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
      activeScreen: 'general',
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

	componentDidMount(){
		this.props.setUserLanguage(this.props.lang);
	}
	
  render() {
    return(
    	<div className="totalWrapper">
    		<PartnerNavigationBar 
    			isMobile={ this.state.isMobile } 
    			language={ this.state.language } 
          fullPath={ this.props.fullPath }
    			link={ this.props.link }
          changeScreen={ this.changeScreen }
          activeScreen={ this.state.activeScreen }
          changeLanguage={ this.changeLanguage }
    		/>
    		<PartnerProfileScreen
          lang={ this.state.language } 
          link={ this.props.link }
          screen={ this.state.activeScreen }

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

export default connect(mapStateToProps, matchDispatchToProps)(PartnerProfileView)