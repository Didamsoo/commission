import { use } from "react"
import { CommercialDetailContent } from "./commercial-detail-content"

export default function CommercialDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  return <CommercialDetailContent id={id} />
}
