import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Invoice, InvoiceItem } from '@/types/invoice'
import { generateInvoiceNumber, addDays } from '@/lib/utils'

interface InvoiceState {
  invoice: Invoice
  drafts: Invoice[]
  setInvoice: (invoice: Invoice) => void
  updateInvoice: (updates: Partial<Invoice>) => void
  addItem: () => void
  removeItem: (id: string) => void
  updateItem: (id: string, updates: Partial<InvoiceItem>) => void
  saveDraft: () => void
  loadDraft: (id: string) => void
  resetInvoice: () => void
}

const createDefaultInvoice = (): Invoice => ({
  id: crypto.randomUUID(),
  number: generateInvoiceNumber(),
  currency: 'EUR',
  taxRate: 20,
  from: {
    name: '',
    vatNumber: '',
    address: '',
  },
  to: {
    name: '',
    vatNumber: '',
    address: '',
  },
  items: [
    {
      id: crypto.randomUUID(),
      description: '',
      quantity: 1,
      price: 0,
    },
  ],
  issueDate: new Date().toISOString().split('T')[0],
  dueDate: addDays(new Date(), 30).toISOString().split('T')[0],
})

export const useInvoiceStore = create<InvoiceState>()(
  persist(
    (set, get) => ({
      invoice: createDefaultInvoice(),
      drafts: [],
      setInvoice: (invoice) => set({ invoice }),
      updateInvoice: (updates) =>
        set((state) => ({
          invoice: { ...state.invoice, ...updates },
        })),
      addItem: () =>
        set((state) => ({
          invoice: {
            ...state.invoice,
            items: [
              ...state.invoice.items,
              {
                id: crypto.randomUUID(),
                description: '',
                quantity: 1,
                price: 0,
              },
            ],
          },
        })),
      removeItem: (id) =>
        set((state) => ({
          invoice: {
            ...state.invoice,
            items: state.invoice.items.filter((item) => item.id !== id),
          },
        })),
      updateItem: (id, updates) =>
        set((state) => ({
          invoice: {
            ...state.invoice,
            items: state.invoice.items.map((item) =>
              item.id === id ? { ...item, ...updates } : item
            ),
          },
        })),
      saveDraft: () =>
        set((state) => ({
          drafts: [...state.drafts, { ...state.invoice, id: crypto.randomUUID() }],
        })),
      loadDraft: (id) =>
        set((state) => ({
          invoice:
            state.drafts.find((draft) => draft.id === id) || state.invoice,
        })),
      resetInvoice: () => set({ invoice: createDefaultInvoice() }),
    }),
    {
      name: 'invoice-storage',
      version: 1,
    }
  )
)
