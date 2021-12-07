import React, { useState, useContext } from "react";
import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";
import { getAvailableNavbarLinks } from "../Routes";
import { AuthContext } from "../contexts/AuthContextProvider";
import CreateProductForm from "../ui-components/CreateProductForm/CreateProductForm";
import InformationPopUp from "../ui-components/InformationPopUp/InformationPopUp";

//import { createProduct } from "../services/ApiClient";
function ProductCreatePage() {
  const authContext = useContext(AuthContext);
  const [popUpMessage, setPopUpMessage] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const initialState = {
    name: "",
    description: "",
    category: "Fruit",
  };
  const [createdProduct, setCreatedProduct] = useState(initialState);

  const handleReset = () => {
    // clear the current state
    setCreatedProduct((prevState) => {
      return {
        ...prevState,
        name: initialState.name,
        description: initialState.description,
        category: initialState.category,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.target.reset();
    console.log(createdProduct);
    //createProduct(createdProduct);       API CALL FOR BACKEND, also uncomment the import
    handleReset();
    setPopUpMessage("You have successfully added : " + createdProduct.name);
    handleShow();
  };

  return (
    <>
      <NavbarComponent
        links={getAvailableNavbarLinks(authContext.currentUser)}
        loggedUser={authContext.currentUser}
        userIconLink={authContext.getUserIconLink()}
      />

      <CreateProductForm
        setCreatedProduct={setCreatedProduct}
        handleSubmit={handleSubmit}
        createdProduct={createdProduct}
      />
      <InformationPopUp
        show={show}
        buttonMessage="Okay"
        title={popUpMessage}
        body="You can add more products by using the same form"
        handleClose={handleClose}
        onCancel={handleClose}
      />
    </>
  );
}
export default ProductCreatePage;
