import { Form, useActionData, useSubmit } from "@remix-run/react";
import { TextField, Button, Card, Page } from "@shopify/polaris";
import React, { useState } from "react";
import { authenticate } from "../shopify.server";
import { createCustomer } from "../api/prisma.server";

export async function action({ request }) {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const email = formData.get("email");
  const name = formData.get("name");
  const response = await admin.graphql(
    `#graphql
      mutation customerCreate($input: CustomerInput!) {
        customerCreate(input: $input) {
          userErrors {
            field
            message
          }
          customer {
            id
            email
            phone
            taxExempt
           
            firstName
            lastName
          
            smsMarketingConsent {
              marketingState
              marketingOptInLevel
            }
            addresses {
              address1
              city
              country
              phone
              zip
            }
          }
        }
      }`,
    {
      variables: {
        input: {
          email: email,
          phone: "+16465555665",
          firstName: name,
          lastName: "Lastname",

          addresses: [
            {
              address1: "412 fake st",
              city: "Ottawa",
              province: "ON",
              phone: "+16469999999",
              zip: "A1A 4A1",
              lastName: "Lastname",
              firstName: "Steve",
              country: "CA",
            },
          ],
        },
      },
    },
  );

  const data = await response.json();
  await createCustomer({
    email: email,
    name: name,
  });
  return data;
}

const Customers = () => {
  const submit = useSubmit();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const actionData = useActionData();
  console.log(actionData, "actionData");
  const generateCustomer = () => submit({}, { replace: true, method: "POST" });
  return (
    <Page>
      <Card>
        <Form onSubmit={generateCustomer} method="post">
          <TextField
            id="name"
            name="name"
            label="name"
            autoComplete="off"
            value={name}
            onChange={(value) => setName(value)}
          />
          <TextField
            id="email"
            name="email"
            label="email"
            autoComplete="off"
            value={email}
            onChange={(value) => setEmail(value)}
          />
          <Button submit>Create Customers</Button>
        </Form>
      </Card>
    </Page>
  );
};

export default Customers;
