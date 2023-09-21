import Chart from 'chart.js/auto';

class Income {
    constructor(){
        this.income = 0;
        this.incomes = [];
        const hasUserData = this.income <= 0;
        // const hasBudget = this.budget <= 0
        if (hasUserData) {
            this.loadSampleData();
        }else{ this.loadFromCookies();   
            console.log(this.incomes)
        }
        this.budget = 0;
        this.savings = 0;
        this.budgetCategories = [];
        this.loadBudgetCategoriesFromCookies();
        if (this.budgetCategories.length === 0) {
            this.loadSampleBudgetData();
        }
        this.budgetAddBtn = document.getElementById("budgetAddbtn")
        this.incomeAddForm = document.getElementById("incomeAddForm")
        this.incomeAddForm.addEventListener("submit", this.addIncomeForm.bind(this))
        this.loadFromCookies();
        this.incomeData = []; // Initialize incomeData as an empty array
        this.incomeLabels = [];
        this.generateIncomeTable();
        // console.log(this.incomes)
        console.log('generateIncomeTable called');
        this.updateBudgetTotal();
        this.updateSavings();
        this.generateBudgetTable();
        this.generateBarChart();
        this.updateBudgetDoughnutChart(this.budgetCategories.map((entry) => entry.category), this.budgetCategories.map((entry) => entry.amount));
    }

    loadSampleData() {
        this.incomes = [
            { amount: 1000, source: 'sample: Job', date: new Date().toLocaleDateString(), },
            { amount: 200, source: 'sample: Freelance', date: new Date().toLocaleDateString(), }
            // Add more sample entries as needed
        ];
        this.income = 1200
    }

    loadSampleBudgetData() {
        this.budgetCategories = [
            { category: 'sample: Housing', amount: 800, date: new Date().toLocaleDateString(), },
            { category: 'sample: Food', amount: 300, date: new Date().toLocaleDateString(), },
        ];
        this.budget = 1100;
        // this.budget = this.budgetCategories.reduce((total, category) => total + category.amount, 0);
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
        const incomeFromCookie = this.getCookie('income');
        const sourcesFromCookie = this.getCookie('sources');
        const budgetFromCookie = this.getCookie('budget');
        if (incomeFromCookie) {
        this.income = parseFloat(incomeFromCookie);
        }
        if (sourcesFromCookie) {
            this.incomes = JSON.parse(sourcesFromCookie);
        }
        if (budgetFromCookie) {
        this.budget = parseFloat(budgetFromCookie);
        }
        this.updateSavings();
    }
    
      // Save income and budget to cookies
    saveToCookies() {
        this.setCookie("income", this.income, 7); 
        this.setCookie("sources", JSON.stringify(this.incomes.map((income) => income)), 7)
        this.setCookie("budget", this.budget, 7); 
    }

      // Method to update the savings property based on income and budget
    updateSavings() {
        this.savings = this.income - this.budget;
        document.getElementById('estimatedSavingsValue').textContent = '$' + this.savings.toFixed(2);
    }

    addIncome(amount, source) {
        // Create an object representing the income details
        const incomeDetails = {
            amount: parseFloat(amount),
            source: source,
            date: new Date().toLocaleDateString(),
        };
        // console.log(incomeDetails)
        this.income += parseFloat(amount)
        // Add the income details to the incomes array
        // this.incomeCategories.push(source)
        this.incomes.push(incomeDetails);
        if (this.incomes.length > 2) {
            this.clearSampleData();
        }
    }
    clearSampleData() {
        this.incomes = this.incomes.filter((income) => {
            return income.source !== 'sample: Job' && income.source !== 'sample: Freelance';
        });
        this.income = this.incomes.reduce((total, income) => total + income.amount, 0);
    }
    
    addIncomeForm(e){
        e.preventDefault();
        const newIncomeInput = document.getElementById("newIncomeInput").value;
        const newSourceInput = document.getElementById("newIncomeSource").value;
        const existingSource = document.getElementById("existingIncomeSource").value;
        const newSource = newSourceInput || existingSource

        if (newIncomeInput.trim() === '' || isNaN(parseFloat(newIncomeInput))) {
            alert('Please enter a valid income amount.');
            return;
        }
        if (newIncomeInput !== ''){
            this.addIncome(newIncomeInput, newSource);
            this.updateSavings();
            this.saveToCookies();
            this.generateIncomeTable();

        document.getElementById("newIncomeInput").value = '';
        document.getElementById("newIncomeSource").value = '';
        document.getElementById("existingIncomeSource").value = '';
        }
    }

