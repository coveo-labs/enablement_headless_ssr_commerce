"use client";

import { usePopularViewedHome } from "@/lib/commerce-engine";
import Image from "next/image";
import styles from "./popular-viewed.module.css";

export default function PopularViewed() {
  const { state } = usePopularViewedHome();

  return (
    <>
      <div className={styles.carousel}>
        <h3 className={styles.headline}>{state.headline}</h3>
        <div className={styles.carouselContainer}>
          {state.products.map((product) => (
            <div className={styles.productCard} key={product.ec_product_id}>
              <Image
                src={product.ec_images[0]}
                alt={product.ec_name!}
                width={100}
                height={100}
                className={styles.productImage}
              />
              <p className={styles.productName}>{product.ec_name}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
