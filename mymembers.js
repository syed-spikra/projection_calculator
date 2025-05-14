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

    // document.getElementById("startMonth").value = 4; // May
    // document.getElementById("endMonth").value = 7;   // September
    // document.getElementById("yearSelect").value = new Date().getFullYear();
    // let departmentSelect = document.getElementById("departmentSelect");
    // Array.from(departmentSelect.options).forEach(opt => opt.selected = true);
    // fetchAndRenderDashboard();

    populateMembersdash(data);
    })
    .catch(error => {
    console.error('API call failed:', error);
    populateMembersdash([]);
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


sampleData = [
    {
        "userDetails": {
            "fullname": "syedsalahudidn",
            "email": "salahuddinksyed.12@gmail.com",
            "password": "Sample@123"
        },
        "_id": "67fcf27063c695fc67c4c89c",
        "memberslist": [
            {
                "memberid": "memb1",
                "memberName": "Hobu",
                "memberRole": "DF Lead",
                "memberDepartment": "Design",
                "memberCostperhrs": 60,
                "_id": "67fcf27063c695fc67c4c89d"
            },
            {
                "memberid": "memb2",
                "memberName": "Lolu",
                "memberRole": "GB Tech",
                "memberDepartment": "Product",
                "memberCostperhrs": 70,
                "_id": "67fcf27063c695fc67c4c89e"
            }
        ],
        "__v": 0
    }
]
// populateMembersdash(sampleData);
function populateMembersdash(membersData){
    const membersListBody = document.getElementById('memberlistbody');
    membersListBody.innerHTML = '';
    if(membersData && membersData.length > 0){
        memberslist = membersData[0].memberslist;
        emailidfromresponse = membersData[0].userDetails.email;
        memberslist.forEach((member, index) => {
            const mrow = membersListBody.insertRow();
            mrow.id = "m"+member._id;
            // const rowmemclsname = `member-row ${member.memberid}`;
            mrow.classList.add("member-row");

            const memberNamecell = mrow.insertCell();
            memberNamecell.classList.add('member-name-cell');
            const memberNameSpan = document.createElement('span');
            memberNameSpan.textContent = member.memberName;
            memberNamecell.appendChild(memberNameSpan);

            const memberRolecell = mrow.insertCell();
            memberRolecell.classList.add('member-role-cell');
            const memberRoleSpan = document.createElement('span');
            memberRoleSpan.textContent = member.memberRole;
            memberRolecell.appendChild(memberRoleSpan);

            const memberDeptcell = mrow.insertCell();
            memberDeptcell.classList.add('member-dept-cell');
            const memberDeptSpan = document.createElement('span');
            memberDeptSpan.textContent = member.memberDepartment;
            memberDeptcell.appendChild(memberDeptSpan);

            const membercostratecell = mrow.insertCell();
            membercostratecell.classList.add('member-costrate-cell');
            const membercostrateSpan = document.createElement('span');
            membercostrateSpan.textContent = `$${member.memberCostperhrs}/hr`;
            membercostratecell.appendChild(membercostrateSpan);

            const memberEdDeloptions = mrow.insertCell();
            memberEdDeloptions.classList.add('member-edel_cell');

            const memberEditButton = document.createElement('button');
            memberEditButton.classList.add('edit-member-button');
            memberEditButton.innerHTML = '<span class="member-edit-icon"><img src="./images/editicon.png" width="20" height="20"></span> Edit';
            memberEditButton.addEventListener('click', () => {
                // console.log(mrow.id);
                let editpassobj = {
                    memberId: member._id,
                    memberName: member.memberName,
                    memberRole: member.memberRole,
                    memberDepartment: member.memberDepartment,
                    memberCostperhrs: member.memberCostperhrs,
                  };
                showcancelcheckbuttons(mrow.id,"for-edit",emailidfromresponse,editpassobj);
            //   handlememberEdit(`member-${index}`);
            });
            const memberDeleteButton = document.createElement('button');
            memberDeleteButton.textContent = 'Delete';
            memberDeleteButton.classList.add('delete-member-button');
            memberDeleteButton.innerHTML = '<span class="member-delete-icon"><img src="./images/deleteicon.png" width="20" height="20"></span>';
            memberDeleteButton.addEventListener('click', () => {
                // console.log(mrow.id);
                let deletepassobj = {
                    memberId: member._id,
                    memberName: member.memberName,
                    memberRole: member.memberRole,
                    memberDepartment: member.memberDepartment,
                    memberCostperhrs: member.memberCostperhrs,
                  };
                showcancelcheckbuttons(mrow.id,"for-delete", emailidfromresponse, deletepassobj);
                // handlememberDelete(emailidfromresponse, deletepassobj);
            });

            memberEdDeloptions.appendChild(memberEditButton);
            memberEdDeloptions.appendChild(memberDeleteButton);
        });
        const addmemrow = membersListBody.insertRow();
        addmemrow.classList.add('addmemberbuttonrow');
        const addmemberfromtable = addmemrow.insertCell();
        addmemberfromtable.colSpan = 5; 
        addmemberfromtable.textContent = '+ Add members';
        addmemberfromtable.addEventListener('click', ()=>{
            // console.log("member added", memberslist.length);
            addnewMember(memberslist.length);
        })
        addmemberfromtable.classList.add('add-newmember-cell');
    }else {
        const row = membersListBody.insertRow();
        const nomembersCell = row.insertCell();
        nomembersCell.colSpan = 4;
        nomembersCell.textContent = 'No members found';
        nomembersCell.classList.add('no-members-cell');
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

function handlememberEdit(emailVal,moid){
    let memberNumber = "m"+moid;
    let newmembRow = document.getElementById(memberNumber);
    // console.log(newmembRow);
    const nameInput = newmembRow.querySelector('td div .memberNameInput');
    const roleInput = newmembRow.querySelector('td div .memberRoleInput');
    const departmentSelect = newmembRow.querySelector('td div .memberDepartmentSelect');
    const costInput = newmembRow.querySelector('td div .memberCostInput');

    const nameValue = nameInput.value;
    const roleValue = roleInput.value;
    const departmentValue = departmentSelect.value;
    const costValue = costInput.value;
    // console.log(memberNumber, nameValue, roleValue, departmentValue, costValue);

    let memberToEdit = {
        memberoid: moid,
        memberName: nameValue,
        memberRole: roleValue,
        memberDepartment: departmentValue,
        memberCostperhrs: parseFloat(costValue) 
    };
    // console.log("||==||==||==||",memberToEdit);
    fetch(`https://projection-calc-function.onrender.com/api/edit-memberfrom/${emailVal}`, {
    // fetch(`http://localhost:3002/api/edit-memberfrom/${emailVal}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(memberToEdit),
    })
    .then(response => response.json())
    .then(data => {
    //   console.log(data);
        thispagereload();
    })
    .catch(error => {
        console.error('Error deleting member:', error);
    });
}
function handlememberDelete(emailVal,mname,mrole,mdept,mcost,moid){
    // console.log(emailVal);
    let memberToDelete = {
        memberoid: moid,
        memberName: mname,
        memberRole: mrole,
        memberDepartment: mdept,
        memberCostperhrs: mcost,
    };
    // console.log(memberToDelete);
    fetch(`https://projection-calc-function.onrender.com/api/delete-memberfrom/${emailVal}`, {
    // fetch(`http://localhost:3002/api/delete-memberfrom/${emailVal}`, {
    method: 'DELETE',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(memberToDelete),
    })
    .then(response => response.json())
    .then(data => {
    //   console.log(data);
        thispagereload();
    })
    .catch(error => {
        console.error('Error deleting member:', error);
    });
}
function handleAddNewMemberRow(memberNumber) {
    memberNumber = "memb"+memberNumber;
    let newmembRow = document.getElementById(memberNumber);
    // console.log(newmembRow);
    const nameInput = newmembRow.querySelector('td div .memberNameInput');
    const roleInput = newmembRow.querySelector('td div .memberRoleInput');
    const departmentSelect = newmembRow.querySelector('td div .memberDepartmentSelect');
    const costInput = newmembRow.querySelector('td div .memberCostInput');

    const nameValue = nameInput.value;
    const roleValue = roleInput.value;
    const departmentValue = departmentSelect.value;
    const costValue = costInput.value;
    // console.log(memberNumber, nameValue, roleValue, departmentValue, costValue);

    let storedUserDetail = localStorage.getItem('userDetail');
    let localvalues =  storedUserDetail ? JSON.parse(storedUserDetail) : null;
    let sendingadddata = {
        fullname:localvalues.username,
        email:localvalues.email,
        password:localvalues.password,
        member:{
            id:memberNumber,
            name:nameValue,
            role:roleValue,
            department:departmentValue,
            cost_rate: parseFloat(costValue),
        }
    }
    // console.log("==========",sendingadddata);

    fetch(`https://projection-calc-function.onrender.com/api/add-member-foruser`, {
    // fetch(`http://localhost:3002/api/add-member-foruser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sendingadddata),
    })
    .then(response => response.json())
    .then(data => {
        // console.log(data);
        thispagereload();
    })
    .catch(error => {
        console.error('Error deleting member:', error);
    });
}
function addnewMember(membernumber){
    const membertablebody = document.getElementById('memberlistbody');
    const newmembRow = document.createElement('tr');
    newmembRow.id = `memb${membernumber}`;
    membertablebody.removeChild(membertablebody.lastElementChild);
    newmembRow.innerHTML = `
    <td>
        <div class="membername">
            <input type="text" class="memberNameInput" placeholder="eg. John Deo">
        </div>
    </td>
    <td>
        <div class="role">
            <input type="text" class="memberRoleInput" placeholder="CTO">
        </div>
    </td>
    <td>
        <div class="departments">
            <select class="memberDepartmentSelect" name="department">
                <option value="Engineer">Engineer</option>
                <option value="Design">Design</option>
                <option value="Product">Product</option>
                <option value="Marketing">Marketing</option>
                <option value="Others">Others</option>
            </select>
        </div>
    </td>
    <td>
        <div class="number-input-group">
            <input type="number" class="number-input memberCostInput" id="input1" name="input1" value="40.00" step="0.5" min="0" max="100">
            <div class="input-controls">
                <button type="button" class="minus-button">-</button>
                <button type="button" class="plus-button">+</button>
            </div>
        </div>
    </td>
    <td>
        <button type="button" class="cancel-button" onclick="cancelnewmemberrow()">x</button>
        <button type="button" class="check-button" onclick="handleAddNewMemberRow('${membernumber}')">Add</button>
    </td>`;
membertablebody.appendChild(newmembRow);

}


function cancelnewmemberrow(){
    const currmembersListBody = document.getElementById('memberlistbody');
    currmembersListBody.removeChild(currmembersListBody.lastElementChild);
    const addmemrow = currmembersListBody.insertRow();
    addmemrow.classList.add('addmemberbuttonrow');
    const addmemberfromtable = addmemrow.insertCell();
    addmemberfromtable.colSpan = 5; 
    addmemberfromtable.textContent = '+ Add members';
    addmemberfromtable.addEventListener('click', ()=>{
        let memberslist = allmembersData[0].memberslist;
        // console.log("member added", memberslist.length);
        addnewMember(memberslist.length);
    })
    addmemberfromtable.classList.add('add-newmember-cell');
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
  
  function retocapdash(){
    window.location.href = "capacity dashboard.html";
}
  function curruserlogout(){
    localStorage.removeItem('userDetail');
    window.location.href = "index.html";
  }

// =================================capacity members=================================

const rangeTypeSelector = document.getElementById('range-type');
const monthSelector = document.getElementById('month-selector');
const yearSelector = document.getElementById('year');
const customDateSelector = document.getElementById('custom-date-selector');
const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');
// const calculateButton = document.getElementById('calculate-availability');
const availabilityResultsDiv = document.getElementById('availability-results');

monthSelector.style.display = 'block flex';
yearSelector.style.display = 'block';
customDateSelector.style.display = 'none';

rangeTypeSelector.addEventListener('change', function () {
    if (this.value === 'month') {
        monthSelector.style.display = 'block flex';
        yearSelector.style.display = 'block';
        customDateSelector.style.display = 'none';
    } else {
        monthSelector.style.display = 'none';
        yearSelector.style.display = 'none';
        customDateSelector.style.display = 'block flex';
    }
});
monthSelector.addEventListener('change', function() {setstartenddate();});
yearSelector.addEventListener('change', function() {setstartenddate();});
startDateInput.addEventListener('change', function () {
    if (endDateInput.value && this.value > endDateInput.value) {
        // alert("Start date cannot be after the end date.");
        this.value = endDateInput.value; // Reset start date to end date
    }
    else 
        setstartenddate();
});
endDateInput.addEventListener('change', function () {
    if (startDateInput.value && this.value < startDateInput.value) {
        // alert("End date cannot be before the start date.");
        this.value = startDateInput.value;
    }
    else
        setstartenddate();
});

// calculateButton.addEventListener('click', function () {
function setstartenddate(){
    let startDate, endDate;
    const selectedMonth = parseInt(document.getElementById('month').value);
    const selectedYear = parseInt(document.getElementById('year').value);
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYearNum = today.getFullYear();
    // const currentDate = today.getDate();
    if (rangeTypeSelector.value === 'month') {
        if (selectedYear === currentYearNum && selectedMonth === currentMonth) {
            // startDate = `${currentYearNum}-${String(currentMonth).padStart(2, '0')}-${String(currentDate).padStart(2, '0')}`;
            startDate = `${currentYearNum}-${String(currentMonth).padStart(2, '0')}-${getfirstDayOfMonth(currentYearNum, currentMonth)}`;
        } else {
            startDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`; 
        }
        endDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${getLastDayOfMonth(selectedYear, selectedMonth)}`;
    } else {
        startDate = startDateInput.value;
        endDate = endDateInput.value;
    }
    fetchAvailabilityData(startDate, endDate);
};

async function fetchAvailabilityData(startDate, endDate) {
    try {
        let currentUserDetails = localStorage.getItem('userDetail');
        // console.log(currentUserDetails);
        let usermail = JSON.parse(currentUserDetails);
        const fetchUrl = 'https://projection-calc-function.onrender.com/api/get-all-member-capacity/'+usermail.email;
        // const fetchUrl = 'http://localhost:3002/api/get-all-member-capacity/'+usermail.email;
        const response = await fetch(fetchUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ startTime: startDate, endTime: endDate })
        });

        if (!response.ok) {
            // throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        displayAvailability(data); //  Call displayAvailability with the fetched data

    } catch (error) {
        // console.error("Error fetching availability data:", error);
        // availabilityResultsDiv.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
    }
}

function displayAvailability(data) {
    availabilityResultsDiv.innerHTML = '';
    // if (!data || !data.member_capacity || data.member_capacity.length === 0) {
    if(data.member_capacity.memberslist.length == 0){
        availabilityResultsDiv.innerHTML = "<p>No member found</p>";
        return;
    }
    data = data.member_capacity;
    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>Name</th>
                <th>Project Allocations</th>
                <th>Total Capacity (hours)</th>
                <th>Allocated Hours</th>
                <th>Available Hours</th>
                <th>Allocation (%)</th>
            </tr>
        </thead>
        <tbody id="availability-table-body"></tbody>
    `;
    availabilityResultsDiv.appendChild(table);
    const tableBody = document.getElementById('availability-table-body');

    data.memberslist.forEach(member => {
        const row = tableBody.insertRow();
        const nameCell = row.insertCell();
        // const hourperday = row.insertCell();
        const projectsCell = row.insertCell();
        const capacityCell = row.insertCell();
        const allocatedCell = row.insertCell();
        const availableCell = row.insertCell();
        const allocationCell = row.insertCell();

        nameCell.textContent = member.membername;
        // hourperday.textContent = data.maxworkperhrs;
        const projectList = member.projectlist.map(p => `${p.pname} (${p.pmemhrsday}hrs * ${p.pdayscount}days = ${p.projectallocationtime} hrs)`).join('<br>');
        projectsCell.innerHTML = projectList || 'No projects';

        capacityCell.textContent = data.capacityHours;
        allocatedCell.textContent = member.allocatedHours;
        availableCell.textContent = member.availableHours;

        const allocationPercentage = member.allocation ? member.allocation.toFixed(2) + '%' : '0.00%';
        allocationCell.textContent = allocationPercentage;

        // Color-coding for allocation %
        if (member.allocation < 50) {
            allocationCell.style.backgroundColor = '#2cdd4caa'; //green
        } else if (member.allocation >= 50 && member.allocation <= 80) {
            allocationCell.style.backgroundColor = '#e8eb4faa'; //yellow
        } else {
            allocationCell.style.backgroundColor = '#dd2c46aa'; //red
        }
    });

    const dateRangeInfo = document.createElement('p');
    const workingDaysInfo = document.createElement('p');
    // dateRangeInfo.textContent = `Date Range: ${startDate} - ${endDate}`;
    // console.log(dateRangeInfo);
    workingDaysInfo.textContent = `Total Working Days: ${data.totaldaysrange}`;
    workingDaysInfo.style.fontWeight = "500";
    availabilityResultsDiv.prepend(workingDaysInfo);
    // availabilityResultsDiv.prepend(dateRangeInfo);
}

// Get current date
const today = new Date();
const capcurrentYear = today.getFullYear();
const currentMonth = today.getMonth() + 1;
const currentDate = today.getDate();

// Set default month and year
document.getElementById('month').value = currentMonth;
document.getElementById('year').value = capcurrentYear;

// Function to get the last day of a month
function getLastDayOfMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

function getfirstDayOfMonth(year, month) {
    return new Date(year, month - 1, 1).getDate();
}
// Set default start and end dates for month view
const defaultStartDate = `${capcurrentYear}-${String(currentMonth).padStart(2, '0')}-${getfirstDayOfMonth(capcurrentYear, currentMonth)}`;
const defaultEndDate = `${capcurrentYear}-${String(currentMonth).padStart(2, '0')}-${getLastDayOfMonth(capcurrentYear, currentMonth)}`;

// Set initial values for custom date pickers
document.getElementById('start-date').value = defaultStartDate;
document.getElementById('end-date').value = defaultEndDate;

//  Initial load with the current month
fetchAvailabilityData(defaultStartDate, defaultEndDate);

document.addEventListener('DOMContentLoaded', function() {
    const opendropdowndiv = document.querySelector('#capacitydes .openerdropdown'); 
    const openerDropdown = document.querySelector('#capacitydes .openerdropdown span');
    const hiddenContent = openerDropdown.nextElementSibling;
    const iconElement = openerDropdown.querySelector('i');
    if (opendropdowndiv && openerDropdown && hiddenContent) {
        opendropdowndiv.addEventListener('click', function() {
        if (hiddenContent.style.display === 'none' || hiddenContent.style.display === '') {
          slideDown(hiddenContent);
          iconElement.classList.remove('bx-chevron-down');
          iconElement.classList.add('bx-chevron-up', 'open');
        } else {
          slideUp(hiddenContent);
          iconElement.classList.remove('bx-chevron-up', 'open');
          iconElement.classList.add('bx-chevron-down');
        }
      });
    }
  
    function slideDown(element) {
      element.style.display = 'block';
      element.style.height = '0';
      element.style.transition = 'height 0.7s ease-out';
      // Use a timeout to trigger the height transition after display is set
      setTimeout(() => {
        element.style.height = element.scrollHeight + 'px';
      }, 0);
    }
  
    function slideUp(element) {
      element.style.height = element.scrollHeight + 'px';
      element.style.transition = 'height 0.5s ease-in';
      // Use a timeout to trigger the height transition
      setTimeout(() => {
        element.style.height = '0';
        // Hide the element completely after the slide up animation
        element.addEventListener('transitionend', function() {
          element.style.display = 'none';
          element.removeEventListener('transitionend', arguments.callee); // Remove listener
        });
      }, 0);
    }
  });

// ====================================================================================================================

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
    let selectedDepartments = Array.from(departmentSelect.options)
  .filter(option => option.selected)
  .map(option => option.value);

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
