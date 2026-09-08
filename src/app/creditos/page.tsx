import { ProductPage, productMetadata } from "@/components/public/ProductPage";

export const metadata = productMetadata("creditos");

export default function Page() {
  return <ProductPage slug="creditos" />;
}
