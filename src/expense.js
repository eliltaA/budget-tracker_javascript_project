import Chart from 'chart.js/auto';

class Expense {
    constructor(){
        this.expenses = [];
        this.expenseAddForm = document.getElementById("expenseAddForm")
        this.expenseAddForm.addEventListener("submit", this.addExpenseForm.bind(this));
        this.loadFromCookies();
        this.generateExpenseTable();
        this.generateDoughnutChart()
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
        this.generateDoughnutChart()
        // this.generateExpenseChart();
    }

    addExpenseForm(e) {
        e.preventDefault();
        const newExpenseInput = document.getElementById("newExpenseInput").value;
        const existingExpenseInput = document.getElementById("existingExpenseTagInput").value;
        const newExpenseCategoryInput = document.getElementById("newExpenseCategory").value;
        const categories = existingExpenseInput || newExpenseCategoryInput
       
        if (existingExpenseInput.trim() === '' && newExpenseCategoryInput.trim() === ('')) {
            alert('Please enter a valid expense category.');
            return;
        }
        if (newExpenseInput.trim() === '' || isNaN(parseFloat(newExpenseInput))) {
            alert('Please enter a valid expense amount.');
            return;
        }
        this.addExpense(newExpenseInput, categories);
        document.getElementById("newExpenseInput").value = '';
        document.getElementById("existingExpenseTagInput").value = '';
        document.getElementById("newExpenseCategory").value = '';
    }

    //   [{"amount":200,"categories":"clothes"},{"amount":500,"categories":"gas"}]
    //   populateTagSelect() {
    //     const selectElement = document.getElementById("existingExpenseTagInput");
    //     selectElement.innerHTML = ""; 
    //     // Add each expense category as an option in the select element
    //     this.expenses.forEach((expense) => {
    //       const optionElement = document.createElement("option");
    //       optionElement.value = expense.categories;
    //       optionElement.textContent = expense.categories;
    //       selectElement.appendChild(optionElement);
    //     });
    //   }

    generateExpenseTable() {
        const tableBody = document.getElementById("allExpensesBody");
        tableBody.innerHTML = "";
        const reversedExpenses = this.expenses.slice().reverse();
        reversedExpenses.forEach((expense, index) => {
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


    
    generateDoughnutChart() {
            const ctx = document.getElementById("expenseDoughnutChart").getContext("2d");
    
            // Get unique expense categories and calculate their total amounts
            const categoryTotals = {};
            this.expenses.forEach((expense) => {
                if (categoryTotals[expense.categories]) {
                    categoryTotals[expense.categories] += expense.amount;
                } else {
                    categoryTotals[expense.categories] = expense.amount;
                }
            });
    
            const labels = Object.keys(categoryTotals);
            const data = Object.values(categoryTotals);
    
            if (this.expenseDoughnutChartInstance) {
                // If the chart already exists, update its data
                this.expenseDoughnutChartInstance.data.labels = labels;
                this.expenseDoughnutChartInstance.data.datasets[0].data = data;
                this.expenseDoughnutChartInstance.update();
            } else {
                this.expenseDoughnutChartInstance = new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: labels,
                    datasets: [
                        {
                            data: data,
                            backgroundColor: [
                                "rgba(255, 99, 132, 0.7)",
                                "rgba(54, 162, 235, 0.7)",
                                "rgba(255, 206, 86, 0.7)",
                                // Add more colors here for additional categories
                            ],
                        },
                    ],
                },
            });
        }
    }
    
    


    initiate() {}
}

const expenseObj = new Expense()

export default expenseObj