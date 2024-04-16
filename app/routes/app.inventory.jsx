import React from "react";
import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";
export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(
    `#graphql
      query {
        inventoryLevel(id: "gid://shopify/InventoryLevel/123682521375?inventory_item_id=50004640825631") {
          id
          available
          incoming
          item {
            id
            sku
          }
          location {
            id
            name
          }
        }
      }`,
  );

  const data = await response.json();

  const {
    data: { inventoryLevel },
  } = data;
  return inventoryLevel;
}

const Inventory = () => {
  const getInventory = useLoaderData();
  console.log(getInventory.available);
  console.log("hit");
  return <div>{getInventory.available}</div>;
};

export default Inventory;
