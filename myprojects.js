var userprojectsData;
var dashVerticalchartData;
var EprofitChart,Ebillablechart;
function fetchcurrentuserprojects(){
    setDefaultMonths();
    let currentUserDetails = localStorage.getItem('userDetail');
    // console.log(currentUserDetails);
    let usermail = JSON.parse(currentUserDetails);
    // console.log(usermail.email);
    let fetchUrl = 'https://projection-calc-function.onrender.com/api/get-user-projects/'+usermail.email;
    // let fetchUrl ='http://localhost:3002/api/get-user-projects/'+usermail.email;
    // Make the API call to your Node.js backend
    // fetch('https://projection-calc-function.onrender.com/.......', { 
    fetch(fetchUrl,{
        method: 'GET',
    })
    .then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`); 
    }
    return response.json(); 
    })
    .then(data => {
    // console.log('API Response:', data);
    userprojectsData = data;
    populateProjsdash(data);
    renderKanbanBoard();
    updateCharts();
    // updateDashboardCards(data);
    })
    .catch(error => {
    console.error('API call failed:', error);
    populateProjsdash([]);
    // updateDashboardCards([]);
    });

    let fetchUrl2 = 'https://projection-calc-function.onrender.com/api/get-tokens-count/'+usermail.email;
    // let fetchUrl2 = 'http://localhost:3002/api/get-tokens-count/'+usermail.email;
    fetch(fetchUrl2,{
    method: 'GET',
    })
    .then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`); 
    }
    return response.json();
    })
    .then(data => {
    if(data.message == "Success"){
        document.getElementById('token-count').innerHTML = (data.creditcount || 0) + " Left";
        document.getElementsByClassName('tokens-remian')[0].style.display = "block flex";
    }
    else{
        document.getElementsByClassName('tokens-remian')[0].style.display = "none";
    }
    })
    .catch(error => {
    console.error('API call failed:', error);
    });
    let storedUserDetail = localStorage.getItem('userDetail');
  let values =  storedUserDetail ? JSON.parse(storedUserDetail) : null;
  if(values != null){
    // console.log("no user available");
    let signupbtnele = document.getElementById('signup-btn');
    let dropdown = document.getElementById('dropdownList');
    signupbtnele.classList.remove('signup-btn');
    signupbtnele.classList.add('signup-profile');
    signupbtnele.innerHTML = values.username.at(0);
    // signupbtnele.addEventListener('mouseover',()=>{
    //   dropdown.style.display = 'block';
    // })
    // signupbtnele.addEventListener('mouseout',()=>{
    //   dropdown.style.display = 'none';
    // })
    // dropdown.addEventListener('mouseover',()=>{
    //   dropdown.style.display = 'block';
    // })
    // dropdown.addEventListener('mouseout',()=>{
    //   dropdown.style.display = 'none';
    // })}
    let mouseOverButton = false;
    let mouseOverDropdown = false;
    let hideTimeout;

    signupbtnele.addEventListener('mouseover', () => {
      mouseOverButton = true;
      clearTimeout(hideTimeout);
      dropdown.style.display = 'block';
    });

    signupbtnele.addEventListener('mouseout', () => {
      mouseOverButton = false;
      hideTimeout = setTimeout(() => {
        if (!mouseOverButton && !mouseOverDropdown) {
          dropdown.style.display = 'none';
        }
      }, 200);
    });

    dropdown.addEventListener('mouseover', () => {
      mouseOverDropdown = true;
      clearTimeout(hideTimeout);
      dropdown.style.display = 'block';
    });

    dropdown.addEventListener('mouseout', () => {
      mouseOverDropdown = false;
      hideTimeout = setTimeout(() => {
        if (!mouseOverButton && !mouseOverDropdown) {
          dropdown.style.display = 'none';
        }
      }, 200);
    });
    }
}

// kanban view - functions
const KANBAN_COLUMNS = ['Scoping', 'Proposed', 'Negotiation', 'Approved', 'Rejected', 'Cancelled'];
const kanbanBoard = document.querySelector('.kanban-board');
let draggedCard = null;

// --- Helper function to format dates ---
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
}

function renderKanbanBoard() {
  kanbanBoard.innerHTML = ''; // Clear existing board

  KANBAN_COLUMNS.forEach(status => {
      const columnDiv = document.createElement('div');
      columnDiv.classList.add('kanban-column');
      columnDiv.dataset.status = status; // Store status in data attribute

      const titleDiv = document.createElement('div');
      titleDiv.classList.add('column-title');
      titleDiv.textContent = `${status} (${userprojectsData.filter(p => p.projectDetails.projectStatus === status && KANBAN_COLUMNS.includes(p.projectDetails.projectStatus)).length})`;

      const cardsDiv = document.createElement('div');
      cardsDiv.classList.add('project-cards');
      cardsDiv.dataset.statusTarget = status; // For drop identification

      columnDiv.appendChild(titleDiv);
      columnDiv.appendChild(cardsDiv);
      kanbanBoard.appendChild(columnDiv);

      // Add drag and drop listeners to the card container div
      cardsDiv.addEventListener('dragover', dragOver);
      cardsDiv.addEventListener('dragenter', dragEnter);
      cardsDiv.addEventListener('dragleave', dragLeave);
      cardsDiv.addEventListener('drop', drop);
      columnDiv.addEventListener('drop', dropOnColumn); // Allow dropping on column too
  });

  populateCards();
}

