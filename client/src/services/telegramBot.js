const schedule = require("node-schedule");
const { Telegraf } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);

let users = [];
bot.start((ctx) => ctx.reply("Welcome"));
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

// can be used for testing,to send messages to users at a certain time
const j = schedule.scheduleJob({ dayOfWeek: 1, hour: 10, minute: 30 }, () => {
  console.log("Job runs every day at 5:30AM");
  users.forEach((id) => {
    console.log(id);
    bot.telegram.sendMessage(id, "Hello userssss");
  });
});
bot.launch();
