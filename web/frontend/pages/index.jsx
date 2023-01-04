import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Heading,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

import { trophyImage } from "../assets";

import { ProductsCard, OrdersCard, ProductList } from "../components";

export default function HomePage() {
  return (
    <Page narrowWidth>
      <TitleBar title="App name" primaryAction={null} />
      <Layout>
        <Layout.Section>
          <ProductsCard />
        </Layout.Section>
        <Layout.Section>
          <OrdersCard/>
        </Layout.Section>
        <Layout.Section>
          <ProductList/>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
