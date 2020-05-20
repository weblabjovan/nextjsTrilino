import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { getLanguage } from '../lib/language';
import { isMobile, setUpLinkBasic } from '../lib/helpers/generalFunctions';
import PartnerHelpersr from '../components/help/partnerHelpsr';
import PartnerHelperen from '../components/help/partnerHelpen';

interface MyProps {
  // using `interface` is also ok
  path: string;
  fullPath: string;
  lang: string;
};
interface MyState {
	language: string;
	dictionary: object;
	isMobile: boolean;
};

export default class PartnerHelpView extends React.Component <MyProps, MyState>{

	state: MyState = {
    language: this.props.lang.toUpperCase(),
    dictionary: getLanguage(this.props.lang),
    isMobile: false,
  };

  componentDidUpdate(prevProps: MyProps, prevState:  MyState){ 
    if (prevProps.lang !== this.props.lang) {
      this.setState({dictionary: getLanguage(this.props.lang), language: this.props.lang.toUpperCase() })
    }
  }

  componentDidMount(){
    const link = setUpLinkBasic(window.location.href);
    this.setState({ isMobile: isMobile(navigator.userAgent)});
    setTimeout(() => {
      const term = !link['queryObject']['section'] || link['queryObject']['section'] === 'undefined' ? 'generalSec' : `${link['queryObject']['section']}Sec`;
      const res = document.getElementById(term);
      res.scrollIntoView({ behavior: "smooth", block: "start", inline: "start"});
    }, 800);
  }
	
  render() {
  	
    return(
    	<div className="totalWrapper">
	    	<Container>
	    		{
	    			this.props.lang === 'sr'
	    			?
	    			<PartnerHelpersr lang={this.props.lang}/>
	    			:
	    			<PartnerHelperen lang={this.props.lang}/>
	    		}
	    	</Container>
    	</div>
    ) 
  }
}
