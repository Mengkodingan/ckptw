import { proto } from "@whiskeysockets/baileys";
import { IInteractiveMessageContent } from "../../Common/Types";
import { makeRealInteractiveMessage } from "../../Common/Functions";

export class CarouselBuilder {
    cards: proto.Message.IInteractiveMessage[]

    constructor(opts?: {
        cards: []
    }) {
        this.cards = [];
    }

    addCard(content: IInteractiveMessageContent) {
        this.cards.push(makeRealInteractiveMessage(content));
        return this
    }

    build() {
        return this.cards;
    }
}
