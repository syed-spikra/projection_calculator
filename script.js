var outputDatares,dataToSend;
var userDetailKey = 'userDetail';
var totalcredit,mymemberslist;
document.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.getElementById('myDate');
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  dateInput.value = `${year}-${month}-${day}`;
});

// dateinput = document.getElementById('myDate');
// dateInput.value = '2025-05-20';

// -------------------------------------------------------------
// password handling hide show 
document.addEventListener('DOMContentLoaded', function() {
  const togglePasswordButtons = document.querySelectorAll('.toggle-password');

  togglePasswordButtons.forEach(button => {
      button.addEventListener('click', function() {
          const targetId = this.dataset.target;
          const passwordInput = document.getElementById(targetId);
          const buttonText = this.textContent;
          if (passwordInput) {
              if (passwordInput.classList.contains('password-masked')) {
                  passwordInput.classList.remove('password-masked');
                  this.innerHTML = `<i class='bx bx-hide'></i>`;
              } else {
                  passwordInput.classList.add('password-masked');
                  this.innerHTML = `<i class='bx bxs-hide'></i>`;
              }
          }
      });
  });
});

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


// -------------------------------------------------------------
// add table row depend on the plus/minus of 

document.addEventListener('DOMContentLoaded', () => {
    const teamMemberCountInput = document.querySelector('.teammember_count .number-input');
    const teamMemberTableBody = document.querySelector('.teammember_infos tbody');
    const addTeamMemberButton = document.querySelector('.teammember_count .plus-button');
    const removeTeamMemberButton = document.querySelector('.teammember_count .minus-button');
  
    // Function to create a new table row for a team member
    function createTeamMemberRow(rcount) {
      const newRow = document.createElement('tr');
      newRow.id = "memb"+rcount;
      newRow.innerHTML = '<td> <div class="membername"> <input type="text" placeholder="John Deo"> <div class="names-options-container"><div class="names-options"></div></div></div> </td> <td> <div class="role"> <input type="text" placeholder="CTO"> </div> </td> <td> <div class="departments"> <select id="departments" name="department"> <option value="Engineer">Engineer</option> <option value="Design">Design</option> <option value="Product">Product</option> <option value="Marketing">Marketing</option> <option value="Others">Others</option> </select> </div> </td> <!-- hrs/day --> <td> <div class="number-input-group"> <input type="number" class="number-input" id="input1" name="input1" value="4.00" step="0.5" min="2" max="100"> <div class="input-controls"> <button type="button" class="minus-button">-</button> <button type="button" class="plus-button">+</button> </div> </div> </td> <!-- $cost/hr --> <td> <div class="number-input-group costrate"> <input type="number" class="number-input" id="input1" name="input1" value="40.00" step="0.5" min="0" max="100"> <div class="input-controls"> <button type="button" class="minus-button">-</button> <button type="button" class="plus-button">+</button> </div> </div> </td> <!-- billable rate $/hr --> <td> <div class="number-input-group"> <input type="number" class="number-input" id="input1" name="input1" value="40.00" step="0.5" min="0" max="100"> <div class="input-controls"> <button type="button" class="minus-button">-</button> <button type="button" class="plus-button">+</button> </div> </div> </td> <!-- billable ratio % --> <td> <div class="number-input-group"> <input type="number" class="number-input" id="input1" name="input1" value="100.00" step="0.5" min="0" max="100"> <div class="input-controls"> <button type="button" class="minus-button">-</button> <button type="button" class="plus-button">+</button> </div> </div> </td>'
        // console.log(newRow, rcount);
      return newRow;
    }
  
    // Event listener for the "Number of Team Members" input changes
    teamMemberCountInput.addEventListener('input', ()=>{
        const desiredMemberCount = parseInt(teamMemberCountInput.value);
        const currentRowCount = teamMemberTableBody.querySelectorAll('tr').length;
    
        if (desiredMemberCount > currentRowCount) {
            // console.log("greater value")
            // Add rows
            for (let i = 0; i < desiredMemberCount - currentRowCount; i++) {
            teamMemberTableBody.appendChild(createTeamMemberRow(i+2));
            }
        } else if (desiredMemberCount < currentRowCount && desiredMemberCount >= 1) {
            // Remove rows (but keep at least one)
            for (let i = 0; i < currentRowCount - desiredMemberCount; i++) {
            teamMemberTableBody.removeChild(teamMemberTableBody.lastElementChild);
            }
        }
    });
    
    // Event listeners for the plus and minus buttons on the team member count
    addTeamMemberButton.addEventListener('click', () => {
        let currentCount = parseInt(teamMemberCountInput.value);
        // teamMemberCountInput.value = currentCount + 1;
        teamMemberTableBody.appendChild(createTeamMemberRow(currentCount + 1)); // Pass the new row index
    });

    removeTeamMemberButton.addEventListener('click', () => {
        let currentCount = parseInt(teamMemberCountInput.value);
        if (currentCount > 1) {
        // teamMemberCountInput.value = currentCount - 1;
        teamMemberTableBody.removeChild(teamMemberTableBody.lastElementChild);
        }
    });

    // Prevent direct editing of the number input to ensure consistency
    teamMemberCountInput.addEventListener('change', () => {
      const currentRowCount = teamMemberTableBody.querySelectorAll('tr').length;
      teamMemberCountInput.value = currentRowCount;
    });
});


