import React from 'react';


type MyProps = {
	placeholder?: string; 
	className?: string;
	type?: string;
  // using `interface` is also ok
};
type MyState = {

};

export default class PlainInput extends React.Component <MyProps, MyState> {

	render(){
		return(
			<input className={`plainInput ${this.props.className}`} placeholder={ this.props.placeholder } type={ this.props.type ? this.props.type : 'text'} ></input>
		)
	}
}