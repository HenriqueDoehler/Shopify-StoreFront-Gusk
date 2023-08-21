import Image from "next/image";
import { getCheckoutUrl, retrieveCart } from "../utils/shopify";
import styles from "../styles/Cart.module.css";
import Header from "../components/Header/Header";
function fixCartIdFormat(cartid) {
  if (cartid.startsWith("gid:/")) {
    return cartid.replace("gid:/", "gid://");
  }
  return cartid;
}

export default function Cart({ cart, checkoutUrl }) {
  console.log(cart);
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
  console.log(data);

  const { checkoutUrl } = data.cart;
  return {
    props: {
      cart,
      checkoutUrl,
    },
  };
};
