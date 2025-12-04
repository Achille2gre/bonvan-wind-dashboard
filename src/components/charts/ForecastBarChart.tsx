import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HourlyForecast } from '@/data/forecastData';

interface ForecastBarChartProps {
  data: HourlyForecast[];
  height?: number;
}

const ForecastBarChart = ({ data, height = 220 }: ForecastBarChartProps) => {
  const chartData = data.map(d => ({
    hour: `${d.hour}h`,
    production: d.production,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={chartData}
        margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
      >
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="hsl(var(--border))"
          vertical={false}
        />
        <XAxis 
          dataKey="hour" 
          tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
          axisLine={{ stroke: 'hsl(var(--border))' }}
          tickLine={false}
          interval={2}
        />
        <YAxis 
          tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
          axisLine={false}
          tickLine={false}
          unit=" kWh"
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
          formatter={(value: number) => [`${value.toFixed(2)} kWh`, 'Production prévue']}
        />
        <Bar 
          dataKey="production" 
          fill="hsl(var(--chart-production))"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ForecastBarChart;
