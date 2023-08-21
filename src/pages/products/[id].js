import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import ProductDetails from "../../components/ProductDetails/ProductDetails";
import { getProduct } from "../../utils/shopify";

export default function Product({ product }) {
  return (
    <>
      <Header />
      <ProductDetails product={product} />
    </>
  );
}

export async function getServerSideProps(context) {
  const product = await getProduct(`${context.query.productid}`);

  if (!product) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      product: product,
    },
  };
}
