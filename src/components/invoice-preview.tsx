import { formatCurrency } from '@/lib/utils'
import type { Invoice } from '@/types/invoice'

interface InvoicePreviewProps {
  invoice: Invoice
}

export function InvoicePreview({ invoice }: InvoicePreviewProps) {
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

  return (
    <div id="invoice-preview" className="bg-background p-8 rounded-lg shadow-lg">
      <div className="flex justify-between items-start mb-8">
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

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-semibold mb-2">From</h3>
          <div className="space-y-1">
            <div className="font-medium">{invoice.from.name}</div>
            <div>VAT: {invoice.from.vatNumber}</div>
            <div className="whitespace-pre-line">{invoice.from.address}</div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Bill To</h3>
          <div className="space-y-1">
            <div className="font-medium">{invoice.to.name}</div>
            <div>VAT: {invoice.to.vatNumber}</div>
            <div className="whitespace-pre-line">{invoice.to.address}</div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="font-medium">Invoice Date:</span>{' '}
            {invoice.issueDate}
          </div>
          <div>
            <span className="font-medium">Due Date:</span> {invoice.dueDate}
          </div>
        </div>
      </div>

      <table className="w-full mb-8">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Description</th>
            <th className="text-right py-2">Quantity</th>
            <th className="text-right py-2">Price</th>
            <th className="text-right py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="py-2">{item.description}</td>
              <td className="text-right py-2">{item.quantity}</td>
              <td className="text-right py-2">
                {formatCurrency(item.price, invoice.currency)}
              </td>
              <td className="text-right py-2">
                {formatCurrency(
                  item.quantity * item.price,
                  invoice.currency
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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

      {invoice.notes && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Notes</h3>
          <div className="whitespace-pre-line">{invoice.notes}</div>
        </div>
      )}

      {invoice.paymentDetails && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
          <div className="whitespace-pre-line">{invoice.paymentDetails}</div>
        </div>
      )}
    </div>
  )
}