// -------------------------------------------------------------
// input container onclick events

document.addEventListener('DOMContentLoaded', () => {
    // container's to listen all input events
    const inputContainer = document.querySelector('.input_container');
    // change occurs
    inputContainer.addEventListener('input', disenCalculate);
    // inputContainer.addEventListener('input', (e)=>{
        // console.log("input change occurs");
        // console.log(e.data);
    // });
    // ==============================================

    //  'keydown' - ENTER key
    inputContainer.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        disenCalculate();
        // console.log("Enter event occur");
        // console.log(event);
      }
    });
    // ==============================================
    
    // plus/mins  - clicks
    inputContainer.addEventListener('click', function(event) {
      if (event.target.classList.contains('minus-button') || event.target.classList.contains('plus-button')) {
        // small delay to ensure the input value has updated
        // console.log("plus minus occurs");
        // console.log(event.data);
        setTimeout(disenCalculate, 100);

      }
    });
  });


// -------------------------------------------------------------
// function for handle Input Change And make Api Call
function handleInputChangeAndApiCall() {
    
    // Get references to the input fields you need
    const startDateInput = document.getElementById('myDate');
    const workHoursInput = document.querySelector('.workhrsperday .number-input');
    const totalProjectHoursInput = document.querySelector('.totalprojecthrs .number-input');
    const profitTargetInput = document.querySelector('.profit_target .number-input');
    const teamMemberCountInput = document.querySelector('.teammember_count .number-input');
    const workWeekDaysSelect = document.getElementById('workWeekDays');
    const teamMemberTableBody = document.querySelector('.teammember_infos tbody');
    const teamMemberRows = teamMemberTableBody.querySelectorAll('tr');
  
    // Array of required input elements
    const requiredFields = [
      { element: startDateInput, name: 'Project Start Date' },
      { element: workHoursInput, name: 'Working Hours per Day' },
      { element: totalProjectHoursInput, name: 'Total Project Hours' },
      { element: profitTargetInput, name: 'Target Profit Margin' },
      { element: teamMemberCountInput, name: 'Number of Team Members' },
      { element: workWeekDaysSelect, name: 'Work Week Days' }
    ];
  
    // Check if all required fields have values
    const missingFields = requiredFields.filter(field => !field.element || !field.element.value);
  
    if (missingFields.length > 0) {
      const missingFieldNames = missingFields.map(field => field.name).join(', ');
      // console.log(`Field missing: ${missingFieldNames}`);
      return; // Stop the function if fields are missing
    }
  
    // If all required fields have values, proceed with the API call
    const startDate = startDateInput.value;
    const workHours = parseFloat(workHoursInput.value);
    const totalProjectHours = parseFloat(totalProjectHoursInput.value);
    const profitTarget = parseFloat(profitTargetInput.value);
    const teamMemberCount = parseInt(teamMemberCountInput.value);
    const workWeekDays = workWeekDaysSelect.value;
    const teamMembersData = [];
  
    // Extract data from each team member row
    let hasMissingRowData = false;
    teamMemberRows.forEach(row => {
        const rowId = row.id; // Get the ID of the current row
        const nameInput = row.querySelector('.membername input');
        const roleInput = row.querySelector('.role input'); // Assuming role is also an input
        const departmentSelect = row.querySelector('.departments select');
        const hoursDayInput = row.querySelectorAll('.number-input-group input')[0]; // First number input
        const costRateInput = row.querySelectorAll('.number-input-group input')[1]; // Second number input
        const billableRateInput = row.querySelectorAll('.number-input-group input')[2]; // Third number input
        const billableRatioInput = row.querySelectorAll('.number-input-group input')[3]; // Fourth number input
  
      if (nameInput && roleInput && departmentSelect && hoursDayInput && costRateInput && billableRateInput && billableRatioInput) {
        teamMembersData.push({
          id: rowId, // Add the row ID here
          name: nameInput.value,
          role: roleInput.value,
          department: departmentSelect.value,
          hours_day: parseFloat(hoursDayInput.value),
          cost_rate: parseFloat(costRateInput.value),
          billable_rate: parseFloat(billableRateInput.value),
          billable_ratio: parseFloat(billableRatioInput.value),
        });
      }else {
        // console.log(`Missing data in row with ID: ${rowId}`);
        hasMissingRowData = true;
      }
    });
    if (hasMissingRowData) {
        // console.log("Stopping API call due to missing data in team member rows.");
        return; // Stop the function
      }
      
    document.getElementById('calcbtn').innerHTML = "<i class='bx bxs-calculator bx-flashing' style='color:#ffffff;font-family:sans-serif'></i><i class='bx-flashing'>Calculating..</i>";
    // Prepare the data to send to the backend
    dataToSend = {
      startDate: startDate,
      workHours: workHours,
      totalProjectHours: totalProjectHours,
      profitTarget: profitTarget,
      teamMemberCount: teamMemberCount,
      workWeekDays: workWeekDays,
      teamMembers: teamMembersData,
      // Add other relevant data from your form if needed
    };
  
    // console.log("data2send||=======|||=====/n", dataToSend);
  
    // Make the API call to your Node.js backend
    fetch('https://projection-calc-function.onrender.com/api/calculate', { 
    // fetch('http://localhost:3002/api/calculate',{
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToSend)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); 
    })
    .then(data => {
      if(data.status == 200){
        // console.log('API Response:', data);
        outputDatares = data;
        populateDashboard(data);
      }

    })
    .catch(error => {
      // console.error('API call failed:', error);
      document.getElementById('calcbtn').innerHTML = "Calculate";
      const outputContainer = document.querySelector('.output_container');
      outputContainer.style.display = "hidden";
      const saveprojBox = document.getElementById('projectDetailBottomBox');
      saveprojBox.style.display = "hidden";
    });
  }
  
