let items = [];

function addItem() {
    const itemRow = document.createElement('div');
    itemRow.className = 'item-row';
    itemRow.innerHTML = `
        <input type="text" placeholder="Description" onchange="updateTotals()">
        <input type="number" placeholder="Quantity" value="1" min="1" onchange="updateTotals()">
        <input type="number" placeholder="Price" step="0.01" onchange="updateTotals()">
        <div class="item-total">€0.00</div>
        <button class="btn-remove" onclick="removeItem(this)">×</button>
    `;
    document.getElementById('itemsList').appendChild(itemRow);
    items.push(itemRow);
    updateTotals();
}

function removeItem(button) {
    const row = button.parentElement;
    items = items.filter(item => item !== row);
    row.remove();
    updateTotals();
}

function updateTotals() {
    let subtotal = 0;
    items.forEach(row => {
        const quantity = parseFloat(row.children[1].value) || 0;
        const price = parseFloat(row.children[2].value) || 0;
        const total = quantity * price;
        row.children[3].textContent = `€${total.toFixed(2)}`;
        subtotal += total;
    });

    const vat = subtotal * 0.20;
    const total = subtotal + vat;

    document.getElementById('subtotal').textContent = `€${subtotal.toFixed(2)}`;
    document.getElementById('vat').textContent = `€${vat.toFixed(2)}`;
    document.getElementById('total').textContent = `€${total.toFixed(2)}`;
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const invoice = document.getElementById('invoice');
    
    html2canvas(invoice, {
        scale: 2,
        useCORS: true,
        logging: false
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 0;

        pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        pdf.save('invoice.pdf');
    });
}

// Set default dates
const today = new Date().toISOString().split('T')[0];
const dueDate = new Date();
dueDate.setDate(dueDate.getDate() + 30);
document.getElementById('invoiceDate').value = today;
document.getElementById('dueDate').value = dueDate.toISOString().split('T')[0];

// Add first item row by default
addItem();