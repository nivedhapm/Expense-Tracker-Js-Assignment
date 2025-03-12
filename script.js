
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let editingIndex = -1;


const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const addBtn = document.getElementById('add-btn');
const expenseBody = document.getElementById('expense-body');
const expenseCount = document.getElementById('expense-count');
const totalAmount = document.getElementById('total-amount');


document.addEventListener('DOMContentLoaded', () => {
    loadExpenses();
    updateSummary();
});


addBtn.addEventListener('click', () => {
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);

    if (description === '' || isNaN(amount) || amount <= 0) {
        alert('Please enter a valid description and amount');
        return;
    }

    if (editingIndex === -1) {
        
        const expense = {
            id: Date.now(),
            description,
            amount
        };
        expenses.push(expense);
    } else {
        
        expenses[editingIndex].description = description;
        expenses[editingIndex].amount = amount;
        editingIndex = -1;
        addBtn.textContent = 'Add Expense';
    }

    
    saveExpenses();
    loadExpenses();
    updateSummary();

    
    descriptionInput.value = '';
    amountInput.value = '';
});


function loadExpenses() {
    expenseBody.innerHTML = '';
    
    if (expenses.length === 0) {
        expenseBody.innerHTML = `
            <tr>
                <td colspan="3" class="no-expenses">No expenses added yet</td>
            </tr>
        `;
        return;
    }
    
    expenses.forEach((expense, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.description}</td>
            <td>₹${expense.amount.toFixed(2)}</td>
            <td class="action-buttons">
                <button class="edit-button" onclick="editExpense(${index})">Edit</button>
                <button class="delete-button" onclick="deleteExpense(${index})">Delete</button>
            </td>
        `;
        expenseBody.appendChild(row);
    });
}


function editExpense(index) {
    const expense = expenses[index];
    descriptionInput.value = expense.description;
    amountInput.value = expense.amount;
    addBtn.textContent = 'Update Expense';
    editingIndex = index;
    
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function deleteExpense(index) {
    if (confirm('Are you sure you want to delete this expense?')) {
        expenses.splice(index, 1);
        saveExpenses();
        loadExpenses();
        updateSummary();
        
        
        if (index === editingIndex) {
            editingIndex = -1;
            descriptionInput.value = '';
            amountInput.value = '';
            addBtn.textContent = 'Add Expense';
        }
    }
}


function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}


function updateSummary() {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    expenseCount.textContent = expenses.length;
    totalAmount.textContent = total.toFixed(2);
}


window.editExpense = editExpense;
window.deleteExpense = deleteExpense;