    // getIncomeCategories() {
    //     const incomeCategories = this.getCookie("sources");
    //     return incomeCategories ? JSON.parse(incomeCategories) : [];
    // }
    deleteIncomeEntry(index) {
        const reversedIndex = this.incomes.length - 1 - index; // Calculate the reversed index
        if (reversedIndex >= 0 && reversedIndex < this.incomes.length) {
            const deletedIncome = this.incomes.splice(reversedIndex, 1)[0];
            this.income -= deletedIncome.amount;
            this.updateSavings();
            this.saveToCookies();
            this.generateIncomeTable();
            if (this.incomes.length === 0) {
                            this.loadSampleData();
                            this.generateIncomeTable()
                        }
        }
    }

    generateIncomeTable() {
        // console.log(this.incomes, "incomes");
        const tableBody = document.getElementById("incomeTableBody");
        tableBody.innerHTML = "";
        
        this.incomeData = []; 
        this.incomeLabels = [];
        if (this.incomes.length === 0) {
            this.loadSampleData();
        }
        const reversedIncomes = this.incomes.slice().reverse();
        reversedIncomes.forEach((income, index) => {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${income.date}</td>
            <td>${income.source}</td>
            <td>$${income.amount}</td>
            <td><button class="delete-btn" data-index="${index}">Delete</button></td>
        `;
        tableBody.appendChild(newRow);
        this.incomeData.push(income.amount);
        this.incomeLabels.push(income.source);
        });
        const deleteButtons = document.querySelectorAll(".delete-btn");
        deleteButtons.forEach((button) => {
            button.addEventListener("click", (e) => {
                const index = e.target.dataset.index;
                this.deleteIncomeEntry(index);
            });
        });

        this.updateDoughnutChart(this.incomeLabels, this.incomeData);
        this.updateBarChart(this.incomeLabels, this.incomeData)
    }

    updateDoughnutChart(labels, data) {
        const incomeChart = document.getElementById("incomeChart").getContext("2d");
        if (this.incomeChartInstance) {
            // If the chart already exists, destroy it first
            this.incomeChartInstance.destroy();
        }

        this.incomeChartInstance = new Chart(incomeChart, {
            type: "doughnut",
            data: {
                labels: labels,
                datasets: [
                    {
                        data: data,
                        backgroundColor: [
                            'rgb(255, 99, 132, 0.7)',
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
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Income Overview',
                        padding: {
                            top: 15,
                            bottom: 15,
                        },
                        font: {
                            size: 25,
                            weight: 'bold',
                        },
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                // console.log(context.parsed)
                                // console.log(context)
                                // console.log(value)
                                return label + ': $' + value;
                            },
                        },
                    },
                },
            },
        });
    }
    updateBarChart(labels, data) {
        const incomeBarChart = document.getElementById("incomeBarChart").getContext("2d");

        if (this.incomeBarChartInstance) {
            // If the chart already exists, destroy it first
            this.incomeBarChartInstance.destroy();
        }

        this.incomeBarChartInstance = new Chart(incomeBarChart, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Income Amount",
                        data: data,
                        backgroundColor: 'rgba(255, 99, 132, 0.6)',
                        borderColor: 'rgba(255, 99, 132, 1)',
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
            },
        });
    }

    loadBudgetCategoriesFromCookies() {
        const budgetCategoriesFromCookie = this.getCookie('budgetCategories');
        if (budgetCategoriesFromCookie) {
            this.budgetCategories = JSON.parse(budgetCategoriesFromCookie);
        } else{
            this.budgetCategories  = [
                { category: 'sample Housing', amount: 800, date: new Date().toLocaleDateString(), },
                { category: 'sample Food', amount: 300, date: new Date().toLocaleDateString(), },
            ];
        }
    }

    addBudgetEntry(category, amount) {
        // Create an object representing the budget entry
        const budgetEntry = {
            category: category,
            amount: parseFloat(amount),
            date: new Date().toLocaleDateString(),
        };
        // Add the budget entry to the budgetCategories array
        this.budgetCategories.push(budgetEntry);
        this.updateBudgetTotal();
        this.updateSavings();
        this.saveBudgetCategoriesToCookies();
        // Regenerate the budget table
        this.generateBudgetTable();
        this.generateBarChart();
        this.updateBudgetDoughnutChart(this.budgetCategories.map((entry) => entry.category), this.budgetCategories.map((entry) => entry.amount));
        // if (this.budgetCategories.length > 2) {
        //     this.clearSampleBudgetData();
        // }
    }
    // clearSampleBudgetData() {
    //     this.budgetCategories = this.budgetCategories.filter((category) => {
    //         return category.category !== 'sample Housing' && category.category !== 'sample Food' ;
    //     });
    //     this.budget = this.budgetCategories.reduce((total, category) => total + category.amount, 0);
    //     this.updateSavings();
    // }


    addBudgetForm(e) {
        e.preventDefault();
        const categoryInput = document.getElementById("budgetCategoryInput").value;
        const amountInput = document.getElementById("budgetAmountInput").value;
    
        if (categoryInput.trim() === '' || amountInput.trim() === '' || isNaN(parseFloat(amountInput))) {
        alert('Please enter a valid budget category and amount.');
        return;
        }
        this.addBudgetEntry(categoryInput, amountInput);
        this.generateBudgetTable();
        document.getElementById("budgetCategoryInput").value = ""
        document.getElementById("budgetAmountInput").value = ""
    }

    saveBudgetCategoriesToCookies() {
        this.setCookie('budgetCategories', JSON.stringify(this.budgetCategories), 7);
    }

    updateBudgetTotal() {
        const totalBudget = this.budgetCategories.reduce((total, entry) => total + parseFloat(entry.amount), 0);
        this.budget = totalBudget;
    }
    
    deleteBudgetEntry(index) {
        this.budgetCategories.splice(index, 1);
        this.updateBudgetTotal();
        this.updateSavings();
        this.saveBudgetCategoriesToCookies();
        this.generateBudgetTable();
        this.generateBarChart();
        this.updateBudgetDoughnutChart(this.budgetCategories.map((entry) => entry.category), this.budgetCategories.map((entry) => entry.amount));
    }
    
    
    generateBudgetTable() {
        const tableBody = document.getElementById("incomeBudgetTableBody");
        tableBody.innerHTML = "";
    
        this.budgetCategories.forEach((entry, index) => {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${entry.date}</td>
            <td>${entry.category}</td>
            <td>$${entry.amount}</td>
            <td><button class="delete-btn" data-index="${index}">Delete</button></td>
        `;
        tableBody.appendChild(newRow);
        });
        const deleteButtons = document.querySelectorAll(".delete-btn");
        deleteButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            const index = e.target.dataset.index;
            this.deleteBudgetEntry(index);
        });
        });
        document.getElementById('incomeBudgetValue').textContent = '$' + this.budget.toFixed(2);
    }
    
    generateBarChart() {
        const incomeVsBudgetChart = document.getElementById("incomeVsBudgetChart").getContext("2d");

        if (this.incomeVsBudgetChartInstance) {
            // If the chart already exists, destroy it first
            this.incomeVsBudgetChartInstance.destroy();
        }

        this.incomeVsBudgetChartInstance = new Chart(incomeVsBudgetChart, {
            type: "bar",
            data: {
                labels: ["Income", "Budget", "Savings"],
                datasets: [
                    {
                        label: "Amount",
                        data: [this.income, this.budget, this.savings],
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
                        text: "Income vs. Budget vs. Savings",
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

    updateBudgetDoughnutChart(labels, data) {
        const budgetDoughnutChart = document.getElementById("budgetDoughnutChart").getContext("2d");

        if (this.budgetDoughnutChartInstance) {
            // If the chart already exists, destroy it first
            this.budgetDoughnutChartInstance.destroy();
        }

        this.budgetDoughnutChartInstance = new Chart(budgetDoughnutChart, {
            type: "doughnut",
            data: {
                labels: labels,
                datasets: [
                    {
                        data: data,
                        backgroundColor: [
                            'rgb(255, 99, 132, 0.7)',
                            'rgb(255, 159, 64, 0.7)',
                            'rgb(255, 205, 86, 0.8)',
                            'rgb(75, 192, 192, 0.7)',
                            'rgb(54, 162, 235, 0.7)',
                            'rgb(1, 142, 203, 0.7)',
                            'rgb(106, 144, 204, 0.7)',
                            'rgb(1, 142, 203, 0.7)',
                            'rgb(102, 55, 221, 0.7)',
                        ],
                    },
                ],
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Budget Overview',
                        padding: {
                            top: 15,
                            bottom: 15,
                        },
                        font: {
                            size: 25,
                            weight: 'bold',
                            color: 'black',
                        },
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
        });
        }
    
    
    initiate() {
        //document.getElementById('incomeValue').textContent = this.income;
        document.getElementById("budgetAddForm").addEventListener("submit", this.addBudgetForm.bind(this));
        this.loadBudgetCategoriesFromCookies();
        this.updateBudgetTotal();
        // this.generateBudgetTable();
        // this.generateIncomeTable();
    }
    
}

const incomeObj = new Income()
export default incomeObj;
