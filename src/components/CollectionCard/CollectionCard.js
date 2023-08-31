import Image from "next/image";
import Link from "next/link";
import styles from "../../styles/ProductCard.module.css";

export default function CollectionsCard({ collections }) {
  return (
    <>
      <div className={styles.card}>
        <div className={styles.image}>
          <Image
            src={collections.node.image.src}
            alt={collections.node.image.alttext}
            fill={true}
          />
        </div>
        <div className={styles.content}>
          <small>
            {/* <Link
              href={`products/${product.node.handle}/?productid=${product.node.id}`}
              className={styles.action}
            >
              {product.node.title}
            </Link> */}
          </small>
        </div>
      </div>
    </>
  );
}
