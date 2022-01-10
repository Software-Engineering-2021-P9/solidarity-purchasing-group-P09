const { Telegraf } = require("telegraf");
const API = require("./API_Bot");

const token = process.env.BOT_TOKEN || undefined;

const PORT = process.env.PORT_BOT || 3002;
const URL = process.env.URL || "https://spg-testing.herokuapp.com/"; //"https://spg-deploy-feat-telegra-lmixoy.herokuapp.com/";

try {
  if (token === undefined) {
    throw new Error("BOT_TOKEN must be provided!");
  }
  const bot = new Telegraf(token);

  bot.telegram.setWebhook(`${URL}/bot${token}`);
  bot.startWebhook(`/bot${token}`, null, PORT);

  bot.launch();

  //Client sends start and will receive a welcome message,
  bot.command("start", async (ctx) => {
    try {
      await API.addTelegramUsers(URL, ctx.chat.id);
      bot.telegram.sendMessage(
        ctx.chat.id,
        "Hello there! Welcome to SPG telegram bot."
      );
    } catch (error) {
      bot.telegram.sendMessage(ctx.chat.id, "Hello again! 😁");
    }
  });

  bot.on("message", async (ctx) => {
    var hi = "hi";
    var bye = "bye";
    var products = "products";
    if (ctx.message.text) {
      if (ctx.message.text.toString().toLowerCase().indexOf(hi) === 0) {
        ctx.reply("Hello dear user");
      } else if (ctx.message.text.toString().toLowerCase().includes(bye)) {
        ctx.reply("Hope to see you around again , Bye");
      } else if (ctx.message.text.toString().toLowerCase().includes(products)) {
        writeProductList(ctx.message.chat.id);
      }
    }
  });

  writeProductList = async function (id) {
    const prods = await API.findProducts(URL);

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
    let users = [];
    users = await API.getTelegramUsers(URL);
    console.log("Utenti: " + users);
    users.map((id) => {
      writeProductList(id.chatID);
    });
  };
} catch (error) {
  //No bot token was passee
  console.error("There was some error with the bot: " + error);
}

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
