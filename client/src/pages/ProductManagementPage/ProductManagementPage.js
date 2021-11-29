import React, { useEffect, useState } from "react";

import { useHistory } from "react-router";
import {
  employeeClientSignupRouteName,
  farmerProductDetailsRouteName,
  farmerNavbarLinks,
  routes,
} from "../../Routes";

import { Container, FormControl, InputGroup, Row, Col } from "react-bootstrap";

import { NavbarComponent } from "../../ui-components/NavbarComponent/NavbarComponent";
import ClientInfoList from "../../ui-components/ClientInfoList/ClientInfoList";
import Button from "../../ui-components/Button/Button";
import Divider from "../../ui-components/Divider/Divider";
import InlineTextForm from "../../ui-components/InlineTextForm/InlineTextForm";

import "bootstrap/dist/css/bootstrap.min.css";
import "./ProductManagementPage.css";
import "../../ui-components/Title.css";

import { findClients, getFarmerProducts } from "../../services/ApiClient";
import ErrorToast from "../../ui-components/ErrorToast/ErrorToast";
import ObjectList from "../../ui-components/ObjectList/ObjectList";
import { RedDropdown } from "../../ui-components/RedDropdownComponent/RedDropdown";
import Product from "../../services/models/Product";
import SemaphoreRenderer from "../../ui-components/ObjectList/SemaphoreRenderer";
import TextRenderer from "../../ui-components/ObjectList/TextRenderer";

function ProductManagementPage(props) {
  const farmerID = "test";
  const history = useHistory();
  const [categoryFilter, setCategoryFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [searchString, setSearchString] = useState("");
  const [productList, setProductList] = useState([
    { name: "cavallo", availability: "wow" },
  ]);
  const [isProductListLoading, setIsProductListLoading] = useState(false);
  const [requestError, setRequestError] = useState("");

  function loadProductList() {
    setIsProductListLoading(true);
    getFarmerProducts(
      farmerID,
      categoryFilter,
      searchString,
      availabilityFilter
    )
      .then(setProductList)
      .catch((err) => {
        setRequestError(err.message);
        setProductList([]);
      })
      .finally(() => setIsProductListLoading(false));
  }

  function onCategoryFilterChange(newVal) {
    setCategoryFilter(newVal);
    loadProductList();
  }

  function onAvailabilityFilterChange(newVal) {
    setAvailabilityFilter(newVal);
    loadProductList();
  }

  function onSearchFormSubmit() {
    loadProductList();
  }

  function productListEmptyText() {
    console.log(productList);
    if (productList?.length === 0)
      return "No product found.\nYou can create a new product using the button below.";
    return "";
  }

  function buildProductListItems() {
    console.log(
      productList.map((p) => {
        console.log(p.name, !!p.availability);
        return [
          TextRenderer({ value: p.name }),
          SemaphoreRenderer({ value: !!p.availability }),
        ];
      })
    );
    return productList.map((p) => [
      TextRenderer({ value: p.name }),
      SemaphoreRenderer({ value: !!p.availability }),
    ]);
  }

  function onProductListItemClick(index) {
    history.push(
      routes[farmerProductDetailsRouteName].path.replace(
        ":id",
        productList[index].id
      )
    );
  }

  function onCreateProductButtonClick(index) {
    history.push(routes[employeeClientSignupRouteName].path);
  }

  return (
    <>
      <NavbarComponent links={farmerNavbarLinks} />
      <Row>
        <Col md='5'>
          <h1 className='title'>Manage Products</h1>
        </Col>
      </Row>
      <Container>
        <Row className='align-items-center justify-content-around'>
          <Col className='pb-3 pb-sm-0' xs='12' sm='6' md='3' lg='2'>
            <Row>
              <RedDropdown
                items={Object.values(Product.Categories)}
                title={categoryFilter ? categoryFilter : "Categories"}
                updateSelectedItem={onCategoryFilterChange}
                activeElement={categoryFilter}
              />
            </Row>
          </Col>
          <Col className='me-auto' xs='12' sm='6' md='3' lg='2'>
            <Row>
              <RedDropdown
                items={["Available", "Not available"]}
                title={availabilityFilter ? availabilityFilter : "Availability"}
                updateSelectedItem={onAvailabilityFilterChange}
                activeElement={availabilityFilter}
              />
            </Row>
          </Col>
          <Col className=' ms-auto' xs='12' sm='12' md='6' lg='4'>
            <InlineTextForm
              placeholder='Apples'
              actionLabel='Search'
              value={searchString}
              onValueChange={setSearchString}
              onSubmit={onSearchFormSubmit}
            />
          </Col>
        </Row>
      </Container>

      <Container>
        <Divider size={2} />
      </Container>
      <Row>
        <ObjectList
          headerLabels={["Name", "Availability"]}
          isLoading={isProductListLoading}
          emptyListText={productListEmptyText()}
          items={buildProductListItems()}
          onItemClick={onProductListItemClick}
        />
      </Row>
      <Container className='client-management-page-bottom-space' />
      <Container className='d-flex position-fixed bottom-0 justify-content-end mb-4 '>
        <Button className='p-4' onClick={onCreateProductButtonClick}>
          Add a new product
        </Button>
      </Container>
      <ErrorToast
        onClose={() => setRequestError("")}
        errorMessage={requestError}
      />
    </>
  );
}

export { ProductManagementPage };
