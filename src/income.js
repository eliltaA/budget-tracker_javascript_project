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
    
        if (newIncomeInput !== ''){
            this.addIncome(newIncomeInput, newSource);
            this.updateSavings();
            this.saveToCookies();
        }
        // location.reload();
    }

    getIncomeCategories() {
        const incomeCategories = this.getCookie("sources");
        return incomeCategories ? JSON.parse(incomeCategories) : [];
      }
}

const incomeObj = new Income()

export default incomeObj;