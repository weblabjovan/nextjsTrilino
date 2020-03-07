import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { getLanguage } from '../lib/language';
import { isMobile } from '../lib/helpers/generalFunctions';
import PartnerHelpersr from '../components/help/partnerHelpsr';
import PartnerHelperen from '../components/help/partnerHelpen';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface MyProps {
  // using `interface` is also ok
  userAgent: string;
  path: string;
  fullPath: string;
  lang: string;
  token?: string | undefined;
  section?: string | undefined | string[]; 
};
interface MyState {
	language: string;
	dictionary: object;
	isMobile: boolean;
};

export default class PartnerHelpView extends React.Component <MyProps, MyState>{

	state: MyState = {
    language: this.props.lang,
    dictionary: getLanguage(this.props.lang),
    isMobile: isMobile(this.props.userAgent),
  };

  componentDidMount(){
    setTimeout(() => {
      const term = !this.props.section || this.props.section === 'undefined' ? 'generalSec' : `${this.props.section}Sec`;
      const res = document.getElementById(term);
      res.scrollIntoView({ behavior: "smooth", block: "start", inline: "start"});
    }, 1200);
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
