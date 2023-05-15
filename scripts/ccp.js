connect.core.initCCP(containerDiv, {
   ccpUrl: 'https://nikqikdevall.awsapps.com/connect/ccp-v2/',        /*REQUIRED (*** has been replaced) */
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
        });

        contact.onEnded(function() {
         console.log("Refreshing table")
         $(".attributes-table-row").remove();
        });

        contact.onConnected(function() {
                console.log(`onConnected(${contact.getContactId()})`);
                var attributeMap = contact.getAttributes();
                var list = GiveAttributesList(attributeMap);
                RenderTable(list)
               

        });
});


$(document).ready(function(){
   console.log("Jquery working")
   // dragElement(document.getElementById("parent-containerDiv"));
   // $("#agent-name").html("test-name")
   // $("#agent-routingprofile").html("Customer support")
});
const GiveAttributesList = (obj) => {
   var attributesKeys = Object.keys(obj)
   if(attributesKeys.length > 0){
       var attributesArray = []
       for (var i = 0 ; i< attributesKeys.length ; i++){
           var item = {}
           item.name = attributesKeys[i]
           item.value = obj[attributesKeys[i]]['value'];         
           attributesArray.push(item)
       }
       return attributesArray
   }else{
       return []
   }   
}

const RenderTable = (list) => {
   console.log("Showing table")
   $(".attributes-table-row").remove();
   list.map((item , index) => {
      $("#attributes-table-body").append(`<tr class='attributes-table-row'><th scope='row'>${index+1}</th><td>${item.name}</td><td>${item.value}</td></tr>`)
   }
   )
  
}

 
connect.agent(agent => {
   console.log("Agent connected" , agent)
   GetAgentInfo()
   
});


const GetAgentInfo = () => {
  console.log("Getting Agent info")
   var agent = new connect.Agent
   console.log("Agent Object" , agent)
   var config = agent.getConfiguration()
   var agentName = agent.getName()
   var agentStates = agent.getAgentStates();
   var routingProfile = agent.getRoutingProfile();
   console.log("Retrived info")
   console.log(agentStates)
   console.log(config)
   console.log(agentName)
   console.log(routingProfile)
   $("#agent-name").html(agentName)
   $("#agent-routingprofile").html(routingProfile.name)
} 

function dragElement(elmnt) {
   var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
   if (document.getElementById(elmnt.id + "header")) {
     // if present, the header is where you move the DIV from:
     document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
   } else {
     // otherwise, move the DIV from anywhere inside the DIV:
     elmnt.onmousedown = dragMouseDown;
   }
 
function dragMouseDown(e) {
     e = e || window.event;
     e.preventDefault();
     // get the mouse cursor position at startup:
     pos3 = e.clientX;
     pos4 = e.clientY;
     document.onmouseup = closeDragElement;
     // call a function whenever the cursor moves:
     document.onmousemove = elementDrag;
   }
 
   function elementDrag(e) {
     e = e || window.event;
     e.preventDefault();
     // calculate the new cursor position:
     pos1 = pos3 - e.clientX;
     pos2 = pos4 - e.clientY;
     pos3 = e.clientX;
     pos4 = e.clientY;
     // set the element's new position:
     elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
     elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
   }
 
   function closeDragElement() {
     // stop moving when mouse button is released:
     document.onmouseup = null;
     document.onmousemove = null;
   }
 }