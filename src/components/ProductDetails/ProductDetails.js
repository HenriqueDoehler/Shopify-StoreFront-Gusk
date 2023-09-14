import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { addToCart, updateCart } from "../../utils/shopify";
import styles from "../../styles/ProductDetails.module.css";

export default function ProductDetails({ product }) {
  console.log(product);
  const [checkout, setCheckout] = useState(false);
  const [variants, setVariants] = useState([]);
  const [descriptionProductImage, setDescriptionProductImage] = useState(null);
  const [descriptionProductMobileImage, setDescriptionProductMobileImage] =
    useState(null);
  const [primeiraParte, setPrimeiraParte] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [currentImage, setCurrentImage] = useState(
    product.image ? product.image.url : product.featuredImage.url
  );
  const [currentPrice, setCurrentPrice] = useState(
    product.price && product.price.amount ? product.price.amount : "0.00"
  );
  const [selectedSize, setSelectedSize] = useState(null);

  const [error, setError] = useState(null);

  const handleAddToCart = async () => {
    let cartId = sessionStorage.getItem("cartId");

    if (cartId) {
      const selectedVariant = variants.find((variant) =>
        isVariantAvailable(variant)
      );
      if (selectedVariant) {
        await updateCart(cartId, selectedVariant.id, 1);
        setCheckout(true);
      } else {
        setError("A variante selecionada não está disponível.");
      }
    } else {
      const data = await addToCart(product.variants.edges[0].node.id, 1);
      cartId = data.cartCreate.cart.id;
      sessionStorage.setItem("cartId", cartId);
      sessionStorage.setItem("cartQuantity", 1);
      setCheckout(true);
    }
  };
  const getUniqueColors = () => {
    return [...new Set(variants.map((variant) => variant.parts[1]))];
  };
  const getUniqueSizes = () => {
    return [...new Set(variants.map((variant) => variant.parts[2]))];
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    if (selectedSize) {
      const matchingVariant = variants.find(
        (variant) =>
          variant.parts[1] === color && variant.parts[2] === selectedSize
      );
      if (matchingVariant) {
        setCurrentImage(matchingVariant.image.url);
        setCurrentPrice(matchingVariant.price.amount);
      }
    }
    setError(null);
  };
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    if (selectedColor) {
      const matchingVariant = variants.find(
        (variant) =>
          variant.parts[1] === selectedColor && variant.parts[2] === size
      );
      if (matchingVariant) {
        setCurrentImage(matchingVariant.image.url);
        setCurrentPrice(matchingVariant.price.amount);
      }
    }
    setError(null);
  };
  const isVariantAvailable = (variant) => {
    return (
      (!selectedColor || selectedColor === variant.parts[1]) &&
      (!selectedSize || selectedSize === variant.parts[2])
    );
  };

  useEffect(() => {
    const variantsArray = product.variants.edges.map((edge) => {
      const parts = edge.node.title.split(" / ");
      return {
        ...edge.node,
        parts,
      };
    });
    setVariants(variantsArray);

    const uniqueColors = getUniqueColors();
    const uniqueSizes = getUniqueSizes();

    if (uniqueColors.length > 0) {
      setSelectedColor(uniqueColors[0]);
    }

    if (uniqueSizes.length > 0) {
      setSelectedSize(uniqueSizes[0]);
    }

    if (variantsArray.length > 0) {
      const primeiraParteVariante = variantsArray[0].parts[0];
      setPrimeiraParte(primeiraParteVariante);
    }
  }, [product]);
  useEffect(() => {
    product.images.edges.forEach(({ node }) => {
      const imageUrl = node.url;
      if (imageUrl.includes("descriptionProduct")) {
        if (imageUrl.includes("descriptionProductMobile")) {
          setDescriptionProductMobileImage(imageUrl);
        } else {
          setDescriptionProductImage(imageUrl);
        }
      }
    });
  }, [product]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.productContainer}>
          <div className={styles.ImageProductContainer}>
            <span>
              <h1>{product.title}</h1>
              <h3>
                A partir de
                <img width={20} height={14} src="/orangeGuskLogo.svg" />
                <span className={styles.amountSpan}>
                  {product.priceRange.minVariantPrice.amount}
                </span>
              </h3>
              <div className={styles.productCondition}>
                {primeiraParte && <p>{primeiraParte}</p>}
              </div>
            </span>
            <div className={styles.image}>
              <div>
                <img
                  src={currentImage}
                  alt={product.featuredImage.altText}
                  // fill={true}
                />
              </div>
            </div>
          </div>
          <div className={styles.content}>
            <span>
              <h2>{product.title}</h2>
              <h3>{currentPrice}</h3>
            </span>

            <button className={styles.cartbtn} onClick={handleAddToCart}>
              Add to Cart
            </button>
            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.variants}>
              {/* Botões para "color" */}
              {getUniqueColors().map((color) => (
                <button
                  key={color}
                  className={`${styles.variant} ${
                    selectedColor === color ? styles.selected : ""
                  }`}
                  onClick={() => handleColorSelect(color)}
                  style={{ backgroundColor: color }}
                  disabled={
                    !variants.some(
                      (variant) =>
                        variant.parts[1] === color &&
                        variant.parts[2] === selectedSize &&
                        variant.quantityAvailable > 0 // Check if quantityAvailable is greater than 0
                    )
                  }
                >
                  <Image
                    width={20}
                    height={20}
                    className=""
                    src={"/logoGuskSemFundo.svg"}
                  />
                </button>
              ))}
            </div>
            <div className={styles.variants}>
              {getUniqueSizes().map((size) => (
                <button
                  key={size}
                  className={`${styles.variant} ${
                    selectedSize === size ? styles.selected : ""
                  }`}
                  onClick={() => handleSizeSelect(size)}
                  disabled={
                    selectedColor &&
                    !variants.some(
                      (variant) =>
                        variant.parts[1] === selectedColor &&
                        variant.parts[2] === size &&
                        variant.quantityAvailable > 0 // Check if quantityAvailable is greater than 0
                    )
                  }
                >
                  {size}
                </button>
              ))}

              {checkout ? (
                <Link href={`/cart?cartid=${sessionStorage.getItem("cartId")}`}>
                  Carrinho
                </Link>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.infoSection}>
        {descriptionProductImage && (
          <img src={descriptionProductImage} alt="Description Product" />
        )}
        {descriptionProductImage && (
          <img src={descriptionProductImage} alt="Description Product" />
        )}
      </div>
    </>
  );
}
