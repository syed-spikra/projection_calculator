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
function populateMembersdash(membersData){
    const membersListBody = document.getElementById('memberlistbody');
    membersListBody.innerHTML = '';
    emailidfromresponse = membersData[0].userDetails.email;
    if(membersData && membersData.length > 0){
        memberslist = membersData[0].memberslist;
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
            memberDeptcell.classList.add('member-role-cell');
            const memberDeptSpan = document.createElement('span');
            memberDeptSpan.textContent = member.memberDepartment;
            memberDeptcell.appendChild(memberDeptSpan);

            const membercostratecell = mrow.insertCell();
            membercostratecell.classList.add('member-role-cell');
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
            tbodyrow.cells[lastCellIndex].innerHTML = `<td><button type="button" class="cancel-button" onclick="thispagereload()">x</button><button type="button" class="check-button" onclick="handlememberDelete('${emailval}','${memjson.memberName}','${memjson.memberRole}','${memjson.memberDepartment}','${memjson.memberCostperhrs}')">Yes delete</button></td>`;
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
function handlememberDelete(emailVal,mname,mrole,mdept,mcost){
    // console.log(emailVal);
    let memberToDelete = {
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
        <button type="button" class="check-button" onclick="handleAddNewMemberRow('${membernumber}')">✓</button>
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
