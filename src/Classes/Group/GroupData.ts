import { BinaryNode, GroupMetadata, GroupParticipant, ParticipantAction } from "@whiskeysockets/baileys";
import { Ctx } from "../Ctx";
import { decodeJid } from "../../Common/Functions";

export class GroupData {
    ctx: Ctx;
    jid: string;

    constructor(ctx: Ctx, jid: string) {
        this.ctx = ctx;
        this.jid = jid;
    }

    async members(): Promise<GroupParticipant[]> {
        let metadata = await this.metadata();
        return metadata.participants;
    }

    async inviteCode(): Promise<string | undefined> {
        return await this.ctx._client.groupInviteCode(this.jid)
    }

    async revokeInviteCode(): Promise<string | undefined> {
        return await this.ctx._client.groupRevokeInvite(this.jid)
    }

    async joinApproval(mode: "on" | "off"): Promise<void> {
        return await this.ctx._client.groupJoinApprovalMode(this.jid, mode)
    }

    async leave(): Promise<void> {
        this.ctx._client.groupLeave(this.jid)
    }
    
    async membersCanAddMemberMode(mode: "on" | "off"): Promise<void> {
        return await this.ctx._client.groupMemberAddMode(this.jid, mode === "on" ? "all_member_add" : "admin_add")
    }

    async metadata(): Promise<GroupMetadata> {
        return await this.ctx._client.groupMetadata(this.jid)
    }

    async getMetadata(key: keyof GroupMetadata) {
        let metadata = await this.metadata();
        return metadata[key];
    }

    async name() {
        return await this.getMetadata('subject');
    }

    async description() {
        return await this.getMetadata('desc');
    }

    async owner() {
        return await this.getMetadata('owner');
    }

    async isAdmin(jid: string) {
        let members = await this.members();
        let check = members.filter((x) => decodeJid(x.id) === decodeJid(jid) && (x.admin === 'admin' || x.admin === 'superadmin'));
        return check.length > 0;
    }

    async isSenderAdmin() {
        return await this.isAdmin(this.ctx.sender.decodedJid!);
    }

    async isBotAdmin() {
        return await this.isAdmin(this.ctx.me.decodedId);
    }

    async toggleEphemeral(expiration: number): Promise<void> {
        return await this.ctx._client.groupToggleEphemeral(this.jid, expiration);
    } 

    async updateDescription(description?: string): Promise<void> {
        return await this.ctx._client.groupUpdateDescription(this.jid, description);
    } 

    async updateSubject(subject: string): Promise<void> {
        return await this.ctx._client.groupUpdateSubject(this.jid, subject);
    } 

    async membersUpdate(members: string[], action: ParticipantAction): Promise<{
        status: string;
        jid: string;
        content: BinaryNode;
    }[]> {
        return await this.ctx._client.groupParticipantsUpdate(this.jid, members, action)
    }

    async kick(members: string[]) {
        return await this.membersUpdate(members, 'remove');
    }

    async add(members: string[]) {
        return await this.membersUpdate(members, 'add');
    }

    async promote(members: string[]) {
        return await this.membersUpdate(members, 'promote');
    }

    async demote(members: string[]) {
        return await this.membersUpdate(members, 'demote');
    }

    async pendingMembers() {
        return await this.ctx._client.groupRequestParticipantsList(this.jid);
    }

    async pendingMembersUpdate(members: string[], action: 'reject' | 'approve') {
        return this.ctx._client.groupRequestParticipantsUpdate(this.jid, members, action);
    }

    async approvePendingMembers(members: string[]) {
        return this.pendingMembersUpdate(members, 'approve');
    }

    async rejectPendingMembers(members: string[]) {
        return this.pendingMembersUpdate(members, 'reject');
    }

    async updateSetting(setting: 'announcement' | 'not_announcement' | 'locked' | 'unlocked') {
        await this.ctx._client.groupSettingUpdate(this.jid, setting);
    }

    async open() {
        await this.updateSetting('not_announcement');
    }

    async close() {
        await this.updateSetting('announcement');
    }

    async lock() {
        await this.updateSetting('locked')
    }

    async unlock() {
        await this.updateSetting('unlocked')
    }
} 