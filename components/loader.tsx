import React from 'react';
import { Spinner } from 'reactstrap';


type MyProps = {
	show?: boolean; 
};
type MyState = {

};

export default class Loader extends React.Component <MyProps, MyState> {

	render(){
		return(
			<div>
			{
				this.props.show
				 ? 
				 (<div className="loader">
	        <div className="spinerHolder">
	          <Spinner type="grow" color="light" />
	          <Spinner type="grow" color="light" />
	          <Spinner type="grow" color="light" />
	        </div>
	      </div>) 
				 : null
			}
			</div>
		)
	}
}