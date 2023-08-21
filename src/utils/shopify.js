const storefrontAccessToken = process.env.NEXT_PUBLIC_STOREFRONTACCESSTOKEN;
const YAMPI_API_URL = "https://api.dooki.com.br/v2/gusk-imports2"; // Substitua com a URL correta da API do Yampi
const YAMPI_API_KEY = "sk_pQ9kiiagzLfkMLqcLpqL0RABTya56ahnAWtnH"; // Substitua com sua chave de API real

const endpoint = `https://${process.env.NEXT_PUBLIC_SHOPURL}api/2023-07/graphql.json`;
import { gql, GraphQLClient } from "graphql-request";

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
    "Content-Type": "application/json",
  },
});

const graphQLClientYampi = new GraphQLClient(
  "https://api.dooki.com.br/v2/public/shopify/cart",
  {
    headers: {
      authorization:
        "Bearer sk_pQ9kiiagzLfkMLqcLpqL0RABTya56ahnAWtnH1dsafgggsdgds",
    },
  }
);

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

export const retrieveCart = async (cartId) => {
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
        variants(first: 10) {
          edges {
            node {
              id
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
    
        metafields(
          first: 10
          
        ) {
          edges {
           
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
