import React, { useContext, useEffect, useState } from "react";

import { useHistory, useParams } from "react-router";
import { getAvailableNavbarLinks } from "../Routes";

import { Col, Container, Image, Row, Spinner, Card } from "react-bootstrap";

import ActionConfirmationModal from "../ui-components/ActionConfirmationModal/ActionConfirmationModal";
import Button from "../ui-components/Button/Button";
import Divider from "../ui-components/Divider/Divider";
import ErrorToast from "../ui-components/ErrorToast/ErrorToast";
import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";

import {
  getNextWeekProductAvailability,
  getProductByID,
  setNextWeekProductAvailability,
} from "../services/ApiClient";

import { AuthContext } from "../contexts/AuthContextProvider";

import "bootstrap/dist/css/bootstrap.min.css";
import "../ui-components/Title.css";
import ProductDetails from "../ui-components/ProductDetails/ProductDetails";
import ImageService from "../services/ImageService/ImageService";
import ProductAvailabilityDetails from "../ui-components/ProductAvailabilityDetails/ProductAvailabilityDetails";
import ProductAvailabilityForm from "../ui-components/ProductAvailabilityForm/ProductAvailabilityForm";

function ProductDetailsPage(props) {
  const params = useParams();
  const productID = params.id;

  const history = useHistory();
  const authContext = useContext(AuthContext);

  const [isInitialized, setIsInitialized] = useState(false);
  const [mustReload, setMustReload] = useState(false);
  const [requestError, setRequestError] = useState("");

  const [product, setProduct] = useState(null);
  const [nextWeekAvailability, setNextWeekAvailability] = useState(null);

  const [actionConfirmationModalMessage, setActionConfirmationModalMessage] =
    useState("");
  const [actionConfirmationModalCallback, setActionConfirmationModalCallback] =
    useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    if (!productID) {
      history.push("/");
    }

    const loadData = () =>
      Promise.all([
        getProductByID(productID),
        getNextWeekProductAvailability(productID),
      ])
        .then(([product, nextWeekProductAvailability]) => {
          setProduct(product);
          setNextWeekAvailability(nextWeekProductAvailability);
          setIsInitialized(true);
          setMustReload(false);
        })
        .catch((err) =>
          setRequestError("Failed to fetch data: " + err.message)
        );

    loadData();
  }, [productID, history, mustReload]);

  function onSetNextWeekProductAvailabilitySubmit(data) {
    setActionConfirmationModalMessage(
      `Are you sure you want confirm the availability for the next week?`
    );
    setActionConfirmationModalCallback(() => () => {
      setIsActionLoading(true);
      setNextWeekProductAvailability(
        productID,
        data.price,
        data.packaging,
        data.quantity
      )
        .catch((err) =>
          setRequestError(
            "Failed to set next week availability: " + err.message
          )
        )
        .finally(() => {
          setMustReload(true);
          setIsActionLoading(false);
          onActionConfirmationModalHide();
        });
    });
  }

  function onActionConfirmationModalHide() {
    setActionConfirmationModalMessage("");
    setActionConfirmationModalCallback(null);
  }

  function buildCurrentWeekAvailabilitySection() {
    return (
      <>
        <Card>
          <Card.Title>
            <h2 className='subtitle ps-3 pt-1'>Current Week Availability</h2>
          </Card.Title>
          <Card.Body className='pt-0'>
            {product?.availability ? (
              <Row>
                <ProductAvailabilityDetails
                  availability={product?.availability}
                />
              </Row>
            ) : (
              <h4 className='title text-center'>No availability set</h4>
            )}
          </Card.Body>
          <Card.Footer className='text-center'>
            {product?.availability && (
              <>
                <Button>Confirm</Button>
                <Button className='ms-3' variant='light'>
                  Update
                </Button>
                <Button className='ms-3' variant='secondary'>
                  Remove
                </Button>
              </>
            )}
          </Card.Footer>
        </Card>
      </>
    );
  }

  function buildNextWeekAvailabilitySection() {
    return (
      <>
        <Card>
          <Card.Title>
            <h2 className='subtitle ps-3 pt-1'>Next Week Availability</h2>
          </Card.Title>
          <Card.Body className='pt-0'>
            {nextWeekAvailability ? (
              <Row>
                <ProductAvailabilityDetails
                  availability={nextWeekAvailability}
                />
              </Row>
            ) : (
              <>
                <Container>
                  <ProductAvailabilityForm
                    isLoading={isActionLoading}
                    onSubmit={onSetNextWeekProductAvailabilitySubmit}
                  />
                </Container>
              </>
            )}
          </Card.Body>
          <Card.Footer className='text-center'>
            {nextWeekAvailability && (
              <>
                <Button className='ms-3'>Update</Button>
                <Button className='ms-3' variant='secondary'>
                  Remove
                </Button>
              </>
            )}
          </Card.Footer>
        </Card>
      </>
    );
  }

  return (
    <>
      <NavbarComponent
        links={getAvailableNavbarLinks(authContext.currentUser)}
        loggedUser={authContext.currentUser}
        userIconLink={authContext.getUserIconLink()}
      />

      {!isInitialized ? (
        <Container className='pt-5 d-flex justify-content-center'>
          <Spinner variant='dark' animation='border' />
        </Container>
      ) : (
        <>
          <Row className='justify-content-center mb-3'>
            <Col xs='12' sm='12' md='12' lg='9' xl='8' xxl='7'>
              <Card className='mt-2'>
                <Card.Title>
                  <h1 className='title ms-3'>{product.name}</h1>
                </Card.Title>
                <Card.Body className='text-center'>
                  <Row>
                    <Col xs='12' md='5'>
                      <Image
                        style={{ width: "270px" }}
                        src={ImageService.returnImageByCategory(
                          product.category
                        )}
                        rounded
                      />
                    </Col>
                    <Divider className='d-block d-md-none mt-4' />
                    <Col xs='12' md='7'>
                      <ProductDetails product={product} />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col xs='12' lg='6' className='pb-3'>
              {buildCurrentWeekAvailabilitySection()}
            </Col>
            <Divider className='d-block d-md-none' />
            <Col xs='12' lg='6' className='pb-3'>
              {buildNextWeekAvailabilitySection()}
            </Col>
          </Row>
        </>
      )}

      <ErrorToast
        errorMessage={requestError}
        onClose={() => setRequestError("")}
      />
      <ActionConfirmationModal
        show={actionConfirmationModalMessage}
        onHide={onActionConfirmationModalHide}
        message={actionConfirmationModalMessage}
        onConfirm={actionConfirmationModalCallback}
        onCancel={onActionConfirmationModalHide}
        isLoading={isActionLoading}
      />
    </>
  );
}

export { ProductDetailsPage };
