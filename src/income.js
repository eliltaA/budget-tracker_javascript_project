import Chart from 'chart.js/auto';

class Income {
    constructor(){
        this.income = 0;
        this.incomes = [];
        this.budget = "";
        this.savings = this.income - this.budget;
        this.incomeCategories = this.getIncomeCategories();
        this.budgetCategories = "";
        this.incomeAddForm = document.getElementById("incomeAddForm")
        this.incomeAddForm.addEventListener("submit", this.addIncomeForm.bind(this))
        this.loadFromCookies();
        this.incomeData = []; // Initialize incomeData as an empty array
        this.incomeLabels = [];
        this.generateIncomeTable();
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
            this.incomes = JSON.parse(sourcesFromCookie).map(source => ({ source: source }));
        }
        if (budgetFromCookie) {
          this.budget = parseFloat(budgetFromCookie);
        }
        this.updateSavings();
    }
    
      // Save income and budget to cookies
    saveToCookies() {
        this.setCookie('income', this.income, 7); 
        this.setCookie("sources", JSON.stringify(this.incomes.map((income) => income.source)), 7)
        this.setCookie('budget', this.budget, 7); 
    }

      // Method to update the savings property based on income and budget
    updateSavings() {
        this.savings = this.income - this.budget;
    }

    addIncome(amount, source) {
        // Create an object representing the income details
        const incomeDetails = {
          amount: parseFloat(amount),
          source: source,
        };
        this.income += parseFloat(amount)
        // Add the income details to the incomes array
        // this.incomeCategories.push(source)
        this.incomes.push(incomeDetails);
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
        }
        //  location.reload();
    }

    getIncomeCategories() {
        const incomeCategories = this.getCookie("sources");
        return incomeCategories ? JSON.parse(incomeCategories) : [];
    }

    generateIncomeTable() {
        const tableBody = document.getElementById("incomeTableBody");
        tableBody.innerHTML = "";
        
        this.incomeData = []; // Clear the incomeData array
        this.incomeLabels = [];
        console.log(this.incomes);
        this.incomes.forEach((income) => {
          const newRow = document.createElement("tr");
          newRow.innerHTML = `
            <td>${income.source}</td>
            <td>$${income.amount}</td>
          `;
          tableBody.appendChild(newRow);
          this.incomeData.push(income.amount);
          this.incomeLabels.push(income.source);
        });
        this.updateDoughnutChart(this.incomeLabels, this.incomeData);
        this.updateBarChart(this.incomeLabels, this.incomeData)
      }
    
      // Add this function to your class to call it when you add a new income
    updateIncomeTable() {
        this.generateIncomeTable();
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
                            'rgb(255, 99, 132)',
                            'rgb(255, 159, 64)',
                            'rgb(255, 205, 86)',
                            'rgb(75, 192, 192)',
                            'rgb(54, 162, 235)',
                            'rgb(1, 142, 203)',
                            'rgb(106, 144, 204)',
                            'rgb(1, 142, 203)',
                            'rgb(102, 55, 221)',
                        ],
                    },
                ],
            },
            options: {
                // Add any custom options for the chart here
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
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
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
}

const incomeObj = new Income()

export default incomeObj;
