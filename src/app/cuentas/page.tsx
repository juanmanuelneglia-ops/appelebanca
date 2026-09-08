import { ProductPage, productMetadata } from "@/components/public/ProductPage";

export const metadata = productMetadata("cuentas");

export default function Page() {
  return <ProductPage slug="cuentas" />;
}
