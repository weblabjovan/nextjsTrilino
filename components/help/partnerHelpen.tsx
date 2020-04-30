import React from 'react';
import { Row, Col } from 'reactstrap';


type MyProps = {
	lang?: string; 
  // using `interface` is also ok
};
type MyState = {

};

export default class PartnerHelpen extends React.Component <MyProps, MyState> {

	render(){
		return(
			<Row>
    		<Col xs="12">
    			<div className="helpPage">
    				<h2>Partner Activation Manuel</h2>
    				<div className="section" id="activationSec">
    					<img src={`/static/help/${this.props.lang}/help-activation.jpg`}></img>
    					<ul>
    						<li>If you want your partner profile to be active and visible to Trilino users, you need to fill out the forms in sections <strong>GENERAL</strong>, <strong>CATERING</strong>, <strong>DECORATION</strong>, <strong>OFFER</strong> and <strong>CALENDAR</strong>.</li>
    						<li>Filling out of the <strong>GENERAL</strong> section is 50% of the whole profile, so you need to be careful when filling out this part. Also, other sections like <strong>CALENDAR</strong> or <strong>CATERING</strong> can not be filled out without the data in section <strong>GENERAL</strong>.</li>
                            <li>In section <strong>GENERAL</strong> you need to fill out all fields in subsections: <strong>PROSTOR</strong>, <strong>WORKING HOURS</strong>, <strong>CHARACTERISTICS</strong>, <strong>TERMS/ROOMS</strong>. Also, you need to create minimum 4 terms per room, so that section <strong>CALENDAR</strong> can be operational.</li>
    						<li>After <strong>GENERAL</strong> section you need to fill out <strong>CATERING</strong> section where you can define your catering deals if you offer food for your guests. Also, you can define your drink list if you offer drinks to your guests.</li>
    						<li>After section <strong>CATERING</strong> you need to fill out section <strong>OFFER</strong> where you need to choose minimum 3 different fun content that will be available to your kid guests.</li>
    						<li>After section <strong>OFFER</strong> you need to fill out section <strong>CALENDAR</strong> where you need to create already made reservations for your venue for the next 6 months. By doing that you will assure unique calendar of events and there will be no chance of double reservations.</li>
    						<li>After section <strong>CALENDAR</strong> you can fill out section <strong>DECORATION</strong> if you have such service available for your guests.</li>
    						<li>When all relevant and needed data is filled in you can contact your Trilino account and arrange the upload of high quality photos that will visualy present your venue.</li>
    					</ul>
    				</div>


    				<h2>Partner Profile Manuel</h2>
    				<div className="section" id="generalSec">
    					<h4>GENERAL</h4>
    					<img src={`/static/help/${this.props.lang}/help-general-1.jpg`}></img>
    					<ul>
    						<li>In section <strong>GENERAL</strong> you can find a form which collects data about your space, location and capacity. This data is most important for decision making of the Trilino users, when they are using our service to organize their celebration.</li>
    						<li>Field <strong>VENUE DESCRIPTION</strong> is required field where you need to describe your space in 450 characters.</li>
    						<li>Field <strong>VENUE TYPE</strong> is required field where you choose the type of your venue.</li>
    						<li>Field <strong>VENUE ADDRESS</strong> is required field where you need to insert your address (street and number).</li>
    						<li>Field <strong>CITY</strong> is unabled field and can not be changed.</li>
    						<li>Field <strong>CITY PART</strong> is required field where you have to choose part of the city where your venue is located.</li>
    						<li>Field <strong>SIZE OF THE VENUE</strong> is required field where you have to, using only numbers, insert the size of the space.</li>
    						<li>Field <strong>SIZE OF PLAY AREA</strong> is required field where you have to, using only numbers, insert the size of the space reserved for kids play.</li>
    						<li>Field <strong>SUITED FOR AGES FROM</strong> is required field where you have to insert minimal age for which your venue is suited for.</li>
    						<li>Field <strong>SUITED FOR AGES TO</strong> is required field where you have to insert maximal age for which your venue is suited for.</li>

    					</ul>
    					<img src={`/static/help/${this.props.lang}/help-general-2.jpg`}></img>
    					<ul>
    						<li>In section <strong>WORKING HOURS</strong> you need to choose start and end times for each week day. If you do not work on some days you can choose last option in the drop down for start and end times.</li>
    					</ul>
    					<img src={`/static/help/${this.props.lang}/help-general-3.jpg`}></img>
    					<ul>
    						<li>In section <strong>CHARACHERISTICS</strong> you can find questions about the characteristics of your space that can help Trilino users to decide if your space is suitable for their needs.</li>
    						<li>Field <strong>DO YOU HAVE PARKING FOR THE GUESTS?</strong> is required field and you need to choose between yes and no.</li>
    						<li>Field <strong>DO YOU HAVE YARD FOR THE GUESTS?</strong> is required field and you need to choose between yes and no.</li>
    						<li>Field <strong>DO YOU HAVE TERACE FOR THE GUESTS?</strong> is required field and you need to choose between yes and no.</li>
    						<li>Field <strong>DO YOU HAVE POOL FOR THE GUESTS?</strong> is required field and you need to choose between yes and no.</li>
    						<li>Field <strong>DO YOU HAVE FREE WIFI?</strong> is required field and you need to choose between yes and no.</li>
    						<li>Field <strong>DO YOU OFFER INHOUSE ANIMATOR?</strong> is required field and you need to choose between yes and no. It doesn't matter if your inhouse animator is provided with additional payment or free</li>
    						<li>Field <strong>DO YOU OFFER INHOUSE MOVIE THEATRE?</strong> is required field and you need to choose between yes and no.</li>
    						<li>Field <strong>DO YOU HAVE GAMING ROOM?</strong> is required field and you need to choose between yes and no. Gaming room can be some separate space where guests can play computer and video games.</li>
    						<li>Field <strong>DO YOU OFFER INHOUSE FOOD?</strong> is required field and you need to select if you are providing your guests with catering deals or not.</li>
    						<li>Field <strong>DO YOU OFFER INHOUSE DRINKS?</strong> is required field and you need to choose between yes and no. You need to indicate if you have a bar.</li>
    						<li>Field <strong>CAN GUESTS BRING THEIR OWN FOOD?</strong> is required field and you need to choose between yes and no. You need to indicate if the guests can organize their own catering and bring inside of your venue.</li>
    						<li>Field <strong>CAN GUESTS BRING THEIR OWN DRINKS?</strong> is required field and you need to choose between yes and no. You need to indicate if your guests are free to not use the service of your bar.</li>
    						<li>Field <strong>CAN GUESTS ORGANIZE THEIR OWN ANIMATOR?</strong> is required field and you need to choose between yes and no.</li>
    						<li>Field <strong>DO YOU HAVE SEPARATE SMOKING AND NON SMOKING AREA?</strong> is required field and you need to choose between yes and no.</li>	
    					</ul>
    					<img src={`/static/help/${this.props.lang}/help-general-4.jpg`}></img>
    					<ul>
    						<li>In section <strong>TIMES/ROOMS</strong> you need to set up the bounderies for the future reservations.</li>
    						<li>Field <strong>TERM DURATION</strong> is required field and it collects the data about duration of one celebration.</li>
    						<li>Field <strong>FREE CANCELATION PERIOD</strong>is required field and indicates time before celebration when users can cancel their reservation for free.</li>
    						<li>Field <strong>NUMBER OF GUEST SPACES</strong> is required field and indicates how many celebartion rooms you have available.</li>
    						<li>Field <strong>DEPOSIT PERCENTAGE</strong> is required field and it indicates price percentage needed for the deposit.</li>
    						<li>Field <strong>DEPOSIT BASE</strong> is required field and indicates the price base for the deposit, and it can be full price or just price of one term.</li>
    						<li>Field <strong>DOUBLE TERM DISCOUNT</strong> is required field and indicates what is the discount in percentages for users that reserve two terms in the row.</li>
    						<li>Field <strong>SPACE NAME</strong> is required field.</li>
    						<li>Field <strong>SPACE SIZE</strong> is required field and indicates how big the celebration room is.</li>
    						<li>Field <strong>SPACE CAPACITY KIDS</strong> is required field and nd indicates how many kids can fit inside that room.</li>
    						<li>Field <strong>SPACE CAPACITY ADULTS</strong> is required field and nd indicates how many adults can fit inside that room.</li>
    						<li>Terms for each space/room is defined by filling out <strong>START</strong>, <strong>END</strong>and<strong>PRICE</strong>. Terms are grouped by week days and if you want to add a term you need to click on <strong>ADD TERM</strong>, but if you want to delete last term of the day you need to click <strong>DELETE TERM</strong></li>

    					</ul>
    				</div>

    				<div className="section" id="cateringSec">
    					<h4>KATERING</h4>
    					<img src={`/static/help/${this.props.lang}/help-catering-1.jpg`}></img>
    					<ul>
    						<li>In section <strong>KATERING</strong> you are defining your catering deals if you indend to provide food for your guests and also you are defining a drink card if you plan to provide drinks for your guests.</li>
    						<li>To define catering deal you need to fill out field <strong>TYPE</strong>, a type can be for kids, adults and both. Catering deal need to have a price in field <strong>PRICE</strong> and minimal number of persons that can apply for it in the field <strong>MINIMUM</strong>.</li>
    						<li>You need to define the deal content by adding food like deal items. In field <strong>FOOD/DRINK YOU WANT TO ADD</strong> insert the food/dish name and click <strong>ADD FOOD/DRINK TO THE DEAL</strong>. The food/dish will than be a part of the deal.</li>
    						<li>By clicking on <strong>ADD DEAL</strong> you create new form for creating a catering deal.</li>
    						<li>If you have selected, in the general section, that you provide food for your guests you need to have at least one catering deal with at least 3 different food items.</li>
    					</ul>
    					<img src={`/static/help/${this.props.lang}/help-catering-2.jpg`}></img>
    					<ul>
    						<li>In section <strong>DRINK MENU</strong> you define your drink offer.</li>
    						<li>You use drink card form to create a new drink card item and than by clicking on the button for adding that drink you will see it in the left section drink menu display.</li>
    						<li>Field <strong>DRINK NAME</strong> is required field and indicates drink name.</li>
    						<li>Field <strong>SIZE</strong> is required field and indicates drink size.</li>
    						<li>Field <strong>MESUREMENT</strong> is required field and indicates drink measure like liter, centiliter, decaliter, etc.</li>
    						<li>Field <strong>PRICE</strong> is required field.</li>
    						<li>Field <strong>TYPE</strong> is required field and indicates if the drink is alcohol, non alcohol or hot drink.</li>
    						<li>By clicking on <strong>ADD ON DRINK MENU</strong> you will create a new drink in the menu.</li>
    						<li>If you would like to delete a drink from the menu you can use a red X character which is on the left side of each drink item in the drink menu display.</li>
    					</ul>

    				</div>

    				<div className="section" id="decorationSec">
    					<h4>DECORATION</h4>
    					<img src={`/static/help/${this.props.lang}/help-decoration.jpg`}></img>
    					<ul>
    						<li>In section <strong>DECORATION</strong> you define decoration services that you provide.</li>
    						<li>On the DECORATION list you can find decoration itmes, for those that you have as a part of your service you need to check them and privide a price if they are not free. For the free ones you just add 0  to the price. The decoration is for the space/room that will be reserved. One unique decoration item should have a unique price, and that price can not vary according to the space/room size. It should be universal.</li>
    					</ul>
    				</div>


    				<div className="section" id="contentSec">
    					<h4>OFFER</h4>
    					<img src={`/static/help/${this.props.lang}/help-content-1.jpg`}></img>
    					<ul>
    						<li>In section <strong>OFFER</strong> you define fun content and activities that will be available in your venue. There are two different content types: free content that is available in every situation and additional content that is available with additional payment, with additional remarks, up front reservations, time restrictions, number restrictions etc.</li>
    						<li>You can choose your free content by searching the free content list and clicking the blue button on the side of the content item that you have in your venue. When you click on the blue button that content will appear on the left side in the Chosen content section.</li>
    						<li>You can remove a content fron the chosen content section by clicking on the X character or by clicking on the red button in the free contnet list section.</li>
    						<li>List you create in the chosen content section will be visible to Trilino users on your profile and it will indicate what fun activities and content is available at you venue.</li>
    					</ul>
    					<img src={`/static/help/${this.props.lang}/help-content-2.jpg`}></img>
    					<ul>
    						<li>In section <strong>ADDITIONAL CONTENT</strong> you define fun contents that are available with additional payment, reservation, or some other constraint.</li>
    						<li>Field <strong>CONTENT NAME</strong> is required field and indicates content name.</li>
    						<li>Field <strong>PRICE</strong> is required field and indicates the price for one term, if the content is free you can insert 0 in this field..</li>
    						<li>Field <strong>CONTENT COMMENT</strong> is required field and indicates the restriction which is related to this content. This can be any restriction from upfront reservation, number of items available, time constriction on the usage, etc.</li>
    						<li>By clicking on <strong>ADD</strong> newly created content will be visible in the additional content list section.</li>
    						<li>If you want to delete some additional content that you have previously added to the list, you just need to click X charachter on the side of that particular content and it will disapear from the list.</li>
    					</ul>

    				</div>

    				<div className="section" id="calendarSec">
    					<h4>CALENDAR</h4>
    					<img src={`/static/help/${this.props.lang}/help-calendar.jpg`}></img>
    					<ul>
    						<li>In section <strong>CALENDAR</strong> you can check your reservations in the calendar form. If you have more celebration spaces/rooms in your venue you will see a small menu on the right wich represents a list of the celebrations rooms and indicates for which room you currently see the calendar.</li>
    						<li>Starting time span of the calendar is weekly but you can choose <strong>MONTH</strong> or <strong>DAY</strong> span by clicking on the buttons on the right.</li>
    						<li>By clicking <strong>NEXT</strong> you will go one time span in the future and by clicking <strong>PREVIOUS</strong> you will go one time span in the past (from the current). Button <strong>TODAY</strong> will bring you back to the present time span, it depends on the one you have chosen before if you will se monthly, weekly or daily.</li>
    						<li>By cliking on <strong>CREATE RESERVATION</strong> button you will open a reservation form that will help you organize your reservation data and create a reservation so no one can make a double reservation and confuse your staff and our users.</li>
    					</ul>
    					<img src={`/static/help/${this.props.lang}/help-reservation.jpg`}></img>
    					<ul>
    						<li>Field <strong>ROOM</strong> is only visible to ones that have more celebration rooms available at one venue.</li>
    						<li>Field <strong>DATE</strong> is required field and it indicates the exact date for the reservation.</li>
    						<li>Field <strong>TERM</strong> is required field and it indicates the start and end times of the reservation.</li>
    						<li>Field <strong>USER</strong> je zaključano Field za vas. Ono je samo informativno pojle i popunjeno je onda kada je rezervaciju napravio korisnik.</li>
    						<li>Field <strong>GUEST NAME</strong> is required field and it indicates the celebrator.</li>
    						<li>Field <strong>DOUBLE TERM</strong> gives you the posibility to make reservations for two terms in the row.</li>
    						<li>Field <strong>COMMENT</strong> gives you the posibility to enrich your reservation data with information that will be benefitial for event organization or execution.</li>
    						<li>Field <strong>CALCULATE PRICE</strong> vgives you the posibility to see the final price and the price of the deposit.</li>
    						<li>If you have catering deals you will see a field <strong>NUMBER</strong> for each of those deals. This field indicates how many persons should be served with this catering deal.</li>
    						<li>If you have additional content available, you will see a list of additional content with the posibility to check each of them and by that indicate that for this reservation you need to prepare that content.</li>
    						<li>If you have decorations you will se a list of those as well and you will have the posibility to choose from them.</li>
    						<li>Reservation creation is a process that helps you organize reservation data and it shapes up the calendar. If you do not need to use all of the fields in the form thera are some that are mandatory. <strong>ROOM</strong> <strong>DATE</strong> <strong>TERM</strong> <strong>GUEST NAME</strong> fields.</li>
    					</ul>

    				</div>
    				
    			</div>
    		</Col>
    	</Row>
		)
	}
}