import { GroupMetadata, proto } from "@whiskeysockets/baileys";
import { ICtx } from "../../Common/Types";

export class Group {
    ctx: ICtx;

    constructor(ctx: ICtx) {
        this.ctx = ctx;
    }

    async create(subject: string, members: string[]): Promise<GroupMetadata> {
        return await this.ctx._client.groupCreate(subject, members);
    }

    async inviteCodeInfo(code: string): Promise<GroupMetadata> {
        return await this.ctx._client.groupGetInviteInfo(code);
    }

    async acceptInvite(code: string): Promise<string | undefined> {
        return await this.ctx._client.groupAcceptInvite(code);
    }
    
    async acceptInviteV4(key: string | proto.IMessageKey, inviteMessage: proto.Message.IGroupInviteMessage): Promise<string> {
        return await this.ctx._client.groupAcceptInviteV4(key, inviteMessage);
    }
}