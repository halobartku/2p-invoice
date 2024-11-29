import { useState } from 'react'
import { useInvoiceStore } from '@/stores/invoice-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { formatCurrency } from '@/lib/utils'
import { generatePDF } from '@/lib/pdf'
import { InvoicePreview } from './invoice-preview'

export function InvoiceForm() {
  const [isPreview, setIsPreview] = useState(false)
  const {
    invoice,
    updateInvoice,
    addItem,
    removeItem,
    updateItem,
    saveDraft,
    resetInvoice,
  } = useInvoiceStore()

  const calculateSubtotal = () => {
    return invoice.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    )
  }

  const calculateTax = () => {
    return calculateSubtotal() * (invoice.taxRate / 100)
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  const handleGeneratePDF = async () => {
    await generatePDF(invoice)
  }

  if (isPreview) {
    return (
      <div className="space-y-8">
        <div className="flex justify-end space-x-4 no-print">
          <Button variant="outline" onClick={() => setIsPreview(false)}>
            Edit
          </Button>
          <Button onClick={handleGeneratePDF}>Download PDF</Button>
        </div>
        <InvoicePreview invoice={invoice} />
      </div>
    )
  }

  return (
    <div className="space-y-8 bg-background shadow-lg rounded-lg p-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold">INVOICE</h1>
          <div className="text-xl text-primary mt-2">{invoice.number}</div>
        </div>
        <div>
          <img
            src="/api/placeholder/200/100"
            alt="Company Logo"
            className="rounded-lg"
          />
        </div>
      </div>

      <div className="flex gap-4 p-4 bg-muted rounded-lg">
        <div className="flex items-center gap-2">
          <label>Currency:</label>
          <select
            className="bg-background border rounded px-2 py-1"
            value={invoice.currency}
            onChange={(e) =>
              updateInvoice({ currency: e.target.value as 'EUR' | 'USD' | 'GBP' })
            }
          >
            <option value="EUR">EUR (€)</option>
            <option value="USD">USD ($)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label>VAT Rate:</label>
          <Input
            type="number"
            className="w-20"
            value={invoice.taxRate}
            onChange={(e) =>
              updateInvoice({ taxRate: parseFloat(e.target.value) || 0 })
            }
          />
          <span>%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* From Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">From</h3>
          <div className="space-y-2">
            <Input
              placeholder="Your Company Name"
              value={invoice.from.name}
              onChange={(e) =>
                updateInvoice({
                  from: { ...invoice.from, name: e.target.value },
                })
              }
            />
            <Input
              placeholder="VAT Number"
              value={invoice.from.vatNumber}
              onChange={(e) =>
                updateInvoice({
                  from: { ...invoice.from, vatNumber: e.target.value },
                })
              }
            />
            <Textarea
              placeholder="Address"
              rows={3}
              value={invoice.from.address}
              onChange={(e) =>
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
            <Input
              placeholder="Client Company Name"
              value={invoice.to.name}
              onChange={(e) =>
                updateInvoice({ to: { ...invoice.to, name: e.target.value } })
              }
            />
            <Input
              placeholder="VAT Number"
              value={invoice.to.vatNumber}
              onChange={(e) =>
                updateInvoice({
                  to: { ...invoice.to, vatNumber: e.target.value },
                })
              }
            />
            <Textarea
              placeholder="Address"
              rows={3}
              value={invoice.to.address}
              onChange={(e) =>
                updateInvoice({ to: { ...invoice.to, address: e.target.value } })
              }
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Invoice Date</label>
          <Input
            type="date"
            value={invoice.issueDate}
            onChange={(e) => updateInvoice({ issueDate: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Due Date</label>
          <Input
            type="date"
            value={invoice.dueDate}
            onChange={(e) => updateInvoice({ dueDate: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Purchase Order Number
          </label>
          <Input
            value={invoice.poNumber || ''}
            onChange={(e) => updateInvoice({ poNumber: e.target.value })}
          />
        </div>
      </div>

      {/* Items Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Items</h3>
        <div className="space-y-2">
          <div className="grid grid-cols-[1fr,auto,auto,auto,auto] gap-4 font-medium px-4">
            <div>Description</div>
            <div>Quantity</div>
            <div>Price</div>
            <div>Total</div>
            <div></div>
          </div>
          {invoice.items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1fr,auto,auto,auto,auto] gap-4 items-center"
            >
              <Input
                placeholder="Description"
                value={item.description}
                onChange={(e) =>
                  updateItem(item.id, { description: e.target.value })
                }
              />
              <Input
                type="number"
                className="w-24"
                value={item.quantity}
                onChange={(e) =>
                  updateItem(item.id, {
                    quantity: parseFloat(e.target.value) || 0,
                  })
                }
              />
              <Input
                type="number"
                className="w-32"
                value={item.price}
                onChange={(e) =>
                  updateItem(item.id, { price: parseFloat(e.target.value) || 0 })
                }
              />
              <div className="w-32 px-4">
                {formatCurrency(item.quantity * item.price, invoice.currency)}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={addItem}
            className="mt-4"
          >
            Add Item
          </Button>
        </div>
      </div>

      {/* Totals Section */}
      <div className="flex justify-end">
        <div className="w-64 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatCurrency(calculateSubtotal(), invoice.currency)}</span>
          </div>
          <div className="flex justify-between">
            <span>VAT ({invoice.taxRate}%):</span>
            <span>{formatCurrency(calculateTax(), invoice.currency)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total:</span>
            <span>{formatCurrency(calculateTotal(), invoice.currency)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <Textarea
            placeholder="Payment terms, delivery details, or any additional notes"
            value={invoice.notes || ''}
            onChange={(e) => updateInvoice({ notes: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Payment Details
          </label>
          <Textarea
            placeholder="Bank account details, payment methods accepted"
            value={invoice.paymentDetails || ''}
            onChange={(e) => updateInvoice({ paymentDetails: e.target.value })}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={resetInvoice}>
          Reset
        </Button>
        <Button variant="secondary" onClick={saveDraft}>
          Save Draft
        </Button>
        <Button variant="secondary" onClick={() => setIsPreview(true)}>
          Preview
        </Button>
        <Button onClick={handleGeneratePDF}>Generate PDF</Button>
      </div>
    </div>
  )
}
