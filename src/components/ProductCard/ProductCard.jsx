import Image from "next/image";
import Link from "next/link";
import styles from "../../styles/ProductCard.module.css";

export default function ProductCard({ product }) {
  const handleBuyClick = (product) => {
    const productUrl = `products/${product.node.handle}/?productid=${product.node.id}`;

    // Redirecionar para a URL do produto
    window.location.href = productUrl;
  };

  // console.log(product.node);
  return (
    <>
      <div className={styles.card}>
       
        <div className={styles.image}>
          <Image
            src={product.node.featuredImage.url}
            alt={product.node.featuredImage.alttext}
            fill={true}
          />
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
