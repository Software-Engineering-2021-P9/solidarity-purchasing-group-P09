const API = require("./API_Bot");

const { Telegraf } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);

let users = [];
//Client sends start and will receive a welcome message,
//we can keep users ID to use them later with users.push(ctx.chat.id);
bot.command("start", (ctx) => {
  console.log(ctx.from);
  users.push(ctx.chat.id);
  bot.telegram.sendMessage(
    ctx.chat.id,
    "Hello there! Welcome to SPG telegram bot.",
    {}
  );
});

bot.on("message", async (ctx) => {
  var hi = "hi";
  var bye = "bye";
  var products = "products";

  if (ctx.message.text.toString().toLowerCase().indexOf(hi) === 0) {
    ctx.reply("Hello dear user");
  } else if (ctx.message.text.toString().toLowerCase().includes(bye)) {
    ctx.reply("Hope to see you around again , Bye");
  } else if (ctx.message.text.toString().toLowerCase().includes(products)) {
    writeProductList(ctx.message.chat.id);
  }
});

writeProductList = async function (id) {
  const prods = await API.findProducts();
  //console.log(prods);
  await bot.telegram.sendMessage(
    id,
    "‼ These are the available products for the next week 🛒\nGo see our website for more info\n<a href='https://spg-prod.herokuapp.com'>SPG</a>",
    {
      parse_mode: "HTML",
    }
  );
  prods.map((element) => {
    const text =
      getEmoji(element.category) +
      " <strong>" +
      element.name +
      "</strong>\n" +
      "🔎 <i>" +
      element.description +
      "</i>\n" +
      "💰 " +
      element.availability.price +
      "€" +
      "\n" +
      "🧮 " +
      getLeftQuantity(element.availability.leftQuantity) +
      "\n" +
      "📦 " +
      element.availability.packaging;
    bot.telegram.sendMessage(id, text, { parse_mode: "HTML" });
  });
};

exports.WriteList = async function () {
  console.log("ora scrivo a:");

  users.map((id) => console.log(id));

  users.map((id) => {
    writeProductList(id);
  });
};

const getEmoji = (category) => {
  switch (category) {
    case "fruit":
      return "🍓";
    case "vegetables":
      return "🥦";
    case "spreadable creams":
      return "🥫";
    case "meat":
      return "🍖";
    case "eggs":
      return "🥚";
    case "milk":
      return "🥛";

    default:
      return "🛒";
  }
};

const getLeftQuantity = (lq) => {
  if (!lq) {
    return "<s>0  pieces left</s>";
  }
  return lq + " pieces left";
};

bot.launch();

/*
📊🛒🔢🎁⚖
const TelegramBot = require("node-telegram-bot-api");
const token = "5046161728:AAEWfW7N6FBKViW530nW2qCufa4tZKHF-OA";
const bot = new TelegramBot(token, { polling: true });
const API = require("./API_Bot");

/*
bot.on("message", async (ctx.message) => {
  var hi = "hi";
  if (ctx.message.text.toString().toLowerCase().indexOf(hi) === 0) {
    ctx.reply( "Hello dear user");
  }

  var bye = "bye";
  if (ctx.message.text.toString().toLowerCase().includes(bye)) {
    ctx.reply( "Hope to see you around again , Bye");
  }

  var products = "products";
  if (ctx.message.text.toString().toLowerCase().includes(products)) {
    bot.sendMessage(
      ctx.message.chat.id,
      "These are the available products for the next week:"
    );
    const prods = await API.findProducts();
    console.log(prods);
    prods.map((element) => {
      const text =
        "🎁:*" +
        element.name +
        "*\n" +
        "🔎:" +
        element.description +
        "\n" +
        "💰" +
        element.availability.price +
        "€" +
        "\n" +
        "📊: " +
        element.availability.quantity +
        "\n" +
        "📦: " +
        element.availability.packaging;
      ctx.reply( text, { parse_mode: "MarkdownV2" });
    });
  }
});
*/
