import { useState, useEffect } from "react";
import {
  Card,
  Heading,
  TextContainer,
  DisplayText,
  TextStyle,
  // IndexTable
} from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

export function OrdersCard() {
  const emptyToastProps = { content: null };
  const [isLoading, setIsLoading] = useState(true);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const fetch = useAuthenticatedFetch();
  const [orderCount, setOrderCount] = useState(0);
  const {
    data,
    refetch: refetchOrderCount,
    isLoading: isLoadingCount,
    isRefetching: isRefetchingCount,
  } = useAppQuery({
    url: "/api/orders/count",
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });
  

  const toastMarkup = toastProps.content && !isRefetchingCount && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

  const handlePopulate = async () => {
    setIsLoading(true);
    const response = await fetch("/api/orders/count");
      const data=response.json();
      console.log(data, "My API DATA");

    if (response.ok) {
      await refetchProductCount();
      setToastProps({ content: "5 products created!" });
    } else {
      setIsLoading(false);
      setToastProps({
        content: "There was an error creating products",
        error: true,
      });
    }
  };

  // const rowMarkup = data.map(
  //   ({ id, name, location, orders, amountSpent }, index) => (
  //     <IndexTable.Row
  //       id={id}
  //       key={id}
  //       selected={selectedResources.includes(id)}
  //       position={index}
  //     >
  //       <IndexTable.Cell>
  //         <Heading variant="bodyMd" fontWeight="bold" as="span">
  //           {name}
  //         </Heading>
  //       </IndexTable.Cell>
  //       <IndexTable.Cell>{location}</IndexTable.Cell>
  //       <IndexTable.Cell>{orders}</IndexTable.Cell>
  //       <IndexTable.Cell>{amountSpent}</IndexTable.Cell>
  //     </IndexTable.Row>
  //   )
  // );

  // useEffect(()=>{
  //   // handlePopulate();
  // },)

  return (
    <>
      {toastMarkup}
      <Card
        title="Order Counter"
        sectioned
      >
        <TextContainer spacing="loose">
          <p>
            Sample orders are created with a default title and price. You can
            remove them at any time.
          </p>
          <Heading element="h4">
            TOTAL ORDERS
            <DisplayText size="medium">
              <TextStyle variation="strong">
                {isLoadingCount ? "-" : data.count}
              </TextStyle>
            </DisplayText>
          </Heading>
        </TextContainer>

        {/* <IndexTable
          resourceName={resourceName}
          itemCount={customers.length}
          selectedItemsCount={
            allResourcesSelected ? "All" : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          headings={[
            { title: "Name" },
            { title: "Location" },
            { title: "Order count" },
            { title: "Amount spent" },
          ]}
        >
          {rowMarkup}
        </IndexTable> */}
      </Card>
    </>
  );
}

