import { useInstantProducts } from "@/lib/commerce-engine";
import Image from "next/image";
import Link from "next/link";

export default function InstantProducts() {
  const { state } = useInstantProducts();

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-3">Popular Products</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {state.products.map((product, index) => (
          <Link
            href={`/product?id=${product.ec_product_id}`}
            key={index}
            className="group flex flex-col hover:bg-blue-50 rounded p-2 transition-all duration-200 border border-transparent hover:border-blue-200"
          >
            <div className="relative h-32 w-full mb-2 bg-gray-50 rounded overflow-hidden shadow-sm">
              <Image
                src={product.ec_images[0]}
                alt={product.ec_name!}
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                style={{ objectFit: "contain" }}
                className="p-2"
              />
            </div>
            <div className="text-base text-gray-800 group-hover:text-blue-600 font-medium line-clamp-2">
              {product.ec_name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
