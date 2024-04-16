import React from "react";
import { Page, Layout, Card } from "@shopify/polaris";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";
export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(
    `#graphql
  query {
    collections(first: 5) {
      edges {
        node {
          id
          title
          handle
          updatedAt
          productsCount
          sortOrder
        }
      }
    }
  }`,
  );

  const data = await response.json();
  const {
    data: {
      collections: { edges },
    },
  } = data;
  return edges;
}

const Collections = () => {
  const getCollections = useLoaderData();
  console.log(getCollections);
  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          {getCollections.map((collection) => {
            return (
              <Card
                title="Online store dashboard"
                sectioned
                key={collection.node.id}
              >
                <p>{collection.node.title}</p>
              </Card>
            );
          })}
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Collections;
