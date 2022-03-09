//var Front = require('@frontapp/ui-sdk');

let hasConversation;
let latestContext;

Front.contextUpdates.subscribe((context) => {
  latestContext = context;
  switch (context.type) {
    case "noConversation":
      console.log("No conversation selected");
      this.resetValues();
      break;
    case "singleConversation":
      console.log("Selected conversation:", context.conversation);
      this.displayConversationInfo(context, "singleConversation");
      break;
    case "multiConversations":
      console.log("Multiple conversations selected", context.conversations);
      this.displayConversationInfo(context, "multiConversations");
      break;
    default:
      console.error(`Unsupported context type: ${context.type}`);
      this.resetValues();
      break;
  }
});

function resetValues() {
  const recepient = document.getElementById("recepient");
  const teammate = document.getElementById("teammate");
  const recepientemail = document.getElementById("recepientemail");
  const subject = document.getElementById("subject");
  const status = document.getElementById("convstatus");
  const sender = document.getElementById("sender");
  const senderemail = document.getElementById("senderemail");
  const tags = document.getElementById("tag");

  recepient.textContent = "";
  teammate.textContent = "";
  recepientemail.textContent = "";
  subject.textContent = "";
  status.textContent = "";
  sender.textContent = "";
  senderemail.textContent = "";
  tags.textContent = "";
}

function displayConversationInfo(contextType) {
  const recepient = document.getElementById("recipient");
  const recepientemail = document.getElementById("recipientemail");
  const subject = document.getElementById("subject");
  const status = document.getElementById("convstatus"); //status
  const sender = document.getElementById("sender"); //assignee
  const senderemail = document.getElementById("senderemail");
  const tags = document.getElementById("tag");
  tags.textContent = "";

  let conversation = null;
  recepient.textContent = latestContext.teammate.name;
  recepientemail.textContent = latestContext.teammate.email;

  console.log("Inside displayConversationInfo: " + JSON.stringify(latestContext));
  if (contextType === "multiConversations") {
    conversation = latestContext.conversations[0];
  } else {
    conversation = latestContext.conversation;
  }
  status.textContent = conversation.status;
  subject.textContent = conversation.subject;
  sender.textContent = conversation.recipient.name;
  senderemail.textContent = conversation.recipient.email;

  if (conversation.tags && conversation.tags.length) {
    tags.textContent = conversation.tags
      .map(function (k) {
        return k.name;
      })
      .join(", ");
  }
}

function tagConversation() {}

function untagConversation() {}
