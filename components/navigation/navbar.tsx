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
  terms: string;
  user?: boolean;
  userProfile?: string;
  languagePrevent?: boolean;
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
    const date = new Date();
    return (
      <div>
          {
          	this.props.isMobile ?
          	( <div>
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
		                <NavLink href={`/login?page=user&stage=login&language=${this.props.language.toLowerCase()}`}>{this.props.login}</NavLink>
		              </NavItem>
		              <NavItem>
                    <NavLink href={`/search?language=${this.props.language.toLowerCase()}&date=${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}&city=null&district=null`}>{this.props.search}</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href={`/?page=terms&language=${this.props.language.toLowerCase()}`}>{this.props.terms}</NavLink>
                  </NavItem>
                  {/*<NavItem>
                    <NavLink href="/">{this.props.faq}</NavLink>
                  </NavItem>*/}
                  <NavItem>
                    <NavLink href={`/?page=partnership&language=${this.props.language.toLowerCase()}`}>{this.props.partnership}</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href={`/?page=contact&language=${this.props.language.toLowerCase()}`}>{this.props.contact}</NavLink>
                  </NavItem>
                  {
                    this.props.user
                    ?
                    <NavItem>
                      <NavLink href={`/userProfile?language=${this.props.language.toLowerCase()}`}>{this.props.userProfile}</NavLink>
                    </NavItem>
                    :
                    null
                  }

                  <hr/>
                  {
                    !this.props.languagePrevent
                    ?
                    (
                      <div>
                        <NavItem>
                          <NavLink href={ changeLanguagePath(this.props.fullPath, this.props.language.toLowerCase(), 'sr') } >SR</NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink href={changeLanguagePath(this.props.fullPath, this.props.language.toLowerCase(), 'en')} >EN</NavLink>
                        </NavItem>
                      </div>
                    )
                    :
                    null
                  }
                  

		            </Nav>
		          </Collapse>
		          </Navbar>
		          </div>) : (
		          <Navbar color="faded" light>
          			<NavbarBrand href={`/?language=${this.props.language.toLowerCase()}`} className="mr-auto">
          				<div className="logoWrapper">
	          				<img src="/static/logo_top.png" alt="trilino-logo"></img>
	          			</div>
          			</NavbarBrand>
                {
                  this.props.user
                  ?
                  (
                    <div className="navlog">
                      <a href={`/userProfile?language=${this.props.language.toLowerCase()}`}> 
                        <img src="/static/userIcon.jpg" alt="trilino-user-profile" />
                      </a>
                    </div>
                  )
                  :
                  null
                }
                
                <UncontrolledButtonDropdown>
                  <DropdownToggle caret>
                    { this.props.language }
                  </DropdownToggle>
                  {
                    !this.props.languagePrevent
                    ?
                    (
                      <DropdownMenu>
                        <DropdownItem ><a href={ changeLanguagePath(this.props.fullPath, this.props.language.toLowerCase(), 'sr') } >SR</a></DropdownItem>
                        <DropdownItem ><a href={changeLanguagePath(this.props.fullPath, this.props.language.toLowerCase(), 'en')} >EN</a></DropdownItem>
                      </DropdownMenu>
                    )
                    :
                    null
                  }
                  
                </UncontrolledButtonDropdown>
		          </Navbar>
		          )
          }
          
        
      </div>
    );
  }
}