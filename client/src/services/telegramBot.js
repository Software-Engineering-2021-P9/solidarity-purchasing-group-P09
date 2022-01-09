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

bot.launch();