// --- Populate Cards ---
function populateCards() {
  userprojectsData.forEach((project, index) => {
      if (!project.projectDetails || !KANBAN_COLUMNS.includes(project.projectDetails.projectStatus)) {
          return; // Skip if status is not one of the 4 or data is malformed
      }

      const status = project.projectDetails.projectStatus;
      const columnCardsDiv = kanbanBoard.querySelector(`.kanban-column[data-status="${status}"] .project-cards`);

      if (columnCardsDiv) {
          const card = document.createElement('div');
          card.classList.add('project-card');
          card.draggable = true;
          card.dataset.projectId = project._id; // Store project's main _id
          card.dataset.index = index; // Store original index if needed

          const projectTitle = project.projectDetails.projectTitle || 'N/A';
          const projectDescription = project.projectDetails.projectDescription || 'No description available.';
          const startDate = formatDate(project.projectDetails.projectinput?.startDate);
          const projectedEndDate = formatDate(project.projectDetails.projectoutput?.projectedEndDate);
          const mainRevenue = project.projectDetails.projectoutput?.mainRevenue !== undefined
                              ? parseFloat(project.projectDetails.projectoutput.mainRevenue).toFixed(2)
                              : 'N/A';
          const projectedDuration = project.projectDetails.projectoutput?.projectedDuration !== undefined
                                    ? `${project.projectDetails.projectoutput.projectedDuration} days`
                                    : 'N/A';

          card.innerHTML = `
              <div class="card-header">
                  <div class="project-title">${projectTitle}</div>
                  <div class="project-amount">$${mainRevenue}</div>
              </div>
              <div class="project-description">${projectDescription}</div>
              <div class="project-dates">
                  <div class="start-date">
                      <span class="date-label">Starts:</span> ${startDate}
                  </div>
                  <div class="end-date-duration">
                      <span class="date-label">Ends:</span> ${projectedEndDate}<br>
                      (${projectedDuration})
                  </div>
              </div>
          `;

          // Add click event listener
          card.addEventListener('click', () => {
              const projid = `project-${project._id}`; // Unique ID for the DOM element if needed
              const ptitle = project.projectDetails.projectTitle;
              const pdescp = project.projectDetails.projectDescription;
              displayProjectDetails(projid, ptitle, pdescp);
          });

          // Add drag event listeners
          card.addEventListener('dragstart', dragStart);
          card.addEventListener('dragend', dragEnd);

          columnCardsDiv.appendChild(card);
      }
  });
}

// --- Drag and Drop Event Handlers ---
function dragStart(event) {
  draggedCard = event.target;
  event.dataTransfer.setData('text/plain', event.target.dataset.projectId);
  setTimeout(() => {
      event.target.classList.add('dragging');
  }, 0);
  // console.log("Drag Start:", event.target.dataset.projectId);
}

function dragEnd(event) {
  event.target.classList.remove('dragging');
  draggedCard = null;
  // console.log("Drag End");
}

function dragOver(event) {
  event.preventDefault(); // Necessary to allow drop
}

function dragEnter(event) {
  event.preventDefault();
  if (event.target.classList.contains('project-cards') || event.target.closest('.project-cards')) {
     const targetCardsContainer = event.target.closest('.project-cards') || event.target;
     let computedStyles = window.getComputedStyle(targetCardsContainer);
     let targetBorderColor = computedStyles.borderColor;
     targetCardsContainer.style.border = '2px dashed ' + targetBorderColor;
     targetCardsContainer.style.padding = '10px';
  }
}

function dragLeave(event) {
  if (event.target.classList.contains('project-cards') || event.target.closest('.project-cards')) {
      const targetCardsContainer = event.target.closest('.project-cards') || event.target;
      targetCardsContainer.style.border = '';
      targetCardsContainer.style.padding = '';
  }
}

function drop(event) {
  event.preventDefault();
  const targetCardsContainer = event.target.closest('.project-cards');
  if (targetCardsContainer && draggedCard) {
      targetCardsContainer.style.border = ''; 
      targetCardsContainer.style.padding = '';
      const targetStatus = targetCardsContainer.dataset.statusTarget;
      handleDrop(targetStatus, targetCardsContainer);
  }
}
function dropOnColumn(event) {
  event.preventDefault();
  const columnDiv = event.target.closest('.kanban-column');
  if (columnDiv && draggedCard) {
      const targetStatus = columnDiv.dataset.status;
      const targetCardsContainer = columnDiv.querySelector('.project-cards');
      handleDrop(targetStatus, targetCardsContainer);
  }
}


function handleDrop(targetStatus, targetCardsContainer) {
  const projectId = draggedCard.dataset.projectId;
  const project = userprojectsData.find(p => p._id === projectId);

  if (project) {
      const oldStatus = project.projectDetails.projectStatus;
      if (oldStatus !== targetStatus) {
          // Call your update function
          updateprojectstaus(
              project._id,
              project.userDetails.email,
              project.projectDetails.projectTitle,
              targetStatus
          );
          // The updateprojectstaus function now handles local data update and re-render.
          // If it didn't, you would manually move the card in the DOM here:
          // targetCardsContainer.appendChild(draggedCard);
          // And then update the local array and re-render titles or counts.
      } else {
           // If dropped in the same column, just append it back if it was visually moved
          targetCardsContainer.appendChild(draggedCard);
          console.log("Card dropped in the same column.");
      }
  }
  draggedCard = null; // Reset dragged card
}


