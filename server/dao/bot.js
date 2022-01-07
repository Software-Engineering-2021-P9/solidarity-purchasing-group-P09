const telegramUserCollectionName = "chats";

exports.getTelegramUsers = (db) => {
  return db.collection(telegramUserCollectionName).find().toArray();
};

exports.addTelegramUsers = (db, telegramUser) => {
  return db
    .collection(telegramUserCollectionName)
    .insertOne({ chatID: telegramUser });
};

//Method used for testing
exports.createUniqueTelegramUserIndex = (db) => {
  //create text index
  db.collection(telegramUserCollectionName).createIndex(
    { chatID: 1 },
    {
      name: "chatID",
      unique: true,
    }
  );
};
