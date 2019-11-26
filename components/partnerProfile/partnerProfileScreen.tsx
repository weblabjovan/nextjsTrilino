import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { getLanguage } from '../../lib/language';
import GeneralScreen from './GeneralScreen';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style/style.scss';

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
    					<Row>
	              <Col xs='12' className="middle">
	                <h1 className="middle">{this.state.dictionary['navigationPartnerCatering']}</h1>
	              </Col>
	            </Row>
    				)
    				:
    				this.props.screen === 'decoration'
    				?
    				(
    					<Row>
	              <Col xs='12' className="middle">
	                <h1 className="middle">{this.state.dictionary['navigationPartnerDecoration']}</h1>
	              </Col>
	            </Row>
    				)
    				:
    				this.props.screen === 'offer'
    				?
    				(
    					<Row>
	              <Col xs='12' className="middle">
	                <h1 className="middle">{this.state.dictionary['navigationPartnerOffer']}</h1>
	              </Col>
	            </Row>
    				)
    				:
    				this.props.screen === 'calendar'
    				?
    				(
    					<Row>
	              <Col xs='12' className="middle">
	                <h1 className="middle">{this.state.dictionary['navigationPartnerCalendar']}</h1>
	              </Col>
	            </Row>
    				)
    				:
    				this.props.screen === 'preview'
    				?
    				(
    					<Row>
	              <Col xs='12' className="middle">
	                <h1 className="middle">{this.state.dictionary['navigationPartnerPreview']}</h1>
	              </Col>
	            </Row>
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