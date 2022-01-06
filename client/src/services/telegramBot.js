const { Telegraf } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);

let users = [];
//bot.start((ctx) => ctx.reply("Welcome"));
bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.on("sticker", (ctx) => ctx.reply("👍"));
bot.hears("hi", (ctx) => ctx.reply("Hey there"));
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

bot.launch();
