"use client";
import styles from "@/styles/Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.divImg}>
        <img className={styles.divImg} src="/GuskLogo.svg" alt="logo-ct" />
        <ul>{/* <li>About Us</li> */}</ul>
      </div>

      <div className={styles.list}>
        <ul>
          <h1>lorem ipsulum</h1>
          <li>About Us</li>
          <li>License</li>
          <li>Contribute</li>
          <li>Contact Us</li>
          &copy; 2023 Gusk Imports
        </ul>
      </div>
    </footer>
  );
}
