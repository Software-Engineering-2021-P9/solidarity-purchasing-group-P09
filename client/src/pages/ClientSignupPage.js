import {React, useState} from "react";
import { employeeNavbarLinks } from "../Routes";
import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { Col, Form ,Alert, Row, Container} from "react-bootstrap";
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
  
  
  

  
  const [client, setClient] = useState({ firstName: "", lastName: "",phoneNumber: "", email: " ", address:"", number:"", city:"", postCode:"" });
  const cancelErrors=()=>{
    setErrorMessage("");
    setErrorMessage1("");
    setErrorMessage2("");
    setErrorMessage3("");
    setErrorMessage4("");
    setErrorMessage5("");
    setErrorMessage6("");
    setErrorMessage7("");
    setErrorMessage8("");
    setError(false);
  }      
  
  const handleChange = e => {
            const { name, value } = e.target;
           
        cancelErrors();
            setClient(prevState => ({
                ...prevState,
                [name]: value
            }));
        };

    
        const handleCancel =(event)=>{
          event.preventDefault();
          cancelErrors();
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
       const  validate = function(clientParams){
           /* eslint-disable no-useless-escape */
  if(clientParams.firstName === '' 
  || clientParams.lastName === '' 
  || clientParams.phoneNumber === '' 
  || clientParams.email === '' 
  || clientParams.address === '' 
  || clientParams.number === '' 
  || clientParams.city === '' 
  || clientParams.postCode === ''
  || !(validator.isEmail(clientParams.email)) || !(validator.isMobilePhone(clientParams.phoneNumber) )
  || !(validator.isAlpha(clientParams.firstName, 'it-IT', {ignore:"\s"})) || !(validator.isAlpha(clientParams.lastName, 'it-IT', {ignore:"\s"})) 
  || !(validator.isAlpha(clientParams.city, 'it-IT', {ignore:"\s"})) 
  || !(validator.isAlpha(clientParams.address, 'it-IT', {ignore:"\s"}))
  || !(validator.isNumeric(clientParams.number)) 
  || !(validator.isNumeric(clientParams.postCode))){
  return false;
  }
  return true;
  
        }

        const updateErrorMessage1 = function(clientParams1){
          if(clientParams1.firstName === '' || clientParams1.lastName === '' || clientParams1.phoneNumber === ''
           || clientParams1.email === '' || clientParams1.address === '' || 
          clientParams1.number === '' || clientParams1.city === '' || clientParams1.postCode === ''  ){
            setErrorMessage("*Fill in all the fields!");
          }
      if(!(validator.isEmail(clientParams1.email)) && !(validator.isEmpty(clientParams1.email))){
        setErrorMessage1("*The Email is invalid!");
      }
         if(!(validator.isMobilePhone(clientParams1.phoneNumber)) && !(validator.isEmpty(clientParams1.phoneNumber))){
          setErrorMessage2("*The phone number is invalid!  ");
         }
      
        }
        const updateErrorMessage2 = function(clientParams2){
          if(!(validator.isAlpha(clientParams2.firstName, 'it-IT', {ignore:"\s"})) && !(validator.isEmpty(clientParams2.firstName))){
            setErrorMessage3("*The first name is incorrect!  ");
           }
           if(!(validator.isAlpha(clientParams2.lastName, 'it-IT', {ignore:"\s"})) && !(validator.isEmpty(clientParams2.lastName))){
            setErrorMessage4("*The last name is incorrect!  ");
           }
           if(!(validator.isAlpha(clientParams2.city, 'it-IT', {ignore:"\s"})) && !(validator.isEmpty(clientParams2.city))){
            setErrorMessage5("*The city is incorrect!  ");
           }
      
        }

        const updateErrorMessage3 = function(clientParams3){
  
         /* eslint-disable no-useless-escape */
         if(!(validator.isAlpha(clientParams3.address, 'it-IT', {ignore:"\s"})) && !(validator.isEmpty(clientParams3.address))){
          setErrorMessage6("*The address is incorrect!  ");
         }
         if(!(validator.isNumeric(clientParams3.number)) && !(validator.isEmpty(clientParams3.number))){
          setErrorMessage7("*The number is incorrect!  ");
         }
         if(!(validator.isNumeric(clientParams3.postCode)) && !(validator.isEmpty(clientParams3.postCode))){
          setErrorMessage8("*The postCode must be a number!  ");
         }

        }

  const handleSubmit = (event) => {
    event.preventDefault();
    let valid = true
    cancelErrors();
 
    valid = validate(client);
   try {
     if(valid){  
       const user = {
         fullName:client.firstName+" "+  client.lastName,
         phoneNumber:client.phoneNumber,
         email:client.email,
         address:client.address +", "+ client.number+" "+ client.city+ ", "+client.postCode,
         wallet:0
       }
    createClient(user);
    setSuccess(true);
    setClient("");
     }
     else{
       
     setError(true);
     updateErrorMessage1(client);
     updateErrorMessage2(client);
     updateErrorMessage3(client);
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
      <Container className="content my-3">
        <Form noValidate onSubmit={handleSubmit}>
          <h4 className="my-3">User Information</h4>
          <Row className="mb-3">
            <Form.Group as={Col} md="3" controlId="validationCustom01">
              <Row className="d-flex">
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
                    className="col-xs-4"
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
