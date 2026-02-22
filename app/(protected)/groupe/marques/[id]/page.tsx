import { use } from "react"
import { BrandDetailContent } from "./brand-detail-content"

export default function BrandDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  return <BrandDetailContent id={id} />
}
