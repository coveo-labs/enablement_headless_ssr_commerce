import { Product, ProductList, Recommendations } from "@coveo/headless-react/ssr-commerce";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

export interface ProductButtonWithImageProps {
  methods: Omit<Recommendations, "state" | "subscribe"> | Omit<ProductList, "state" | "subscribe"> | undefined;
  product: Product;
}

export default function ProductButtonWithImage({ methods, product }: ProductButtonWithImageProps) {
  const router = useRouter();

  const onProductClick = (product: Product) => {
    methods?.interactiveProduct({ options: { product } }).select();
    router.push(`/product?id=${product.ec_product_id}`);
  };

  const onAddToCart = () => {};

  return (
    <div
      key={product.ec_product_id}
      className="rounded-lg shadow-md overflow-hidden flex flex-col h-full border border-gray-200 hover:shadow-lg transition-shadow"
    >
      {/* Product image section */}
      <div className="relative overflow-hidden bg-gray-50 p-2 flex justify-center">
        <button disabled={!methods} onClick={() => onProductClick(product)} className="w-full">
          <Image
            src={product.ec_images[0]}
            alt={product.ec_name!}
            width={250}
            height={250}
            className="object-contain h-48 w-full"
          />
        </button>
      </div>

      {/* Product info section */}
      <div className="p-4 flex-grow flex flex-col">
        {/* Product name */}
        <h3 className="font-semibold text-lg mb-1 line-clamp-2">
          {product.ec_name} <span className="text-sm text-gray-600">({product.ec_brand})</span>
        </h3>

        {/* Product description */}
        {product.ec_description && <p className="text-sm text-gray-600 mb-3 line-clamp-5">{product.ec_description}</p>}

        {/* Price and add to cart section */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
          <span className="font-bold text-lg text-blue-900">${product.ec_price}</span>
          <button
            onClick={onAddToCart}
            className="bg-gray-100 border border-gray-300 text-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-md font-medium py-1 px-3 rounded-md transition-all duration-200 ease-in-out flex items-center cursor-pointer transform hover:scale-105"
          >
            <ShoppingCartIcon className="h-5 w-5 mr-1" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
