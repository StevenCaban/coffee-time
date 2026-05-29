const FILE_VERSION = 1;

export function exportBrew(brew) {
  const payload = JSON.stringify({ version: FILE_VERSION, brews: [brew] }, null, 2);
  triggerDownload(payload, `${slugify(brew.name)}.coffee-time.json`);
}

export function exportAllBrews(brews) {
  const payload = JSON.stringify({ version: FILE_VERSION, brews }, null, 2);
  triggerDownload(payload, 'all-brews.coffee-time.json');
}

export function parseImportFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const parsed = JSON.parse(e.target.result);
        const brews = validate(parsed);
        resolve(brews);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsText(file);
  });
}

function validate(parsed) {
  if (!parsed || !Array.isArray(parsed.brews)) {
    throw new Error('Invalid file format');
  }
  return parsed.brews.map(b => {
    if (!b.id || !b.name || !Array.isArray(b.steps)) {
      throw new Error('Invalid brew data in file');
    }
    return {
      id: String(b.id),
      name: String(b.name),
      details: String(b.details ?? ''),
      createdAt: Number(b.createdAt) || Date.now(),
      steps: b.steps.map(s => ({
        name: String(s.name ?? ''),
        duration: Number(s.duration) || 0,
        notes: String(s.notes ?? ''),
      })),
    };
  });
}

function triggerDownload(content, filename) {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'brew';
}
