import { useState } from 'react'
import { useInvoiceStore } from '@/stores/invoice-store'
import { Button } from '@/components/ui/button'

export function DraftsDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const { drafts, loadDraft } = useInvoiceStore()

  const handleLoadDraft = (id: string) => {
    loadDraft(id)
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        Load Draft
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg">
        <div className="bg-background rounded-lg shadow-lg p-6 border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Saved Drafts</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              ×
            </Button>
          </div>

          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {drafts.length === 0 ? (
              <p className="text-muted-foreground">No saved drafts</p>
            ) : (
              drafts.map((draft) => (
                <div
                  key={draft.id}
                  className="flex justify-between items-center p-4 border rounded-lg hover:bg-accent"
                >
                  <div>
                    <div className="font-medium">{draft.number}</div>
                    <div className="text-sm text-muted-foreground">
                      {draft.to.name} - {draft.issueDate}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLoadDraft(draft.id)}
                  >
                    Load
                  </Button>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
