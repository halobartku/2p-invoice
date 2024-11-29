import { useEffect } from 'react'
import { ThemeProvider } from './components/theme-provider'
import { InvoiceForm } from './components/invoice-form'
import { DraftsDialog } from './components/drafts-dialog'
import { useInvoiceStore } from './stores/invoice-store'

function App() {
  const { saveDraft, addItem } = useInvoiceStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Save draft with Ctrl/Cmd + S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        saveDraft()
      }
      // Add new item with Ctrl/Cmd + I
      if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault()
        addItem()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [saveDraft, addItem])

  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <div className="min-h-screen bg-background p-8">
        <div className="container mx-auto">
          <div className="flex justify-end mb-4">
            <DraftsDialog />
          </div>
          <InvoiceForm />
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App