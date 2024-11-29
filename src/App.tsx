import { useState } from 'react'
import { ThemeProvider } from './components/theme-provider'
import { InvoiceForm } from './components/invoice-form'

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <div className="min-h-screen bg-background p-8">
        <div className="container mx-auto">
          <InvoiceForm />
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App