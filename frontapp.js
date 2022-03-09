//var Front = require('@frontapp/ui-sdk');

let hasConversation;

Front.contextUpdates.subscribe(context => {
    switch(context.type) {
      case 'noConversation':
        console.log('No conversation selected');
        this.resetValues();
        break;
      case 'singleConversation':
        console.log('Selected conversation:', context.conversation);
        this.displayConversationInfo(context, 'singleConversation');
        break;
      case 'multiConversations':
        console.log('Multiple conversations selected', context.conversations);
        this.displayConversationInfo(context, 'multiConversations');
        break;
      default:
        console.error(`Unsupported context type: ${context.type}`);
        this.resetValues();
        break;
    }
  });

function resetValues()
{
   const sender = document.getElementById('sender');
   const teammate = document.getElementById('teammate');
   sender.textContent = '';
   teammate.textContent = '';
}

function displayConversationInfo(context, contextType)
{
  const sender = document.getElementById('sender');
  const teammate = document.getElementById('teammate'); //assignee
  // const subject = document.getElementById('subject');
  const status = document.getElementById('convstatus'); //status
  let conversation = null;
  sender.textContent = '';
  teammate.textContent = context.teammate.name;
  sender.textContent = context.teammate.name;
  console.log('Inside displayConversationInfo: '+JSON.stringify(context));
  if(contextType === 'multiConversations')
  {
      conversation = context.conversations[0];
  }
  else
  {
    conversation = context.conversation;
  }
  status.textContent = conversation.status;
  subject.textContent = conversation.subject;

}

function tagConversation()
{

}

function untagConversation()
{

}
