import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { getLanguage } from '../../lib/language';
import PartnersScreen from './PartnersScreen';

interface MyProps {
  // using `interface` is also ok
  link: object;
  lang: string;
  screen: string;
  token?: string | undefined;
  loader: boolean;
  openLoader(): void;
  closeLoader(): void;
};
interface MyState {
  dictionary: object;
};

class AdminScreenView extends React.Component <MyProps, MyState>{

  state: MyState = {
    dictionary: getLanguage(this.props.lang),
  };

  componentDidUpdate(prevProps: MyProps, prevState:  MyState){
    if (prevProps.lang !== this.props.lang) {
      let dictionary = getLanguage(this.props.lang);
      this.setState({ dictionary });
    }
  }
  
  render() {
    return(
      <div className="totalWrapper partnerProfileScreen">
        <Container>
          {
            this.props.screen === 'partners'
            ?
            (
              <PartnersScreen 
                lang={this.props.lang}
                token={ this.props.token }
                closeLoader={ this.props.closeLoader }
                openLoader={ this.props.openLoader }
              />
            )
            :
            null
          }
              
        </Container>

      </div>
      
    ) 
  }
}

export default AdminScreenView;