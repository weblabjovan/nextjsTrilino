import React from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';
import { changeLanguagePath } from '../../lib/helpers/generalFunctions';

type MyProps = {
	isMobile: boolean;
  language: string;
  page: string;
  fullPath: string;
  login: string;
  search: string;
  faq: string;
  partnership: string;
  contact: string; 
  // using `interface` is also ok
};
type MyState = {
  collapsed: boolean; // like this
};

export default class NavigationBar extends React.Component <MyProps, MyState> {
  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
   
  }

   state: MyState = {
      collapsed: true
    };

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render() {
    return (
      <div>
          {
          	this.props.isMobile ?
          	( <div>
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
		                <NavLink href={`/login?language=${this.props.language.toLowerCase()}`}>{this.props.login}</NavLink>
		              </NavItem>
		              <NavItem>
                    <NavLink href={`/search?language=${this.props.language.toLowerCase()}`}>{this.props.search}</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href="/">{this.props.faq}</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href={`/partnership?language=${this.props.language.toLowerCase()}`}>{this.props.partnership}</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href="/">{this.props.contact}</NavLink>
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
		          </div>) : (
		          <Navbar color="faded" light>
          			<NavbarBrand href={`/?language=${this.props.language.toLowerCase()}`} className="mr-auto">
          				<div className="logoWrapper">
	          				<img src="/static/logo.png" alt="trilino-logo"></img>
	          			</div>
          			</NavbarBrand>
                <div className="navlog">
                  <a href={`/login?language=${this.props.language.toLowerCase()}`}> 
                    <img src="/static/userIcon.jpg" alt="trilino-user-profile" />
                  </a>
                </div>
                <UncontrolledButtonDropdown>
                  <DropdownToggle caret>
                    { this.props.language }
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem ><a href={ changeLanguagePath(this.props.fullPath, this.props.language.toLowerCase(), 'sr') } >SR</a></DropdownItem>
                    <DropdownItem ><a href={changeLanguagePath(this.props.fullPath, this.props.language.toLowerCase(), 'en')} >EN</a></DropdownItem>
                  </DropdownMenu>
                </UncontrolledButtonDropdown>
		          </Navbar>
		          )
          }
          
        
      </div>
    );
  }
}