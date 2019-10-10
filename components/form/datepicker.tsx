import React from 'react';
import DatePicker from "react-datepicker";
import { datePickerMonths } from '../../lib/language/dateLanguage';

interface MyProps {
	date: Date;
	dateChange(date: Date): any;
	lang: string;
	className: string;
};
interface MyState {
	date: Date;
	months?: any;
	years?: Array<number>;
};

export default class DatePickerBasic extends React.Component <MyProps, MyState> {
	
	state: MyState = {
       date: this.props.date,
       months: datePickerMonths[this.props.lang],
       years: [2019, 2020]

    };

    render(){
    	console.log(this.props.date.getDate())
    	return(
    			<DatePicker
		      renderCustomHeader={({
		        date,
		        changeYear,
		        changeMonth,
		        decreaseMonth,
		        increaseMonth,
		        prevMonthButtonDisabled,
		        nextMonthButtonDisabled
		      }) => (
		        <div
		          style={{
		            margin: 10,
		            display: "flex",
		            justifyContent: "center"
		          }}
		        >
		          <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
		            {"<"}
		          </button>
		          <select
		            value={2019}
		            onChange={({ target: { value } }) => changeYear(value)}
		          >
		            {this.state.years.map(option => (
		              <option key={option} value={option}>
		                {option}
		              </option>
		            ))}
		          </select>

		          <select
		            value={this.state.months[this.state.date.getMonth()]}
		            onChange={({ target: { value } }) =>
		              changeMonth(this.state.months.indexOf(value))
		            }
		          >
		            {this.state.months.map(option => (
		              <option key={option} value={option}>
		                {option}
		              </option>
		            ))}
		          </select>

		          <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
		            {">"}
		          </button>
		        </div>
		      )}
		      selected={this.state.date}
		      onChange={this.props.dateChange}
		    />
    	)
    }

     
}