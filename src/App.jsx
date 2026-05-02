import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import './App.css';
import MetricDisplay from './components/MetricDisplay';
import MainGraph from './components/MainGraph';
import SystemLogs from './components/SystemLogs';

const MAX_DATA_POINTS = 60; // 60 seconds of history
const UPDATE_INTERVAL = 1000; // 1 second

function App() {
  const [coreTemp, setCoreTemp] = useState(1200); // °C
  const [coolantPressure, setCoolantPressure] = useState(15.5); // MPa
  const [radiationLevel, setRadiationLevel] = useState(0.5); // mSv/h
  const [powerOutput, setPowerOutput] = useState(850); // MW
  
  const [tempHistory, setTempHistory] = useState([]);
  const [logs, setLogs] = useState([]);
  
  // Overall status: nominal, warning, critical
  const [reactorStatus, setReactorStatus] = useState('nominal');

  // Initialize graph data
  useEffect(() => {
    const initialData = [];
    let currentTemp = 1200;
    for (let i = MAX_DATA_POINTS; i > 0; i--) {
      currentTemp += (Math.random() - 0.5) * 5;
      initialData.push({
        time: `-${i}s`,
        temperature: currentTemp,
      });
    }
    setTempHistory(initialData);
    
    addLog('Système initialisé. Panneau de contrôle en ligne.', 'nominal');
  }, []);

  const addLog = (message, type = 'nominal') => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
    setLogs(prev => {
      const newLogs = [...prev, { id: Date.now(), time: timeStr, message, type }];
      // Keep only last 50 logs
      if (newLogs.length > 50) return newLogs.slice(newLogs.length - 50);
      return newLogs;
    });
  };

  // Main simulation loop
  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuate values
      const newTemp = coreTemp + (Math.random() - 0.5) * 15 + (Math.random() > 0.95 ? 30 : 0); // Occasional spike
      const newPressure = coolantPressure + (Math.random() - 0.5) * 0.2;
      const newRad = radiationLevel + (Math.random() - 0.5) * 0.05;
      const newPower = powerOutput + (Math.random() - 0.5) * 10;

      setCoreTemp(Math.max(0, newTemp));
      setCoolantPressure(Math.max(0, newPressure));
      setRadiationLevel(Math.max(0, newRad));
      setPowerOutput(Math.max(0, newPower));

      // Update history
      setTempHistory(prev => {
        const newData = [...prev.slice(1), { 
          time: new Date().toLocaleTimeString('fr-FR', { second: '2-digit' }) + 's', 
          temperature: newTemp 
        }];
        return newData;
      });

      // Status checks & logs
      let currentStatus = 'nominal';
      
      if (newTemp > 1600 || newPressure > 18 || newRad > 5) {
        currentStatus = 'critical';
      } else if (newTemp > 1400 || newPressure > 16.5 || newRad > 2) {
        currentStatus = 'warning';
      }

      if (currentStatus !== reactorStatus) {
        if (currentStatus === 'critical') addLog('ALERTE CRITIQUE : Dépassement des seuils de sécurité !', 'critical');
        else if (currentStatus === 'warning') addLog('AVERTISSEMENT : Paramètres hors normes détectés.', 'warning');
        else if (reactorStatus !== 'nominal') addLog('Retour à la normale. Paramètres stabilisés.', 'nominal');
        setReactorStatus(currentStatus);
      }

      // Random background events
      if (Math.random() > 0.95) {
        const events = [
          "Fluctuation mineure dans le flux de refroidissement primaire.",
          "Ajustement automatique des barres de contrôle (0.5%).",
          "Analyse de routine de l'enceinte de confinement terminée.",
          "Recalibrage des capteurs de pression du secteur 4."
        ];
        addLog(events[Math.floor(Math.random() * events.length)]);
      }

    }, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [coreTemp, coolantPressure, radiationLevel, powerOutput, reactorStatus]);


  return (
    <div className="crt">
      <div className="app-container">
        
        {/* HEADER */}
        <header className="panel header-panel">
          <div className="header-title glow-text">SUPERVISION RÉACTEUR ALPHA</div>
          <div className={`header-status ${reactorStatus === 'critical' ? 'blink glow-text-critical' : reactorStatus === 'warning' ? 'glow-text-warning' : 'glow-text'}`}>
            {reactorStatus === 'nominal' && <CheckCircle size={32} color="var(--neon-green)" />}
            {reactorStatus === 'warning' && <Activity size={32} color="var(--neon-yellow)" />}
            {reactorStatus === 'critical' && <AlertTriangle size={32} color="var(--neon-red)" />}
            <span>ÉTAT: {reactorStatus.toUpperCase()}</span>
          </div>
        </header>

        {/* LEFT PANEL: Core Metrics */}
        <div className="left-panel">
          <MetricDisplay 
            title="TEMPÉRATURE CŒUR" 
            value={coreTemp} 
            unit="°C" 
            max={2000} 
            warningThreshold={1400} 
            criticalThreshold={1600} 
          />
          <MetricDisplay 
            title="PRESSION FLUIDE" 
            value={coolantPressure} 
            unit="MPa" 
            max={20} 
            warningThreshold={16.5} 
            criticalThreshold={18} 
          />
          <MetricDisplay 
            title="RADIATIONS CONFINEMENT" 
            value={radiationLevel} 
            unit="mSv/h" 
            max={10} 
            warningThreshold={2} 
            criticalThreshold={5} 
          />
        </div>

        {/* MAIN PANEL: Graph */}
        <div className="main-panel">
          <MainGraph data={tempHistory} warningThreshold={1400} criticalThreshold={1600} />
        </div>

        {/* RIGHT PANEL: Secondary Metrics & Controls Status */}
        <div className="right-panel">
           <MetricDisplay 
            title="PUISSANCE DE SORTIE" 
            value={powerOutput} 
            unit="MW" 
            max={1200} 
            warningThreshold={1000} 
            criticalThreshold={1100} 
          />
          
          <div className="panel" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="metric-header" style={{ marginBottom: '15px' }}>
              <span>ÉTAT SYSTÈMES AUXILIAIRES</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Pompe Primaire 1:</span>
                <span className="glow-text">ACTIF (98%)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Pompe Primaire 2:</span>
                <span className="glow-text">ACTIF (97%)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Barres de Contrôle:</span>
                <span className="glow-text-warning">RETRAIT (85%)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Ventilation Confinement:</span>
                <span className="glow-text">ACTIF (100%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM PANEL: Logs */}
        <div className="bottom-panel">
          <SystemLogs logs={logs} />
        </div>

      </div>
    </div>
  );
}

export default App;
