import ProductView from "@/components/product-view";
import { StandaloneProvider } from "@/components/providers/providers";
import { fetchCoveoStaticState } from "@/lib/fetch-coveo-static-state";

export default async function ProductPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const productId = searchParams.id?.toString() || "";
  const productName = searchParams.name?.toString() || "";
  const productPrice = searchParams.price ? parseFloat(searchParams.price.toString()) : 0;

  const { navigatorContext, staticState } = await fetchCoveoStaticState("standaloneEngineDefinition");

  return (
    <div>
      <h2>Product Page </h2>
      <br />
      {productId ? (
        <div>
          <p>Product ID: {productId}</p>
          {productName && <p>Product Name: {productName}</p>}
          {productPrice > 0 && <p>Product Price: ${productPrice.toFixed(2)}</p>}
        </div>
      ) : (
        <p>No product ID provided</p>
      )}
      <br />
      This is a potential product page. The purpose of this page in the demo is to trigger a product view event.
      <br />
      In a real life scenario, this page would be populated using a PIM or CMS
      <StandaloneProvider navigatorContext={navigatorContext.marshal} staticState={staticState}>
        <ProductView productId={productId} name={productName} price={productPrice} />
      </StandaloneProvider>
    </div>
  );
}
