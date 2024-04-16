import React from "react";
import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";
export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);
  //   "gid://shopify/InventoryItem/47717760041247"
  const response = await admin.graphql(
    `#graphql
  query {
    inventoryItems(first: 20) {
      edges {
        node {
          id
          tracked
          sku
        }
      }
    }
  }`,
  );
  console.log("hit");
  const data = await response.json();
  const {
    data: {
      inventoryItems: { edges },
    },
  } = data;
  return edges;
}

const Inventory = () => {
  const getInventory = useLoaderData();
  console.log(getInventory);
  console.log("hit");
  return <div>This is New Inventory</div>;
};

export default Inventory;
