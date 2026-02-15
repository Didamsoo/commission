import { use } from "react"
import { dealerships } from "@/lib/mock-dir-marque-data"
import { ConcessionDetailContent } from "./concession-detail-content"

// Generate static params for all dealerships
export function generateStaticParams() {
  return dealerships.map((dealership) => ({
    id: dealership.id,
  }))
}

export default function ConcessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  return <ConcessionDetailContent id={id} />
}
