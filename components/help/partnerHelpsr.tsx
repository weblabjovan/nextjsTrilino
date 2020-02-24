import React from 'react';
import { Row, Col } from 'reactstrap';


type MyProps = {
	lang?: string; 
  // using `interface` is also ok
};
type MyState = {

};

export default class PartnerHelpsr extends React.Component <MyProps, MyState> {

	render(){
		return(
			<Row>
    		<Col xs="12">
    			<div className="helpPage">
    				<h2>Uputstvo za aktivaciju profila</h2>
    				<div className="section" id="activationSec">
    					<img src={`/static/help/${this.props.lang}/help-activation.jpg`}></img>
    					<ul>
    						<li>Da bi vaš partnerski profil bio aktivan i na taj način vidljiv posetiocima Trilino sajta, potrebno je da pažljivo i tim redosledom popunite formulare koji se nalaze u okviru opcija <strong>OSNOVNO</strong>, <strong>HRANA I PIĆE</strong>, <strong>DEKORACIJA</strong>, <strong>PONUDA</strong> i <strong>KALENDAR</strong>.</li>
    						<li>Popunjavanje sekcije <strong>OSNOVNO</strong> predstavlja 50% ukupnog profila, stoga je dobro da prvo popunite ovaj deo. Takođe, određene sekcija kao na primer <strong>KALENDAR</strong> ili <strong>HRANA I PIĆE</strong> nije moguće adekvatno popuniti ukoliko prethodno nisu sačuvani podaci u opciji <strong>OSNOVNO</strong>.</li>
    						<li>Nakon sekcije <strong>OSNOVNO</strong> potrebno je popuniti sekciju <strong>HRANA I PIĆE</strong> u kojoj u koliko nudite ketering pakete morate ponuditi barem jedan paket. Takođe ukoliko nudite piće svojim gostima morate kreirati kartu pića od minimum 3 različita pića.</li>
    						<li>Nakon sekcije <strong>HRANA I PIĆE</strong> potrebno je popuniti sekciju <strong>PONUDA</strong> u kojoj je potrebno izabrati minimum 3 različita besplatna sadržaja koje nudite deci koja su gosti proslava u vašem prostoru.</li>
    						<li>Nakon sekcije <strong>PONUDA</strong> potrebno je popuniti sekciju <strong>KALENDAR</strong> u kojoj je potrebno rezervisati sve termine koji će biti nedostupni korisnicima Trilino sajta u narednih 6 meseci. Na taj način ćete osigurati jedinstveni i ažurni kalendar rezervacija/događaja i onemogućiti potencijalno dupliranje rezervacija.</li>
    						<li>Nakon sekcije <strong>KALENDAR</strong> možete popuniti sekciju <strong>DEKORACIJA</strong> ukoliko vaš prostor nudi izbor dodatne dekoracije.</li>
    						<li>Kada svi podaci budu unešeni možete kontaktirati vašeg Trilino savetnika u vezi sa kreiranjem adekvatnih fotografija kojima će se vizuelno predstaviti vaš prostor.</li>
    					</ul>
    				</div>


    				<h2>Uputstvo za popunjavanje partnerskog profila</h2>
    				<div className="section" id="generalSec">
    					<h4>Osnovno</h4>
    					<img src={`/static/help/${this.props.lang}/help-general-1.jpg`}></img>
    					<ul>
    						<li>U opciji <strong>OSNOVNO</strong> se nalazi formular koji prikuplja osnovne informacije o vašem prostoru, lokaciji i kapacitetu, sa ciljem da te informacije budu adekvatno predstavljene korisnicima Trilino sajta koji su zainteresovani za organizaciju dečijih proslava.</li>
    						<li>Polje <strong>OPIS PROSTORA</strong> je obavezno polje u kojem je potrebno opisno predstaviti vaš prostor u okviru 450 karaktera (slova, brojeva).</li>
    						<li>Polje <strong>TIP PROSTORA</strong> je obavezno polje u kojem je potrebno odabrati tip kojem vaš prostor najviše odgovara.</li>
    						<li>Polje <strong>ADRESA PROSTORA</strong> je obavezno polje u kojem je potrebno upisati adresu (ulicu i broj) vašeg prostora.</li>
    						<li>Polje <strong>GRAD</strong> je zaključano polje i ono se ne moće menjati.</li>
    						<li>Polje <strong>DEO GRADA</strong> je obavezmo polje u kojem je potrebno odabrati deo grada u kome se nalazi vaš prostor.</li>
    						<li>Polje <strong>POVRŠINA PROSTORA</strong> je obavezno polje u kojem je potrebno upisati, koristeći samo brojeve, kvadraturu celog prostora/lokala.</li>
    						<li>Polje <strong>POVRŠINA PROSTORA ZA IGRU</strong> je obavezno polje u kojem je potrebno upisati, koristeći samo brojeve, kvadraturu prostora koji je deci dostupan isključivo za igru.</li>
    						<li>Polje <strong>PREDVIĐEN ZA UZRAST OD</strong> je obavezno polje u kojem je potrebno odabrati minimalni uzrast dece za koju je predviđen sadržaj koji poseduje prostor.</li>
    						<li>Polje <strong>PREDVIĐEN ZA UZRAST DO</strong> je obavezno polje u kojem je potrebno odabrati maksimalni uzrast dece za koju je predviđen sadržaj koji poseduje prostor.</li>

    					</ul>
    					<img src={`/static/help/${this.props.lang}/help-general-2.jpg`}></img>
    					<ul>
    						<li>U opciji <strong>RADNO VREME</strong> potrebno je odabrati početak i kraj radnog vremena po danima u nedelji. Ukoliko je neki dan neradan možete odabrati poslednju opciju u padajućem meniju kao početak i kraj radnog vremena.</li>
    					</ul>
    					<img src={`/static/help/${this.props.lang}/help-general-3.jpg`}></img>
    					<ul>
    						<li>U opciji <strong>KARAKTERISTIKE</strong> se nalaze pitanja u vezi sa osobinama vašeg prostora koja će korisnicima Trilino sajta pomoći da donesu odluku gde da organizuju svoju proslavu.</li>
    						<li>Polje <strong>DA LI JE GOSTIMA DOSTUPAN PARKING?</strong> je obavezno polje u kojem je potrebno izabrati između odgovara da ili ne.</li>
    						<li>Polje <strong>DA LI JE GOSTIMA DOSTUPNO DVORIŠTE?</strong> je obavezno polje u kojem je potrebno izabrati između odgovara da ili ne.</li>
    						<li>Polje <strong>DA LI JE GOSTIMA DOSTUPNA TERASA?</strong> je obavezno polje u kojem je potrebno izabrati između odgovara da ili ne.</li>
    						<li>Polje <strong>DA LI JE GOSTIMA DOSTUPAN BAZEN?</strong> je obavezno polje u kojem je potrebno izabrati između odgovara da ili ne.</li>
    						<li>Polje <strong>DA LI JE GOSTIMA DOSTUPAN WIFI?</strong> je obavezno polje u kojem je potrebno izabrati između odgovara da ili ne.</li>
    						<li>Polje <strong>DA LI SE GOSTIMA NUDI ANIMATOR?</strong> je obavezno polje koje označava da li je u toku slavlja deci dostupan animator kojeg vi organizujete (besplatno ili uz doplatu).</li>
    						<li>Polje <strong>DA LI SE GOSTIMA NUDI BIOSKOP?</strong> je obavezno polje koje označava da li vaš prostor ima mogućnosti (audio, vizuelne i smeštajne) za projekciju nekog filma.</li>
    						<li>Polje <strong>DA LI SE GOSTIMA NUDI GAMING SOBA?</strong> je obavezno polje koje označava da vaš prostor poseduje posebnu sobu ili deo prostora koji je namenjen kopjuterskim i video igricama.</li>
    						<li>Polje <strong>DA LI SE GOSTIMA NUDI HRANA?</strong> je obavezno polje koje označava da li ste u mogućnosti da vašim gostima ponudite sopstveni ketering (onaj koji ćete vi organizovati).</li>
    						<li>Polje <strong>DA LI SE GOSTIMA NUDI PIĆE?</strong> je obavezno polje koje označava da li ste u mogućnosti da vašim gostima ponudite piće (da li imate neku vrstu bara sa spiskom pića).</li>
    						<li>Polje <strong>DA LI GOSTI MOGU DONETI SVOJU HRANU?</strong> je obavezno polje koje označava da li dozvoljavate vašim gostima da na slavlje donesu isključivo svoju hranu (hranu koju su sami pripremili ili kupili negde drugde).</li>
    						<li>Polje <strong>DA LI GOSTI MOGU DONETI SVOJE PIĆE?</strong> je obavezno polje koje označava da li dozvoljavate vašim gostima da na slavlje donesu isključivo svoje piće i na taj način ne budu u obavezi da poručuju piće iz vašeg bara.</li>
    						<li>Polje <strong>DA LI GOSTI MOGU ORGANIZOVATI SVOG ANIMATORA?</strong> je obavezno polje koje označava da li dozvoljavate vašim gostima da organizuju animatora koji nije povezan sa vašim prostorom.</li>
    						<li>Polje <strong>DA LI JE GOSTIMA DOSTUPNA PUŠAČKA I NEPUŠAČKA ZONA?</strong> je obavezno polje koje označava da li vaš prostor ima odvojene prostorije za pušače i nepušače.</li>	
    					</ul>
    					<img src={`/static/help/${this.props.lang}/help-general-4.jpg`}></img>
    					<ul>
    						<li>U opciji <strong>TERMINI/SALE</strong> se nalaze stavke kojima se definišu dostupni termini i osnovne karakteristike sala (rođendaonica) ukoliko vaš prostor ima mogućnosti za istovremeno održavanje više proslava.</li>
    						<li>Polje <strong>TRAJANJE TERMINA</strong> je obavezno polje u kojem je potrebno oodrediti vremensku dužinu termina proslave u vašem prostoru koju će korisnici Trilino sajta biti u mogućnosti da rezervišu.</li>
    						<li>Polje <strong>ROK OTKAZIVANJA</strong> je obavezno polje koje označava period u kome korisnik može besplatno otkazati prethodno rezervisani termin.</li>
    						<li>Polje <strong>BROJ SALA</strong> je obavezno polje u kojem je potrebno upisati, isključivo brojevima, broj sala koje vaš prostor poseduje. Ukoliko je u vašem prostoru moguće organizovati samo jednu proslavu u određeno vreme to znači da prostor ima jednu salu.</li>
    						<li>Polje <strong>PROCENAT ZA DEPOZIT</strong> je obavezno polje i njime se definiše koliki procenat cene je potrebno da korisnik plati unapred kako bi rezervisao termn u vašem prostoru.</li>
    						<li>Polje <strong>OSNOVICA ZA OBRAČUN DEPOZITA</strong> je obavezno polje u kojem je potrebno odabrati jednu od opcija. Osnovica predstavlja sumu od koje će se obračunavati procenat koji je unet u prethodno polje i ta osnovica može biti puna cena, sve što je korisnik označio da želi ili može biti samo cena termina.</li>
    						<li>Polje <strong>POPUST ZA DUPLI TERMIN</strong> je obavezno polje u kojem je potrebno odabrati nivo/procenat popusta za one korisnike koje rezervišu dupli termin (dva uzastopna termina).</li>
    						<li>Polje <strong>NAZIV SALE</strong> je obavezno polje u kojem je potrebno upisati naziv sale onako kako će se on prikazivati posetiocima Trilino sajta. Bez obzira da li imate jednu ili više sala za njih je potrebno upisati naziv.</li>
    						<li>Polje <strong>VELIČINA SALE</strong> je obavezno polje u kojem je potrebno upisati, isključivo koristeći brojeve, kvadraturu sale.</li>
    						<li>Polje <strong>KAPACITET SALE DECA</strong> je obavezno polje u kojem je potrebno upisati, isključivo koristeći brojeve, maksimalni broj dece koja mogu u jednom trenutku biti gosti u sali.</li>
    						<li>Polje <strong>KAPACITET SALE ODRASLI</strong> je obavezno polje u kojem je potrebno upisati, isključivo koristeći brojeve, maksimalni broj odraslih koji mogu u jednom trenutku biti gosti u sali.</li>
    						<li>Termine za svaku salu definišete tako što unesete <strong>POČETAK</strong> (vreme početka termina), <strong>KRAJ</strong>(vreme kraja termina) i <strong>CENU</strong>. Termini se grupišu po danima u nedelji, i ukoliko želite da dodate termin kliknite na dugme <strong>DODAJTE TERMIN</strong>, a ukoliko želite da obrišete termin kliknite na <strong>OBRIŠITE TERMIN</strong></li>

    					</ul>
    				</div>

    				<div className="section" id="cateringSec">
    					<h4>Ketering</h4>
    					<img src={`/static/help/${this.props.lang}/help-catering-1.jpg`}></img>
    					<ul>
    						<li>U opciji <strong>KETERING</strong> definišete ketering pakete koje ćete ponuditi vašim gostima, ukoliko imate takve mogućnosti. Takođe kreirate vašu kartu pića, koja će vašim korisnicima biti korisna informacija pri odlučivanju u toku organizacije proslave.</li>
    						<li>Da biste definisali ketering paket potrebno je da odredite kog je tipa, polje <strong>TIP</strong>, a može biti za decu, za odrasle ili univerzalni (za decu i odrasle). Ketering paket mora imati cenu po osobi koja se treba upisati u  polje <strong>CENA</strong> i potrebno je odrediti minimalni broj osoba za koje se može poručiti taj ketering paket, polje <strong>MINIMUM</strong> ispuniti isključivo brojevima.</li>
    						<li>Nakon definisanja osnovnih odrednica ketering paketa, potrebno je u njega uneti stavke, odnosno jela koja ulaze u njegov sasatav. U polje <strong>NAZIV JELA/PIĆA KOJE ŽELITE DODATI</strong> upišite naziv jela i kliknite na dugme <strong>DODAJTE JELO/PIĆE U PAKET</strong>. Upisano jelo postaće vidljivo u delu sadržaj paketa</li>
    						<li>Klikom na dugme <strong>DODAJTE PAKET</strong> kreirate novu karticu/formular za kreiranje ketering paketa.</li>
    						<li>Ukoliko ste označili da vašim gostima nudite hranu, to znači da u ovom odeljku morate kreirate barem jedan ketering paket koji će imati minimum 3 različita jela u svom sadržaju. Ukoliko ne nudite hranu ovaj deo možete ostaviti ne popunjen</li>
    					</ul>
    					<img src={`/static/help/${this.props.lang}/help-catering-2.jpg`}></img>
    					<ul>
    						<li>U opciji <strong>KARTA PIĆA</strong> nalaze se podaci o pićima koje nudite vašim gostima.</li>
    						<li>Formular za unos pića na kartu se koristi kako bi se prvo i svako novo piće unelo na kartu pića i postalo vidljivo na levoj strani ekrana u odeljku sive boje.</li>
    						<li>Polje <strong>NAZIV PIĆA</strong> je obavezno polje i u njega se upisuje naziv pića koje se unosi na kartu.</li>
    						<li>Polje <strong>KOLIČINA</strong> je obavezno polje i u njega se upisuje isključivo brojčana vrednost količine pića. Npr. 500 za 500 mililitra.</li>
    						<li>Polje <strong>MERA</strong> je obavezno polje i u njemu se bira merna jedinica prethodno unete količine. Ona može biti, mililitar, centilitar, dekalitar, litar itd.</li>
    						<li>Polje <strong>CENA</strong> je obavezno polje i u njega se upisuje cena navedenog pića u navedenoj količini.</li>
    						<li>Polje <strong>TIP</strong> je obavezno polje i u njemu se bira merna tip pića, a može biti bezalkoholno piće, alkoholno piće ili topli napitak.</li>
    						<li>Nakon ispunjavanja svih polja možete kliknuti na dugme <strong>DODAJTE PIĆE NA KARTU</strong> i prethodno uneto piće će biti vidljivo u karti pića.</li>
    						<li>Sa desne strane svakog pića nalazi se crveni X znak koji možete iskoristiti ukoliko želite da obrišete piže sa karte.</li>
    					</ul>

    				</div>

    				<div className="section" id="decorationSec">
    					<h4>Dekoracija</h4>
    					<img src={`/static/help/${this.props.lang}/help-decoration.jpg`}></img>
    					<ul>
    						<li>U opciji <strong>DEKORACIJA</strong> definišete dekorativni sadržaj koji je dostupan vašim gostima bez obzira da li je taj sadržaj besplatan ili se dodatno naplaćuje.</li>
    						<li>Na listi dekoracija nalaze se dekorativne stavke, potrebno je da označite one stavke koje nudite gostima i za njih upišete cenu ukoliko takve stavke dodatno naplaćujete. Cena dekorativne stavke je univerzalna i odnosi se na dekorisanje sale u kojoj se održavaju proslave. Bez obzira na različite veličine sala ukoliko ih vaš prostor ima više, cene dekoracija (jedne dekorativne stavke) moraju biti jedinstvene/univerzalne.</li>
    					</ul>
    				</div>


    				<div className="section" id="contentSec">
    					<h4>Ponuda</h4>
    					<img src={`/static/help/${this.props.lang}/help-content-1.jpg`}></img>
    					<ul>
    						<li>U opciji <strong>PONUDA</strong> definišete zabavne sadržaje koje će biti dostupne deci koja budu na proslavi u vašem prostoru. Postoje dve vrste zabavnih sadržaja: besplatni koji se ne naplaćuju dodatno i koji su uvek dostupni u vašem prostoru, i dodatni sadržaji za koje postoje određene napomene, vremenske odrednice, dodatna novčana nadoknada, potreba za prethodnom najavom.</li>
    						<li>Besplatne sadržaje birate tako što pronađete željeni sadržaj na listi besplatnih sadržaja i kliknete na plavo dugme pored njega. Taj besplatni sadržaj će se nakon toga naći na desnoj strani ekrana gde se nalaze prethodno odabrani sadržaji.</li>
    						<li>Ove sadržaje možete ukloniti tako što ćete kliknuti na X polje u samom odabranom sadržaju ili tako što ćete kliknuti na crveno dugme pored besplatnog sadržaja u listi besplatnih sadržaja.</li>
    						<li>Lista koju kreirate biće vidljiva posetiocima Trilino sajta koji će na vašem profilu moći da vide spisak svih zanimljivih stvari i aktivnosti koje deca mogu da iskuse u vašem prostoru.</li>
    					</ul>
    					<img src={`/static/help/${this.props.lang}/help-content-2.jpg`}></img>
    					<ul>
    						<li>U opciji <strong>DODATNI SADRŽAJI</strong> definišu se oni zabavni sadržaji, usluge i aktivnosti koje su gostima vašeg prostora dostupne uz doplatu, napomenu, ili neko drugo ograničenje.</li>
    						<li>Formular za unos pića na kartu se koristi kako bi se prvo i svako novo piće unelo na kartu pića i postalo vidljivo na levoj strani ekrana u odeljku sive boje.</li>
    						<li>Polje <strong>NAZIV SADRŽAJA</strong> je obavezno polje i u njega se upisuje naziv dodatnog sadržaja.</li>
    						<li>Polje <strong>CENA</strong> je obavezno polje i u njega se upisuje, isključivo u brojčanoj vrednosti, cena tog sadržaja za korišćenje u punom trajanju jednog termina. Ukoliko je sadržaj besplatan u ovo polje se upisuje broj 0.</li>
    						<li>Polje <strong>NAPOMENA</strong> je obavezno polje i predstavlja ograničenje koje je vezano uz korišćenje ovog sadrćaja. To može biti brojčano ograničenje, npr da je sadržaj dostupan samo za 5 dece u jednom trenutku. To može biti vremensko ograničenje, da se sadržaj može koristiti svega 30 minuta. To može biti ograničenje u okviru rezervisanja, da je npr. potrebno unapred rezervisati takav sadržaj i ukoliko se definisani vremenski period ne ispoštuje od strane korisnika vaš prostor nije u obavezi da prezentuje taj sadržaj.</li>
    						<li>Klikom na dugme <strong>DODATI</strong> u listi dodatnih sadržaja postaje vidljiv novi dodatni sadržaj sa podacima koje ste malopre uneli u formular.</li>
    						<li>Ukoliko želite da uklonite formular iz liste to možete uraditi klikom na X koji se nalazi u desnom uglu svakog kreiranog dodatnog sadržaja u listi.</li>
    					</ul>

    				</div>

    				<div className="section" id="calendarSec">
    					<h4>Kalendar</h4>
    					<img src={`/static/help/${this.props.lang}/help-calendar.jpg`}></img>
    					<ul>
    						<li>U opciji <strong>KALENDAR</strong> možete videti kalendarski pregled rezervisanih termina. Ukoliko lokacija ima više sala za proslavu, kalendar će prikazivati rezervisane termine samo jedne sale. Sa desne strane će se nalaziti padajući meni na kojem ćete moći da vidite koja je to sala u pitanju, a klikom na taj padajući meni imaćete mogućnost da izaberete i druge sale i vidite i njihov raspored.</li>
    						<li>Početni pregled je na nedeljnom rasponu, po širini stranice dani su označeni datumima, a po visini stranice označeni su sati. Ukoliko želite da promenite raspon posmatranja kalendara to možete uraditi klikom na dugme <strong>MESEC</strong> ili <strong>DAN</strong> koji se nalaze u gornjem desnom uglu i daju mesečno odnosno dnevni prikaz.</li>
    						<li>Radi bolje preglednosti po kalendaru se možete kretati u budućnost i u prošlost klikom na dugme <strong>NAPRED</strong> i <strong>NAZAD</strong>. Dugme <strong>NAPRED</strong> prikazuje rezervisane termine u sledećem rasponu u odnosu na poslednji prikazani (ukoliko je to nedeljni raspon prikazaće sledeću nedelju, ukoliko je mesečni raspon prikazaće sledeći mesec i ukoliko je odabran dnevni raspon prikazaće sledeći dan). Dugme <strong>NAZAD</strong> na isti način prikazuje termine u prethodnom rasponu, dok dugme <strong>DANAS</strong> prikazuje kalendar u odabranom rasponu tako da je današnji dan vidljiv na kalendaru (ukoliko je odabrani raspon nedeljni prikazaće se trenutna nedelja, ukoliko je dnevni prikazaće se današnji dan i ukoliko je prikaz mesečni prikazaće se trenutni mesec).</li>
    						<li>Ukoliko želite da označite neki termin tako da on više ne bude dostupan korisnicima Trilino sajta potrebno je da kliknete na dugme <strong>KREIRAJTE REZERVACIJU</strong> i tako otvorite rezervacioni formular koji vam pomaže da budućoj rezervaciji priključite koji će vam omogućiti da se za termin bolje pripremite.</li>
    					</ul>
    					<img src={`/static/help/${this.props.lang}/help-reservation.jpg`}></img>
    					<ul>
    						<li>Polje <strong>SALA</strong> je vidljivo samo ukoliko imate više sala za proslave, onda morate obeležiti salu za koji želite napraviti rezervaciju.</li>
    						<li>Polje <strong>DATUM</strong> je obavezno polje i na njemu označavate kog datuma će biti aktuelna rezervacija koju pravite. Možete odabrati samo datume koji su manje od pola godine u budućnosti.</li>
    						<li>Polje <strong>TERMIN</strong> je obavezno polje i na njemu označavate koji termin prethodno označenog datuma želite da rezervišete. Klikom na ovo polje otvara vam se padajuči meni koji vam nudi slobodne termine na prethodno odabrani datum.</li>
    						<li>Polje <strong>KORISNIK</strong> je zaključano polje za vas. Ono je samo informativno pojle i popunjeno je onda kada je rezervaciju napravio korisnik.</li>
    						<li>Polje <strong>IME SLAVLJENIKA/CE</strong> je obavezno polje i u njega se unosi ime deteta za kojeg se organizuje proslava.</li>
    						<li>Polje <strong>DUPLI TERMIN</strong> vam daje mogućnost da jednom rezervacijom dodatno rezervišete i sledeći termin ukoliko je on slobodan.</li>
    						<li>Polje <strong>KOMENTAR</strong> možete iskoristiti da vasim kolegama ili sebi ostavite neku belešku, informaciju koja će vam pomoći u toku pripreme i realizacije proslave.</li>
    						<li>Polje <strong>OBRAČUNAJTE CENU</strong> vam daje mogućnost da vidite kretanje ukupnih troškova i depozita u toku kreiranja rezervacije.</li>
    						<li>Ukoliko imate ketering ponudu, u svakom od paketa postojaće polje <strong>BROJ</strong> koje vam daje mogućnost da označite broj osoba za koje je potrebno spremiti određeni ketering paket.</li>
    						<li>Ukoliko imate ponudu za dodatni zabavni sadržaj, pored svake stavke dodatnog sadržaja videćete polje za čekiranje čijim označavanjem ukazujete da je taj sadržaj potreban u toku tog termina.</li>
    						<li>Ukoliko imate ponudu za dekoracijz, pored svake stavke dekoracije videćete polje za čekiranje čijim označavanjem ukazujete da je ta dekoracija potrebna u toku tog termina.</li>
    						<li>Kreiranje rezervacije je proces kojim onemogućavate da neki termin bude dostupan korisnicima sajta Trilino, ali to je takođe i vaš podsetnik stoga unesite onoliko informacija koliko vam je potrebno da biste organizovali kvalitetnu proslavu za vaše klijente. Ukoliko želite samo da označite termin tako da on više ne bude dostupan drugima, popunite samo obavezna polja <strong>SALA</strong> <strong>DATUM</strong> <strong>TERMIN</strong> <strong>IME SLAVLJENIKA/CE</strong>.</li>
    					</ul>

    				</div>
    				
    			</div>
    		</Col>
    	</Row>
		)
	}
}