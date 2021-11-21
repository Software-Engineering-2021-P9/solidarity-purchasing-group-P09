

import {React, useState} from "react";
import { employeeNavbarLinks } from "../Routes";
import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Col, Form, Alert, Container, Row} from "react-bootstrap";
import { Link, Redirect} from "react-router-dom";
import { createClient } from "../services/ApiClient";

function ClientSignupPage(props) {
  return (
    <Container>
      <Row>
        <NavbarComponent links={employeeNavbarLinks} />
      </Row>
      <Row>
      <ClientPage {...props} />
      </Row>
    </Container>
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
  
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  

  
  const [client, setClient] = useState({ firstName: "", lastName: "",phoneNumber: "", email: " ", address:"", number:"", city:"", postCode:"" });
        const handleChange = e => {
            const { name, value } = e.target;
            setClient(prevState => ({
                ...prevState,
                [name]: value
            }));
        };
        

  const handleSubmit = (event) => {
    event.preventDefault();
    let valid = true;
    if(client.firstName === '' || client.lastName === '' || client.phoneNumber === '' || client.email === '' || client.address === '' || 
    client.number === '' || client.city === '' || client.fpostCode === ''  ){
    valid = false;
   
    }
   
   try {
     if(valid){
    setErrorMessage("");
    createClient(client);
    setSuccess(true);

    setClient("");
     }
     else{
       setErrorMessage("Error in the form!");
     }
    
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
        <Form noValidate onSubmit={handleSubmit}>
          <h4>User Information</h4>
          <Row className="mb-3">
            <Form.Group as={Col} md="3" controlId="validationCustom01">
              <Row flex className>
                <Col>
                  <Form.Label >First name</Form.Label>
                </Col>
                <Col>
                  <Form.Control value ={client.firstName}  onChange={handleChange} name = "firstName" required type="text"/>
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
                  <Form.Control value ={client.email}  onChange={handleChange} name = "email" 
                  required
                   type="text" 
                    />
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
                    <Form.Control value ={client.address}  onChange={handleChange} name = "address"  type="text"  required />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid address.
                    </Form.Control.Feedback>
                  </Col>

                  <Col>
                    <Form.Label> Number </Form.Label>
                  </Col>
                  <Col>
                    <Form.Control value ={client.number}  onChange={handleChange} name = "number"  type="text"  required />
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
                  <Form.Control  value ={client.city}  onChange={handleChange} name = "city" type="text" required />
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
                  <Form.Control value ={client.postCode}  onChange={handleChange} name = "postCode" type="text"  required />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid post code.
                  </Form.Control.Feedback>
                </Col>
              </Row>
            </Form.Group>
          </Row>
         
          <Button className="button" type="submit" onClick={handleSubmit} >
            Submit
          </Button>
          
          <Link to="/">
            <Button className="button1" type="cancel">
              Cancel
            </Button><br/>
          {errorMessage}
          </Link>
        </Form>
      </Container>
    </>
  );
}

export { ClientSignupPage };
