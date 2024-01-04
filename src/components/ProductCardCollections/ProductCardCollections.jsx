import Image from "next/image";
import Link from "next/link";
import styles from "../../styles/ProductCard.module.css";

export default function ProductCard({ product }) {
  const handleBuyClick = (product) => {
    const productUrl = `products/${product.node.handle}/?productid=${product.node.id}`;

    window.location.href = productUrl;
  };

  return (
    <>
      <div className={styles.card}>
        <div className={styles.image}>
          <Image src={product.node.images.edges[0].node.src} fill={true} />
        </div>
        <div className={styles.content}>
          <small className={styles.titleP}>
            <Link
              href={`products/${product.node.handle}/?productid=${product.node.id}`}
              className={styles.action}
            >
              {product.node.title}
            </Link>
          </small>
          <small className={styles.price}>
            <img width={20} height={14} src="/orangeGuskLogo.svg" />
            {product.node.priceRange.minVariantPrice.amount}
          </small>
          <button
            className={styles.buttonBuyCard}
            onClick={() => handleBuyClick(product)}
          >
            Comprar
          </button>
        </div>
      </div>
    </>
  );
}
