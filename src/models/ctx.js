exports.ctx = ({ args, self, msg }) => {
    return {
        id: msg.key.remoteJid,
        args, 
        ...self.whats, 
        msg,
        react: function(id, e, w) {
            self.whats.sendMessage(id, { react: { text: e, key: w ? w : msg.key }})
        }
    }
}