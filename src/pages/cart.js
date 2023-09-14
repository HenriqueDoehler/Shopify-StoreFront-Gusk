"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { getCheckoutUrl, retrieveCart, removeCartItem } from "../utils/shopify";
import styles from "../styles/Cart.module.css";
import Header from "../components/Header/Header";

function fixCartIdFormat(cartid) {
  cartid = cartid.replace(/\/{3,}/g, "//");
  if (cartid.indexOf("//") === -1) {
    cartid = cartid.replace(/^(.*?)\//g, "$1//");
  }
  return cartid;
}

export default function Cart({ cart, checkoutUrl }) {
  // console.log(cart.lines.edges[0].node.merchandise.product);
  const [cartState, setCartState] = useState(cart);
  // console.log(cartState.lines.edges.node);

  useEffect(() => {
    setCartState(cart);
  }, [cart]);

  const handleRemoveCartItem = async (lineId) => {
    try {
      const result = await removeCartItem(cartState.id, lineId);
      console.log("Item removido do carrinho:", result);
      const updatedCart = await retrieveCart(cartState.id);
      setCartState(updatedCart);
      window.location.reload();
    } catch (error) {
      console.error("Erro ao remover item do carrinho:", error.message);
    }
  };
  return (
    <>
      <Header />
      <div className={styles.container}>
        <ul role="list-item">
          {cart.lines.edges.map((item) => {
            return (
              <li key={item.node.id}>
                <div>
                  <Image
                    src={item.node.merchandise.product.featuredImage.url}
                    alt={item.node.merchandise.product.featuredImage.altText}
                    width={200}
                    height={240}
                  />
                </div>
                <div className={styles.content}>
                  <h2>{item.node.merchandise.product.title}</h2>
                  <p>
                    {
                      item.node.merchandise.product.priceRange.minVariantPrice
                        .amount
                    }
                  </p>
                  <p>Quantity: {item.node.quantity}</p>
                  <button onClick={() => handleRemoveCartItem(item.node.id)}>
                    Remover
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        <h2>Total - {cart.estimatedCost.totalAmount.amount}</h2>
        <a href={checkoutUrl}>
          <button>Checkout</button>
        </a>
      </div>
    </>
  );
}

export const getServerSideProps = async (context) => {
  let { cartid } = context.query;
  cartid = fixCartIdFormat(cartid);
  const cart = await retrieveCart(cartid);
  const data = await getCheckoutUrl(cartid);
  // console.log(data);

  const { checkoutUrl } = data.cart;
  return {
    props: {
      cart,
      checkoutUrl,
    },
  };
};
