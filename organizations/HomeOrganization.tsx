import React from 'react';
import HomeView from '../views/HomeView';
import ContactView from '../views/ContactView';
import TermsView from '../views/TermsView';
import OnlinePaymentsView from '../views/OnlinePaymentsView';
import PartnershipView from '../views/PartnershipView';
import FaqView from '../views/FaqView';
import PrivacyView from '../views/PrivacyView';
import ErrorPageView from '../views/ErrorPageView';

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
            this.props.page === 'faq'
            ?
            (
              <FaqView 
                userAgent={this.props.userAgent} 
                path={this.props.path} 
                fullPath={ this.props.fullPath } 
                lang={ this.props.lang } 
                userIsLogged={ this.props.userIsLogged } 
              />
            )
            :
            this.props.page === 'privacy'
            ?
            (
              <PrivacyView 
                userAgent={this.props.userAgent} 
                path={this.props.path} 
                fullPath={ this.props.fullPath } 
                lang={ this.props.lang } 
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