import React from "react";
import styles from "../../styles/CartMenu.module.css";
import { getCheckoutUrl, retrieveCart } from "../../utils/shopify";

function fixCartIdFormat(cartid) {
  if (cartid.startsWith("gid:/")) {
    return cartid.replace("gid:/", "gid://");
  }
  return cartid;
}

export const CartMenu = ({ cart, checkoutUrl, isOpen, toggleMenu }) => {
  return (
    <div className={`${styles.cartMenu} ${isOpen ? styles.open : ""}`}>
      <button className={styles.closeButton} onClick={toggleMenu}>
        Fechar
      </button>
      <ul className={styles.cartItems}>
        {cart.lines.edges.map((item) => (
          <li key={item.node.id} className={styles.cartItem}>
            {/* Conteúdo do item do carrinho */}
          </li>
        ))}
      </ul>
      <div className={styles.cartTotal}>
        <p>Total: {cart.estimatedCost.totalAmount.amount}</p>
        <a href={checkoutUrl}>
          <button>Checkout</button>
        </a>
      </div>
    </div>
  );
};

export const getServerSideProps = async () => {
  const cartgID = sessionStorage.getItem("cartId");
  console.log(cartgID);

  const cart = await retrieveCart(cartgID);
  const data = await getCheckoutUrl(cartgID);

  const { checkoutUrl } = data.cart;
  return {
    props: {
      cart,
      checkoutUrl,
    },
  };
};
