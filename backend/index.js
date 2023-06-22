let apiKey = "";

const { Configuration, OpenAIApi } = require("openai");
const express = require("express");
const cors = require("cors");
const configuration = new Configuration({
  apiKey: apiKey,
});
const openai = new OpenAIApi(configuration);
const app = express();

//CORS 이슈 해결
// let corsOptions = {
//   origin: "https://tourguide.pages.dev",
//   credentials: true,
// };
// app.use(cors(corsOptions));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/guide", async function (req, res) {
  let { myPlace, myDate, userMessages, assistantMessages } = req.body;
  let message = [
    { role: "system", content: "당신은 여행 가이드 입니다." },
    { role: "user", content: "당신은 여행 가이드 입니다." },
    {
      role: "assistant",
      content:
        "안녕하세요! 저는 여행 가이드입니다. 여행 계획이나 관심 있는 곳이 있다면 언제든지 말씀해주세요. 저는 여러 나라의 문화와 역사, 음식, 관광지 등에 대한 지식이 풍부합니다. 당신의 여행을 즐겁고 기억에 남는 경험으로 만들어 드릴 것입니다. 어디로 가볼까요?",
    },
    {
      role: "user",
      content: `${myPlace} ${myDate} 여행하려고 합니다. 유명한 관광지와 음식점을 추천해주세요.`,
    },
  ];
  while (userMessages.length != 0 || assistantMessages.length != 0) {
    if (userMessages.length != 0) {
      message.push(
        JSON.parse(
          '{"role": "user", "content": "' +
            String(userMessages.shift()).replace(/\n/g, "<br />") +
            '"}'
        )
      );
    }
    if (assistantMessages.length != 0) {
      message.push(
        JSON.parse(
          '{"role": "assistant", "content": "' +
            String(assistantMessages.shift()).replace(/\n/g, "<br />") +
            '"}'
        )
      );
    }
  }

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0.8,
    top_p: 0.8,
    max_tokens: 500,
    presence_penalty: 0.4,
    messages: message,
  });

  let guide = completion.data.choices[0].message["content"];
  res.json({ assistant: guide });
});

app.listen(3000);
