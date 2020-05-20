import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { getLanguage } from '../../lib/language';
import GeneralScreen from './GeneralScreen';
import PreviewScreen from './PreviewScreen';
import OfferScreen from './OfferScreen';
import FoodScreen from './FoodScreen';
import DecorationScreen from './DecorationScreen';
import CalendarScreen from './CalendarScreen';

interface MyProps {
  // using `interface` is also ok
  link: object;
  lang: string;
  screen: string;
  closeLoader(): void;
  openLoader(): void;
  token?: string | undefined;
  loader: boolean;
};
interface MyState {
  dictionary: object;
};

class PartnerScreenView extends React.Component <MyProps, MyState>{

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
            this.props.screen === 'general'
            ?
            (
              <GeneralScreen 
                lang={this.props.lang}
                closeLoader={this.props.closeLoader}
                openLoader={this.props.openLoader}
                token={ this.props.token }
                loader={ this.props.loader }
              />
            )
            :
            this.props.screen === 'catering'
            ?
            (
              <FoodScreen
                lang={this.props.lang}
                closeLoader={this.props.closeLoader}
                openLoader={this.props.openLoader}
                token={ this.props.token }
              />
            )
            :
            this.props.screen === 'decoration'
            ?
            (
              <DecorationScreen
                lang={this.props.lang}
                closeLoader={this.props.closeLoader}
                openLoader={this.props.openLoader}
                token={ this.props.token }
              />
            )
            :
            this.props.screen === 'offer'
            ?
            (
              <OfferScreen
                lang={this.props.lang}
                closeLoader={this.props.closeLoader}
                openLoader={this.props.openLoader}
                token={ this.props.token }
              />
            )
            :
            this.props.screen === 'calendar'
            ?
            (
              <CalendarScreen
                lang={this.props.lang}
                closeLoader={this.props.closeLoader}
                openLoader={this.props.openLoader}
                token={ this.props.token }
              />
            )
            :
            this.props.screen === 'preview'
            ?
            (
              <PreviewScreen
                lang={this.props.lang}
                closeLoader={this.props.closeLoader}
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

export default PartnerScreenView;