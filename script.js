let payments = JSON.parse(localStorage.getItem("payments")) || [];
let editIndex = -1;

// LOGIN
function showLogin(){
  document.getElementById("loginBox").classList.remove("d-none");
  document.getElementById("userPage").classList.add("d-none");
}
function closeLogin(){
  document.getElementById("loginBox").classList.add("d-none");
  document.getElementById("userPage").classList.remove("d-none");
}
function adminLogin(){
  let user=document.getElementById("adminUser").value;
  let pass=document.getElementById("adminPass").value;

  if(user==="admin" && pass==="1111"){
    
    // user page hide
    document.getElementById("userPage").classList.add("d-none");

    // login box hide
    document.getElementById("loginBox").classList.add("d-none");

    // admin panel show
    document.getElementById("adminPanel").classList.remove("d-none");

    dashboard();

  } else {
    alert("Invalid Login");
  }
}
// USER VIEW
function renderUser(){
  let search=document.getElementById("search").value.toLowerCase();
  let html="";

  payments.forEach(p=>{
    if(search && !p.name.toLowerCase().includes(search)) return;

    html+=`
    <tr>
      <td>${p.name}</td>
      <td>₹${p.amount}</td>
      <td class="${p.status.toLowerCase()}">${p.status}</td>
    </tr>`;
  });

  document.getElementById("userTable").innerHTML=html;
}

//  UPDATED DASHBOARD WITH CHART
function dashboard(){
  let paid=0, pending=0, failed=0;

  payments.forEach(p=>{
    if(p.status==="Paid") paid++;
    if(p.status==="Pending") pending++;
    if(p.status==="Failed") failed++;
  });

  document.getElementById("content").innerHTML=`
    <h3>Dashboard</h3>
    <canvas id="myChart" height="100"></canvas>
  `;

  setTimeout(()=>{
    new Chart(document.getElementById("myChart"),{
      type:"doughnut",
      data:{
        labels:["Paid","Pending","Failed"],
        datasets:[{
          data:[paid,pending,failed],
          backgroundColor:["green","orange","red"]
        }]
      }
    });
  },100);
}

// PAYMENTS
function paymentsPage(){

  let html = `
    <h3>Payments</h3>

    <input
      type="text"
      id="filter"
      class="form-control mb-3"
      placeholder="Filter by status..."
      onkeyup="filterPayments()"
    >

    <table class="table table-bordered">

      <thead class="table-dark">
        <tr>
          <th>Name</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody id="paymentTable"></tbody>

    </table>
  `;

  document.getElementById("content").innerHTML = html;

  filterPayments();
}


// FILTER
function filterPayments(){

  let filter =
    document.getElementById("filter")
    .value
    .toLowerCase();

  let html = "";

  payments.forEach((p, i) => {

    if(
       filter &&
       !p.name.toLowerCase().includes(filter) &&
       !p.status.toLowerCase().includes(filter) &&
       !p.amount.toString().includes(filter)
      )
    {
      return;
    }

    html += `
      <tr>

        <td>${p.name}</td>

        <td>₹${p.amount}</td>

        <td class="${p.status.toLowerCase()}">
          ${p.status}
        </td>

        <td>

          <button
            class="btn btn-primary mb-2 btn-sm"
            onclick="editPayment(${i})"
          >
            Edit
          </button>

          <button
            class="btn btn-danger mb-2 btn-sm"
            onclick="deletePayment(${i})"
          >
            Delete
          </button>

        </td>

      </tr>
    `;
  });

  document.getElementById("paymentTable").innerHTML = html;
}

// ADD
function addPage(){
  editIndex=-1;

  document.getElementById("content").innerHTML=`
  <h3>Add Payment</h3>
  <input id="name" class="form-control mb-2 w-50" placeholder="Name">
  <input id="amount" type="number" class="form-control mb-2 w-50" placeholder="Amount">
  <select id="status" class="form-control mb-2 w-50">
    <option>Paid</option>
    <option>Pending</option>
    <option>Failed</option>
  </select>
  <button class="btn btn-success" onclick="savePayment()">Save</button>`;
}

// EDIT
function editPayment(i){
  let p=payments[i];
  editIndex=i;

  document.getElementById("content").innerHTML=`
  <h3>Edit Payment</h3>
  <input id="name" class="form-control mb-2" value="${p.name}">
  <input id="amount" type="number" class="form-control mb-2" value="${p.amount}">
  <select id="status" class="form-control mb-2">
    <option ${p.status=="Paid"?"selected":""}>Paid</option>
    <option ${p.status=="Pending"?"selected":""}>Pending</option>
    <option ${p.status=="Failed"?"selected":""}>Failed</option>
  </select>
  <button class="btn btn-warning" onclick="savePayment()">Update</button>`;
}

// SAVE
function savePayment(){ 
  let name=document.getElementById("name").value; 
  let amount=document.getElementById("amount").value; 
  let status=document.getElementById("status").value; 

  if(!name||!amount){alert("Fill all");return;} 

  if(editIndex==-1){ 
    payments.push({name,amount,status}); 
  }else{ 
    payments[editIndex]={name,amount,status}; 
  } 

  localStorage.setItem("payments",JSON.stringify(payments)); 

  //  reload
  payments = JSON.parse(localStorage.getItem("payments")) || [];

  //  admin page update
  paymentsPage();

  //   user home page update
  renderUser();
}

// DELETE
function deletePayment(i){
  payments.splice(i,1);
  localStorage.setItem("payments",JSON.stringify(payments));

//  latest data reload
payments = JSON.parse(localStorage.getItem("payments")) || [];

//  admin update
paymentsPage();

//   THIS LINE IMPORTANT
renderUser();
}

// LOGOUT
function logout(){
  document.getElementById("adminPanel").classList.add("d-none");
  document.getElementById("userPage").classList.remove("d-none");
}

//  DARK MODE
function toggleDark(){
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
}
if(localStorage.getItem("darkMode")==="true"){
  document.body.classList.add("dark");
}

// INIT
renderUser();