import Head from "next/head";
import { Footer } from "@/components/Footer/footer";
import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import {
  getProducts,
  getBannersHome,
  getCollections,
  getProductsInCollection,
  getNodeImageBanner,
} from "../utils/shopify";
import ProductCard from "../components/ProductCard/ProductCard";
import CollectionsCard from "@/components/CollectionCard/CollectionCard";
import Header from "../components/Header/Header";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Reviews } from "@/components/reviews/reviews";
import { NextArrow, PrevArrow } from "@/components/NextArrow/arrow";

export default function Home({
  data,

  collectionsWithImageUrl,

  bannerData,
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((currentImageIndex + 1) % bannerData.length);
  };

  useEffect(() => {
    const interval = setInterval(handleNextImage, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [currentImageIndex]);

  const products = data.products.edges;

  return (
    <>
      <Head>
        <title>GUSK Imports</title>
        <meta name="description" content="Gusk Imports" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/orangeGuskLogo.svg" />
      </Head>

      <Header />

      <main>
        <div className={styles.bannerContainer}>
          <div>
            {bannerData.length > 0 && (
              <img src={bannerData[currentImageIndex].url} alt="" />
            )}
          </div>
          <div className={styles["bullet-container"]}>
            {bannerData.map((_, index) => (
              <div
                key={index}
                className={`${styles.bullet} ${
                  index === currentImageIndex ? styles.active : ""
                }`}
                onClick={() => setCurrentImageIndex(index)}
              ></div>
            ))}
          </div>
        </div>
        <Carousel collectionsWithImageUrl={collectionsWithImageUrl} />
        {/* <div className={styles.products}> */}
        <div className={styles.spanButtonVM}>
          <span>Todos os produtos</span>
          <span className={styles.vmspan}>Ver Mais</span>
        </div>
        <div className={styles.containerSlider}>
          <div className={styles.sliderDiv}>
            <Slider
              centerMode={true}
              infinite={true}
              centerPadding={10}
              slidesToShow={3}
              speed={500}
              rows={1}
              slidesPerRow={2}
              dots={true}
              nextArrow={<NextArrow />}
              prevArrow={<PrevArrow />}
            >
              {products.map((product) => (
                <ProductCard
                  className={styles.productBox}
                  key={product.node.id}
                  product={product}
                />
              ))}
            </Slider>
          </div>
        </div>
        <div className={styles.containerImgRedes}>
          <Reviews />
        </div>

        <div className={styles.redes}>
          <img className={styles.redesImg} src="/redes.png" />
        </div>
        <Footer />
      </main>
    </>
  );
}

export const getServerSideProps = async () => {
  const data = await getProducts();
  const collections = await getCollections();
  const banners = await getBannersHome();
  const productsInCollection = await getProductsInCollection("459822596409");
  console.log(productsInCollection.collection.products.edges[0].node);

  const allCollections = collections.collections.edges.flat();

  const collectionsWithImageUrl = allCollections.map((collection) => {
    const image = collection.node.image;
    const imageUrl = image.src;
    return {
      ...collection,
      imageUrl,
    };
  });

  const bannerData = await Promise.all(
    banners.metaobjects.edges.map(async (banner) => {
      const bannerNode = banner.node;
      const bannerFields = bannerNode.fields.map((field) => {
        return {
          name: field.name,
          value: field.value,
        };
      });
      const bannerIds = bannerFields.map((values) => values);
      const valores = extractValues(bannerIds);
      const respostasNodeImage = await fetchNodeImageBanners(valores);
      const UrlBannerMedia = respostasNodeImage[0].node.image.url;

      return {
        url: UrlBannerMedia,
      };
    })
  );

  return {
    props: { data, collectionsWithImageUrl, bannerData },
  };
};

const Carousel = ({ collectionsWithImageUrl }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const totalCollections = collectionsWithImageUrl.length;
  const itemsPerPage = 3;

  const totalPages = Math.ceil(totalCollections / itemsPerPage);

  const handleClick = () => {
    setCurrentImageIndex((currentImageIndex + 1) % totalPages);
  };

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carousel}>
        <button className={styles.buttonSetaL} onClick={handleClick}>
          <img src="/seta-direita.svg" />
        </button>
        {collectionsWithImageUrl
          .slice(
            currentImageIndex * itemsPerPage,
            (currentImageIndex + 1) * itemsPerPage
          )
          .map((collection) => (
            <div
              className={styles.containerCollections}
              key={collection.node.id}
            >
              <span className={styles.titleCollection}>
                {collection.node.title}
              </span>
              <span className={styles.descriptionCollection}>
                {collection.node.description}
              </span>
              <img className={styles.imgCarousel} src={collection.imageUrl} />
            </div>
          ))}
        <button className={styles.buttonSeta} onClick={handleClick}>
          <img src="/seta-direita.svg" />
        </button>
      </div>
    </div>
  );
};

function extractValues(inputArray) {
  const values = [];

  for (const item of inputArray) {
    try {
      const parsedValue = JSON.parse(item.value);
      values.push(parsedValue[0]);
    } catch (error) {
      console.error(`Erro ao analisar JSON: ${error}`);
    }
  }

  return values;
}
async function fetchNodeImageBanners(values) {
  const responses = [];

  for (const value of values) {
    const responseBanner = await getNodeImageBanner(value);
    responses.push(responseBanner);
  }

  return responses;
}
