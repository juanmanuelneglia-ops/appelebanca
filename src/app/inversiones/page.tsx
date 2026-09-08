import { ProductPage, productMetadata } from "@/components/public/ProductPage";

export const metadata = productMetadata("inversiones");

export default function Page() {
  return <ProductPage slug="inversiones" />;
}
