connect.core.initCCP(containerDiv, {
    ccpUrl: 'https://nikqikdevall.my.connect.aws/ccp-v2',        /*REQUIRED (*** has been replaced) */
    loginPopup: true,               // optional, defaults to `true`
    loginPopupAutoClose: true,      // optional, defaults to `true`
    loginOptions: {                 // optional, if provided opens login in new window
    autoClose: true,              // optional, defaults to `false`
    height: 600,                  // optional, defaults to 578
    width: 400,                   // optional, defaults to 433
    top: 0,                       // optional, defaults to 0
    left: 0    
       }, 
    region: "ap-southeast-2",        /*optional, default TRUE*/
    softphone:     {              /*optional*/
       allowFramedSoftphone: true
    }
 });

 connect.contact(function(contact) {
         connect.core.onAccessDenied(function(contact){
           window.open("https://nikqikdevall.awsapps.com/connect/login")
         })
         contact.onIncoming(function(contact) {
          console.log("Incoming call")
          var attributeMap = contact.getAttributes();
          var list = GiveAttributesList(attributeMap);
          RenderTable(list)
         });
 
         contact.onRefresh(function(contact) {
         });
 
         contact.onAccepted(function(contact) {

            window.open('https://nikqikninja.freshservice.com/a/tickets/new', '_blank');

            // window.open('https://nikqiktechnologies273.freshservice.com/a/tickets/new', '_blank', 'width=800,height=800');

           });
 
         contact.onEnded(function() {
          
         });
 
         contact.onConnected(function() {

                 console.log(`onConnected(${contact.getContactId()})`);
                 contactId = contact.getContactId();

                 initialContactId = contact.getInitialContactId();
                 console.log('Initial Contact ID:', initialContactId);

                 var callerName = contact.getAttributes().CallerName;
                 var mobileNumber = contact.getAttributes().MobileNumber;
                 var callerIssue = contact.getAttributes().CallerIssue;
         
                 console.log(callerName.value);
                 console.log(mobileNumber.value);
                 console.log(callerIssue.value);
                 console.log(contact.getContactId());
                 
                 document.getElementById("callerName").textContent = callerName.value;
                 document.getElementById("phoneNumber").textContent = mobileNumber.value;
                 document.getElementById("contactID").textContent = contact.getContactId();
                 document.getElementById("callerIssue").textContent = callerIssue.value;
             
                 if (agentCall) {
                    console.log("This is agent to agent call")
                    window.ccp.agent.getEndpoints(window.ccp.agent.getAllQueueARNs(), {
                        success: function (data) {
                            console.log("Adding connection to selected agent")
                            var selectedIndex = $("#agentCalling").prop('selectedIndex');
                            window.ccp.agent.getContacts(connect.ContactType.VOICE)[0].addConnection(data.endpoints[selectedIndex], {});
                        },
                        failure: function () {
                            console.log("failed to place the call to the agent");
                        }
                    });
                }
         });
 });
 
 connect.agent(agent => {
    // console.log("Agent connected")
    // window.ccp.agent = agent;
    // var config = agent.getConfiguration()
    getAgents(agent);
    GetAgentInfo(agent);
    getQueues(agent);
    setInterval(function () {
        getQueues(agent);
    }, 30000);
});

function getAgents(agent) {
    console.log("Generating agent list")
    agent.getEndpoints(agent.getAllQueueARNs(), {
       success: function (data) {
           console.log("fetched the agent list")
           var dropdowns = data.endpoints;
           console.log(dropdowns.length);
           var i;
           var totalOptions = [];
           for (i = 0; i < dropdowns.length; i++) {
               var openDropdown = new Option(dropdowns[i].name);
               totalOptions.push(openDropdown);
           }
           console.log(totalOptions)
           $("#agentCalling").append(totalOptions);
               $('#agentCalling').on('change', function() {
                   console.log( $(this).find(":selected").val());
               });
       },
       failure: function () {
           console.log("Failed to generate agent list")
       }
   });
   $("#placeCall").click(() => {
       console.log("Clicked on placing call")
       agentCall = true;
       agent.connect(connect.Endpoint.byPhoneNumber("+61272567820"), {});
   });
}



//  $(document).ready(function(){
//      console.log("Jquery working")
//     //  $("#agent-name").html("Ankit")
//     // var list = GiveAttributesList(obj);
//     // RenderTable(list)
//  });
 
//  const GiveAttributesList = (obj) => {
//     var attributesKeys = Object.keys(obj)
//     if(attributesKeys.length > 0){
//         var attributesArray = []
//         for (var i = 0 ; i< attributesKeys.length ; i++){
//             var item = {}
//             item.name = attributesKeys[i]
//             item.value = obj[attributesKeys[i]]['value'];         
//             attributesArray.push(item)
//         }
//         return attributesArray
//     }else{
//         return []
//     }   
//  }
 
