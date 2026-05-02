import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

const MainGraph = ({ data, warningThreshold, criticalThreshold }) => {
  return (
    <div className="panel" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <div className="metric-header" style={{ marginBottom: '10px' }}>
        <span>ÉVOLUTION TEMPÉRATURE DU CŒUR</span>
      </div>
      <div style={{ flexGrow: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis 
              dataKey="time" 
              stroke="var(--text-muted)" 
              tick={{ fill: 'var(--text-muted)' }} 
              tickLine={false}
              minTickGap={30}
            />
            <YAxis 
              domain={['auto', 'auto']} 
              stroke="var(--text-muted)" 
              tick={{ fill: 'var(--text-muted)' }}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--bg-panel)', 
                borderColor: 'var(--neon-green)',
                color: 'var(--text-main)',
                fontFamily: 'var(--font-mono)'
              }} 
            />
            <ReferenceLine y={warningThreshold} stroke="var(--neon-yellow)" strokeDasharray="3 3" label={{ position: 'top', value: 'WARN', fill: 'var(--neon-yellow)' }} />
            <ReferenceLine y={criticalThreshold} stroke="var(--neon-red)" strokeDasharray="3 3" label={{ position: 'top', value: 'CRIT', fill: 'var(--neon-red)' }} />
            <Line 
              type="monotone" 
              dataKey="temperature" 
              stroke="var(--neon-green)" 
              strokeWidth={3}
              dot={false}
              isAnimationActive={false} // Disable animation for real-time feel
              activeDot={{ r: 8, fill: 'var(--neon-green)' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MainGraph;
