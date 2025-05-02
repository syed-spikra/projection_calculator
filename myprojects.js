var userprojectsData;
function fetchcurrentuserprojects(){
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
    })
    .catch(error => {
    console.error('API call failed:', error);
    populateProjsdash([]);
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
function populateProjsdash(projectData) {
    const projectListBody = document.getElementById('projectlistbody');
    projectListBody.innerHTML = ''; // Clear any existing rows

    if (projectData && projectData.length > 0) {
        projectData.forEach((project, index) => {
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


            // 2. Start Date
            const startDateCell = row.insertCell();
            startDateCell.classList.add('start-date-cell');
            const startDate = new Date(project.projectDetails.projectinput.startDate);
            startDateCell.textContent = startDate.toLocaleDateString('en-GB');

            // 3. Predicted End Date
            const predictedEndDateCell = row.insertCell();
            predictedEndDateCell.classList.add('predicted-end-date-cell');
            const predictedEndDate = new Date(project.projectDetails.projectoutput.projectedEndDate);
            predictedEndDateCell.textContent = predictedEndDate.toLocaleDateString('en-GB');

            // 4. Revenue
            const revenueCell = row.insertCell();
            revenueCell.classList.add('revenue-cell');
            revenueCell.textContent = `$${project.projectDetails.projectoutput.mainRevenue.toFixed(2)}`;

            // 5. Duration
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
            }
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
            }
        },
        "_id": "67f7c6f66a6ddd00fd075573",
        "__v": 0
    }
];

// populateProjsdash(Sampledata);


function displayProjectDetails(projectID,ptitle,pdesp){
    document.getElementById('projects_info').style.display = 'none';
    document.getElementById('projectDetailsContainer').style.display = 'block';
    let projiVal = projectID.at(-1);
    let passingData = userprojectsData[projiVal];
    // let passingData = Sampledata[projiVal];
    let totprojhrs = passingData.projectDetails.projectinput.totalProjectHours;
    let projOutput= passingData.projectDetails.projectoutput;
    populateProjectDashboard(projOutput,totprojhrs,ptitle,pdesp);
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


function populateProjectDashboard(data,projinputhrs,ptitle,pdescp) {
    // Get references to the HTML elements where you want to display the data
    let titletagDisplay = document.querySelector('.titleNdescription .outer_subtitle_name');
    let descriptiontagDisplay = document.querySelector('.titleNdescription .inner_subtitle_name');

    let teamDailyCapacityDisplay = document.querySelector('.Team_Daily_Capacity .outer_subtitle_name');
    let projectedDurationDisplay = document.querySelector('.Projected_Duration .outer_subtitle_name');
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
    let totalProjectHoursInput = projinputhrs
    
    titletagDisplay.textContent = `Estimate Name: ${ptitle}`;
    descriptiontagDisplay.textContent = `Description: ${pdescp}`;

    // Project Timeline Projection
    teamDailyCapacityDisplay.textContent = `${processData.teamDailyCapacity} hours/day`;
    projectedDurationDisplay.textContent = `${(processData.projectedDuration).toFixed(1)} days`;
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
}

function retomyhome(){
    window.location.href = "index.html";
  }
  function retomymembers(){
    window.location.href = "mymembers.html";
  }
  
  function curruserlogout(){
    localStorage.removeItem('userDetail');
    window.location.href = "index.html";
  }
  