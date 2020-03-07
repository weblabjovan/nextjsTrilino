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
  activeScreen: string;
  // using `interface` is also ok
};
type MyState = {
  collapsed: boolean; // like this
  dictionary: object;
};

export default class AdminNavigationBar extends React.Component <MyProps, MyState> {
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
    unsetCookie('trilino-admin-token');
    window.location.href = `${this.props.link["protocol"]}${this.props.link["host"]}/adminLogin?language=${this.props.language}`;
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
                      id="partners"
                      onClick={this.props.changeScreen}
                    >Partneri</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      id="test"
                      onClick={this.props.changeScreen}
                    >Test</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink onClick={this.logout}>Odjava</NavLink>
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
                  <span>Admin Panel</span>
                </li>
                <li 
                  className={this.props.activeScreen === 'partners' ? 'active' : ''}
                  id="partners"
                  onClick={this.props.changeScreen}
                  ><span className="icon general"></span>PARTNERI</li>
                 <li 
                  className={this.props.activeScreen === 'test' ? 'active' : ''}
                  id="test"
                  onClick={this.props.changeScreen}
                  ><span className="icon general"></span>Test</li>
                <li 
                  onClick={this.logout}
                ><span className="icon logout"></span>ODJAVA</li>
              </ul>
            </div>
          )
        }
      </div>
    );
  }
}