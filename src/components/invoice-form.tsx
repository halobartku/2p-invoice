import { useState } from 'react'
import type { Invoice, InvoiceItem, Currency } from '@/types/invoice'
import { generateInvoiceNumber, formatCurrency, addDays } from '@/lib/utils'

export function InvoiceForm() {
  const [invoice, setInvoice] = useState<Invoice>({
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

  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: crypto.randomUUID(),
          description: '',
          quantity: 1,
          price: 0,
        },
      ],
    }))
  }

  const removeItem = (id: string) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id),
    }))
  }

  const updateItem = (id: string, updates: Partial<InvoiceItem>) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }))
  }

  const updateInvoice = (updates: Partial<Invoice>) => {
    setInvoice(prev => ({ ...prev, ...updates }))
  }

  const calculateSubtotal = () => {
    return invoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0)
  }

  const calculateTax = () => {
    return calculateSubtotal() * (invoice.taxRate / 100)
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  return (
    <div className="space-y-8 bg-background shadow-lg rounded-lg p-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold">INVOICE</h1>
          <div className="text-xl text-primary mt-2">{invoice.number}</div>
        </div>
        <div>
          <img src="/api/placeholder/200/100" alt="Company Logo" className="rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* From Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">From</h3>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Your Company Name"
              className="w-full input"
              value={invoice.from.name}
              onChange={e =>
                updateInvoice({
                  from: { ...invoice.from, name: e.target.value },
                })
              }
            />
            <input
              type="text"
              placeholder="VAT Number"
              className="w-full input"
              value={invoice.from.vatNumber}
              onChange={e =>
                updateInvoice({
                  from: { ...invoice.from, vatNumber: e.target.value },
                })
              }
            />
            <textarea
              placeholder="Address"
              className="w-full input"
              rows={3}
              value={invoice.from.address}
              onChange={e =>
                updateInvoice({
                  from: { ...invoice.from, address: e.target.value },
                })
              }
            />
          </div>
        </div>

        {/* To Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Bill To</h3>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Client Company Name"
              className="w-full input"
              value={invoice.to.name}
              onChange={e =>
                updateInvoice({ to: { ...invoice.to, name: e.target.value } })
              }
            />
            <input
              type="text"
              placeholder="VAT Number"
              className="w-full input"
              value={invoice.to.vatNumber}
              onChange={e =>
                updateInvoice({
                  to: { ...invoice.to, vatNumber: e.target.value },
                })
              }
            />
            <textarea
              placeholder="Address"
              className="w-full input"
              rows={3}
              value={invoice.to.address}
              onChange={e =>
                updateInvoice({ to: { ...invoice.to, address: e.target.value } })
              }
            />
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Items</h3>
        <div className="space-y-2">
          {invoice.items.map(item => (
            <div key={item.id} className="flex gap-4">
              <input
                type="text"
                placeholder="Description"
                className="flex-grow input"
                value={item.description}
                onChange={e =>
                  updateItem(item.id, { description: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Qty"
                className="w-24 input"
                value={item.quantity}
                onChange={e =>
                  updateItem(item.id, {
                    quantity: parseFloat(e.target.value) || 0,
                  })
                }
              />
              <input
                type="number"
                placeholder="Price"
                className="w-32 input"
                value={item.price}
                onChange={e =>
                  updateItem(item.id, { price: parseFloat(e.target.value) || 0 })
                }
              />
              <div className="w-32 flex items-center">
                {formatCurrency(item.quantity * item.price, invoice.currency)}
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="p-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
          <button
            onClick={addItem}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Add Item
          </button>
        </div>
      </div>

      {/* Totals Section */}
      <div className="space-y-2 text-right">
        <div>
          Subtotal: {formatCurrency(calculateSubtotal(), invoice.currency)}
        </div>
        <div>
          VAT ({invoice.taxRate}%):{' '}
          {formatCurrency(calculateTax(), invoice.currency)}
        </div>
        <div className="text-xl font-bold">
          Total: {formatCurrency(calculateTotal(), invoice.currency)}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90">
          Save Draft
        </button>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90">
          Generate PDF
        </button>
      </div>
    </div>
  )
}
