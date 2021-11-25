import React from "react";
import { Container, Row } from "react-bootstrap";
import { employeeNavbarLinks } from "../Routes";
import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect} from "react";
import { Col, Form ,Alert, } from "react-bootstrap";
import { Redirect} from "react-router-dom";
import { createClient } from "../services/ApiClient";
import  Button  from "../ui-components/Button/Button";
import validator from 'validator';




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
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessage1, setErrorMessage1] = useState("");
  const [errorMessage2, setErrorMessage2] = useState("");
  const [errorMessage3, setErrorMessage3] = useState("");
  const [errorMessage4, setErrorMessage4] = useState("");
  const [errorMessage5, setErrorMessage5] = useState("");
  const [errorMessage6, setErrorMessage6] = useState("");
  const [errorMessage7, setErrorMessage7] = useState("");
  const [errorMessage8, setErrorMessage8] = useState("");
  
  
  
useEffect(()=>{
  
},[success]);



  
  const [client, setClient] = useState({ firstName: "", lastName: "",phoneNumber: "", email: " ", address:"", number:"", city:"", postCode:"" });
        const handleChange = e => {
            const { name, value } = e.target;
            setClient(prevState => ({
                ...prevState,
                [name]: value
            }));
        };


        const handleCancel =(event)=>{
          event.preventDefault();
        setClient({
        firstName:"",
        lastName:"",
        phoneNumber:"",
        email:"",
        address:"",
        number:"",
        city:"",
        postCode:"",
        }
        );
        } 

  const handleSubmit = (event) => {
    event.preventDefault();
    let valid = true;
    setErrorMessage("");
    setErrorMessage1("");
    setErrorMessage2("");
    setErrorMessage3("");
    setErrorMessage4("");
    setErrorMessage5("");
    setErrorMessage6("");
    setErrorMessage7("");
    setErrorMessage8("");
  
    if(client.firstName === '' 
    || client.lastName === '' 
    || client.phoneNumber === '' 
    || client.email === '' 
    || client.address === '' 
    || 
    client.number === '' 
    || client.city === '' 
    || client.postCode === ''
   || !(validator.isEmail(client.email)) || !(validator.isMobilePhone(client.phoneNumber) )
   || !(validator.isAlpha(client.firstName)) || !(validator.isAlpha(client.lastName)) 
   || !(validator.isAlpha(client.city)) 
   || (validator.isAlpha(client.address))
    || !(validator.isNumeric(client.number)) 
    || !(validator.isNumeric(client.postCode))){
    valid = false;
  
      }
   try {
     if(valid){
      
    createClient(client);
    setSuccess(true);

    setClient("");
     }
     else{
       
       setError(true);
       if(client.firstName === '' || client.lastName === '' || client.phoneNumber === '' || client.email === '' || client.address === '' || 
    client.number === '' || client.city === '' || client.postCode === ''  ){
      setErrorMessage("Fill in all the fields!");
    }

   if(!(validator.isEmail(client.email)) ){
    setErrorMessage1("The Email is invalid!");
   }

   if(!(validator.isMobilePhone(client.phoneNumber))){
    setErrorMessage2("*The phone number is invalid!  ");
   }
   if(!(validator.isAlpha(client.firstName) && !(client.firstName === '' ))){
    setErrorMessage3("*The first name is incorrect!  ");
   }
   if(!(validator.isAlpha(client.lastName) )){
    setErrorMessage4("*The last name is incorrect!  ");
   }
   if(!(validator.isAlpha(client.city))){
    setErrorMessage5("*The city is incorrect!  ");
   }
   if(!(validator.isAlpha(client.address))){
    setErrorMessage6("*The address is incorrect!  ");
   }
   if(!(validator.isNumeric(client.number))){
    setErrorMessage7("*The number is incorrect!  ");
   }
   if(!(validator.isNumeric(client.postCode))){
    setErrorMessage8("*The postCode must be a number!  ");
   }
 
     }
    
     }catch(err){
      setError(true);
       setErrorMessage("Error in the form!");
     }
    
   
  };

 


  return (
    <>
    {success ? <Redirect to = "/"/> : ""}
    {error ? (
            <Alert variant="danger" onClose={() => setError("")} dismissible>
              {errorMessage}
              {errorMessage1}
              {errorMessage2}
              {errorMessage3}
              {errorMessage4}
              {errorMessage5}
              {errorMessage6}
              {errorMessage7}
              {errorMessage8}
              
              
            </Alert>
          ) : " "}
      <Container flex className="content my-3">
        <Form noValidate onSubmit={handleSubmit}>
          <h4 className="my-3">User Information</h4>
          <Row className="mb-3">
            <Form.Group as={Col} md="3" controlId="validationCustom01">
              <Row flex className>
                <Col>
                  <Form.Label >First Name:</Form.Label>
                </Col>
                <Col>
                  <Form.Control value ={client.firstName}  onChange={handleChange} name = "firstName" required type="text"/>
                
                </Col>
              </Row>
              
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="3" controlId="validationCustom01">
              <Row>
                <Col>
                  <Form.Label>Last Name:</Form.Label>
                </Col>
                <Col>
                  <Form.Control value ={client.lastName}  onChange={handleChange} name = "lastName" 
                    class="col-xs-4"
                    required
                    type="text"
                   
                  />
                </Col>
              </Row>
              
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="3" controlId="validationCustom01">
              <Row>
                <Col>
                  <Form.Label>Phone Number:</Form.Label>
                </Col>
                <Col>
                  <Form.Control value ={client.phoneNumber}  onChange={handleChange} name = "phoneNumber" 
                    required
                    type="text"
                    
                  />
                </Col>
              </Row>
              
            </Form.Group>
          </Row>

          <Row>
            <Form.Group as={Col} md="3" controlId="validationCustom02">
              <Row>
                <Col>
                  <Form.Label>Email:</Form.Label>
                </Col>
                <Col>
                  <Form.Control value ={client.email}  onChange={handleChange} name = "email" 
                  required
                   type="text" 
                    />
                </Col>
              </Row>
              
            </Form.Group>
          </Row>

          
          <Row></Row>

          <h4 className = "my-3">Residential Address</h4>

          <Row className="mb-3">
            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="validationCustom03">
                <Row>
                  <Col>
                    <Form.Label>Address:</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control value ={client.address}  onChange={handleChange} name = "address"  type="text"  required />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid address.
                    </Form.Control.Feedback>
                  </Col>

                  <Col>
                    <Form.Label className = "mx-3"> Number: </Form.Label>
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
                  <Form.Label>City:</Form.Label>
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
                  <Form.Label className = "mx-3"> Post code: </Form.Label>
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
         
          <Button className="btn-primary" type="submit" onClick={handleSubmit} >
            Submit
          </Button>
          
          
            <Button className="btn-light mx-3" type="cancel" onClick={handleCancel} >
              reset
            </Button><br/>
          
          
        </Form>
      </Container>
    </>
  );
}

export { ClientSignupPage };
