import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";
import React from "react";
import { Container, Row } from "react-bootstrap";
import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { Button, Col, Form ,Alert, } from "react-bootstrap";
import { Link, Redirect, Route, Switch, useLocation } from "react-router-dom";
//import {loadAllClients, addClient} from "../services/ApiClient"

function ClientSignupPage(props) {
  const [clients, setClients] = useState([]);

  const [loading, setLoading] = useState(true); // still loading at mount
  const [dirty, setDirty] = useState(true) ; // exams are dirty



  // Rehydrate exams at mount time, and when courses are updated
 /*
  useEffect(() => {
    if ( dirty) {
      props.loadAllClients().then(newCl => {
        setClients(newCl);
        setLoading(false);
        setDirty(false);
      });
    }
  }, [dirty]);
  */


  //const examCodes = exams.map(exam => exam.coursecode);



  const addClient = (client) => {
    setClients(oldClients => [...oldClients, client]);

    props.addClient(client).then((err)=>{setDirty(true)}) ;
  }




  return (
    <Container>
      <Row>
        <NavbarComponent cart={1} />
        {/*cart prop receives the length of the items list in shopping cart */}
      </Row>
      <Row>
        <Title />
      </Row>
      <Row>
        <ClientPage {...props} />
      </Row>
    </Container>
  );
}

function Title(props) {
  return (
    <Col>
      <h1>Add New Client</h1>
    </Col>
  );
}

function ClientPage(props) {
  return (
    <Container>
      {" "}
      <Row>
        <ClientForm {...props}/>
      </Row>
    </Container>
  );
}

function ClientForm(props) {
  const [validated, setValidated] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [date, setDate] = useState(
    window.location.state
      ? window.location.state.date.format("YYYY-MM-DD")
      : dayjs().format("YYYY-MM-DD")
  );

  //added
  const [client, setClient] = useState({ firstName: "", lastName: "",phoneNumber: "", email: " ", address:"", number:"", city:"", postCode:""  });
        const handleChange = e => {
            const { name, value } = e.target;
            setClient(prevState => ({
                ...prevState,
                [name]: value
            }));
        };
        //*** */

  const handleSubmit = (event) => {
    event.preventDefault();
   try {
    props.addClient(client);
    setSuccess(true);
   
     }catch(err){
      setError("error");
     }
    
   
  };
if(success){<Redirect to = "/"/>}
  return (
    <>
    <div>{error && (
            <Alert variant="danger" onClose={() => setError("")} dismissible>
              {error}
            </Alert>
          )}</div>
      <Container flex className="content">
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <h4>User Information</h4>
          <Row className="mb-3">
            <Form.Group as={Col} md="3" controlId="validationCustom01">
              <Row flex className>
                <Col>
                  <Form.Label >First name</Form.Label>
                </Col>
                <Col>
                  <Form.Control value ={client.firstName}  onChange={handleChange} name = "firstName" required type="text" placeholder="first name"/>
                </Col>
              </Row>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="3" controlId="validationCustom01">
              <Row>
                <Col>
                  <Form.Label>Last name</Form.Label>
                </Col>
                <Col>
                  <Form.Control value ={client.lastName}  onChange={handleChange} name = "lastName" 
                    class="col-xs-4"
                    required
                    type="text"
                    placeholder="last name"
                  />
                </Col>
              </Row>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="3" controlId="validationCustom01">
              <Row>
                <Col>
                  <Form.Label>Phone Number</Form.Label>
                </Col>
                <Col>
                  <Form.Control value ={client.phoneNumber}  onChange={handleChange} name = "phoneNumber" 
                    required
                    type="text"
                    placeholder="phone number"
                  />
                </Col>
              </Row>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row>
            <Form.Group as={Col} md="3" controlId="validationCustom02">
              <Row>
                <Col>
                  <Form.Label>Email</Form.Label>
                </Col>
                <Col>
                  <Form.Control value ={client.email}  onChange={handleChange} name = "email" required type="text" placeholder="email" />
                </Col>
              </Row>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row></Row>

          <h4>Residential Address</h4>

          <Row className="mb-3">
            <Row>
              <Form.Group as={Col} md="6" controlId="validationCustom03">
                <Row>
                  <Col>
                    <Form.Label>Address</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control value ={client.address}  onChange={handleChange} name = "address"  type="text" placeholder="address" required />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid address.
                    </Form.Control.Feedback>
                  </Col>

                  <Col>
                    <Form.Label> Number </Form.Label>
                  </Col>
                  <Col>
                    <Form.Control value ={client.number}  onChange={handleChange} name = "number"  type="text" placeholder="number" required />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid number.
                    </Form.Control.Feedback>
                  </Col>
                </Row>
              </Form.Group>
            </Row>

            <> </>
            <Form.Group as={Col} md="3" controlId="validationCustom04">
              <Row>
                <Col>
                  <Form.Label>City</Form.Label>
                </Col>
                <Col>
                  <Form.Control  value ={client.city}  onChange={handleChange} name = "city" type="text" placeholder="city" required />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid city.
                  </Form.Control.Feedback>
                </Col>
              </Row>
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="validationCustom05">
              <Row>
                <Col>
                  <Form.Label> Post code </Form.Label>
                </Col>
                <Col>
                  <Form.Control value ={client.postCode}  onChange={handleChange} name = "postCode" type="text" placeholder="Post code" required />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid post code.
                  </Form.Control.Feedback>
                </Col>
              </Row>
            </Form.Group>
          </Row>

          <Button className="button" type="submit" onClick={handleSubmit}>
            Submit
          </Button>

          <> </>

          <Link to="/">
            <Button className="button1" type="cancel">
              Reset
            </Button>
          </Link>
        </Form>
      </Container>
    </>
  );
}
export { ClientSignupPage };



