import React from 'react';
import PaymentSuccessView from '../views/PaymentSuccessView';
import PaymentFailureView from '../views/PaymentFailureView';
import CateringPaymentView from '../views/CateringPaymentView';
import DeactiveReservationView from '../views/DeactiveReservationView';

interface MyProps {
  // using `interface` is also ok
  userAgent: string;
  path: string;
  fullPath: string;
  lang: string;
  link: object;
  paymentInfo: object;
  page: string;
  cateringSuccess: boolean;
};

interface MyState {
};

export default class PaymentOrganization extends React.Component <MyProps, MyState>{
  
  render() {
    return(
      <div>
          {
            this.props.page === 'reservationSuccess'
            ?
            (
              <PaymentSuccessView 
    		        userAgent={this.props.userAgent} 
    		        path={this.props.path} 
    		        fullPath={ this.props.fullPath } 
    		        lang={ this.props.lang }
    		        link={ this.props.link }
    		        paymentInfo={ this.props.paymentInfo }
    		      />
            )
            :
             this.props.page === 'reservationFailure'
            ?
            (
              <PaymentFailureView 
    		        userAgent={this.props.userAgent} 
    		        path={this.props.path} 
    		        fullPath={ this.props.fullPath } 
    		        lang={ this.props.lang }
    		        link={ this.props.link }
    		        paymentInfo={ this.props.paymentInfo }
    		      />
            )
            :
             this.props.page === 'cateringSuccess'
            ?
            (
              <CateringPaymentView 
    		        userAgent={this.props.userAgent} 
    		        path={this.props.path} 
    		        fullPath={ this.props.fullPath } 
    		        lang={ this.props.lang }
    		        link={ this.props.link }
    		        success={ this.props.cateringSuccess }
    		        paymentInfo={ this.props.paymentInfo }
    		      />
            )
            :
             this.props.page === 'closed'
            ?
            (
              <DeactiveReservationView 
                userAgent={this.props.userAgent} 
                path={this.props.path} 
                fullPath={ this.props.fullPath } 
                lang={ this.props.lang }
                link={ this.props.link }
              />
            )
            :
            null
          }

      </div>
      
    ) 
  }
}