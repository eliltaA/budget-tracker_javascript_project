import Chart from 'chart.js/auto';
import incomeObj from "./income.js";


class Expense {
    constructor(){
        this.expense = 0;
        this.expenses = [];
        this.expenseAddForm = document.getElementById("expenseAddForm")
        this.expenseAddForm.addEventListener("submit", this.addExpenseForm.bind(this));
        this.loadFromCookies();
        this.generateExpenseTable();
        this.generateDoughnutChart();
        this.generateBarChart();
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
        }else{
            this.expenses = [{
                amount: 100, 
                categories: 'Sample Category', 
                date: new Date().toLocaleDateString(),
            }];
        }
        const totalExpenseFromCookie = this.getCookie('expense');
        if (totalExpenseFromCookie) {
            this.expense = parseFloat(totalExpenseFromCookie);
        }else{
            this.expense = 100;
        }
    }

    saveToCookies() {
        this.setCookie('expenses', JSON.stringify(this.expenses), 7);
        this.setCookie('expense', this.expense, 7);
    }

    addExpense(amount, categories) {
        const expenseDetails = {
            amount: parseFloat(amount),
            categories: categories
        };
        if (this.expenses.length > 0 && this.expenses[0].categories === 'Sample Category') {
            this.expenses.shift(); 
            this.expense -= 100; 
        }
        this.expense += parseFloat(amount);
        this.expenses.push(expenseDetails);
        this.saveToCookies();
        this.generateExpenseTable();
        this.generateDoughnutChart()
        this.generateBarChart();
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
                <td>${expense.date}</td>
                <td>${expense.categories}</td>
                <td>$${expense.amount}</td>
            `;
            tableBody.appendChild(newRow);
        });
    
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
                            'rgb(255, 99, 132, 0.8)',
                            'rgb(255, 159, 64, 0.7)',
                            'rgb(255, 205, 86, 0.8)',
                            'rgb(75, 192, 192, 0.7)',
                            'rgb(54, 162, 235, 0.7)',
                            'rgb(1, 142, 203, 0.7)',
                            'rgb(106, 144, 204, 0.7)',
                            'rgb(1, 142, 203, 0.7)',
                            'rgb(102, 55, 221, 0.8)',
                            ],
                        },
                    ],
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Expense Overview',
                            font: {
                                size: 25,
                                weight: 'bold',
                            },
                        },
                        legend: {
                            display: true,
                            position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    const label = context.label || '';
                                    const value = context.parsed || 0;
                                    return label + ': $' + value;
                                },
                            },
                        },
                    },
                },
            })
        }
    }

    generateBarChart() {
        const ctx = document.getElementById("expenseBarChart").getContext("2d");

        if (this.expenseBarChartInstance) {
            this.expenseBarChartInstance.destroy();
        }    
        
        const labels = ["Expenses", "Budget", "Savings"];
        const data = [this.expense, incomeObj.budget, incomeObj.savings];

        this.expenseBarChartInstance = new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Amount",
                        data: data,
                        backgroundColor: [
                            "rgba(255, 99, 132, 0.6)",
                            "rgba(54, 162, 235, 0.6)",
                            "rgba(75, 192, 192, 0.6)",
                        ],
                        borderColor: [
                            "rgba(255, 99, 132, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(75, 192, 192, 1)",
                        ],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
                plugins: {
                    title: {
                        display: true,
                        text: "Expenses vs. Budget vs. Savings",
                        font: {
                            size: 20,
                            weight: 'bold',
                            color: 'rgba(0, 0, 0, 1)',
                        },
                    },
                    datalabels: {
                        align: 'end',
                        anchor: 'end',
                        color: 'black',
                        font: {
                            weight: 'bold',
                        },
                    },
                },
            },
        });
    }



    initiate() {}
}

const expenseObj = new Expense()

export default expenseObj
