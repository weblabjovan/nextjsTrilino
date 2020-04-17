import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import HomeView from '../views/HomeView';
import ContactView from '../views/ContactView';
import TermsView from '../views/TermsView';
import OnlinePaymentsView from '../views/OnlinePaymentsView';
import PartnershipView from '../views/PartnershipView';
import ErrorPageView from '../views/ErrorPageView';
import { getLanguage } from '../lib/language';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';

interface MyProps {
  // using `interface` is also ok
  userAgent: string;
  lang: string;
  fullPath: string;
  path: string;
  userIsLogged: boolean;
  error: string;
  page: string;
};
interface MyState {
};

export default class HomeOrganization extends React.Component <MyProps, MyState>{
  
  render() {
    return(
      <div>
          {
            this.props.page === 'home'
            ?
            (
              <HomeView 
		        userAgent={this.props.userAgent} 
		        path={this.props.path} 
		        fullPath={ this.props.fullPath } 
		        lang={ this.props.lang } 
		        userIsLogged={ this.props.userIsLogged } 
		      />
            )
            :
            this.props.page === 'contact'
            ?
            (
              <ContactView 
		        userAgent={this.props.userAgent} 
		        path={this.props.path} 
		        fullPath={ this.props.fullPath } 
		        lang={ this.props.lang } 
		        userIsLogged={ this.props.userIsLogged } 
		      />
            )
            :
            this.props.page === 'terms'
            ?
            (
              <TermsView 
		        userAgent={this.props.userAgent} 
		        path={this.props.path} 
		        fullPath={ this.props.fullPath } 
		        lang={ this.props.lang } 
		        userIsLogged={ this.props.userIsLogged } 
		      />
            )
            :
            this.props.page === 'partnership'
            ?
            (
              <PartnershipView 
		        userAgent={this.props.userAgent} 
		        path={this.props.path} 
		        fullPath={ this.props.fullPath } 
		        lang={ this.props.lang } 
		        userIsLogged={ this.props.userIsLogged } 
		      />
            )
            :
            this.props.page === 'payments'
            ?
            (
              <OnlinePaymentsView 
		        userAgent={this.props.userAgent} 
		        path={this.props.path} 
		        fullPath={ this.props.fullPath } 
		        lang={ this.props.lang } 
		        userIsLogged={ this.props.userIsLogged } 
		      />
            )
            :
            this.props.page === 'error'
            ?
            (
              <ErrorPageView 
		        userAgent={this.props.userAgent} 
		        path={this.props.path} 
		        fullPath={ this.props.fullPath } 
		        lang={ this.props.lang } 
		        error={ this.props.error } 
		        userIsLogged={ this.props.userIsLogged } 
		      />
            )
            :
            null
          }

      </div>
      
    ) 
  }
}