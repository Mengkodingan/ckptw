import { MessageType } from "../Constant/MessageType";

function ExtractEventsContent(m: any, msgType: string) {
    let used: Record<string, any> = { upsert: m.content };

    const eventMapping: Record<string, (m: any) => Record<string, any>> = {
        [MessageType.pollCreationMessage]: (m) => ({
            poll: m.message.pollCreationMessage.name,
        }),
        [MessageType.pollUpdateMessage]: (m) => ({
            pollVote: m.content
        }),
        [MessageType.reactionMessage]: (m) => ({
            reactions: m.content
        })
    };

    return eventMapping[msgType] ? { ...used, ...eventMapping[msgType](m) } : used;
}

export default ExtractEventsContent;