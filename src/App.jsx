import { useState } from 'react';
import { StopwatchScreen } from './components/StopwatchScreen';
import { EditScreen } from './components/EditScreen';
import { BrewListScreen } from './components/BrewListScreen';
import { CountdownScreen } from './components/CountdownScreen';
import { loadBrews, saveBrews } from './storage';
import { exportBrew, exportAllBrews, parseImportFile } from './importExport';

export default function App() {
  const [brews, setBrews] = useState(() => loadBrews());
  const [mode, setMode] = useState('list');
  const [pendingSteps, setPendingSteps] = useState(null);
  const [activeBrew, setActiveBrew] = useState(null);
  const [editingBrew, setEditingBrew] = useState(null);

  function handleStopwatchFinish(steps) {
    setPendingSteps(steps);
    setMode('edit');
  }

  function handleSaveBrew(brew) {
    const updated = editingBrew
      ? brews.map(b => b.id === brew.id ? brew : b)
      : [brew, ...brews];
    setBrews(updated);
    saveBrews(updated);
    setPendingSteps(null);
    setEditingBrew(null);
    setMode('list');
  }

  function handleEditBrew(brew) {
    setEditingBrew(brew);
    setMode('edit');
  }

  function handleDeleteBrew(id) {
    const updated = brews.filter(b => b.id !== id);
    setBrews(updated);
    saveBrews(updated);
  }

  async function handleImport(file) {
    const incoming = await parseImportFile(file);
    const existingIds = new Set(brews.map(b => b.id));
    const toAdd = incoming.map(b =>
      existingIds.has(b.id) ? { ...b, id: String(Date.now() + Math.random()) } : b
    );
    const updated = [...toAdd, ...brews];
    setBrews(updated);
    saveBrews(updated);
    return toAdd.length;
  }

  function handleSelectBrew(brew) {
    setActiveBrew(brew);
    setMode('countdown');
  }

  if (mode === 'stopwatch') {
    return (
      <StopwatchScreen
        onFinish={handleStopwatchFinish}
        onCancel={() => setMode(brews.length > 0 ? 'list' : 'stopwatch')}
      />
    );
  }

  if (mode === 'edit' && (pendingSteps || editingBrew)) {
    return (
      <EditScreen
        recordedSteps={pendingSteps ?? []}
        existingBrew={editingBrew}
        onSave={handleSaveBrew}
        onDiscard={() => {
          setPendingSteps(null);
          setEditingBrew(null);
          setMode(editingBrew ? 'list' : 'stopwatch');
        }}
      />
    );
  }

  if (mode === 'countdown' && activeBrew) {
    return (
      <CountdownScreen
        brew={activeBrew}
        onDone={() => { setActiveBrew(null); setMode('list'); }}
      />
    );
  }

  return (
    <BrewListScreen
      brews={brews}
      onSelect={handleSelectBrew}
      onDelete={handleDeleteBrew}
      onEdit={handleEditBrew}
      onExportBrew={exportBrew}
      onExportAll={() => exportAllBrews(brews)}
      onImport={handleImport}
      onNewBrew={() => setMode('stopwatch')}
    />
  );
}
