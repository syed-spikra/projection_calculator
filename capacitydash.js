var allmembersData;
var emailidfromresponse;
// -------------------------------------------------------------
// function for all plus minus click event handling
document.addEventListener('DOMContentLoaded', () => {
    // Attach a single event listener to the document
    document.addEventListener('click', function(event) {
      const clickedElement = event.target;
  
      if (clickedElement.classList.contains('minus-button')) {
        handleNumberInputChange(clickedElement, -1);
      } else if (clickedElement.classList.contains('plus-button')) {
        handleNumberInputChange(clickedElement, 1);
      }
    });
  
    function handleNumberInputChange(buttonElement, direction) {
      // Find the parent .number-input-group of the clicked button
      const inputGroup = buttonElement.closest('.number-input-group');
  
      if (inputGroup) {
        // Find the input element within that specific group
        const numberInput = inputGroup.querySelector('.number-input');
  
        if (numberInput) {
          let currentValue = parseFloat(numberInput.value);
          const stepValue = parseFloat(numberInput.getAttribute('step')) || 1;
          const minValue = parseFloat(numberInput.getAttribute('min')) || 0;
          const maxValue = parseFloat(numberInput.getAttribute('max')) || Infinity;
          let newValue;
  
          if (direction === -1) {
            newValue = (currentValue - stepValue).toFixed(2);
            // console.log(newValue);
            if (newValue >= minValue) {
              numberInput.value = newValue;
            }
          } else if (direction === 1) {
            newValue = (currentValue + stepValue).toFixed(2);
            // console.log(newValue);
            if (newValue <= maxValue) {
              numberInput.value = newValue;
            }
          }
        }
      }
    }
  });
