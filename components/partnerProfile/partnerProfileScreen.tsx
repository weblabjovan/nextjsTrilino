import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col } from 'reactstrap';
import { setUserLanguage } from '../../actions/user-actions';
import { getLanguage } from '../../lib/language';
import { isMobile } from '../../lib/helpers/generalFunctions';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style/style.scss';

interface MyProps {
  // using `interface` is also ok
  link: string;
  lang: string;
  screen: string;
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

	componentDidMount(){

	}
	
  render() {
    return(
    	<div className="totalWrapper partnerProfileScreen">
    		<Container>
    			{
    				this.props.screen === 'general'
    				?
    				(
    					<Row>
	              <Col xs='12' className="middle">
	                <h1 className="middle">{this.state.dictionary['navigationPartnerGeneral']}</h1>
	              </Col>
	            </Row>
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

const mapStateToProps = (state) => ({

});


const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({

  },
  dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(PartnerScreenView)