import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ProductCardCollections from "../components/ProductCardCollections/ProductCardCollections";
import { getProductsInCollection } from "@/utils/shopify";
import Header from "@/components/Header/Header";
import { Footer } from "@/components/Footer/footer";
import styles from "@/styles/Home.module.css";
import Slider from "react-slick";

const CollectionPage = () => {
  const router = useRouter();
  const { collectionId } = router.query;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (collectionId) {
      getProductsInCollection(collectionId)
        .then((data) => {
          setProducts(data.collection.products.edges);
        })
        .catch((error) => {
          console.error("Erro ao carregar produtos da coleção:", error);
        });
    }
  }, [collectionId]);

  const settings = {
    dots: true,
    className: "center",
    centerMode: true,
    infinite: false,
    centerPadding: "60px",
    slidesToShow: 1,
    speed: 500,
    rows: 2,
    slidesPerRow: 3,

    appendDots: (dots) => (
      <div
        style={{
          backgroundColor: "none",
          borderRadius: "10px",
          padding: "10px",
        }}
      >
        <ul style={{ margin: "0px" }}> {dots} </ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        style={{
          width: "30px",
          color: "#ff8c42",
          fontSize: "188px",
        }}
      >
        .
      </div>
    ),
  };

  return (
    <>
      <Header />
      <div>
        <div>
          <Slider {...settings}>
            {products.map((product) => (
              <div>
                <ProductCardCollections
                  className={styles.productBox}
                  key={product.node.id}
                  product={product}
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CollectionPage;
