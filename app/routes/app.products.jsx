import React from "react";
import { Page, Layout, Card } from "@shopify/polaris";
import { useLoaderData, useActionData } from "@remix-run/react";
import { authenticate } from "../shopify.server";
export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(
    `#graphql
    query {
      products(first: 10, reverse: true) {
        edges {
          node {
            id
            title
            handle
            resourcePublicationOnCurrentPublication {
              publication {
                name
                id
              }
              publishDate
              isPublished
            }
          }
        }
      }
    }`,
  );
  const data = await response.json();
  const {
    data: {
      products: { edges },
    },
  } = data;
  return edges;
}

export async function action({ request }) {
  console.log(
    "action HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII !!!!!!!!!!!!!!!!!!!!!!!!!!!!",
  );
  const { admin } = await authenticate.admin(request);
  const response = await admin.graphql(
    `#graphql
mutation productUpdate($input: ProductInput!) {
  productUpdate(input: $input) {
    product {
      id
      descriptionHtml
    }
    userErrors {
      field
      message
    }
  }
}`,
    {
      variables: {
        input: {
          id: "gid://shopify/Product/9002553540895",
          descriptionHtml: "<your-descriptionHtml>",
        },
      },
    },
  );
  const responseJson = await response.json();

  return responseJson;
}

const Products = () => {
  const getProducts = useLoaderData();
  const actionData = useActionData();
  console.log(actionData);
  console.log(getProducts);
  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          {getProducts.map((product) => {
            return (
              <Card
                title="Online store dashboard"
                sectioned
                key={product.node.id}
              >
                <p>{product.node.title}</p>
              </Card>
            );
          })}
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Products;
