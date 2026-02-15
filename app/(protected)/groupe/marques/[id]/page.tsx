import { use } from "react"
import { brands } from "@/lib/mock-dir-plaque-data"
import { BrandDetailContent } from "./brand-detail-content"

export function generateStaticParams() {
  return brands.map((brand) => ({
    id: brand.id,
  }))
}

export default function BrandDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  return <BrandDetailContent id={id} />
}
