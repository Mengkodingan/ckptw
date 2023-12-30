import { Collection } from "@discordjs/collection";
import { ICollectorOptions, IMessageInfo } from "../../Common/Types";
import { EventEmitter } from "events";

export class Collector extends EventEmitter {
  [x: string]: any;
  isRun: any;
  filter: (args: any, collector: Collection<any, any>) => boolean;
  time: number;
  max: number;
  maxProcessed: number;
  collector: Collection<unknown, unknown>;
  received: any;
  constructor(options: ICollectorOptions = {
    filter: function (): boolean {
      throw new Error("Function not implemented.");
    },
    time: 0,
    max: 0,
    maxProcessed: 0
  }) {
    super();

    this.isRun = false;
    this.filter = options.filter ?? (() => true);

    if (this.isRun) throw new Error("some collector already run in another instance");
    if (typeof this.filter !== "function") throw new Error("filter options in collector must be Function");

    this.time = options.time;
    this.max = options.max;
    this.maxProcessed = options.maxProcessed;
    this.collector = new Collection();
    this.collect = this.collect.bind(this);

    if(options.time) this.isRun = setTimeout(() => this.stop(), this.time);
  }

  async collect(t: IMessageInfo) {
    let args = this._collect(t);
    if(args) {
      if (this.maxProcessed && this.maxProcessed === this.received) {
        this.stop("processedLimit");
      } else {
        let filtered = await this.filter(args, this.collector);
        if (filtered) {
          if (this.max && this.max <= this.collector.size) {
            this.stop("limit");
          } else {
            if (this.isRun) {
              this.collector.set(args.jid, args);
              this.emit("collect", args);
            }
          }
        }
      }
    }
  }

  stop(r: string = "timeout") {
    if (this.isRun) {
      clearTimeout(this.isRun);
      this.isRun = undefined;
      this.emit("end", this.collector, r);
    }
  }
};