import { ProductPage, productMetadata } from "@/components/public/ProductPage";

export const metadata = productMetadata("promociones");

export default function Page() {
  return <ProductPage slug="promociones" />;
}
