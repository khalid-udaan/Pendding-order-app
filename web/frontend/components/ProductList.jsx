import { useState, useEffect } from "react";
import {
  Card,
  Heading,
  TextContainer,
  DisplayText,
  TextStyle,
} from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

export function ProductList() {
  const emptyToastProps = { content: null };
  const [isLoading, setIsLoading] = useState(true);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const fetch = useAuthenticatedFetch();

  const {
    data,
    refetch: refetchProductCount,
    isLoading: isLoadingCount,
    isRefetching: isRefetchingCount,
  } = useAppQuery({
    url: "/api/product",
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });
	console.log(data,'asdf;lkjhg');

	// const renderProducts = (data) => {
	// 	return data.map((val) => <tr>
	// 	<td>{val.Product.id} </td>
	// 	<td>{val.Product.title}</td>
	// 	<td> {val.product.body_html} </td>
	// 	<td> {val.product.vendor}</td>
	// </tr>)
	// }

  return (
    <>
      <Card
        title="Product List"
        sectioned
      >
        <TextContainer spacing="loose">
          <table className="table table-border">
						<thead>
						<tr>
							<th>product_id</th>
							<th>shopify_product_id</th>
							<th>shopify_variant_id</th>
							<th>shopify_variant_title</th>
              <th>shopify_product_title</th>
              <th>shopify_quantity</th>
              <th></th>
						</tr>
						</thead>
						<tbody>
              {/* {data.size > 0 && renderProducts(data)} */}
						</tbody>
						
          </table>
        </TextContainer>
      </Card>
    </>
  );
}
