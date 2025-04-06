let entries = JSON.parse(localStorage.getItem('budgetEntries')) || [];
let editIndex = null;

function updateStorage() {
  localStorage.setItem('budgetEntries', JSON.stringify(entries));
}

function resetForm() {
  document.getElementById('description').value = '';
  document.getElementById('amount').value = '';
  document.getElementById('type').value = 'income';
  editIndex = null;
}

function addEntry() {
  const description = document.getElementById('description').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const type = document.getElementById('type').value;

  if (!description || isNaN(amount)) return alert('Please enter valid data');

  const newEntry = { description, amount, type };

  if (editIndex !== null) {
    entries[editIndex] = newEntry;
    editIndex = null;
  } else {
    entries.push(newEntry);
  }

  updateStorage();
  resetForm();
  displayEntries();
}

function displayEntries() {
  const filter = document.querySelector('input[name="filter"]:checked').value;
  const entryList = document.getElementById('entryList');
  entryList.innerHTML = '';

  let totalIncome = 0;
  let totalExpense = 0;

  entries.forEach((entry, index) => {
    if (filter === 'all' || filter === entry.type) {
      const div = document.createElement('div');
      div.className = 'entry';
      div.innerHTML = `
        <span>${entry.description}</span>
        <span class="${entry.type}">$${entry.amount.toFixed(2)}</span>
        <span>
          <button onclick="editEntry(${index})">Edit</button>
          <button onclick="deleteEntry(${index})">Delete</button>
        </span>
      `;
      entryList.appendChild(div);
    }

    if (entry.type === 'income') totalIncome += entry.amount;
    if (entry.type === 'expense') totalExpense += entry.amount;
  });

  document.getElementById('totalIncome').textContent = `Total Income: Rs:${totalIncome.toFixed(2)}`;
  document.getElementById('totalExpense').textContent = `Total Expense: Rs:${totalExpense.toFixed(2)}`;
  document.getElementById('netBalance').textContent = `Net Balance: Rs:${(totalIncome - totalExpense).toFixed(2)}`;
}

function editEntry(index) {
  const entry = entries[index];
  document.getElementById('description').value = entry.description;
  document.getElementById('amount').value = entry.amount;
  document.getElementById('type').value = entry.type;
  editIndex = index;
}

function deleteEntry(index) {
  if (confirm('Are you sure you want to delete this entry?')) {
    entries.splice(index, 1);
    updateStorage();
    displayEntries();
  }
}

function filterEntries() {
  displayEntries();
}

displayEntries();