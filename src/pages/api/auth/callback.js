import { Context, OAuthCallback } from "@shopify/shopify-api/dist/auth";

export default async function callback(req, res) {
  const oAuthCallback = OAuthCallback(Context, async (session) => {
    console.log("Session token", session);

    // Save the session here

    return true;
  });

  await oAuthCallback(req, res);
}
