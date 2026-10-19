const indexExports = Object.keys(models).map(file => {
  const modelName = file.replace('.ts', '');
  return "export * from './" + modelName + "';";
}).join('\n');
models['index.ts'] = indexExports + '\n';

for (const [filename, content] of Object.entries(models)) {
  fs.writeFileSync(path.join(modelsDir, filename), content.trim() + '\n');
}

console.log('Successfully generated all models and enums!');
