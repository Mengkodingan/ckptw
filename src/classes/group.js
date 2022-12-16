module.exports = class Group {
  constructor(d) {
    this.d = d;
  }

  async create(title, participants = []) {
    return this.d._client.groupCreate(title, participants);
  }

  async metadata(jid) {
    return this.d._client.groupMetadata(jid);
  }

  async addParticipants(groupJid, participants = []) {
    this.d._client.groupParticipantsUpdate(groupJid, participants, "add");
  }

  async removeParticipants(groupJid, participants = []) {
    this.d._client.groupParticipantsUpdate(groupJid, participants, "remove");
  }

  async promoteParticipants(groupJid, participants = []) {
    this.d._client.groupParticipantsUpdate(groupJid, participants, "promote");
  }

  async demoteParticipants(groupJid, participants = []) {
    this.d._client.groupParticipantsUpdate(groupJid, participants, "demote");
  }

  async setSubject(jid, name) {
    this.d._client.groupUpdateSubject(jid, name);
  }

  async setDescription(jid, description) {
    this.d._client.groupUpdateDescription(jid, description);
  }

  async setAnnouncement(jid) {
    this.d._client.groupSettingUpdate(jid, "announcement");
  }

  async removeAnnouncement(jid) {
    this.d._client.groupSettingUpdate(jid, "not_announcement");
  }

  async modifyLock(jid) {
    this.d._client.groupSettingUpdate(jid, "locked");
  }

  async modifyUnlock(jid) {
    this.d._client.groupSettingUpdate(jid, "unlocked");
  }

  async leave(jid) {
    try {
      this.d._client.groupLeave(jid);
    } catch (e) {
      return e;
    }
  }

  async getInviteCode(jid) {
    return this.d._client.groupInviteCode(jid);
  }

  async revokeInviteCode(jid) {
    return this.d._client.groupRevokeInvite(jid);
  }

  async acceptInvite(code) {
    this.d._client.groupAcceptInvite(code);
  }

  async getInviteInfo(code) {
    return this.d._client.groupGetInviteInfo(code);
  }
};