import React, { useEffect, useRef } from 'react';

const SystemLogs = ({ logs }) => {
  const logContainerRef = useRef(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="panel log-container">
      <div className="log-title">TERMINAL SYSTÈME</div>
      <div className="log-entries" ref={logContainerRef} style={{ overflowY: 'auto' }}>
        {logs.map((log) => (
          <div key={log.id} className="log-entry">
            <span className="log-time">[{log.time}]</span>
            <span className={`log-msg ${log.type === 'warning' ? 'warning' : log.type === 'critical' ? 'critical blink-fast' : ''}`}>
              {log.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemLogs;
