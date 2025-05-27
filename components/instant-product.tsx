import { useInstantProducts } from "@/lib/commerce-engine";
import Image from "next/image";

export default function InstantProducts() {
  const { state } = useInstantProducts();

  return (
    // Changed container to "product-card-grid" for styling instant products
    <div className="product-card-grid">
      {state.products.map((product, index) => (
        <div key={index} className="product-card">
          <Image src={product.ec_images[0]} alt={product.ec_name!} width={100} height={100} />
          <div className="product-name">{product.ec_name}</div>
        </div>
      ))}
    </div>
  );
}
