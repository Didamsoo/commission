"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface FinancingData {
  label: string
  financingRate: number
}

interface FinancingChartProps {
  data: FinancingData[]
}

const chartConfig = {
  financingRate: {
    label: "Taux financement (%)",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export function FinancingChart({ data }: FinancingChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <BarChart data={data} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis tickLine={false} axisLine={false} domain={[0, 100]} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey="financingRate"
          fill="var(--color-financingRate)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  )
}