// two charts generation codes
const departmentColors = {
    Engineer: '#23459E',   // blue
    Design: '#4F793F',     // green
    Marketing: '#D24D57',  // red
    Product: '#F1C40F',    // yellow
    Others: '#8E44AD'      // purple
  };
  
  function setDefaultMonths() {
    const startInput = document.getElementById('startMonth');
    const endInput = document.getElementById('endMonth');
  
    const now = new Date();
    const getMonthString = (offset) => {
      const date = new Date(now.getFullYear(), now.getMonth() + offset, 1);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    };
  
    startInput.value = getMonthString(-2); // 2 months ago
    endInput.value = getMonthString(2);    // 2 months ahead
  }
  
  function getWorkingDaysInMonth(year, month) {
    let count = 0;
    const date = new Date(year, month, 1);
    while (date.getMonth() === month) {
      const day = date.getDay();
      if (day !== 0 && day !== 6) count++;
      date.setDate(date.getDate() + 1);
    }
    return count;
  }
  
  function getMonthKey(date) {
    return date.toLocaleString('default', { month: 'short', year: 'numeric' });
  }
  
  function calculateMonthlyFinancials(data, startMonthStr, endMonthStr) {
    const startDate = new Date(`${startMonthStr}-01`);
    const endDate = new Date(new Date(`${endMonthStr}-01`).getFullYear(), new Date(`${endMonthStr}-01`).getMonth() + 1, 0);
  
    const resultMap = {};
  
    // Step 1: Generate all months in range with default 0s
    const iter = new Date(startDate);
    iter.setDate(1);
  
    while (iter <= endDate) {
      const key = getMonthKey(iter);
      resultMap[key] = { revenue: 0, teamCost: 0, profit: 0 };
      iter.setMonth(iter.getMonth() + 1);
    }
  
    // Step 2: Calculate project contributions
    for (const project of data) {
      const input = project.projectDetails.projectinput;
      const output = project.projectDetails.projectoutput;
  
      const projStart = new Date(input.startDate);
      const projEnd = new Date(output.projectedEndDate);
  
      const actualStart = projStart > startDate ? projStart : startDate;
      const actualEnd = projEnd < endDate ? projEnd : endDate;
      if (actualStart > actualEnd) continue;
  
      let totalWorkingDays = 0;
      const monthWiseDays = {};
  
      const projectIter = new Date(actualStart);
      projectIter.setDate(1);
  
      while (projectIter <= actualEnd) {
        const month = projectIter.getMonth();
        const year = projectIter.getFullYear();
        const key = getMonthKey(projectIter);
        const days = getWorkingDaysInMonth(year, month);
        monthWiseDays[key] = days;
        totalWorkingDays += days;
        projectIter.setMonth(projectIter.getMonth() + 1);
      }
  
      for (const [monthKey, days] of Object.entries(monthWiseDays)) {
        const share = days / totalWorkingDays;
  
        if (!resultMap[monthKey]) {
          resultMap[monthKey] = { revenue: 0, teamCost: 0, profit: 0 };
        }
  
        const revenueShare = output.mainRevenue * share;
        const teamCostShare = output.teamCosts * share;
        const profitShare = revenueShare - teamCostShare;
  
        resultMap[monthKey].revenue += revenueShare;
        resultMap[monthKey].teamCost += teamCostShare;
        resultMap[monthKey].profit += profitShare;
      }
    }
  
    const sortedMonths = Object.keys(resultMap).sort((a, b) => {
      const [ma, ya] = a.split(' ');
      const [mb, yb] = b.split(' ');
      return new Date(`${ya}-${ma}-01`) - new Date(`${yb}-${mb}-01`);
    });
  
    return {
      labels: sortedMonths,
      datasets: [
        {
          label: 'Revenue',
          data: sortedMonths.map(m => Math.round(resultMap[m].revenue)),
          backgroundColor: '#23459E'
        },
        {
          label: 'Team Costs',
          data: sortedMonths.map(m => Math.round(resultMap[m].teamCost)),
          backgroundColor: '#D24D57'
        },
        {
          label: 'Profit',
          data: sortedMonths.map(m => Math.round(resultMap[m].profit)),
          backgroundColor: '#4F793F'
        }
      ]
    };
  }
  
  
  function calculateEffortDistribution(data, startMonthStr, endMonthStr) {
    const startDate = new Date(`${startMonthStr}-01`);
    const endDate = new Date(new Date(`${endMonthStr}-01`).getFullYear(), new Date(`${endMonthStr}-01`).getMonth() + 1, 0);
  
    const deptEfforts = {
      Engineer: 0,
      Design: 0,
      Product: 0,
      Marketing: 0,
      Others: 0
    };
  
    for (const project of data) {
      const input = project.projectDetails.projectinput;
      const teamMembers = input.teamMembers;
      const workWeekDays = parseInt(input.workWeekDays);
  
      const projectStart = new Date(input.startDate);
      const projectEnd = new Date(project.projectDetails.projectoutput.projectedEndDate);
  
      const actualStart = projectStart > startDate ? projectStart : startDate;
      const actualEnd = projectEnd < endDate ? projectEnd : endDate;
  
      if (actualStart > actualEnd) continue;
  
      const workingDays = [];
      const tempDate = new Date(actualStart);
      while (tempDate <= actualEnd) {
        const day = tempDate.getDay();
        if (
          (workWeekDays === 5 && day >= 1 && day <= 5) || // Mon-Fri
          (workWeekDays === 6 && day >= 1 && day <= 6)    // Mon-Sat
        ) {
          workingDays.push(new Date(tempDate));
        }
        tempDate.setDate(tempDate.getDate() + 1);
      }
  
      const totalWorkingDays = workingDays.length;
  
      for (const member of teamMembers) {
        const dept = deptEfforts.hasOwnProperty(member.department) ? member.department : 'Others';
        const memberEffort = totalWorkingDays * member.hours_day;
        deptEfforts[dept] += memberEffort;
      }
    }
  
    return {
    //   labels: Object.keys(deptEfforts),
      datasets: [
        {
          data: Object.values(deptEfforts),
          backgroundColor: Object.keys(deptEfforts).map(dept => departmentColors[dept])
        }
      ]
    };
  }
  
  
  let myChart;
  let effortChart;
  
  function generateChart(Sampledata) {
    const startMonth = document.getElementById('startMonth').value;
    const endMonth = document.getElementById('endMonth').value;
    if (!startMonth || !endMonth) return;
  
    const chartData = calculateMonthlyFinancials(Sampledata, startMonth, endMonth);
    const ctx = document.getElementById('financeChart').getContext('2d');
    if (myChart) myChart.destroy();
    myChart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom',
              labels:{
                  usePointStyle: true,
                  pointStyle: 'rect',
                  boxWidth:16,
                  boxHeight:16,
                  font: {weight:400,size: 20},
                  padding: 30
              }
             },
            title: { display: true, text: 'Monthly Revenue, Costs, and Profit'}
          },
          scales: {
            y: {
                beginAtZero: true,
                ticks: {
                  callback: function (value) {
                    return (value / 1000) + 'K';
                  }
                }
              }
          }
        }
      });
  }
  
  function generateEffortChart(projectData) {
    const startMonth = document.getElementById('startMonth').value;
    const endMonth = document.getElementById('endMonth').value;
    if (!startMonth || !endMonth) return;
    const chartData = calculateEffortDistribution(projectData, startMonth, endMonth);
    const ctx = document.getElementById('effortChart').getContext('2d');
    if (effortChart) effortChart.destroy();
    effortChart = new Chart(ctx, {
        type: 'pie',
        data: chartData,
        options: {
          responsive: true,
          plugins: {
                tooltip: {enabled: false},
                legend: {onHover: null}
            },
          hover: {mode: null}
        }
      });
      
  }
  
  function updateCharts() {
    generateChart(userprojectsData);
    generateEffortChart(userprojectsData);
  }