function fetchcurrentusermembers(){
    let currentUserDetails = localStorage.getItem('userDetail');
    // console.log(currentUserDetails);
    let usermail = JSON.parse(currentUserDetails);
    // console.log(usermail.email);
    let fetchUrl = 'https://projection-calc-function.onrender.com/api/get-user-members/'+usermail.email;
    // console.log(fetchUrl);
    // let fetchUrl ='http://localhost:3002/api/get-user-members/'+usermail.email;
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
    allmembersData = data;
    // console.log('====',allmembersData);

    document.getElementById("startMonth").value = 4; // May
    document.getElementById("endMonth").value = 7;   // September
    document.getElementById("yearSelect").value = new Date().getFullYear();
    let departmentSelect = document.getElementById("departmentSelect");
    Array.from(departmentSelect.options).forEach(opt => opt.selected = true);
    fetchAndRenderDashboard();

    // populateMembersdash(data);
    })
    .catch(error => {
    console.error('API call failed:', error);
    // populateMembersdash([]);
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


document.getElementById('logo-area').addEventListener('click', function(){
    window.location.href = "index.html";
})


function showcancelcheckbuttons(rowID,forwhichaction,emailval,memjson){
    const membertbody = document.getElementById('memberlistbody');
    const tbodyrow = membertbody.querySelector(`#${rowID}`);
    // console.log(tbodyrow);
    const lastCellIndex = tbodyrow.cells.length - 1;
    if (lastCellIndex >= 0) {
        if(forwhichaction == "for-delete"){
            tbodyrow.cells[lastCellIndex].innerHTML = `<td><button type="button" class="cancel-button" onclick="thispagereload()">x</button><button type="button" class="check-button" onclick="handlememberDelete('${emailval}','${memjson.memberName}','${memjson.memberRole}','${memjson.memberDepartment}','${memjson.memberCostperhrs}','${memjson.memberId}')"><i class='bx bxs-trash' style='color:#ffffff' ></i></button></td>`;
        }
        if(forwhichaction == "for-edit"){
            tbodyrow.innerHTML = `
            <td>
                <div class="membername">
                    <input type="text" class="memberNameInput" value="${memjson.memberName}">
                </div>
            </td>
            <td>
                <div class="role">
                    <input type="text" class="memberRoleInput" value="${memjson.memberRole}">
                </div>
            </td>
            <td>
                <div class="departments">
                    <select class="memberDepartmentSelect" name="department">
                        <option value="Engineer" ${memjson.memberDepartment === 'Engineer' ? 'selected' : ''}>Engineer</option>
                        <option value="Design" ${memjson.memberDepartment === 'Design' ? 'selected' : ''}>Design</option>
                        <option value="Product" ${memjson.memberDepartment === 'Product' ? 'selected' : ''}>Product</option>
                        <option value="Marketing" ${memjson.memberDepartment === 'Marketing' ? 'selected' : ''}>Marketing</option>
                        <option value="Others" ${memjson.memberDepartment === 'Others' ? 'selected' : ''}>Others</option>
                    </select>
                </div>
            </td>
            <td>
                <div class="number-input-group">
                    <input type="number" class="number-input memberCostInput" id="input1" name="input1" value="${memjson.memberCostperhrs}" step="0.5" min="0" max="100">
                    <div class="input-controls">
                        <button type="button" class="minus-button">-</button>
                        <button type="button" class="plus-button">+</button>
                    </div>
                </div>
            </td>
            <td>
                <button type="button" class="cancel-button" onclick="thispagereload()">x</button>
                <button type="button" class="check-button" onclick="handlememberEdit('${emailval}','${memjson.memberId}')">✓</button>
            </td>`;
        }
    } else {
      console.warn(`Row with ID "${rowID}" in tbody has no cells.`);
    }
}

function thispagereload(){
    window.location.reload();
}
function retomyhome(){
    window.location.href = "index.html";
  }
  function retomyprojects(){
    window.location.href = "myprojects.html";
  }
  
  function curruserlogout(){
    localStorage.removeItem('userDetail');
    window.location.href = "index.html";
  }



// ================================= all capacity dashboards may 13th=================================
const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];


  // Populate month/year dropdowns
  let startMonth = document.getElementById("startMonth");
  let endMonth = document.getElementById("endMonth");
  let yearSelect = document.getElementById("yearSelect");

  months.forEach((m, i) => {
    startMonth.innerHTML += `<option value="${i}">${m}</option>`;
    endMonth.innerHTML += `<option value="${i}">${m}</option>`;
  });

  const currentYear = new Date().getFullYear();
  for (let y = currentYear - 1; y <= currentYear + 2; y++) {
    yearSelect.innerHTML += `<option value="${y}">${y}</option>`;
  }

  let departmentSelect = document.getElementById("departmentSelect");
  let choices = new Choices(departmentSelect, {
      removeItemButton: true,
      placeholder: true,
      placeholderValue: 'Select departments',
      searchEnabled: false,
      position: 'bottom'
  });
  // Add event listeners
  [startMonth, endMonth, yearSelect, departmentSelect].forEach(el =>
    el.addEventListener("change", fetchAndRenderDashboard)
  );

  async function fetchAndRenderDashboard() {
    let start = parseInt(startMonth.value);
    let end = parseInt(endMonth.value);
    let year = parseInt(yearSelect.value);
    if (start > end) return;
    // let selectedDepartments = Array.from(departmentSelect.selectedOptions).map(o => o.value);
    
//     let selectedDepartments = Array.from(departmentSelect.options)
//   .filter(option => option.selected)
//   .map(option => option.value);

    let selectedDepartments = choices.getValue(true);
    
    if (selectedDepartments == [] || selectedDepartments.length === 0) {
        choices.destroy();
        choices = new Choices(departmentSelect, {
            removeItemButton: true,
            placeholder: true,
            placeholderValue: 'All departments',
            searchEnabled: false,
            position: 'bottom'
        });
      selectedDepartments = ['Engineer', 'Product', 'Design', 'Marketing', 'Others'];
    }else{
        letchecksel = choices.getValue(true);
        if(choices._placeholderValue == "All departments" && (letchecksel.lenght != 0 && letchecksel != [])){
            choices.destroy();
            choices = new Choices(departmentSelect, {
                removeItemButton: true,
                placeholder: true,
                placeholderValue: 'Select departments',
                searchEnabled: false,
                position: 'bottom'
            });
        }
    }
    let startTime = new Date(year, start, 1);
    let endTime = new Date(year, end + 1, 0);
    let currentUserDetails = localStorage.getItem('userDetail');
    // console.log(currentUserDetails);
    let usermail = JSON.parse(currentUserDetails);
    let response = await fetch(`https://projection-calc-function.onrender.com/api/get-capacity-dashboards/${usermail.email}`, {
    // let response = await fetch(`http://localhost:3002/api/get-capacity-dashboards/${usermail.email}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startTime, endTime, selectedDepartment: selectedDepartments })
    });

    let capdashdata = await response.json();
    if (capdashdata.status === 200) {
      renderDepartmentCapacity(capdashdata.capdash.DepartmentCapacityRows);
      renderMonthWiseCapacity(capdashdata.capdash.DeptartmentCapcityMonthRows, start, end, year);
      renderTeamMemberCapacity(capdashdata.capdash.TeamMemberCapacityRows);
      renderProjectMemberCapacity(capdashdata.capdash.ProjectTeamMemberCapacityRows);
    }
  }

  function getColorClass(percent) {
    if (percent > 80) return "red";
    if (percent >= 50) return "yellow";
    return "green";
  }

  function renderDepartmentCapacity(rows) {
    const table = document.getElementById("departmentCapacityTable");
    table.innerHTML = `<tr><th>Department</th><th>Available hours</th><th>Allocated hours</th></tr>`;
    rows.forEach(row => {
      table.innerHTML += `
        <tr>
          <td>${row.department}</td>
          <td>${row.availableHrs}</td>
          <td class="${getColorClass(row.allocatedPercent)}">${row.allocatedHrs}</td>
        </tr>`;
    });
  }

  function renderMonthWiseCapacity(rows, startMonth, endMonth, year) {
    const monthLabels = [];
    for (let m = startMonth; m <= endMonth; m++) {
      monthLabels.push(`${months[m]} ${year}`);
    }

    const table = document.getElementById("monthWiseCapacityTable");
    let header = `<tr><th>Department</th>${monthLabels.map(m => `<th>${m}</th>`).join("")}</tr>`;
    let body = rows.map(row => {
      const monthMap = Object.fromEntries(row.months.map(m => [m.monthName, m]));
      const cells = monthLabels.map(month => {
        const val = monthMap[month];
        return `<td class="${val ? getColorClass(val.allocatedPercent) : ""}">${val ? val.allocatedHrs : "-"}</td>`;
      }).join("");
      return `<tr><td>${row.department}</td>${cells}</tr>`;
    }).join("");
    table.innerHTML = header + body;
  }

  function renderTeamMemberCapacity(rows) {
    const table = document.getElementById("teamMemberCapacityTable");
    table.innerHTML = `<tr><th>Member</th><th>Available hours</th><th>Allocated hours</th><th>Allocated %</th></tr>`;
    rows.forEach(row => {
      table.innerHTML += `
        <tr>
          <td>${row.memberName}</td>
          <td>${row.availableHrs}</td>
          <td>${row.allocatedHrs}</td>
          <td class="${getColorClass(row.allocatedPercent)}">${row.allocatedPercent}</td>
        </tr>`;
    });
  }

  function renderProjectMemberCapacity(rows) {
const table = document.getElementById("projectMemberCapacityTable");

// ✅ Fix: use 'allocatedProjectHrs' instead of 'projects'
const projects = [...new Set(rows.flatMap(r =>
  (r.allocatedProjectHrs || []).map(p => p.projectName.trim())
))];

let header = `<tr><th>Member</th>${projects.map(p => `<th>${p}</th>`).join("")}</tr>`;

let body = rows.map(row => {
  const map = Object.fromEntries(
    (row.allocatedProjectHrs || []).map(p => [p.projectName.trim(), p.hrsTime])
  );

  const cells = projects.map(p => `<td>${map[p] ?? '-'}</td>`).join("");
  return `<tr><td>${row.memberName}</td>${cells}</tr>`;
}).join("");

table.innerHTML = header + body;
}


// -=-=-=-=-=-------------------=================
// projects.js

var userprojectsData;
var EprofitChart,Ebillablechart;
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
    // populateProjsdash(data);
    updateDashboardCards(data);
    })
    .catch(error => {
    console.error('API call failed:', error);
    // populateProjsdash([]);
    updateDashboardCards([]);
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



document.getElementById('logo-area').addEventListener('click', function(){
    window.location.href = "index.html";
})

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
  



function calltwofns(){
    fetchcurrentuserprojects();
    fetchcurrentusermembers();
}