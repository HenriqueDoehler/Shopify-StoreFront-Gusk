import { shopifyApi, ApiVersion } from "@shopify/shopify-api";
import "@shopify/shopify-api/adapters/node";
import { restResources } from "@shopify/shopify-api/rest/admin/2022-07";

const shopify = shopifyApi({
  adminApiAccessToken: process.env.APIKEY,
  apiKey: process.env.APIKEY1,
  apiSecretKey: process.env.PASSWORD,
  scopes: process.env.SHOPIFY_API_SCOPES,
  hostName: process.env.SHOPURL1,
  hostScheme: "http",
  apiVersion: ApiVersion.July22,
  isEmbeddedApp: true,
  isCustomStoreApp: false,
  userAgentPrefix: "Custom prefix",
  privateAppStorefrontAccessToken: process.env.STOREFRONTACCESSTOKEN,
  customShopDomains: process.env.SHOPURL1,
  restResources,
});

export default shopify;
console.log(shopify);
