import React from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';
import { changeLanguagePath, unsetCookie } from '../../lib/helpers/generalFunctions';

type MyProps = {
	isMobile: boolean;
  language: string;
  link: object;
  fullPath: string; 
  // using `interface` is also ok
};
type MyState = {
  collapsed: boolean; // like this
};

export default class NavigationBar extends React.Component <MyProps, MyState> {
  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.logout = this.logout.bind(this);
   
  }

   state: MyState = {
      collapsed: true
    };

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  logout() {
    unsetCookie('trilino-partner-token');
    window.location.href = `${this.props.link["protocol"]}${this.props.link["host"]}/partnerProfile?language=${this.props.language.toLowerCase()}`;
  }

  render() {
    return (
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
              <NavLink onClick={this.logout}>Logout</NavLink>
            </NavItem>

            <hr/>

            <NavItem>
              <NavLink href={ changeLanguagePath(this.props.fullPath, this.props.language.toLowerCase(), 'sr') } >SR</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href={changeLanguagePath(this.props.fullPath, this.props.language.toLowerCase(), 'en')} >EN</NavLink>
            </NavItem>

          </Nav>
        </Collapse>
        </Navbar>
      </div>
    );
  }
}