//  const RenderTable = (list) => {
//     console.log("Showing table")
//     $(".attributes-table-row").remove();
//     list.map((item , index) => {
//        $("#attributes-table-body").append(`<tr class='attributes-table-row'><th scope='row'>${index+1}</th><td>${item.name}</td><td>${item.value}</td></tr>`)
//     }
//     )
   
//  }
 

 const GetAgentInfo = () => {
    console.log("Getting Agent info")
     var agent = new connect.Agent
     console.log("Agent Object" , agent)
     var config = agent.getConfiguration()
     var agentName = agent.getName()
     var agentStates = agent.getAgentStates();
    //  var routingProfile = agent.getRoutingProfile();
     
     document.getElementById("agentName").textContent = agentName;
    //  document.getElementById("routingProfile").textContent = routingProfile.name;
    //  document.getElementById("agentQueue").textContent = routingProfile.defaultOutboundQueue.name;

     console.log("Retrived info")
     console.log(agentStates)
     console.log(config)
     console.log(agentName)
    //  console.log(routingProfile)
   
  } 


  const getQueues = async (agent) => {

    var queues = agent.getRoutingProfile().queues;
    console.log(queues);

    document.getElementById("routingProfile").textContent = agent.getRoutingProfile().name;
    console.log(agent.getRoutingProfile().name);

    var queueDetails = []; // Array to store the queue details
    var instanceId = "13624e6a-435a-479c-97db-d3386a6c4e5e";

    for (var i = 0; i < queues.length; i++) {
        var queue = queues[i];
        var queueName = queue.name;
        var queueArn = queue.queueARN;

        // Make the API request for each queue ARN and with valid name
        if (queueName !== null) {
            var queueInfo = await fetchAPI(queueArn, instanceId);

            // Extract the required values from the API response
            var agentOnline = queueInfo.agentOnline;
            var agentsOnCall = queueInfo.agentsOnCall;
            var contactsInQueue = queueInfo.contactsInQueue;

            // Create the queue details string
            var queueDetailsString = `${queueName}: agentOnline=${agentOnline}, agentsOnCall=${agentsOnCall}, contactsInQueue=${contactsInQueue}`;

            // Add the queue details string to the array
            queueDetails.push(queueDetailsString);
        }
    }

    console.log(queueDetails); // Print the array of queue details

    const queueTableBody = document.getElementById('queueTableBody'); // Get the table body element

    // Clear existing rows from the table body
    queueTableBody.innerHTML = '';

    // Create header row for the columns
    const headerRow = document.createElement('tr');
    const queueHeader = document.createElement('th');
    queueHeader.textContent = 'Queue';
    const agentsAvailableHeader = document.createElement('th');
    agentsAvailableHeader.textContent = 'Total Agents Available';
    const agentsOnCallHeader = document.createElement('th');
    agentsOnCallHeader.textContent = 'Agents on Call';
    const contactsWaitingHeader = document.createElement('th');
    contactsWaitingHeader.textContent = 'Calls waiting in Queue';

    headerRow.appendChild(queueHeader);
    headerRow.appendChild(agentsAvailableHeader);
    headerRow.appendChild(agentsOnCallHeader);
    headerRow.appendChild(contactsWaitingHeader);

    queueTableBody.appendChild(headerRow);

    // Loop through the queue details array and add each queue's information to a new row
    for (let i = 0; i < queueDetails.length; i++) {
        const queueInfo = queueDetails[i].split(': ')[1].split(', '); // Split the queue details string into an array of values
        const queueName = queueDetails[i].split(': ')[0]; // Get the queue name

        // Create a new table row and set its content to the queue name and details
        const row = document.createElement('tr');
        const queueCell = document.createElement('td');
        queueCell.textContent = queueName;
        const agentsAvailableCell = document.createElement('td');
        agentsAvailableCell.textContent = ` ${queueInfo[0].split('=')[1]}`;
        const agentsOnCallCell = document.createElement('td');
        agentsOnCallCell.textContent = `${queueInfo[1].split('=')[1]}`;
        const contactsWaitingCell = document.createElement('td');
        contactsWaitingCell.textContent = ` ${queueInfo[2].split('=')[1]}`;

        // Append the cells to the row
        row.appendChild(queueCell);
        row.appendChild(agentsAvailableCell);
        row.appendChild(agentsOnCallCell);
        row.appendChild(contactsWaitingCell);

        // Append the row to the table body
        queueTableBody.appendChild(row);
    }
}

const fetchAPI = async (queueArn, instanceId) => {
    const url = "https://jguhro6rd4.execute-api.ap-southeast-2.amazonaws.com/1?queueArn=" + queueArn + "&instanceId=" + instanceId;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data; // Return the API response data
    } catch (error) {
        console.error(error);
        return {}; // Return an empty object if there's an error
    }
};