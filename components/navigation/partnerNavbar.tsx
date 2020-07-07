import React from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { changeLanguagePath, unsetCookie } from '../../lib/helpers/generalFunctions';
import { getLanguage } from '../../lib/language';

type MyProps = {
	isMobile: boolean;
  language: string;
  link: object;
  fullPath: string;
  changeScreen(event: any): any;
  changeLanguage(lang: string): void;
  activeScreen: string;
  partner: string | undefined;
  // using `interface` is also ok
};
type MyState = {
  collapsed: boolean; // like this
  dictionary: object;
};

export default class NavigationBar extends React.Component <MyProps, MyState> {
  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.logout = this.logout.bind(this);
    this.mobileChangeScreen = this.mobileChangeScreen.bind(this);
   
  }

   state: MyState = {
      collapsed: true,
      dictionary: getLanguage(this.props.language),
    };

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  mobileChangeScreen(event: any){
    this.setState({ collapsed: true});
    this.props.changeScreen(event);
  }

  logout() {
    unsetCookie('trilino-partner-token');
    window.location.href = `${this.props.link["protocol"]}${this.props.link["host"]}/login?page=partner&stage=login&language=${this.props.language}`;
  }

  componentDidUpdate(prevProps: MyProps, prevState:  MyState){
    if (prevProps.language !== this.props.language) {
      let dictionary = getLanguage(this.props.language);
      this.setState({ dictionary });
    }
  }

  render() {
    return (
      <div>
        {
          this.props.isMobile ? 
          (
            <div>
              <Navbar color="faded" light>
              <NavbarBrand href={`/?language=${this.props.language.toLowerCase()}`} className="mr-auto">
                <div className="logoWrapper">
                  <img src="/static/logo_top.png" alt="trilino-logo"></img>
                </div>
              </NavbarBrand>
              <NavbarToggler onClick={this.toggleNavbar}  />
              <Collapse isOpen={!this.state.collapsed} navbar>
                <Nav navbar>
                  <NavItem>
                    <NavLink
                      id="general"
                      onClick={(e) => this.mobileChangeScreen(e)}
                    >{this.state.dictionary['navigationPartnerGeneral']}</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      id="catering"
                      onClick={(e) => this.mobileChangeScreen(e)}
                    >{this.state.dictionary['navigationPartnerCatering']}</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      id="decoration"
                      onClick={(e) => this.mobileChangeScreen(e)}
                    >{this.state.dictionary['navigationPartnerDecoration']}</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      id="offer"
                      onClick={(e) => this.mobileChangeScreen(e)}
                    >{this.state.dictionary['navigationPartnerOffer']}</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      id="calendar"
                      onClick={(e) => this.mobileChangeScreen(e)}
                    >{this.state.dictionary['navigationPartnerCalendar']}</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      id="preview"
                      onClick={(e) => this.mobileChangeScreen(e)}
                    >{this.state.dictionary['navigationPartnerPreview']}</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      id="financial"
                      onClick={(e) => this.mobileChangeScreen(e)}
                    >{this.state.dictionary['navigationPartnerFinancial']}</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      id="message"
                      onClick={(e) => this.mobileChangeScreen(e)}
                    >{this.state.dictionary['userProfileSubNavMessage']}</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink onClick={this.logout}>{this.state.dictionary['navigationPartnerLogout']}</NavLink>
                  </NavItem>

                  <hr/>

                  <NavItem>
                    <NavLink onClick={() => this.props.changeLanguage('sr')} >SR</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink onClick={() => this.props.changeLanguage('en')} >EN</NavLink>
                  </NavItem>

                </Nav>
              </Collapse>
              </Navbar>
            </div>
          ) :
          (
            <div className="partnerNavDesktop">
              <ul>
                <li>
                  <span>
                    <a onClick={() => this.props.changeLanguage('sr')} >SR</a>
                    <a onClick={() => this.props.changeLanguage('en')} >EN</a>
                  </span>
                  <span>{this.props.partner}</span>
                </li>
                <li 
                  className={this.props.activeScreen === 'general' ? 'active' : ''}
                  id="general"
                  onClick={this.props.changeScreen}
                  ><span className="icon general"></span>{this.state.dictionary['navigationPartnerGeneral'].toUpperCase()}</li>
                <li 
                  className={this.props.activeScreen === 'catering' ? 'active' : ''}
                  id="catering"
                  onClick={this.props.changeScreen}
                  ><span className="icon catering"></span>{this.state.dictionary['navigationPartnerCatering'].toUpperCase()}</li>
                <li 
                  className={this.props.activeScreen === 'decoration' ? 'active' : ''}
                  id="decoration"
                  onClick={this.props.changeScreen}
                  ><span className="icon decoration"></span>{this.state.dictionary['navigationPartnerDecoration'].toUpperCase()}</li>
                <li 
                  className={this.props.activeScreen === 'offer' ? 'active' : ''}
                  id="offer"
                  onClick={this.props.changeScreen}
                  ><span className="icon offer"></span>{this.state.dictionary['navigationPartnerOffer'].toUpperCase()}</li>
                <li 
                  className={this.props.activeScreen === 'calendar' ? 'active' : ''}
                  id="calendar"
                  onClick={this.props.changeScreen}
                  ><span className="icon calendar"></span>{this.state.dictionary['navigationPartnerCalendar'].toUpperCase()}</li>
                <li 
                  className={this.props.activeScreen === 'preview' ? 'active' : ''}
                  id="preview"
                  onClick={this.props.changeScreen}
                  ><span className="icon preview"></span>{this.state.dictionary['navigationPartnerPreview'].toUpperCase()}</li>
                <li 
                  className={this.props.activeScreen === 'financial' ? 'active' : ''}
                  id="financial"
                  onClick={this.props.changeScreen}
                  ><span className="icon financial"></span>{this.state.dictionary['navigationPartnerFinancial'].toUpperCase()}</li>
                  <li 
                  className={this.props.activeScreen === 'message' ? 'active' : ''}
                  id="message"
                  onClick={this.props.changeScreen}
                  ><span className="icon message"></span>{this.state.dictionary['userProfileSubNavMessage'].toUpperCase()}</li>
                <li 
                  onClick={this.logout}
                ><span className="icon logout"></span>{this.state.dictionary['navigationPartnerLogout'].toUpperCase()}</li>
              </ul>
            </div>
          )
        }
      </div>
    );
  }
}