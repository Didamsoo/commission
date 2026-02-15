import { use } from "react"
import { teamMembers } from "@/lib/mock-chef-ventes-data"
import { CommercialDetailContent } from "./commercial-detail-content"

// Generate static params for all team members
export function generateStaticParams() {
  return teamMembers.map((member) => ({
    id: member.id,
  }))
}

export default function CommercialDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  return <CommercialDetailContent id={id} />
}
