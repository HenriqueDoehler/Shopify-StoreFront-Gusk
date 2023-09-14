"use client";

import Link from "next/link";
import styles from "../../styles/Home.module.css";
import { searchProductsPredictive } from "../../utils/shopify";
import React, { useState, useEffect, useRef, useContext } from "react";
import { retrieveCart } from "../../utils/shopify";
import { useRouter } from "next/router";

export default function Header(cart, cartid) {
  const [inputValue, setInputValue] = useState("");
  const [dataCartId, setCartId] = useState(null);
  const [quantityCartId, setCartQuantity] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const searchInputRef = useRef(null);
  const searchResultsRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      let id = window.sessionStorage.getItem("cartId");

      if (id !== null) {
        setCartId(id);
      }

      console.log(id);
    }
  }, []);

  useEffect(() => {
    if (inputValue.length > 0) {
      searchProductsPredictive(inputValue).then((products) => {
        setSearchResults(products);
        console.log(products);
      });
    } else {
      setSearchResults([]);
    }
  }, [inputValue]);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (
  //       searchInputRef.current &&
  //       !searchInputRef.current.contains(event.target) &&
  //       searchResultsRef.current &&
  //       !searchResultsRef.current.contains(event.target)
  //     ) {
  //       setIsFocused(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  const router = useRouter();

  const redirectToCart = () => {
    if (router.pathname !== "/cart") {
      router.push(`/cart?cartid=${dataCartId}`);
    }
  };

  const fetchCartQuantity = async () => {
    try {
      const cartData = await retrieveCart(dataCartId);
      let totalQuantity = 0;

      if (cartData.lines && cartData.lines.edges) {
        for (const item of cartData.lines.edges) {
          totalQuantity += item.node.quantity;
        }
      }

      setCartQuantity(totalQuantity);
    } catch (error) {
      console.error("Erro ao obter dados do carrinho:", error.message);
    }
  };

  useEffect(() => {
    if (dataCartId !== null) {
      fetchCartQuantity();
    }
  }, [dataCartId]);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <Link href="/">
            <img className={styles.imgLogo} src="/GuskLogo.svg" alt="" />
          </Link>
        </div>

        <div className={styles.containerMaster}>
          <div className={styles.containerNavbar1}>
            <div className={styles.searchBox}>
              <input
                ref={searchInputRef}
                className={styles.searchInput}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Pesquisar"
                onFocus={() => setIsFocused(true)}
              />
              <div className={styles.searchIcon}>
                <img className={styles.imgIcon} src="/search.svg" alt="" />
              </div>
            </div>
            {isFocused && searchResults.length > 0 && (
              <div ref={searchResultsRef} className={styles.searchResults}>
                {searchResults.map((product) => {
                  const productId = product.id.split("/").pop();
                  return (
                    <div key={productId}>
                      <Link href={`/product/${productId}`}>
                        <h2>{product.title}</h2>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className={styles.containerNavbar}>
            <nav className={styles.navMenu}>
              <a href="#">Mac</a>
              <a href="#">iPad</a>
              <a href="#">iPhone</a>
              <a href="#">Apple Watch</a>
              <a href="#">AirPods</a>
              <a href="#">Acessórios</a>
              <a href="#">Quem é Gusk</a>
              <a href="#">F.A.Q</a>
              <div className={styles.dot}></div>
            </nav>
          </div>
        </div>

        <div className={styles.logoContainer}>
          <img className={styles.imgIcon} src="/customerIcon.svg" alt="" />
          {dataCartId !== null ? (
            <button className={styles.btnIconCart} onClick={redirectToCart}>
              <div className={styles.imageicon}>
                <img className={styles.imgIcon} src="/Prancheta.svg" alt="" />
              </div>
              <div className={styles.cartIndicator}>{quantityCartId}</div>
            </button>
          ) : (
            <div>
              <div className={styles.imageicon}>
                <img className={styles.imgIcon} src="/Prancheta.svg" alt="" />
              </div>
              <div className={styles.cartIndicator}>{quantityCartId}</div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
