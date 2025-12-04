import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DataPoint {
  name: string;
  production: number;
  consumption: number;
}

interface ProductionLineChartProps {
  data: DataPoint[];
  height?: number;
}

const ProductionLineChart = ({ data, height = 200 }: ProductionLineChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
      >
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="hsl(var(--border))"
          vertical={false}
        />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
          axisLine={{ stroke: 'hsl(var(--border))' }}
          tickLine={false}
        />
        <YAxis 
          tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
        />
        <Line 
          type="monotone" 
          dataKey="production" 
          stroke="hsl(var(--chart-production))"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: 'hsl(var(--chart-production))' }}
          name="Production"
        />
        <Line 
          type="monotone" 
          dataKey="consumption" 
          stroke="hsl(var(--chart-consumption))"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: 'hsl(var(--chart-consumption))' }}
          name="Consommation"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ProductionLineChart;
