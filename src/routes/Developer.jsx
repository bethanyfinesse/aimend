import { useEffect, useRef, useState } from 'react'
import Editor from '@monaco-editor/react'
import ActivityBar from '../components/developer/ActivityBar.jsx'
import Explorer from '../components/developer/Explorer.jsx'
import Tabs from '../components/developer/Tabs.jsx'
import StatusBar from '../components/developer/StatusBar.jsx'
import { FILES } from '../lib/devFiles.js'
import { registerAimend } from '../lib/aimendMonaco.js'

function beforeMount(monaco) {
  // The demo file imports modules that don't exist, so skip semantic type errors.
  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({ noSemanticValidation: true })
  monaco.editor.defineTheme('aimend-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: { 'editorInfo.foreground': '#5FD0CB', 'editorCodeLens.foreground': '#9fb8b5' },
  })
}

export default function Developer() {
  const [tabs, setTabs] = useState(['weekly.ts', 'routes.ts'])
  const [active, setActive] = useState('weekly.ts')
  const [suggestions, setSuggestions] = useState(3)
  const aimend = useRef(null)

  useEffect(() => () => aimend.current?.dispose(), [])

  const open = (name) => {
    if (!tabs.includes(name)) setTabs([...tabs, name])
    setActive(name)
  }
  const close = (name) => {
    const rest = tabs.filter((t) => t !== name)
    setTabs(rest)
    if (active === name) setActive(rest[0] ?? null)
  }

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e] text-white">
      <div className="h-8 shrink-0 flex items-center justify-center relative bg-[#323233] text-[12.5px] text-white/60">
        <div className="absolute left-3 flex gap-2">
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => <span key={c} className="w-3 h-3 rounded-full opacity-70" style={{ background: c }} />)}
        </div>
        {active ?? 'Welcome'} — sales-app
      </div>
      <div className="flex flex-1 min-h-0">
        <ActivityBar />
        <Explorer files={FILES} active={active} onOpen={open} />
        <div className="flex-1 flex flex-col min-w-0">
          <Tabs tabs={tabs} active={active} onSelect={setActive} onClose={close} />
          <div className="flex-1 min-h-0">
            {active && (
              <Editor
                theme="aimend-dark"
                path={active}
                defaultLanguage={FILES[active].language}
                defaultValue={FILES[active].value}
                beforeMount={beforeMount}
                onMount={(editor, monaco) => {
                  aimend.current?.dispose()
                  aimend.current = registerAimend(monaco, editor, { onSuggestions: setSuggestions })
                }}
                options={{
                  fontSize: 14,
                  fontFamily: 'JetBrains Mono, Menlo, monospace',
                  minimap: { enabled: false },
                  codeLens: true,
                  lightbulb: { enabled: 'on' },
                  scrollBeyondLastLine: false,
                  padding: { top: 12 },
                  renderLineHighlight: 'none',
                }}
                loading={<div className="text-white/50 text-sm p-6">Loading editor…</div>}
              />
            )}
          </div>
        </div>
      </div>
      <StatusBar suggestions={suggestions} language={active && FILES[active].language} />
    </div>
  )
}