// set calculated date values
// Function to populate the HTML with the received data
function populateDashboard(data) {
    // Get references to the HTML elements where you want to display the data
    const teamDailyCapacityDisplay = document.querySelector('.Team_Daily_Capacity .outer_subtitle_name');
    const projectedDurationDisplay = document.querySelector('.Projected_Duration .outer_subtitle_name');
    const projectedEndDateDisplay = document.querySelector('.Projected_EndDate .outer_subtitle_name');
  
    const totalHoursDisplay = document.querySelector('.metrics-card .metric-item:nth-child(1) .metric-value');
    const costDisplay = document.querySelector('.metrics-card .metric-item:nth-child(2) .metric-value');
    const revenueDisplay = document.querySelector('.metrics-card .metric-item:nth-child(3) .metric-value');
    const profitDisplay = document.querySelector('.metrics-card .metric-item:nth-child(4) .metric-value');
    const profitMarginDisplay = document.querySelector('.metrics-card .metric-item:nth-child(5) .metric-value');
    const avgBillableRatioDisplay = document.querySelector('.metrics-card .metric-item:nth-child(6) .metric-value');
    const durationDisplay = document.querySelector('.metrics-card .metric-item:nth-child(7) .metric-value');
    const endDateDashboardDisplay = document.querySelector('.metrics-card .metric-item:nth-child(8) .metric-value');
  
    const teamCostsFinancialDisplay = document.querySelector('.Financial_Analysis .Team_Costs .outer_subtitle_name');
    const revenueFinancialDisplay = document.querySelector('.Financial_Analysis .Revenue .outer_subtitle_name');
    const profitLossDisplay = document.querySelector('.Financial_Analysis .Profit_Loss .outer_subtitle_name');
    const profitMarginFinancialDisplay = document.querySelector('.Financial_Analysis .Profit_Margin .outer_subtitle_name');
  
    const teamCostBreakdownTableBody = document.querySelector('.teamcost_breakdown_table table tbody');
    const totalCostBreakdownDisplay = document.querySelector('.teamcost_breakdown_table table tfoot tr td:last-child');
  
    const revenueBreakdownTableBody = document.querySelector('.revenue_breakdown_table table tbody');
    const totalRevenueBreakdownDisplay = document.querySelector('.revenue_breakdown_table table tfoot tr td:last-child');
    const processData = data.processData;
    const totalProjectHoursInput = document.querySelector('.totalprojecthrs .number-input');
    

    // Project Timeline Projection
    teamDailyCapacityDisplay.textContent = `${processData.teamDailyCapacity} hours/day`;
    projectedDurationDisplay.textContent = `${(processData.projectedDuration).toFixed(1)} days`;
    projectedEndDateDisplay.textContent = processData.projectedEndDate;

    // Project Dashboard
    totalHoursDisplay.textContent = totalProjectHoursInput.value;
    costDisplay.textContent = `$ ${(processData.teamCosts).toFixed(2)}`;
    revenueDisplay.textContent = `$ ${(processData.revenueBreakdown.totalRevenue).toFixed(2)}`;
    profitDisplay.textContent = `$ ${(processData.profitLoss).toFixed(2)}`;
    profitMarginDisplay.textContent = `${(processData.profitMargin).toFixed(2)} %`;
    avgBillableRatioDisplay.textContent = `${(processData.averageBillableRatio).toFixed(2)} % (all)`;
    durationDisplay.textContent = `${(processData.projectedDuration).toFixed(2)} working days`;
    endDateDashboardDisplay.textContent = processData.projectedEndDate;

    // Financial Analysis
    teamCostsFinancialDisplay.textContent = `$${(processData.teamCosts).toFixed(2)}`;
    revenueFinancialDisplay.textContent = `$${(processData.mainRevenue).toFixed(2)}`;
    profitLossDisplay.textContent = `$${(processData.profitLoss).toFixed(2)}`;
    profitMarginFinancialDisplay.textContent = `${(processData.profitMargin).toFixed(2)}%`;

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

    // show output container
    const outputContainer = document.querySelector('.output_container');
    outputContainer.style.display = "block";
    const saveprojBox = document.getElementById('projectDetailBottomBox');
    saveprojBox.style.display = "block";
    document.getElementById('calcbtn').innerHTML = "Calculate";
    document.getElementById('output_container').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function disenCalculate(){
  let calculateButton = document.getElementById('calcbtn');
  if (!calculateButton) {
    // console.error("Calculate button ID might have been changed, please check");
    return;
  }

  let requiredInputs = document.querySelectorAll('.input_container input[type="date"], .input_container input[type="number"], .input_container select, .teammember_infos tbody tr input[type="text"], .teammember_infos tbody tr input[type="number"], .teammember_infos tbody tr select');
  let allRequiredFilled = true;

  requiredInputs.forEach(input => {
    if (input.value.trim() === '') {
      allRequiredFilled = false;
      // console.log(`Required field empty: ${input.id || input.name || input.className}`);
    }
  });

  if (allRequiredFilled) {
    calculateButton.classList.remove('disable-calcbtn');
    calculateButton.classList.add('calcbtn');
  } else {
    calculateButton.classList.remove('calcbtn');
    const outputContainer = document.querySelector('.output_container');
    outputContainer.style.display = "none";
    const saveprojBox = document.getElementById('projectDetailBottomBox');
    saveprojBox.style.display = "none";
    document.getElementById('calcbtn').innerHTML = "Calculate";
    calculateButton.classList.add('disable-calcbtn');
  }
}

document.getElementById('calcbtn').addEventListener('click', (e)=>{
  let calculateClsName = e.target.className;
  if(calculateClsName == "calcbtn")
    handleInputChangeAndApiCall();
})

// modal functions down
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('saveProjectModal');
    const signinmodal = document.getElementById('signInModal');
    const paymentmodal = document.getElementById('paymentModal');
    const btn = document.getElementById('signup-btn');
    const span = document.querySelector('.signup-close-button');
    const signinclose = document.querySelector('.signin-close-button');
    const paymentclose = document.querySelector('.payment-close-button');
    const signupForm = document.getElementById('signupForm');
    const signInForm = document.getElementById('signInForm');
    const fullnameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const fullnameError = document.getElementById('fullnameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    const signInEmailInput = document.getElementById('signInEmail');
    const signInPasswordInput = document.getElementById('signInPassword');
    const signInEmailError = document.getElementById('signInEmailError');
    const signInPasswordError = document.getElementById('signInPasswordError');
    const switchToSignUp = document.getElementById('switchToSignUp');

    // Function to open the modal
    btn.onclick = function() {
        // if(outputDatares != undefined)
        if(btn.className != "signup-profile")
          signinmodal.style.display = "block";
    }

    switchToSignUp.onclick = function(){
      signinmodal.style.display = "none";
      modal.style.display = "block";
    }

    // Function to close the modal
    span.onclick = function() {
        modal.style.display = "none";
        resetValidationErrors();
        signupForm.reset();
    }
    signinclose.onclick = function(){
      signinmodal.style.display = "none";
      resetsigninValidations();
      signInForm.reset();
    }
    paymentclose.onclick = function() {
      paymentmodal.style.display = "none";
    }
    // Close modal if user clicks outside of it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            resetValidationErrors();
            signupForm.reset();
        }
        if(event.target == signinmodal){
          signinmodal.style.display = "none";
          resetsigninValidations();
          signInForm.reset();
        }
    }

    // Function to reset validation error messages
    function resetValidationErrors() {
        fullnameError.textContent = "";
        emailError.textContent = "";
        passwordError.textContent = "";
        confirmPasswordError.textContent = "";
    }
    function resetsigninValidations(){
      signInEmailError.textContent = "";
      signInPasswordError.textContent = "";
    }
    // Function to validate email using regex
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Event listener for form submission
    signupForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        resetValidationErrors();
        let isValid = true;

        // Validate Full Name
        if (fullnameInput.value.trim() === "") {
            fullnameError.textContent = "Full Name is required.";
            isValid = false;
        }

        // Validate Email
        if (emailInput.value.trim() === "") {
            emailError.textContent = "Email is required.";
            isValid = false;
        } else if (!isValidEmail(emailInput.value.trim())) {
            emailError.textContent = "Invalid email format.";
            isValid = false;
        }

        // Validate Password
        if (passwordInput.value.trim() === "") {
          passwordError.textContent = "Password is required.";
          isValid = false;
        } else if (passwordInput.value.trim().length < 8) {
          passwordError.textContent = "Password must be at least 8 characters.";
          isValid = false;
        } else {
          // Regex to check for at least one lowercase, one uppercase, one number, and one symbol
          const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
          if (!passwordRegex.test(passwordInput.value.trim())) {
              passwordError.textContent = "Password must contain at least 8 characters, 1 lowercase, 1 uppercase, 1 number, and 1 symbol.";
              isValid = false;
          }
        }

        // Validate Confirm Password
        if (confirmPasswordInput.value.trim() === "") {
          confirmPasswordError.textContent = "Confirm Password is required.";
          isValid = false;
        } else if (confirmPasswordInput.value.trim() !== passwordInput.value.trim()) {
            confirmPasswordError.textContent = "Passwords do not match.";
            isValid = false;
        }

        if(isValid){
          let userDetail = {
            username: fullnameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value.trim()
          };
          localStorage.setItem(userDetailKey, JSON.stringify(userDetail));
          // console.log("inside localstorage");
          checkNstoreAllDetails(userDetail.username, userDetail.email, userDetail.password, "from_signup_btn");
        }
    });

    signInForm.addEventListener('submit', function(event) {
      event.preventDefault();
      resetsigninValidations();
      let isValid = true;

      // Validate Email
      if (signInEmailInput.value.trim() === "") {
          signInEmailError.textContent = "Email is required.";
          isValid = false;
      } else if (!isValidEmail(signInEmailInput.value.trim())) {
          signInEmailError.textContent = "Invalid email format.";
          isValid = false;
      }

      // Validate Password
      if (signInPasswordInput.value.trim() === "") {
          signInPasswordError.textContent = "Password is required.";
          isValid = false;
      } else if (signInPasswordInput.value.trim().length < 8) {
          signInPasswordError.textContent = "Password must be at least 8 characters.";
          isValid = false;
      } else {
          // You might choose to apply the same strong password regex here if desired for sign-in as well
          // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
          // if (!passwordRegex.test(signInPasswordInput.value.trim())) {
          //     signInPasswordError.textContent = "Password must contain at least 8 characters, 1 lowercase, 1 uppercase, 1 number, and 1 symbol.";
          //     isValid = false;
          // }
      }

      if (isValid) {
          const loginUserDetail = {
              email: signInEmailInput.value.trim(),
              password: signInPasswordInput.value.trim()
          };
          // console.log("Signing in with:", loginUserDetail);

          fetch(`https://projection-calc-function.onrender.com/api/get-loginuser/${signInEmailInput.value.trim()}`, {
            // fetch(`http://localhost:3002/api/get-loginuser/${signInEmailInput.value.trim()}`, {
              method: 'GET',
            })
            .then(response => response.json())
            .then(data => {
              if (data.message=="Exists") {
                // console.log("||+++||+++||",data);
                let userDetail = {
                  username: data.userDetails.fullname,
                  email: data.userDetails.email,
                  password: data.userDetails.password
                };
                if (userDetail.email === loginUserDetail.email && userDetail.password === loginUserDetail.password) {
                    // console.log("Sign In Successful!");
                    localStorage.setItem(userDetailKey,JSON.stringify(userDetail));
                    signinmodal.style.display="none";
                    window.location.reload();
                } else {
                    signInPasswordError.textContent = "Invalid email or password.";
                }
              } else {
                  signInEmailError.textContent = "User not found. Please sign up.";
              }
            })
            .catch(error => {
                // console.error('Error deleting member:', error);
            });
      }
    });
});



