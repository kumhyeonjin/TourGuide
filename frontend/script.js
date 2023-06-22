const btn_send = document.querySelector("#btnSendMessage");
const chatMessage = document.querySelector(".chat_message");
const place = document.querySelector("#place");
const date = document.querySelector("#date");
const chatCon = document.querySelector(".chat_con");
const guideChat = document.querySelector(".guide_chat");
const loder = document.querySelector(".loder");
const restart = document.querySelector(".restart");
const chatInputDiv = document.querySelector(".chat-input");

chatInputDiv.style.display = "none";
chatCon.style.display = "none";
loder.style.display = "none";
place.focus();

let userMessages = [];
let assistantMessages = [];

const sendMessage = async () => {
  guideChat.style.display = "none";
  loder.style.display = "block";
  chatInputDiv.style.display = "flex";

  let myPlace = place.value;
  let myDate = date.value;

  const chatInput = document.querySelector(".chat-input input");
  const chatMessageDiv = document.createElement("div");
  chatMessageDiv.classList.add("chat_message");
  chatMessageDiv.innerHTML = `<p>${chatInput.value}</p>`;
  chatCon.appendChild(chatMessageDiv);
  //
  if (chatInput.value !== "") {
    chatMessageDiv.innerHTML = `<p class='question'>${chatInput.value}</p>`;
  } else {
    chatMessageDiv.innerHTML = `<p hidden> </p>`;
  }
  //

  userMessages.push(chatInput.value);
  chatInput.value = "";

  const response = await fetch(
    "https://jw9i7ylqag.execute-api.ap-northeast-2.amazonaws.com/props/guide",
    {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        myPlace: myPlace,
        myDate: myDate,
        userMessages: userMessages,
        assistantMessages: assistantMessages,
      }),
    }
  );

  const data = await response.json();
  assistantMessages.push(data.assistant);
  const astrologerMessage = document.createElement("div");
  astrologerMessage.classList.add("chat_message");
  astrologerMessage.innerHTML = `<p class='assistant'>${data.assistant.replace(
    /\n/g,
    "<br />"
  )}</p>`;
  chatCon.appendChild(astrologerMessage);

  chatCon.style.display = "block";
  chatCon.scrollTop = chatCon.scrollHeight;
  loder.style.display = "none";
  restart.style.display = "block";
};
const reStart = () => {
  window.location.reload();
};

btn_send.addEventListener("click", sendMessage);
document.querySelector("#btn").addEventListener("click", sendMessage);
restart.addEventListener("click", reStart);
