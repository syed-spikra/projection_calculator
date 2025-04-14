var allmembersData;
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
            // populateMembersdash([]);
          });
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

    if(membersData && membersData.length > 0){
        memberslist = membersData[0].memberslist;
        memberslist.forEach((member, index) => {
            const mrow = membersListBody.insertRow();
            mrow.id = `member-${index}`;
            mrow.classList.add('member-row');

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
        });
    }else {
        const row = membersListBody.insertRow();
        const nomembersCell = row.insertCell();
        nomembersCell.colSpan = 4; // Span across all columns
        nomembersCell.textContent = 'No members found.';
        nomembersCell.classList.add('no-members-cell');
    }
}