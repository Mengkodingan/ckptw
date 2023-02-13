var Bot = {
  Client: require("./src/classes/client"),
  CommandHandler: require("./src/classes/commandHandler"),
  ButtonBuilder: require("./src/classes/misc/buttonBuilder"),
  SectionBuilder: require("./src/classes/misc/sectionBuilder"),
  MessageCollector: require("./src/classes/collector/MessageCollector"),
  Events: require("./src/Constant/Events")
};

module.exports = Bot;
