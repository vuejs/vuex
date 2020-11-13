// Only test esm entry points on Node.14 or higher.
const [major] = process.versions.node.split('.')
if (+major >= 14) {
  (async function () {
    await import('./esm-import.mjs')
  })().catch(console.error)
}
