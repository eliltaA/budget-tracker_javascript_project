import incomeObj from './income.js';
import expenseObj from './expense.js';


class Tracker {
  constructor() {
    this.incomeObj = incomeObj;
    this.expenseObj = expenseObj;
    this.incomeBtn = document.getElementById('incomeBtn');
    this.budgetBtn = document.getElementById('budgetBtn')
    this.expenseBtn = document.getElementById('expenseBtn');
    this.summaryBtn = document.getElementById('summaryBtn');
    // this.incomeDiv = document.querySelector('.income-container');
    this.incomeDiv = document.querySelectorAll('.income-container-item');
    // this.budgetDiv = document.querySelector('.budget-container');
    this.budgetDiv = document.querySelectorAll('.budget-container-item');
    // this.budgetContainer = document.getElementById('budgetContainer');
    // this.expenseDiv = document.querySelector('.expense-container');
    this.expenseDiv = document.querySelectorAll('.expense-container-item');
    this.summaryDiv = document.querySelector('.summary-container');
    this.tabDivs = [...this.incomeDiv, ...this.budgetDiv, ...this.expenseDiv, this.summaryDiv];
    this.tabBtns = [this.incomeBtn, this.budgetBtn, this.expenseBtn, this.summaryBtn];

    //event handlers
    this.incomeBtn.addEventListener('click', this.showTab.bind(this));
    this.budgetBtn.addEventListener('click', this.showTab.bind(this));
    this.expenseBtn.addEventListener('click', this.showTab.bind(this));
    this.summaryBtn.addEventListener('click', this.showTab.bind(this));
    this.displayChartsInSummary()
  }
  showTab(e) {
    const clickedTab = e.target.id;
    // const container = clickedTab.split('Btn')[0];
    const containerName = `${clickedTab.split('Btn')[0]}-container-item`;
    // console.log(containerName)
    this.tabDivs.forEach(div => {
      div.classList.remove("summary")
      if (div.classList.contains(containerName)){
      // console.log(div.classList)
        return div.classList.remove('hidden');
      }else{
      div.classList.add('hidden');
  }});

    if (e.target === this.summaryBtn){
      this.displayChartsInSummary()
    };
  
    this.tabBtns.forEach(btn => {
      if (btn.id === e.target.id) return btn.classList.add('active-tab');
      btn.classList.remove('active-tab');
    });
  }
  
    displayChartsInSummary() {
      const summaryContainer = document.querySelector(".summary-container");
      // summaryContainer.innerHTML = "";
  
      const incomeChartCanvas = document.getElementById("incomeChart");
      incomeChartCanvas.classList.remove("hidden")
      incomeChartCanvas.classList.add("summary")

      const expenseChartCanvas = document.getElementById("expenseDoughnutChart");
      expenseChartCanvas.classList.remove("hidden")
      expenseChartCanvas.classList.add("summary")

      const budgetChartCanvas = document.getElementById("incomeVsBudgetChart");
      budgetChartCanvas.classList.remove("hidden")
      budgetChartCanvas.classList.add("summary")

      const expenseBarCanvas = document.getElementById("expenseBarChart");
      expenseBarCanvas.classList.remove("hidden")
      expenseBarCanvas.classList.add("summary")
    }

  //   initiate() {
  //   console.log('initiating main tracker');
  //   Promise.all([this.incomeObj.initiate(), this.expenseObj.initiate()])
  //     .then(() => {
  //       // Once both data are loaded, display the charts in the summary container
  //       this.displayChartsInSummary();
  //     })
  //     .catch((error) => {
  //       console.error('Error loading data:', error);
  //     });
  // }
  
  initiate() {
    this.incomeObj.initiate();
    this.expenseObj.initiate();
  }
}

const tracker = new Tracker();
tracker.initiate();
// tracker.displayChartsInSummary();
