import { ProductPage, productMetadata } from "@/components/public/ProductPage";

export const metadata = productMetadata("tarjetas");

export default function Page() {
  return <ProductPage slug="tarjetas" />;
}
