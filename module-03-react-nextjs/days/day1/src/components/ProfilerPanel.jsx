import React, { useState, useEffect, useCallback } from "react";

function ProfilerPanel({
  profilerLogsRef,
  onAddThreeDishes,
  isOptimized,
  onToggleOptimization,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [displayLogs, setDisplayLogs] = useState([]);

  const syncLogs = useCallback(() => {
    if (profilerLogsRef?.current) {
      setDisplayLogs([...profilerLogsRef.current]);
    }
  }, [profilerLogsRef]);

  useEffect(() => {
    if (isOpen) {
      syncLogs();
    }
  }, [isOpen, syncLogs]);

  const handleTestThreeDishes = () => {
    onAddThreeDishes();
    setTimeout(() => {
      syncLogs();
    }, 100);
  };

  const handleClear = () => {
    if (profilerLogsRef?.current) {
      profilerLogsRef.current = [];
    }
    setDisplayLogs([]);
  };

  const slowestLog = displayLogs.reduce((slowest, current) => {
    if (!slowest || current.actualDuration > slowest.actualDuration) {
      return current;
    }
    return slowest;
  }, null);

  const averageDuration =
    displayLogs.length > 0
      ? (
          displayLogs.reduce((acc, log) => acc + log.actualDuration, 0) /
          displayLogs.length
        ).toFixed(2)
      : "0.00";

  return (
    <aside className={`profiler-drawer ${isOpen ? "open" : "collapsed"}`}>
      <div
        className="profiler-drawer-toggle"
        onClick={() => {
          const nextState = !isOpen;
          setIsOpen(nextState);
          if (nextState) syncLogs();
        }}
      >
        <span className="profiler-title">
          ⚡ React Profiler Monitor ({displayLogs.length} commits)
        </span>
        <span className="drawer-arrow">{isOpen ? "▼ Hide" : "▲ View Profiler"}</span>
      </div>

      {isOpen && (
        <div className="profiler-drawer-content">
          <div className="profiler-toolbar">
            <button
              className="profiler-action-btn primary"
              onClick={handleTestThreeDishes}
            >
              + Add 3 Dishes (Record Session)
            </button>
            <button className="profiler-action-btn" onClick={syncLogs}>
              🔄 Refresh Logs
            </button>
            <button
              className={`profiler-action-btn ${isOptimized ? "optimized" : "unoptimized"}`}
              onClick={onToggleOptimization}
            >
              Optimization: {isOptimized ? "React.memo Active" : "Unoptimized"}
            </button>
            <button className="profiler-action-btn" onClick={handleClear}>
              Clear Logs
            </button>
          </div>

          <div className="profiler-stats-grid">
            <div className="stat-card">
              <span className="stat-label">Total Commits</span>
              <strong className="stat-value">{displayLogs.length}</strong>
            </div>
            <div className="stat-card">
              <span className="stat-label">Avg Actual Duration</span>
              <strong className="stat-value">{averageDuration} ms</strong>
            </div>
            <div className="stat-card highlight">
              <span className="stat-label">Slowest Component Render</span>
              <strong className="stat-value">
                {slowestLog
                  ? `${slowestLog.id} (${slowestLog.actualDuration.toFixed(2)} ms)`
                  : "None recorded yet"}
              </strong>
            </div>
          </div>

          <div className="profiler-table-wrap">
            <table className="profiler-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Component (ID)</th>
                  <th>Phase</th>
                  <th>Actual Duration</th>
                  <th>Base Duration</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {displayLogs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-logs">
                      No renders in view. Click "+ Add 3 Dishes (Record Session)" or "Refresh Logs".
                    </td>
                  </tr>
                ) : (
                  displayLogs.slice(-10).reverse().map((log, index) => (
                    <tr
                      key={index}
                      className={
                        slowestLog && log === slowestLog ? "slowest-row" : ""
                      }
                    >
                      <td>{displayLogs.length - index}</td>
                      <td>
                        <strong>{log.id}</strong>
                      </td>
                      <td>
                        <span className={`phase-tag ${log.phase}`}>
                          {log.phase}
                        </span>
                      </td>
                      <td>{log.actualDuration.toFixed(2)} ms</td>
                      <td>{log.baseDuration.toFixed(2)} ms</td>
                      <td>{log.timestamp}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </aside>
  );
}

export default ProfilerPanel;
