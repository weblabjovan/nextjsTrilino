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

  logout() {
    unsetCookie('trilino-partner-token');
    window.location.href = `${this.props.link["protocol"]}${this.props.link["host"]}/partnerProfile?language=${this.props.language}`;
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
                  <img src="/static/logo.png" alt="trilino-logo"></img>
                </div>
              </NavbarBrand>
              <NavbarToggler onClick={this.toggleNavbar}  />
              <Collapse isOpen={!this.state.collapsed} navbar>
                <Nav navbar>
                  <NavItem>
                    <NavLink
                      id="general"
                      onClick={this.props.changeScreen}
                    >{this.state.dictionary['navigationPartnerGeneral']}</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      id="catering"
                      onClick={this.props.changeScreen}
                    >{this.state.dictionary['navigationPartnerCatering']}</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      id="decoration"
                      onClick={this.props.changeScreen}
                    >{this.state.dictionary['navigationPartnerDecoration']}</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      id="offer"
                      onClick={this.props.changeScreen}
                    >{this.state.dictionary['navigationPartnerOffer']}</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      id="calendar"
                      onClick={this.props.changeScreen}
                    >{this.state.dictionary['navigationPartnerCalendar']}</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      id="preview"
                      onClick={this.props.changeScreen}
                    >{this.state.dictionary['navigationPartnerPreview']}</NavLink>
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
                  <span>Adalgo</span>
                </li>
                <li 
                  className={this.props.activeScreen === 'general' ? 'active' : ''}
                  id="general"
                  onClick={this.props.changeScreen}
                  >{this.state.dictionary['navigationPartnerGeneral']}</li>
                <li 
                  className={this.props.activeScreen === 'catering' ? 'active' : ''}
                  id="catering"
                  onClick={this.props.changeScreen}
                  >{this.state.dictionary['navigationPartnerCatering']}</li>
                <li 
                  className={this.props.activeScreen === 'decoration' ? 'active' : ''}
                  id="decoration"
                  onClick={this.props.changeScreen}
                  >{this.state.dictionary['navigationPartnerDecoration']}</li>
                <li 
                  className={this.props.activeScreen === 'offer' ? 'active' : ''}
                  id="offer"
                  onClick={this.props.changeScreen}
                  >{this.state.dictionary['navigationPartnerOffer']}</li>
                <li 
                  className={this.props.activeScreen === 'calendar' ? 'active' : ''}
                  id="calendar"
                  onClick={this.props.changeScreen}
                  >{this.state.dictionary['navigationPartnerCalendar']}</li>
                <li 
                  className={this.props.activeScreen === 'preview' ? 'active' : ''}
                  id="preview"
                  onClick={this.props.changeScreen}
                  >{this.state.dictionary['navigationPartnerPreview']}</li>
                <li 
                  onClick={this.logout}
                >{this.state.dictionary['navigationPartnerLogout']}</li>
              </ul>
            </div>
          )
        }
      </div>
    );
  }
}