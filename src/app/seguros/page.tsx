import { ProductPage, productMetadata } from "@/components/public/ProductPage";

export const metadata = productMetadata("seguros");

export default function Page() {
  return <ProductPage slug="seguros" />;
}
