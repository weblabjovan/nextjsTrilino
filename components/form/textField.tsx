import React from 'react';


type MyProps = {
	placeholder?: string; 
	className?: string;
	onChange?(event: any): void;
	value?: any;
	max?: number;
  // using `interface` is also ok
};
type MyState = {

};

export default class PlainText extends React.Component <MyProps, MyState> {

	render(){
		return(
			<textarea className={`plainInput ${this.props.className}`} onChange={ this.props.onChange } placeholder={ this.props.placeholder } value={this.props.value === null ? "" : this.props.value } maxLength={ this.props.max ? this.props.max : 288} ></textarea>
		)
	}
}