// ---------------------------------------------------------------
// functions for memberslist dropdown
async function fetchnsetUserMembers() {
  try {
    const currentUserDetails = localStorage.getItem('userDetail');
    const parsedUserDetails = JSON.parse(currentUserDetails);
    if (!parsedUserDetails || !parsedUserDetails.email) {
      console.error('Error: Could not retrieve user email from localStorage.');
      return;
    }
    const usermail = parsedUserDetails.email;
    const fetchUrl = `https://projection-calc-function.onrender.com/api/get-user-members/${usermail}`;
    // const fetchUrl ='http://localhost:3002/api/get-user-members/'+usermail;

    const response = await fetch(fetchUrl, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    mymemberslist = await data[0].memberslist;
  } catch (error) {
    console.error('API call failed:', error);
  }
}


// old table row name input eventlistener
// document.querySelector('.temmember_table_div table tbody').addEventListener('click', function(event){
//     let nameInput = event.target.closest('.membername input[type="text"]');
//     if (nameInput) {
//         let tabrow = nameInput.closest('tr');
//         const optionsContainer = tabrow.querySelector('.names-options-container');
//         const optionsDiv = tabrow.querySelector('.names-options');
//         // Clear previous options
//         optionsDiv.innerHTML = '';

//         // Populate names options
//         mymemberslist.forEach(member => {
//             const li = document.createElement('li');
//             li.textContent = `${member.memberName} (${member.memberRole})`;
//             li.addEventListener('click', function() {
//                 // Set values in the current tabrow
//                 tabrow.querySelector('.membername input').value = member.memberName;
//                 tabrow.querySelector('.role input').value = member.memberRole;
//                 tabrow.querySelector('.departments select').value = member.memberDepartment;
//                 tabrow.querySelector('.costrate input').value = member.memberCostperhrs;

//                 // Hide the options
//                 optionsContainer.classList.remove('show');
//             });
//             optionsDiv.appendChild(li);
//         });

//         // Show the options container
//         optionsContainer.classList.add('show');

//         // Position the options container correctly
//         const inputRect = nameInput.getBoundingClientRect();
//         optionsContainer.style.position = 'absolute';
//         // optionsContainer.style.top = `${inputRect.bottom + window.scrollY}px`;
//         // optionsContainer.style.left = `${inputRect.left + window.scrollX}px`;
//         // optionsContainer.style.width = `${inputRect.width}px`;

//         // Handle clicks outside to close the options
//         function handleClickOutside(event) {
//             if (!event.target.closest('.membername')) {
//                 optionsContainer.classList.remove('show');
//                 document.removeEventListener('click', handleClickOutside);
//             }
//         }
//         document.addEventListener('click', handleClickOutside);
//     }
// });

// new table row nampe input eventlistener
const tableBody = document.querySelector('.temmember_table_div table tbody');
let activeOptionsContainer = null;
let focusedListItemIndex = -1;
let currentInput;
let currentTableRow;

function hideAllOpenContainers() {
    const openContainers = document.querySelectorAll('.names-options-container.show');
    openContainers.forEach(container => {
        if (container !== activeOptionsContainer) {
            container.classList.remove('show');
        }
    });
}

function populateNameOptions(inputElement, optionsContainer, optionsDiv, searchTerm = '') {
  optionsDiv.innerHTML = '';
  if (!Array.isArray(mymemberslist)) {
    console.error('Error: mymemberslist is not an array or is undefined.');
    // const li = document.createElement('li');
    // li.textContent = 'Error loading members';
    // li.classList.add('disabled');
    // optionsDiv.appendChild(li);
    return; // Exit the function to prevent further errors
  }
  const filteredMembers = mymemberslist.filter(member =>
      member.memberName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredMembers.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'No member found';
      li.classList.add('disabled'); // Add a class for styling if needed
      optionsDiv.appendChild(li);
  } else {
      filteredMembers.forEach((member, index) => {
          const li = document.createElement('li');
          li.textContent = `${member.memberName} (${member.memberRole})`;
          li.dataset.index = index; // Store index for arrow navigation
          li.addEventListener('click', function() {
              populateTableRow(currentTableRow, member);
              optionsContainer.classList.remove('show');
              activeOptionsContainer = null;
              currentInput.focus(); // Keep focus on the input after selection
          });
          optionsDiv.appendChild(li);
      });
  }

  focusedListItemIndex = -1; // Reset focus index when options change
}

function populateTableRow(row, member) {
    row.querySelector('.membername input').value = member.memberName;
    row.querySelector('.role input').value = member.memberRole;
    row.querySelector('.departments select').value = member.memberDepartment;
    row.querySelector('.costrate input').value = member.memberCostperhrs;
}

tableBody.addEventListener('click', function(event) {
    const nameInput = event.target.closest('.membername input[type="text"]');
    if (nameInput) {
        currentInput = nameInput;
        currentTableRow = nameInput.closest('tr');
        const optionsContainer = currentTableRow.querySelector('.names-options-container');
        const optionsDiv = currentTableRow.querySelector('.names-options');

        hideAllOpenContainers(); // Hide other open containers
        activeOptionsContainer = optionsContainer;

        populateNameOptions(nameInput, optionsContainer, optionsDiv, nameInput.value);

        // Position the options container correctly
        const inputRect = nameInput.getBoundingClientRect();
        optionsContainer.style.position = 'absolute';
        // optionsContainer.style.top = `${inputRect.bottom + window.scrollY}px`;
        // optionsContainer.style.left = `${inputRect.left + window.scrollX}px`;
        // optionsContainer.style.width = `${inputRect.width}px`;
        optionsContainer.classList.add('show');

        // No need for a global click listener to hide, as focusout on input handles this

        nameInput.addEventListener('focusout', function(e) {
            // Prevent immediate hide if focus goes to the options container
            if (!e.relatedTarget || !e.relatedTarget.closest('.names-options-container')) {
                setTimeout(() => {
                    optionsContainer.classList.remove('show');
                    activeOptionsContainer = null;
                }, 100); // Small delay to allow click on options
            }
        });

        nameInput.addEventListener('input', function() {
            populateNameOptions(nameInput, optionsContainer, optionsDiv, this.value);
            optionsContainer.classList.add('show'); // Ensure it's visible on input
        });

        nameInput.addEventListener('keydown', function(e) {
          const listItems = optionsDiv.querySelectorAll('li');
          if (listItems.length > 0) {
              if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  focusedListItemIndex++;
                  if (focusedListItemIndex >= listItems.length) {
                      focusedListItemIndex = 0; // Cycle back to the top
                  }
                  listItems.forEach(item => item.classList.remove('focused'));
                  listItems[focusedListItemIndex].classList.add('focused');
                  optionsDiv.scrollTop = listItems[focusedListItemIndex].offsetTop - optionsDiv.offsetTop;
              } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  focusedListItemIndex--;
                  if (focusedListItemIndex < 0) {
                      focusedListItemIndex = listItems.length - 1; // Cycle to the bottom
                  }
                  listItems.forEach(item => item.classList.remove('focused'));
                  listItems[focusedListItemIndex].classList.add('focused');
                  optionsDiv.scrollTop = listItems[focusedListItemIndex].offsetTop - optionsDiv.offsetTop;
              } else if (e.key === 'Enter' && focusedListItemIndex !== -1) {
                  e.preventDefault();
                  const selectedListItem = listItems[focusedListItemIndex];
                  const memberIndex = parseInt(selectedListItem.dataset.index);
                  populateTableRow(currentTableRow, mymemberslist[memberIndex]);
                  optionsContainer.classList.remove('show');
                  activeOptionsContainer = null;
                  this.blur(); // Remove focus from input
              }
          }
      });
    }
});

