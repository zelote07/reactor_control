import React from 'react';

const MetricDisplay = ({ title, value, unit, max, min = 0, criticalThreshold, warningThreshold, reverseThresholds = false }) => {
  // Determine status based on thresholds
  let status = 'nominal';
  
  if (reverseThresholds) {
    // For things where low is bad (e.g. pressure drop)
    if (value <= criticalThreshold) status = 'critical';
    else if (value <= warningThreshold) status = 'warning';
  } else {
    // For things where high is bad (e.g. temperature)
    if (value >= criticalThreshold) status = 'critical';
    else if (value >= warningThreshold) status = 'warning';
  }

  // Calculate percentage for the bar
  const range = max - min;
  const percentage = Math.max(0, Math.min(100, ((value - min) / range) * 100));

  return (
    <div className="panel metric-container">
      <div className="metric-header">
        <span>{title}</span>
        <span className={status === 'critical' ? 'blink-fast glow-text-critical' : ''}>
          {status.toUpperCase()}
        </span>
      </div>
      <div className={`metric-value glow-text${status === 'nominal' ? '' : '-' + status}`}>
        {value.toFixed(1)} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>{unit}</span>
      </div>
      <div className="metric-bar-bg">
        <div 
          className={`metric-bar-fill ${status}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default MetricDisplay;
