import React from 'react';


type MyProps = {
	placeholder?: string; 
	className?: string;
	type?: string;
	onChange?(event: any): void;
	value?: any;
	max?: number;
	disabled?: boolean;
	name?: string;
  // using `interface` is also ok
};
type MyState = {

};

export default class PlainInput extends React.Component <MyProps, MyState> {

	render(){
		return(
			<input className={`plainInput ${this.props.className}`} onChange={ this.props.onChange } placeholder={ this.props.placeholder } type={ this.props.type ? this.props.type : 'text'} value={this.props.value === null ? "" : this.props.value } maxLength={ this.props.max ? this.props.max : 56} disabled={ this.props.disabled ? this.props.disabled : false } name={ this.props.name ? this.props.name : ''  } ></input>
		)
	}
}