// project updates functions
function updateDashboardCards(data) {
    if(data.length > 0){
        const totalProjectsElement = document.getElementById('total-projects');
        const averageDurationElement = document.getElementById('average-duration');
        const averageRevenueElement = document.getElementById('average-revenue');
        const totalForecastElement = document.getElementById('total-forecast');
        const totalHoursElement = document.getElementById('total-hours');
        const totalProjects = data.length;
        const totalDuration = data.reduce((sum, project) => sum + project.projectDetails.projectoutput.projectedDuration, 0);
        const averageDuration = totalDuration / totalProjects || 0;
        const totalMainRevenue = data.reduce((sum, project) => sum + project.projectDetails.projectoutput.mainRevenue, 0);
        const averageRevenue = totalMainRevenue / totalProjects || 0;
        const totalForecast = data.reduce((sum, project) => sum + project.projectDetails.projectoutput.revenueBreakdown.totalRevenue, 0);
        const totalHours = data.reduce((sum, project) => sum + project.projectDetails.projectinput.totalProjectHours, 0);
        totalProjectsElement.textContent = totalProjects;
        averageDurationElement.textContent = averageDuration.toFixed(2);
        averageRevenueElement.textContent = `$${averageRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
        totalForecastElement.textContent = `$${totalForecast.toLocaleString('en-IN')}`;
        totalHoursElement.textContent = totalHours;
        document.getElementById('fivecard-title').style.display = "block";
        document.getElementById("dashboard-cards").style.display = "flex";
    }
}

function populateProjsdash(projectData) {
    const projectListBody = document.getElementById('projectlistbody');
    projectListBody.innerHTML = ''; // Clear any existing rows
    const statusOptions = ['Scoping', 'Proposed', 'Negotiation', 'Approved', 'Rejected', 'Cancelled'];
    if (projectData && projectData.length > 0) {
        projectData.forEach((project, index) => {
          // if(project.projectDetails.projectStatus == "Rejected" || project.projectDetails.projectStatus == "Cancelled"){
            const row = projectListBody.insertRow();
            row.id = `project-${index}`;
            row.classList.add('project-row');

            // 1. Project Name with "Open" button
            let ptitle = project.projectDetails.projectTitle;
            let pdescp = project.projectDetails.projectDescription;
            const projectNameCell = row.insertCell();
            projectNameCell.classList.add('project-name-cell');
            const projectNameSpan = document.createElement('span');
            projectNameSpan.textContent = project.projectDetails.projectTitle;
            const openButton = document.createElement('button');
            openButton.classList.add('open-button');
            openButton.style.display = "none";
            openButton.innerHTML = '<span class="open-icon"><i class="bx bx-arrow-from-left"></i></span> View';
            // Add event listener for redirection
            openButton.addEventListener('click', function() {
                displayProjectDetails(row.id,ptitle,pdescp);
            });
            projectNameCell.appendChild(projectNameSpan);
            projectNameCell.appendChild(openButton); 

            // 2. Status Dropdown
            const statusCell = row.insertCell(); // Insert at the beginning
            statusCell.classList.add('status-cell');
            const statusDropdown = document.createElement('select');
            statusDropdown.classList.add('status-dropdown');
            statusOptions.forEach(optionValue => {
                const option = document.createElement('option');
                option.value = optionValue;
                option.textContent = optionValue;
                if (project.projectDetails.projectStatus === optionValue || (!project.projectDetails.projectStatus && optionValue === 'Scoping')) {
                    option.selected = true;
                }
                statusDropdown.appendChild(option);
            });
            statusDropdown.addEventListener('change', function() {
                const newStatus = this.value;
                updateprojectstaus(project._id,project.userDetails.email,project.projectDetails.projectTitle,newStatus);
            });
            statusCell.appendChild(statusDropdown);

            // 3. Start Date
            const startDateCell = row.insertCell();
            startDateCell.classList.add('start-date-cell');
            const startDate = new Date(project.projectDetails.projectinput.startDate);
            startDateCell.textContent = startDate.toLocaleDateString('en-GB');

            // 4. Predicted End Date
            const predictedEndDateCell = row.insertCell();
            predictedEndDateCell.classList.add('predicted-end-date-cell');
            const predictedEndDate = new Date(project.projectDetails.projectoutput.projectedEndDate);
            predictedEndDateCell.textContent = predictedEndDate.toLocaleDateString('en-GB');

            // 5. Revenue
            const revenueCell = row.insertCell();
            revenueCell.classList.add('revenue-cell');
            revenueCell.textContent = `$${project.projectDetails.projectoutput.mainRevenue.toFixed(2)}`;

            // 6. Duration
            const durationCell = row.insertCell();
            durationCell.classList.add('duration-cell');
            durationCell.textContent = `${project.projectDetails.projectoutput.projectedDuration} days`;

            // hover effect to visible/invisible view button
            row.addEventListener('mouseover', function() {
                openButton.style.display = "block"; 
            });
            row.addEventListener('mouseout', function() {
                openButton.style.display = "none";
            });
          // }
        });
    } else {
        // Optionally display a message if there are no projects
        const row = projectListBody.insertRow();
        const noProjectsCell = row.insertCell();
        noProjectsCell.colSpan = 5; // Span across all columns
        noProjectsCell.textContent = 'No saved projects found.';
        noProjectsCell.classList.add('no-projects-cell');
    }
}
// fetchcurrentuserprojects();



let Sampledata=[
    {
        "userDetails": {
            "fullname": "syedsalahudidn",
            "email": "salahuddinksyed.12@gmail.com",
            "password": "Samplesamp"
        },
        "projectDetails": {
            "projectTitle": "project Hello",
            "projectDescription": "this is my merry project",
            "projectinput": {
                "startDate": "2025-04-11T00:00:00.000Z",
                "workHours": 8,
                "totalProjectHours": 120,
                "profitTarget": 25,
                "teamMemberCount": 2,
                "workWeekDays": "5",
                "teamMembers": [
                    {
                        "id": "memb1",
                        "name": "john",
                        "role": "TL",
                        "department": "Engineer",
                        "hours_day": 4,
                        "cost_rate": 40,
                        "billable_rate": 40,
                        "billable_ratio": 100,
                        "_id": "67f791055bd1f337f6659d3e"
                    },
                    {
                        "id": "memb2",
                        "name": "wick",
                        "role": "HL",
                        "department": "Engineer",
                        "hours_day": 4,
                        "cost_rate": 40,
                        "billable_rate": 60,
                        "billable_ratio": 90,
                        "_id": "67f791055bd1f337f6659d3f"
                    }
                ],
                "_id": "67f791055bd1f337f6659d3d"
            },
            "projectoutput": {
                "teamCostBreakdown": {
                    "memberCostBreakdown": [
                        {
                            "id": "memb1",
                            "name": "john",
                            "role": "TL",
                            "cost_rate": 40,
                            "total_hours": 60,
                            "member_cost": 2400,
                            "_id": "67f791055bd1f337f6659d41"
                        },
                        {
                            "id": "memb2",
                            "name": "wick",
                            "role": "HL",
                            "cost_rate": 40,
                            "total_hours": 60,
                            "member_cost": 2400,
                            "_id": "67f791055bd1f337f6659d42"
                        }
                    ],
                    "totalCosts": 4800
                },
                "revenueBreakdown": {
                    "memberRevenueBreakdown": [
                        {
                            "id": "memb1",
                            "name": "john",
                            "role": "TL",
                            "billable_rate": 40,
                            "billable_ratio": 100,
                            "billable_hours": 60,
                            "revenue": 2400,
                            "_id": "67f791055bd1f337f6659d43"
                        },
                        {
                            "id": "memb2",
                            "name": "wick",
                            "role": "HL",
                            "billable_rate": 60,
                            "billable_ratio": 90,
                            "billable_hours": 54,
                            "revenue": 3240,
                            "_id": "67f791055bd1f337f6659d44"
                        }
                    ],
                    "totalRevenue": 5640
                },
                "teamDailyCapacity": 8,
                "projectedDuration": 15,
                "projectedEndDate": "2025-05-01T00:00:00.000Z",
                "averageBillableRatio": 95,
                "teamCosts": 4800,
                "mainRevenue": 6400,
                "profitLoss": 1600,
                "profitMargin": 25,
                "_id": "67f791055bd1f337f6659d40"
            },
            "projectStatus": "Proposed"
        },
        "_id": "67f791055bd1f337f6659d3c",
        "__v": 0
    },
    {
        "userDetails": {
            "fullname": "syedsalahudidn",
            "email": "salahuddinksyed.12@gmail.com",
            "password": "Samplesamp"
        },
        "projectDetails": {
            "projectTitle": "project santionz",
            "projectDescription": "this is the initial project",
            "projectinput": {
                "startDate": "2025-04-11T00:00:00.000Z",
                "workHours": 8,
                "totalProjectHours": 140,
                "profitTarget": 35,
                "teamMemberCount": 2,
                "workWeekDays": "6",
                "teamMembers": [
                    {
                        "id": "memb1",
                        "name": "Donald",
                        "role": "manager",
                        "department": "Design",
                        "hours_day": 6,
                        "cost_rate": 50,
                        "billable_rate": 70,
                        "billable_ratio": 90,
                        "_id": "67f7c6f66a6ddd00fd075575"
                    },
                    {
                        "id": "memb2",
                        "name": "Trump",
                        "role": "host",
                        "department": "Product",
                        "hours_day": 5,
                        "cost_rate": 40,
                        "billable_rate": 60,
                        "billable_ratio": 95,
                        "_id": "67f7c6f66a6ddd00fd075576"
                    }
                ],
                "_id": "67f7c6f66a6ddd00fd075574"
            },
            "projectoutput": {
                "teamCostBreakdown": {
                    "memberCostBreakdown": [
                        {
                            "id": "memb1",
                            "name": "Donald",
                            "role": "manager",
                            "cost_rate": 50,
                            "total_hours": 76.19999999999999,
                            "member_cost": 3809.9999999999995,
                            "_id": "67f7c6f66a6ddd00fd075578"
                        },
                        {
                            "id": "memb2",
                            "name": "Trump",
                            "role": "host",
                            "cost_rate": 40,
                            "total_hours": 63.5,
                            "member_cost": 2540,
                            "_id": "67f7c6f66a6ddd00fd075579"
                        }
                    ],
                    "totalCosts": 6350
                },
                "revenueBreakdown": {
                    "memberRevenueBreakdown": [
                        {
                            "id": "memb1",
                            "name": "Donald",
                            "role": "manager",
                            "billable_rate": 70,
                            "billable_ratio": 90,
                            "billable_hours": 68.58,
                            "revenue": 4800.599999999999,
                            "_id": "67f7c6f66a6ddd00fd07557a"
                        },
                        {
                            "id": "memb2",
                            "name": "Trump",
                            "role": "host",
                            "billable_rate": 60,
                            "billable_ratio": 95,
                            "billable_hours": 60.324999999999996,
                            "revenue": 3619.4999999999995,
                            "_id": "67f7c6f66a6ddd00fd07557b"
                        }
                    ],
                    "totalRevenue": 8420.099999999999
                },
                "teamDailyCapacity": 11,
                "projectedDuration": 12.7,
                "projectedEndDate": "2025-04-25T00:00:00.000Z",
                "averageBillableRatio": 92.5,
                "teamCosts": 6350,
                "mainRevenue": 9769.23076923077,
                "profitLoss": 3419.2307692307695,
                "profitMargin": 35,
                "_id": "67f7c6f66a6ddd00fd075577"
            },
            "projectStatus": "Proposed"
        },
        "_id": "67f7c6f66a6ddd00fd075573",
        "__v": 0
    }
];
// populateProjsdash(Sampledata);

function updateprojectstaus(o_id, email, projectTitle, stausVal) {
    const apiUrl = 'https://projection-calc-function.onrender.com/api/update-project-staus';
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            projectTitle: projectTitle,
            o_id: o_id,
            stausVal: stausVal
        }),
    })
    .then(response => {
        if (!response.ok) {
            // console.error('Failed to update project status:', response.status);
        } else {
            // console.log('Project status updated successfully');
            // window.location.reload();
        }
    })
    .then(data => {
        // console.log('Update API Response:', data);
        window.location.reload();
    })
    .catch(error => {
        // console.error('Error updating project status:', error);
    });
}

function displayProjectDetails(projectID,ptitle,pdesp){
    document.getElementById('projects_info').style.display = 'none';
    document.getElementById('projectDetailsContainer').style.display = 'block';
    let projiVal = projectID.at(-1);
    let passingData = userprojectsData[projiVal];
    // let passingData = Sampledata[projiVal];
    let totprojhrs = passingData.projectDetails.projectinput.totalProjectHours;
    let projstartDate = passingData.projectDetails.projectinput.startDate;
    let projOutput= passingData.projectDetails.projectoutput;
    populateProjectDashboard(projOutput,totprojhrs,projstartDate,ptitle,pdesp);
}

document.getElementById('logo-area').addEventListener('click', function(){
    window.location.href = "index.html";
})

document.getElementById('redirect-home').addEventListener('click', function(){
    window.location.href = "index.html";
})
document.getElementById('backToProjects').addEventListener('click', function() {
    document.getElementById('projectDetailsContainer').style.display = 'none';
    document.getElementById('projects_info').style.display = 'block';
});


function populateProjectDashboard(data,projinputhrs,projstartDate,ptitle,pdescp) {
    // Get references to the HTML elements where you want to display the data
    let titletagDisplay = document.querySelector('.titleNdescription .outer_subtitle_name');
    let descriptiontagDisplay = document.querySelector('.titleNdescription .inner_subtitle_name');

    let teamDailyCapacityDisplay = document.querySelector('.Team_Daily_Capacity .outer_subtitle_name');
    let projectedDurationDisplay = document.querySelector('.Projected_Duration .outer_subtitle_name');
    let projectedStartDateDisplay = document.querySelector('.Projected_StartDate .outer_subtitle_name');
    let projectedEndDateDisplay = document.querySelector('.Projected_EndDate .outer_subtitle_name');
  
    const totalHoursDisplay = document.querySelector('.metrics-card .metric-item:nth-child(1) .metric-value');
    const costDisplay = document.querySelector('.metrics-card .metric-item:nth-child(2) .metric-value');
    const revenueDisplay = document.querySelector('.metrics-card .metric-item:nth-child(3) .metric-value');
    const amttoQuote = document.querySelector('.metrics-card .metric-item:nth-child(4) .metric-value');
    const profitDisplay = document.querySelector('.metrics-card .metric-item:nth-child(5) .metric-value');
    const profitMarginDisplay = document.querySelector('.metrics-card .metric-item:nth-child(6) .metric-value');
    const avgBillableRatioDisplay = document.querySelector('.metrics-card .metric-item:nth-child(7) .metric-value');
    const durationDisplay = document.querySelector('.metrics-card .metric-item:nth-child(8) .metric-value');
    const endDateDashboardDisplay = document.querySelector('.metrics-card .metric-item:nth-child(9) .metric-value');
  
    // let teamCostsFinancialDisplay = document.querySelector('.Financial_Analysis .Team_Costs .outer_subtitle_name');
    let revenueFinancialDisplay = document.querySelector('.Financial_Analysis .Revenue .outer_subtitle_name');
    let profitLossDisplay = document.querySelector('.Financial_Analysis .Profit_Loss .outer_subtitle_name');
    let profitMarginFinancialDisplay = document.querySelector('.Financial_Analysis .Profit_Margin .outer_subtitle_name');
  
    let teamCostBreakdownTableBody = document.querySelector('.teamcost_breakdown_table table tbody');
    let totalCostBreakdownDisplay = document.querySelector('.teamcost_breakdown_table table tfoot tr td:last-child');
  
    let revenueBreakdownTableBody = document.querySelector('.revenue_breakdown_table table tbody');
    let totalRevenueBreakdownDisplay = document.querySelector('.revenue_breakdown_table table tfoot tr td:last-child');
    let processData = data;
    // let totalProjectHoursInput = document.querySelector('.totalprojecthrs .number-input');
    let totalProjectHoursInput = projinputhrs;
    
    titletagDisplay.textContent = `Estimate Name: ${ptitle}`;
    descriptiontagDisplay.textContent = `Description: ${pdescp}`;

    // Project Timeline Projection
    teamDailyCapacityDisplay.textContent = `${processData.teamDailyCapacity} hours/day`;
    projectedDurationDisplay.textContent = `${(processData.projectedDuration).toFixed(1)} days`;
    projectedStartDateDisplay.textContent = projstartDate.split("T")[0];
    projectedEndDateDisplay.textContent = (processData.projectedEndDate.split("T"))[0];

    // Project Dashboard
    totalHoursDisplay.textContent = totalProjectHoursInput;
    costDisplay.textContent = `$ ${(processData.teamCosts).toFixed(2)}`;
    revenueDisplay.textContent = `$ ${(processData.revenueBreakdown.totalRevenue).toFixed(2)}`;
    amttoQuote.textContent = `$ ${(processData.mainRevenue).toFixed(2)}`;
    profitDisplay.textContent = `$ ${(processData.profitLoss).toFixed(2)}`;
    profitMarginDisplay.textContent = `${(processData.profitMargin).toFixed(2)} %`;
    avgBillableRatioDisplay.textContent = `${(processData.averageBillableRatio).toFixed(2)} % (all)`;
    durationDisplay.textContent = `${(processData.projectedDuration).toFixed(2)} working days`;
    let dateString = processData.projectedEndDate;
    endDateDashboardDisplay.textContent = dateString.split("T")[0];

    // Financial Analysis
    // teamCostsFinancialDisplay.textContent = `$${(processData.teamCosts).toFixed(2)}`;
    revenueFinancialDisplay.textContent = `$ ${(processData.mainRevenue).toFixed(2)}`;
    profitLossDisplay.textContent = `$ ${(processData.profitLoss).toFixed(2)}`;
    profitMarginFinancialDisplay.textContent = `${(processData.profitMargin).toFixed(2)} %`;

    let costBreakdownHTML = '';
    processData.teamCostBreakdown.memberCostBreakdown.forEach(member => {
      costBreakdownHTML += `
        <tr>
          <td>${member.name}</td>
          <td>${member.role}</td>
          <td>$ ${(member.cost_rate).toFixed(2)}</td>
          <td>${(member.total_hours).toFixed(2)}</td>
          <td>$ ${(member.member_cost).toFixed(2)}</td>
        </tr>
      `;
    });
    // console.log("********",costBreakdownHTML);
    teamCostBreakdownTableBody.innerHTML = costBreakdownHTML;
    totalCostBreakdownDisplay.textContent = `$ ${(processData.teamCostBreakdown.totalCosts).toFixed(2)}`;

    // Revenue Breakdown
    let revenueBreakdownHTML = '';
    processData.revenueBreakdown.memberRevenueBreakdown.forEach(member => {
      revenueBreakdownHTML += `
        <tr>
          <td>${member.name}</td>
          <td>${member.role}</td>
          <td>$ ${(member.billable_rate).toFixed(2)}</td>
          <td>${(member.billable_ratio).toFixed(2)}%</td>
          <td>${(member.billable_hours).toFixed(1)}</td>
          <td>$ ${(member.revenue).toFixed(2)}</td>
        </tr>
      `;
    });
    revenueBreakdownTableBody.innerHTML = revenueBreakdownHTML;
    totalRevenueBreakdownDisplay.textContent = `$ ${(processData.revenueBreakdown.totalRevenue).toFixed(2)}`;

    // set charts
    let chart1data = [processData.revenueBreakdown.totalRevenue/1000,processData.teamCosts/1000,processData.profitLoss/1000];
    Chart.register(ChartDataLabels);
    const ctx1 = document.getElementById('profitChart').getContext('2d');
    if(EprofitChart){
        EprofitChart.destroy();
    }
    EprofitChart = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: ['Revenue', 'Team Costs', 'Profit Amount'],
            datasets: [{
                data: chart1data,
                backgroundColor: ['#3498db','#2fcc71','#f1c40f'],
                borderColor: ['#186ca3','#1a994f','#b59102'],
                borderWidth: 1.3,
                borderRadius: 8,
                barThickness: 100
            }],
        },
        options: {
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false },
                    datalabels: {
                        anchor: 'center',
                        align: 'center',
                        color: '#fff',
                        font: {size: 16,weight:400},
                        formatter: function(value) {
                            let amtVal = value * 1000;
                            return '$ '+amtVal.toFixed(0);
                        }
                    }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amount ($)',
                        rotation: -90,
                        font: {size: 16}
                    },
                    ticks: {
                        stepSize: 2,
                        callback: function(value, index, values) {
                            return value + 'k';
                        },
                        font: {size: 16}
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: { size: 16 }
                    }
                }
            }
        }
    });
    
    let billable = parseFloat(processData.averageBillableRatio.toFixed(2));
    let nonBillable = parseFloat((100 - billable).toFixed(2));
    let rawData = [
        { label: 'Billable', value: billable, bg: '#2fcc71', border: '#12753b' },
        { label: 'Non-Billable', value: nonBillable, bg: '#e74b3c', border: '#961e14' }
    ];
    // Filter out 0 values
    let filteredData = rawData.filter(item => item.value > 0);
    let billchartData = filteredData.map(item => item.value);
    let billchartLabels = filteredData.map(item => item.label);
    let backgroundColors = filteredData.map(item => item.bg);
    let borderColors = filteredData.map(item => item.border);
    
    const ctx2 = document.getElementById('billChart').getContext('2d');
    if (Ebillablechart) {
        Ebillablechart.destroy();
    }
    
    Ebillablechart = new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: billchartLabels,
            datasets: [{
                label: 'Data',
                data: billchartData,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 0.5,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            layout: {padding: {bottom: 40}},
            plugins: {
                legend: { 
                    position: 'bottom',
                    labels:{
                        usePointStyle: true,
                        pointStyle: 'rect',
                        boxWidth:16,
                        boxHeight:16,
                        font: {weight:400,size: 20},
                        padding: 30
                    }
                    },
                datalabels: {
                    color: '#fff',
                    font: {weight: 500,size: 16},
                    formatter: (value) => value + '%'
                }
            }
        },
        plugins: [ChartDataLabels]
    });
    document.getElementById('allcharts').style.display = "block";
}

function retomyhome(){
    window.location.href = "index.html";
}
function retomymembers(){
    window.location.href = "mymembers.html";
}
function retocapdash(){
    window.location.href = "capacity dashboard.html";
}

function curruserlogout(){
    localStorage.removeItem('userDetail');
    window.location.href = "index.html";
}
  