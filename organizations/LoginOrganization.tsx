import React from 'react';
import UserLoginView from '../views/UserLoginView';
import PartnershipLoginView from '../views/PartnershipLoginView';
import AdminLoginView from '../views/AdminLoginView';
import LoginView from '../views/LoginView';

interface MyProps {
  // using `interface` is also ok
  userAgent: string;
  path: string;
  fullPath: string;
  lang: string;
  link: object;
  userIsLogged: boolean;
  page: string;
  stage: string;
};

interface MyState {
	stage: string;
};

export default class Loginization extends React.Component <MyProps, MyState>{

	state: MyState = {
		stage: this.props.stage,
	}

	changeStage(stage: string){
		this.setState({ stage });
	}
  
  render() {
    return(
      <div>
          {
            this.props.page === 'user'
            ?
            (
              <UserLoginView 
    		        userAgent={this.props.userAgent} 
    		        path={this.props.path} 
    		        fullPath={ this.props.fullPath } 
    		        lang={ this.props.lang }
    		        stage={ this.state.stage } 
    		        link={ this.props.link }
    		        changeStage={ (stage) => this.changeStage(stage) }
    		      />
            )
            :
             this.props.page === 'partner'
            ?
            (
              <PartnershipLoginView 
    		        userAgent={this.props.userAgent} 
    		        path={this.props.path} 
    		        fullPath={ this.props.fullPath } 
    		        lang={ this.props.lang }
    		        stage={ this.state.stage } 
    		        link={ this.props.link }
    		        changeStage={ (stage) => this.changeStage(stage) }
    		      />
            )
            :
             this.props.page === 'dev'
            ?
            (
              <LoginView 
    		        userAgent={this.props.userAgent} 
    		        path={this.props.path} 
    		        fullPath={ this.props.fullPath } 
    		        lang={ this.props.lang }
    		        link={ this.props.link }
    		      />
            )
            :
             this.props.page === 'admin'
            ?
            (
              <AdminLoginView 
    		        userAgent={this.props.userAgent} 
    		        path={this.props.path} 
    		        fullPath={ this.props.fullPath } 
    		        lang={ this.props.lang }
    		        link={ this.props.link }
    		      />
            )
            :
            null
          }

      </div>
      
    ) 
  }
}