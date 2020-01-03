import React from 'react';

type MyProps = {
	checked?: boolean;
	disabled?: boolean;
  field?: string;
	onChange?(event: any): void;
  label?: string;
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
      <div>
        
        <div className="React__checkbox">
          {
            this.props.label
            ?
            <label className="checkbox-simple-label">{this.props.label}</label>
            :
            null
          }
          
          <label>
            <input
              type="checkbox"
              className="React__checkbox--input"
              checked={this.props.checked}
              disabled={this.props.disabled}
              data-field={ this.props.field }
              onChange={(event) => this.props.onChange(event.target)}
            />
            <span className="React__checkbox--span" />
          </label>
        </div>
        
      </div>
      
    );
  }
}


