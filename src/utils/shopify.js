const storefrontAccessToken = process.env.NEXT_PUBLIC_STOREFRONTACCESSTOKEN;

const endpoint = `https://${process.env.NEXT_PUBLIC_SHOPURL}api/2023-07/graphql.json`;
import { gql, GraphQLClient } from "graphql-request";

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
    "Content-Type": "application/json",
  },
});

export const getProducts = async () => {
  const getAllProductsQuery = gql`
    {
      products(first: 10) {
        edges {
          node {
            id
            title
            handle
            description

            priceRange {
              minVariantPrice {
                amount
              }
            }
            variants(first: 20) {
              edges {
                node {
                  id
                  sku
                  title

                  price {
                    amount
                  }
                  image {
                    url
                  }
                  compareAtPriceV2 {
                    amount
                  }
                }
              }
            }
            featuredImage {
              altText
              url
            }
          }
        }
      }
    }
  `;

  try {
    return await graphQLClient.request(getAllProductsQuery);
  } catch (error) {
    throw new Error(error);
  }
};

export const addToCart = async (itemId, quantity) => {
  const createCartMutation = gql`
    mutation createCart($cartInput: CartInput) {
      cartCreate(input: $cartInput) {
        cart {
          id
        }
      }
    }
  `;
  const variables = {
    cartInput: {
      lines: [
        {
          quantity: parseInt(quantity),
          merchandiseId: itemId,
        },
      ],
    },
  };
  try {
    const data = await graphQLClient.request(createCartMutation, variables);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateCart = async (cartId, itemId, quantity) => {
  const updateCartMutation = gql`
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
        }
      }
    }
  `;
  const variables = {
    cartId: cartId,
    lines: [
      {
        quantity: parseInt(quantity),
        merchandiseId: itemId,
      },
    ],
  };

  try {
    const data = await graphQLClient.request(updateCartMutation, variables);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const removeCartItem = async (cartId, lineId) => {
  const removeCartItemMutation = gql`
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
        }
      }
    }
  `;
  const variables = {
    cartId: cartId,
    lineIds: [lineId],
  };

  try {
    const data = await graphQLClient.request(removeCartItemMutation, variables);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const retrieveCart = async (cartId) => {
  if (!cartId.includes("gid://")) {
    cartId = cartId.replace("gid:/", "gid://");
  }
  // console.log(cartId);
  const cartQuery = gql`
    query cartQuery($cartId: ID!) {
      cart(id: $cartId) {
        id
        createdAt
        updatedAt
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  product {
                    id
                    title
                    handle
                    featuredImage {
                      url
                      altText
                    }
                    priceRange {
                      minVariantPrice {
                        amount
                      }
                    }
                  }
                }
              }
            }
          }
        }

        estimatedCost {
          totalAmount {
            amount
          }
        }
      }
    }
  `;
  const variables = {
    cartId,
  };
  try {
    const data = await graphQLClient.request(cartQuery, variables);
    return data.cart;
  } catch (error) {
    throw new Error(error);
  }
};

export const getProduct = async (id) => {
  if (!id.includes("gid://")) {
    id = id.replace("gid:/", "gid://");
  }
  const productQuery = gql`
    query getProduct($id: ID!) {
      product(id: $id) {
        id
        handle
        title
        description

        metafield(key: "Color", namespace: "") {
          value
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }

        featuredImage {
          url
          altText
        }

        images(first: 10) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 100) {
          edges {
            node {
              title
              quantityAvailable
              id
              availableForSale
              sku
              image {
                url
              }
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `;
  const variables = {
    id,
  };
  try {
    const data = await graphQLClient.request(productQuery, variables);
    return data.product;
  } catch (error) {
    throw new Error(error);
  }
};

export const getCheckoutUrl = async (cartId) => {
  const getCheckoutUrlQuery = gql`
    query checkoutURL($cartId: ID!) {
      cart(id: $cartId) {
        checkoutUrl
      }
    }
  `;
  const variables = {
    cartId: cartId,
  };

  try {
    return await graphQLClient.request(getCheckoutUrlQuery, variables);
  } catch (error) {
    throw new Error(error);
  }
};

export const searchProducts = async (searchTerm) => {
  const storefrontAccessToken = process.env.NEXT_PUBLIC_STOREFRONTACCESSTOKEN;
  const endpoint = `https://${process.env.NEXT_PUBLIC_SHOPURL}api/2023-07/graphql.json`;

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      "Content-Type": "application/json",
    },
  });

  const searchQuery = gql`
    query searchProducts($searchTerm: String!) {
      products(first: 10, query: $searchTerm) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
                amount
              }
            }
            variants(first: 1) {
              edges {
                node {
                  compareAtPriceV2 {
                    amount
                  }
                }
              }
            }
            featuredImage {
              altText
              url
            }
          }
        }
      }
    }
  `;

  const variables = {
    searchTerm: `title:${searchTerm}* OR description:${searchTerm}*`,
  };

  try {
    const data = await graphQLClient.request(searchQuery, variables);
    return data.products.edges;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const searchProductsPredictive = async (searchTerm) => {
  const storefrontAccessToken = process.env.NEXT_PUBLIC_STOREFRONTACCESSTOKEN;
  const endpoint = `https://${process.env.NEXT_PUBLIC_SHOPURL}api/2023-07/graphql.json`;

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      "Content-Type": "application/json",
    },
  });

  const searchQuery = gql`
    query searchProductsPredictive($searchTerm: String!) {
      predictiveSearch(query: $searchTerm) {
        products {
          id
          title
          handle
          description
          variants(first: 1) {
            edges {
              node {
                id
                compareAtPriceV2 {
                  amount
                }
              }
            }
          }
          featuredImage {
            altText
            url
          }
        }
      }
    }
  `;

  const variables = {
    searchTerm,
  };

  try {
    const data = await graphQLClient.request(searchQuery, variables);
    return data.predictiveSearch.products;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const getBannersHome = async () => {
  const GET_META_FIELDS = gql`
    {
      metaobjects(type: "Banners", first: 10) {
        edges {
          node {
            id
            handle
            type
            fields {
              key
              value
              reference
              type
            }
          }
        }
      }
    }
  `;
  try {
    const data = await graphQLClient.request(GET_META_FIELDS);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getProductsInCollection = async (collectionId) => {
  const response = gql`
    query getProductsInCollection {
     collection(id: "gid://shopify/Collection/${collectionId}") {
        title
        products(first: 10) {  
          edges {
            node {
              id
              title
              handle
              description
              images(first: 1) {
                edges {
                  node {
                    src
                  }
                }
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  `;
  try {
    const data = await graphQLClient.request(response);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getCollections = async () => {
  const response = gql`
    query getCollection {
      collections(first: 6) {
        edges {
          node {
            id
            handle
            title
            description
            image {
              src
            }
          }
        }
      }
    }
  `;
  try {
    const data = await graphQLClient.request(response);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getNodeImageBanner = async (id) => {
  const response = gql`
    query getBannerVariantsFromNode($id: ID!) {
      node(id: $id) {
        id
        ... on MediaImage {
          id
          alt
          image {
            url
          }
        }
      }
    }
  `;

  const variables = {
    id,
  };

  try {
    const data = await graphQLClient.request(response, variables);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getCustomerOrders = async (customerAccessToken) => {
  const query = `
    query getCustomerOrders($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        orders(first: 10) {
          edges {
            node {
              id
              orderNumber
              totalPriceV2 {
                amount
                currencyCode
              }
              lineItems(first: 5) {
                edges {
                  node {
                    title
                    quantity
                    variant {
                      priceV2 {
                        amount
                        currencyCode
                      }
                      product {
                        title
                        handle
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const variables = { customerAccessToken };

  try {
    const data = await graphQLClient.request(query, variables);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createCustomer = async ( {email,
  password,
  firstName,
  lastName,
  phone,
  acceptsMarketing}
  
) => {
  const query = `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
          email
          phone
          firstName
          lastName
          acceptsMarketing
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      email,
      password,
      firstName,
      lastName,
      phone,
      acceptsMarketing,
    },
  };

  try {
    const data = await graphQLClient.request(query, variables);
    return data;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

export const customerAccessTokenCreate = async (email, password) => {
  const query = `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      email,
      password,
    },
  };

  try {
    const data = await graphQLClient.request(query, variables);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};
