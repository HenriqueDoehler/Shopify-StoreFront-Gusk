import React, { useState } from "react";

import styles from "@/styles/reviews.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const Reviews = () => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "Fernanda Cavalcanti",
      photo: "/feFoto.png",
      deliveryOnTime: true,
      comment:
        "Já sou cliente da Gusk desde o antigo nome rsrsrs nunca tive problema e sempre me atenderam super bem!!!!!! Recomendei pros meus amigo e vou comprar de novo",
      instagram: "@fe_insta",
    },
    {
      id: 2,
      name: "Maria",
      photo: "/feFoto.png",
      deliveryOnTime: true,
      comment:
        "top        Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime porro ut et iusto at rem debitis quas accusamus quam? Praesentium, quas voluptas sint optio eos laborum sequi nemo molestias perferendis.",
      instagram: "@maria_insta",
      
    },
    {
      id: 3,
      name: "Maria",
      photo: "/feFoto.png",
      deliveryOnTime: true,
      comment:
        "top        Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime porro ut et iusto at rem debitis quas accusamus quam? Praesentium, quas voluptas sint optio eos laborum sequi nemo molestias perferendis.",
      instagram: "@maria_insta",
    },
    {
      id: 4,
      name: "Maria",
      photo: "/feFoto.png",
      deliveryOnTime: true,
      comment:
        "top        Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime porro ut et iusto at rem debitis quas accusamus quam? Praesentium, quas voluptas sint optio eos laborum sequi nemo molestias perferendis.",
      instagram: "@maria_insta",
    },
    {
      id: 5,
      name: "Maria",
      photo: "/feFoto.png",
      deliveryOnTime: true,
      comment:
        "top        Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime porro ut et iusto at rem debitis quas accusamus quam? Praesentium, quas voluptas sint optio eos laborum sequi nemo molestias perferendis.",
      instagram: "@maria_insta",
    },
    {
      id: 6,
      name: "Maria",
      photo: "/feFoto.png",
      deliveryOnTime: true,
      comment:
        "top        Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime porro ut et iusto at rem debitis quas accusamus quam? Praesentium, quas voluptas sint optio eos laborum sequi nemo molestias perferendis.",
      instagram: "@maria_insta",
    },
  ]);

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 3,
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
      <h1 className={styles.textFeedback}>FEEDBACK DA GURIZADA</h1>
      <div className={styles.co}>
        <Slider className={styles.containerSliderR} {...settings}>
          {reviews.map((review) => (
            <div key={review.id} className={styles.ulReviews}>
              <li className={styles.liReviews} key={review.id}>
                <div>
                  <img
                    className={styles.divphoto}
                    src={review.photo}
                    alt={`Foto de ${review.name}`}
                  />
                </div>
                <div className={styles.divContainer}>
                  <p className={styles.name}>{review.name}</p>
                  <p className={styles.instagram}> {review.instagram}</p>
                  <div>
                    <img
                      className={styles.star}
                      src={"/GroupStar.png"}
                      alt={`Foto de `}
                    />
                  </div>
                  <p className={styles.deliveryTime}>
                    {review.deliveryOnTime
                      ? "Entrega no prazo"
                      : "Entrega atrasada"}
                  </p>
                  <p className={styles.comment}>{review.comment}</p>
                </div>
              </li>
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
};
