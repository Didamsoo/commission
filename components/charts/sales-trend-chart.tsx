"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

interface SalesTrendData {
  period: string
  label: string
  sales: number
  target: number
  margin: number
  financingRate: number
}

interface SalesTrendChartProps {
  data: SalesTrendData[]
}

const chartConfig = {
  sales: {
    label: "Ventes",
    color: "hsl(var(--chart-1))",
  },
  target: {
    label: "Objectif",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function SalesTrendChart({ data }: SalesTrendChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart data={data} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="sales" fill="var(--color-sales)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="target" fill="var(--color-target)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