// onchange for the projectdetailinfo container
document.addEventListener('DOMContentLoaded', () => {
  // container's to listen all input events
  const projectdetailBox = document.querySelector('.projectDetailInfo');
  // change occurs
  projectdetailBox.addEventListener('input', checkProjectDetailInfo);
  // ==============================================

  //  'keydown' - ENTER key
  projectdetailBox.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      checkProjectDetailInfo();
      // console.log("Enter event occur");
      // console.log(event);
    }
  });
  // ==============================================
  
});

function checkProjectDetailInfo(){
  // console.log("inside theiss funciton");
  let projectName = document.getElementById('projectName');
  let saveprojbtn = document.getElementById('save-project-button');
  let allRequiredFilled = true;
  if(projectName.value.trim() === '')
    allRequiredFilled = false;
  if (allRequiredFilled) {
    saveprojbtn.classList.remove('disable-saveprojbtn');
    saveprojbtn.classList.add('saveprojbtn');
  } else {
    saveprojbtn.classList.remove('saveprojbtn');
    saveprojbtn.innerHTML = "Save Projedaccct";
    saveprojbtn.classList.add('disable-saveprojbtn');
  }
}

document.getElementById('save-project-button').addEventListener('click',(e)=>{
  let saveprojbtnClsName = e.target.className;
  if(saveprojbtnClsName == "saveprojbtn")
    userDetailPopupModal();
})

