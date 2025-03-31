import {
  Product,
  ProductList,
  Recommendations,
} from '@coveo/headless-react/ssr-commerce';
import Image from 'next/image';
import {useRouter} from 'next/navigation';

export interface ProductButtonWithImageProps {
  methods:
    | Omit<Recommendations, 'state' | 'subscribe'>
    | Omit<ProductList, 'state' | 'subscribe'>
    | undefined;
  product: Product;
}

export default function ProductButtonWithImage({
  methods,
  product,
}: ProductButtonWithImageProps) {
  const router = useRouter();

  const onProductClick = (product: Product) => {
    methods?.interactiveProduct({options: {product}}).select();
    router.push(
      `/product`
    );
  };

  return (
    <div key={product.ec_product_id} className="rounded shadow p-4 flex flex-col items-center">
    <button disabled={!methods} onClick={() => onProductClick(product)}>
    {/* Product image */}
    <Image
      src={product.ec_images[0]}
      alt={product.ec_name!}
      width={250}
      height={250}
      className="object-cover mb-2"
    />
    </button>
    {/* Product name */}
    <h3 className="text-center font-semibold">
      {product.ec_name} ({product.ec_brand})
    </h3>
    {product.ec_price} $
  </div>
  );
}
