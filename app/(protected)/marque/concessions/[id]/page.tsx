"use client"

import { use } from "react"
import { ConcessionDetailContent } from "./concession-detail-content"

export default function ConcessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  return <ConcessionDetailContent id={id} />
}
