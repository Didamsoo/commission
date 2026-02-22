"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface MarginData {
  label: string
  margin: number
}

interface MarginChartProps {
  data: MarginData[]
}

const chartConfig = {
  margin: {
    label: "Marge (\u20ac)",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function MarginChart({ data }: MarginChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <AreaChart data={data} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          dataKey="margin"
          type="monotone"
          fill="var(--color-margin)"
          fillOpacity={0.3}
          stroke="var(--color-margin)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  )
}
