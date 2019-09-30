import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'reactstrap';
import Link from 'next/link'
import Head from '../components/head'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/style.scss';
import moment from 'moment';

const Home = () => {
  const [date, setDate] = useState(null);


  useEffect(() => {
    async function getDate() {
      const res = await fetch('/api/date');
      const newDate = await res.json();
      const differnece = moment('05/01/2020').diff(moment(newDate.date), 'days');
      console.log(differnece);
      setDate(differnece);
    }
    getDate();
  }, []);

  return (
    <div>
      <Head title="Trilino" />
      <Container>
        <Row>
          <Col xs='12' className="middle">
            <img src="/static/construction.gif" ></img>
          </Col>
        </Row>

        {
          date ?
          (<div className="intro">
            <Row>
              <Col xs='12' className="middle">
                <h1 className="middle">{`Ova usluga će biti aktivna za ${date} dana`} </h1>
              </Col>
            </Row>

            <Row>
              <Col xs='12' className="middle">
                <h1 className="middle">{`This service is going to be active in ${date} days`}</h1>
              </Col>
            </Row>
          </div>)
          : null
        }
        
      </Container>
      
    </div>
  )
}

export default Home
