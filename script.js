var outputDatares,dataToSend;
var userDetailKey = 'userDetail';
const dateInput = document.getElementById('myDate');
dateInput.addEventListener('change', function() {
  const selectedDate = dateInput.value; // Returns date in YYYY-MM-DD format
  // console.log('Selected date:', selectedDate);
});

// dateinput = document.getElementById('myDate');
// dateInput.value = '2025-05-20';

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
      newRow.innerHTML = '<td> <div class="membername"> <input type="text" placeholder="john Deo"> </div> </td> <td> <div class="role"> <input type="text" placeholder="Team Leader"> </div> </td> <td> <div class="departments"> <select id="departments" name="department"> <option value="Engineer">Engineer</option> <option value="Design">Design</option> <option value="Product">Product</option> <option value="Marketing">Marketing</option> <option value="Others">Others</option> </select> </div> </td> <!-- hrs/day --> <td> <div class="number-input-group"> <input type="number" class="number-input" id="input1" name="input1" value="4.00" step="0.5" min="2" max="100"> <div class="input-controls"> <button type="button" class="minus-button">-</button> <button type="button" class="plus-button">+</button> </div> </div> </td> <!-- $cost/hr --> <td> <div class="number-input-group"> <input type="number" class="number-input" id="input1" name="input1" value="40.00" step="0.5" min="0" max="100"> <div class="input-controls"> <button type="button" class="minus-button">-</button> <button type="button" class="plus-button">+</button> </div> </div> </td> <!-- billable rate $/hr --> <td> <div class="number-input-group"> <input type="number" class="number-input" id="input1" name="input1" value="40.00" step="0.5" min="0" max="100"> <div class="input-controls"> <button type="button" class="minus-button">-</button> <button type="button" class="plus-button">+</button> </div> </div> </td> <!-- billable ratio % --> <td> <div class="number-input-group"> <input type="number" class="number-input" id="input1" name="input1" value="100.00" step="0.5" min="0" max="100"> <div class="input-controls"> <button type="button" class="minus-button">-</button> <button type="button" class="plus-button">+</button> </div> </div> </td>'
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

    // show output container
    const outputContainer = document.querySelector('.output_container');
    outputContainer.style.display = "block";
    const saveprojBox = document.getElementById('projectDetailBottomBox');
    saveprojBox.style.display = "block";
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
      // console.log('API Response:', data);
      outputDatares = data;
      populateDashboard(data);
    })
    .catch(error => {
      // console.error('API call failed:', error);
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

}

function disenCalculate(){
  let calculateButton = document.getElementById('calcbtn');
  if (!calculateButton) {
    console.error("Calculate button ID might have been changed, please check");
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
    const btn = document.getElementById('signup-btn');
    const span = document.querySelector('.close-button');
    const signupForm = document.getElementById('signupForm');
    const fullnameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const fullnameError = document.getElementById('fullnameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');

    // Function to open the modal
    btn.onclick = function() {
        // if(outputDatares != undefined)
        if(btn.className != "signup-profile")
          modal.style.display = "block";
    }


    // Function to close the modal
    span.onclick = function() {
        modal.style.display = "none";
        resetValidationErrors();
        signupForm.reset();
    }

    // Close modal if user clicks outside of it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            resetValidationErrors();
            signupForm.reset();
        }
    }

    // Function to reset validation error messages
    function resetValidationErrors() {
        fullnameError.textContent = "";
        emailError.textContent = "";
        passwordError.textContent = "";
        confirmPasswordError.textContent = "";
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
          checkNstoreAllDetails(userDetail.username, userDetail.email, userDetail.password);
          modal.style.display = "none";
          signupForm.reset();
        }
    });
});



// ---------------------------------------------------------------
// functions for payments orders confirmation
async function initiatePayment(quantity, currency) {
  const tokensToBuy = quantity * 5;
  let amount;

  // if (currency === 'INR') {
  //   amount = Math.round((quantity * 431.85) * 100);
  // } else if (currency === 'USD') {
  //   amount = quantity * 5 * 100;
  // } else {
  //   console.log('Unsupported currency');
  //   return;
  // }

  try {
    const response = await fetch('/api/payment/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity: quantity, currency: currency }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create order');
    }

    const order = await response.json();
    // console.log('Razorpay Order:', order);

    const options = {
      key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your actual Key ID (public)
      amount: order.amount,
      currency: order.currency,
      name: 'Project Profitablity Estimation',
      description: `Purchase of ${tokensToBuy} Tokens`,
      order_id: order.id,
      handler: async function (response) {
        // console.log('Payment Response:', response);
        const verificationResponse = await fetch('/api/payment/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...response, quantity: quantity }), // Send quantity for verification
        });

        if (verificationResponse.ok) {
          const verificationData = await verificationResponse.json();
          // console.log(verificationData.message || `Payment successful! ${tokensToBuy} tokens credited.`);
          // TODO: Update your frontend UI (e.g., show updated token balance)
        } else {
          const errorData = await verificationResponse.json();
          // console.log(errorData.error || 'Payment verification failed');
        }
      },
      prefill: {
        name: 'Project Profitability Estimator', 
        email: '', 
        contact: '', 
      },
      theme: {
        color: '#3399cc', 
      },
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
  } catch (error) {
    console.error('Payment Error:', error);
    // console.log(error.message);
  }
}

document.getElementById('buy-tokens').addEventListener('click', () => {
  const quantity = parseInt(document.getElementById('token-quantity').value);
  if (!isNaN(quantity) && quantity > 0) {
    const currency = 'INR'; // Or 'USD' based on your logic
    initiatePayment(quantity, currency);
  } else {
    // console.log('Please enter a valid quantity.');
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
  }
  else{
    checkNstoreAllDetails(values.username, values.email, values.password);
  }
}

function checkNstoreAllDetails(usernameVal, emailVal, passwordVal){
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
            retomyprojects();
            // alert("success");
            // Handle success (e.g., show a success message)
        } else {
            const error = await response.json();
            alert("failed");
            // console.error('Error sending data:', error);
        }
    } catch (error) {
        console.error('Fetch error:', error);
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
    signupbtnele.addEventListener('mouseover',()=>{
      dropdown.style.display = 'block';
    })
    signupbtnele.addEventListener('mouseout',()=>{
      dropdown.style.display = 'none';
    })
    dropdown.addEventListener('mouseover',()=>{
      dropdown.style.display = 'block';
    })
    dropdown.addEventListener('mouseout',()=>{
      dropdown.style.display = 'none';
    })
  }
}

function retomyprojects(){
  window.location.href = "myprojects.html";
}