function userDetailPopupModal(){
  let storedUserDetail = localStorage.getItem(userDetailKey);
  let values =  storedUserDetail ? JSON.parse(storedUserDetail) : null;
  if(values == null){
    // console.log("not stored");
    let signupmodal = document.getElementById('saveProjectModal');
    signupmodal.style.display = 'block';
  }else if(totalcredit <= 0){
    let paymentmodal = document.getElementById('paymentModal');
    paymentmodal.style.display = "block";
  }else{
    checkNstoreAllDetails(values.username, values.email, values.password, "from_save_btn");
  }
}

async function checkNstoreAllDetails(usernameVal, emailVal, passwordVal, ticketfrom){
  if(ticketfrom == "from_signup_btn"){
    let usercreateData = {
      name: usernameVal,
      email: emailVal,
      password: passwordVal
    }
    try {
      const response = await fetch('https://projection-calc-function.onrender.com/api/createuser', {
        // const response = await fetch('http://localhost:3002/api/createuser', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(usercreateData)
      });

      if (response.ok) {
          const result = await response.json();
      } else {
          const error = await response.json();
      }
    } catch (error) {
        // console.error('Fetch error:', error);
    }
    document.getElementById('saveProjectModal').style.display = "none";
    document.getElementById('signupForm').reset();
    window.location.reload();
    return;
  }
  document.getElementById('save-project-button').innerHTML = "<i class='bx bx-upload bx-flashing' style='color:#ffffff' ></i><i class='bx-flashing'> Saving..</i>";
  // alert("inside project store function");
    // Get the project title and the output data (assuming it's stored in a variable called 'outputData')
    const projectTitle = document.getElementById('projectName').value || "project Unknown";
    const projectdes = document.getElementById('projectDescription').value || "";
    // outputDatares = "some";
    // Assuming 'outputData' is available in the global scope or you can access it here
    const outputData = JSON.parse(JSON.stringify(outputDatares)) || null; // Replace yourOutputData
    const userData = {
        fullname: usernameVal,
        email: emailVal,
        password: passwordVal,
        projectDetails: {
            projectTitle: projectTitle,
            projectDescription: projectdes,
            projectInput: dataToSend ?? "no data",
            projectOutput: outputData.processData ?? null
        }
    };
    // console.log("*****",userData);
    // Call the function to send data to the backend
    // alert(JSON.stringify(userData));
    // --comment le irundha, uncomment pannu sikkrama | alert check pannadradhuku comment pota, alert illana idha(sendUserDataToBackend) thooki vidu--
    sendUserDataToBackend(userData);


    // Optionally close the modal after successful submission
    // modal.style.display = "none";
    // signupForm.reset();
  
}
// Function to send user data to the backend (replace with your actual API call)
async function sendUserDataToBackend(userData) {
    try {
        const response = await fetch('https://projection-calc-function.onrender.com/api/process-project-data', {
          // const response = await fetch('http://localhost:3002/api/process-project-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            const result = await response.json();
            // console.log('Success:', result.result_response);
            // window.location.href = "myprojects.html";
            document.getElementById('save-project-button').innerHTML = "Save Project";
            retomyprojects();
            // alert("success");
            // Handle success (e.g., show a success message)
        } else {
            const error = await response.json();
            // alert("failed");
            // console.error('Error sending data:', error);
        }
    } catch (error) {
        // console.error('Fetch error:', error);
    }
}

// document.getElementById('signup-btn').addEventListener('click',()=>{
//   userDetailPopupModal();
// })

function checkcurrUser(){
  let storedUserDetail = localStorage.getItem(userDetailKey);
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
    // signupbtnele.addEventListener('mouseout', () => {
    //   setTimeout(() => {
    //     dropdown.style.display = 'none';
    //   }, 1200);
    // });    
    // dropdown.addEventListener('mousemove',()=>{
    //   dropdown.style.display = 'block';
    // })
    // dropdown.addEventListener('mouseout',()=>{
    //   dropdown.style.display = 'none';
    // })
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
    let fetchUrl = 'https://projection-calc-function.onrender.com/api/get-tokens-count/'+values.email;
    // let fetchUrl = 'http://localhost:3002/api/get-tokens-count/'+values.email;
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
      if(data.message == "Success"){
        document.getElementById('token-count').innerHTML = (data.creditcount || 0)+ " Left";
        document.getElementsByClassName('tokens-remian')[0].style.display = "block flex";
        totalcredit = data.creditcount || 0;
      }
      else{
        document.getElementsByClassName('tokens-remian')[0].style.display = "none";
      }
    })
    .catch(error => {
      console.error('API call failed:', error);
    });
    fetchnsetUserMembers();
  }
}

function retomyprojects(){
  window.location.href = "myprojects.html";
}
function retomymembers(){
  window.location.href = "mymembers.html";
}

function curruserlogout(){
  localStorage.removeItem(userDetailKey);
  window.location.reload();
}

document.getElementById('tokens-remian').addEventListener('click',()=>{
  let paymentmodal = document.getElementById('paymentModal');
  paymentmodal.style.display = "block";
})

document.getElementById('pay-btn').addEventListener('click',()=>{
  window.location.href = "https://pages.razorpay.com/entask";
})