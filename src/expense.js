class Expense {
    constructor(){
        this.expenses = [];
        this.expenseAddForm = document.getElementById("expenseAddForm")
        this.expenseAddForm.addEventListener("submit", this.addExpenseForm.bind(this));
        this.loadFromCookies();
        this.generateExpenseTable();
       
    }

    setCookie(name, value, daysToExpire) {
        const date = new Date();
        date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    getCookie(name) {
        const cookieName = name + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(';');
        for (let i = 0; i < cookieArray.length; i++) {
          let cookie = cookieArray[i];
          while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
          }
          if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length, cookie.length);
          }
        }
        return "";
    }

    loadFromCookies() {
        const expensesFromCookie = this.getCookie('expenses');
        if (expensesFromCookie) {
            this.expenses = JSON.parse(expensesFromCookie);
        }
    }

    saveToCookies() {
        this.setCookie('expenses', JSON.stringify(this.expenses), 7);
    }

    addExpense(amount, categories) {
        const expenseDetails = {
            amount: parseFloat(amount),
            categories: categories
        };
        this.expenses.push(expenseDetails);
        this.saveToCookies();
        this.generateExpenseTable();
        // this.generateExpenseChart();
    }

    addExpenseForm(e) {
        e.preventDefault();
        const newExpenseInput = document.getElementById("newExpenseInput").value;
        const existingExpenseInput = document.getElementById("existingExpenseInput").value;
        const newExpenseCategoryInput = document.getElementById("newExpenseCategory").value;
        const categories = existingExpenseInput || newExpenseCategoryInput
       
        // if (newTag.trim() === '') {
        //     alert('Please enter a valid expense category.');
        //     return;
        // }
        // if (newExpenseInput.trim() === '' || isNaN(parseFloat(newExpenseInput))) {
        //     alert('Please enter a valid expense amount.');
        //     return;
        // }
        this.addExpense(newExpenseInput, categories);
    }

    // populateTagSelect(){  //[{"amount":200,"categories":"clothes"},{"amount":500,"categories":"gas"}]
    //     const selectElement = document.getElementById("existingExpenseInput");
    //     selectElement.innerHTML = ""; // Clear existing options

    //     // Add each budget category as an option in the select element
    //     this.expenses.forEach((category) => {
    //         const optionElement = document.createElement("option");
    //         optionElement.value = category;
    //         optionElement.textContent = category;
    //         selectElement.appendChild(optionElement);
    //     });
    // }

    generateExpenseTable() {
        const tableBody = document.getElementById("allExpensesBody");
        tableBody.innerHTML = "";
        this.expenses.forEach((expense, index) => {
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td>${index + 1}</td>
                <td>${expense.categories}</td>
                <td>$${expense.amount}</td>
            `;
            tableBody.appendChild(newRow);
        });
        
    }


    getTotalExpenses() {
        return this.expenses.reduce((total, expense) => total + expense.amount, 0);
    }




    initiate() {}
}

const expenseObj = new Expense()

export default expenseObj