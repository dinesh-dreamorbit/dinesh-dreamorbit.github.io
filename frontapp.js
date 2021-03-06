//var Front = require('@frontapp/ui-sdk');

let hasConversation;
let latestContext;

Front.contextUpdates.subscribe((context) => {
  latestContext = context;
  document.getElementById("weather").style.display = "none";
  document.getElementById("availableTags").style.display = "none";

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
  recepient.textContent = latestContext.conversation.assignee.name;
  recepientemail.textContent = latestContext.conversation.assignee.email;

  console.log(
    "Inside displayConversationInfo: " + JSON.stringify(latestContext)
  );
  if (contextType === "multiConversations") {
    conversation = latestContext.conversations[0];
  } else {
    conversation = latestContext.conversation;
  }
  status.textContent = conversation.status;
  subject.textContent = conversation.subject;
  sender.textContent = conversation.recipient.contact.name;
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

async function getDataFromPublicApi() {
  const city = "Bangalore";
  const url = "https://goweather.herokuapp.com/weather/" + city;
  let httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = onReceiveAPIResponse;
  httpRequest.open("GET", url);
  httpRequest.send();

  function onReceiveAPIResponse() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        console.log(httpRequest.responseText);
        const weatherObj = JSON.parse(httpRequest.responseText);
        console.log("weather: " + weatherObj.temperature);
        console.log(httpRequest.responseText.temperature);

        document.getElementById("city").textContent = city;
        document.getElementById("temp").textContent = weatherObj.temperature;
        document.getElementById("wind").textContent = weatherObj.wind;
        document.getElementById("desc").textContent = weatherObj.description;
        document.getElementById("weather").style.display = "block";
      } else {
        console.log("Error occurred while getting the data from API.");
        document.getElementById("weather").style.display = "none";
      }
    }
  }
}

async function getAvailableTagsFromFront() {
  if (!latestContext) return null;

  const tags = await latestContext.listTags();
  console.log(
    "Inside getAvailableTagsFromFront: available tags: " + JSON.stringify(tags)
  );

  return tags;
}

async function getAllTags() {
  const tags = await getAvailableTagsFromFront();
  const availableTags = document.getElementById("avtags");

  if (tags && tags.results) {
    availableTags.textContent = tags.results
      .map(function (t) {
        return t.name;
      })
      .join(", ");
  } else {
    availableTags.textContent = "-";
  }
  document.getElementById("availableTags").style.display = "block";
}

async function addNewTag() {
  if (!latestContext) return;

  const enteredTag = document.getElementById("newTagName").value;
  if (!enteredTag) {
    console.log("removeTag: No tag name entered.");
    return;
  }

  const allTags = await getAvailableTagsFromFront();
  let tag;

  if (allTags && allTags.results) {
    tag = allTags.results.find(
      (t) => t.name.toLowerCase() === enteredTag.toLowerCase()
    );
    if (!tag) {
      console.log(
        "No corresponding tag found for the entered tag: " + enteredTag
      );
      return;
    }
  } else {
    console.log("No tags found.");
    return;
  }

  let tagsToAdd = [];
  tagsToAdd.push(tag.id);

  await latestContext.tag(tagsToAdd);

  document.getElementById("newTagName").value = "";
}

async function removeTag() {
  if (!latestContext) return;

  const enteredTag = document.getElementById("removeTagName").value;
  if (!enteredTag) {
    console.log("removeTag: No tag name entered.");
    return;
  }

  const allTags = await getAvailableTagsFromFront();
  let tag;

  if (allTags && allTags.results) {
    tag = allTags.results.find(
      (t) => t.name.toLowerCase() === enteredTag.toLowerCase()
    );
    if (!tag) {
      console.log(
        "No corresponding tag found for the entered tag: " + enteredTag
      );
      return;
    }
  } else {
    console.log("No tags found.");
    return;
  }

  let tagsToRemove = [];
  tagsToRemove.push(tag.id);

  await latestContext.untag(tagsToRemove);

  document.getElementById("removeTagName").value = "";
}

/**
 * Opens the url in the popup
 * @returns Promise
 */
async function openUrl() {
  const url = "http://www.google.com";
  if (!latestContext) return;

  await latestContext.openUrlInPopup(url, { height: 100, width: 100 });
}

async function getDataFromAuthenticatedApi() {}


window.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded and parsed');
});