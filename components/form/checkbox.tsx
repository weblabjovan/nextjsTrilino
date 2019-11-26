import React from 'react';

type MyProps = {
	checked?: boolean;
	disabled?: boolean;
	onChange?(event: any): void;
  // using `interface` is also ok
};
type MyState = {

};


export default class PlainCheckbox extends React.Component <MyProps, MyState> {

  // _handleChange = () => {
  //   this.setState({
  //     checked: !this.state.checked
  //   });
  // };

  render() {
    return (
      <div className="React__checkbox">
        <label>
          <input
            type="checkbox"
            className="React__checkbox--input"
            checked={this.props.checked}
            disabled={this.props.disabled}
            onChange={this.props.onChange}
          />
          <span className="React__checkbox--span" />
        </label>
      </div>
    );
  }
}


