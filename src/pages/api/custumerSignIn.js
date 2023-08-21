import shopify from "../api/auth/auth";

export default async function handler(req, res) {
  try {
    const client = new shopify.clients.Storefront({
      domain: process.env.SHOPURL,
      storefrontAccessToken: process.env.STOREFRONTACCESSTOKEN,
    });
    const data = await client.query({
      data: {
        query: `mutation customerCreate($input: CustomerCreateInput!) {
          customerCreate(input: $input) {
            customer {
              firstName
              lastName
              email
              phone
              acceptsMarketing
            }
            customerUserErrors {
              field
              message
              code
            }
          }
        }`,
        variables: {
          input: {
            firstName: "John",
            lastName: "Smith",
            email: "teste@shopify.com",
            phone: "+15146649999",
            password: "5hopi4fy",
            acceptsMarketing: true,
          },
        },
      },
    });

    res.status(200).json({ message: "Cliente criado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar o cliente" });
  }
}
