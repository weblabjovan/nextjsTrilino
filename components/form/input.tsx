import React from 'react';


type MyProps = {
	placeholder?: string; 
	className?: string;
  // using `interface` is also ok
};
type MyState = {

};

export default class PlainInput extends React.Component <MyProps, MyState> {

	render(){
		return(
			<input className={`plainInput ${this.props.className}`} placeholder={ this.props.placeholder }></input>
		)
	}
}