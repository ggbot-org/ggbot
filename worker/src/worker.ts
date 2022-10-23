import type { Item } from "@ggbot2/models";

export class Worker {
  static itemIdToNumber(_itemId: Item["id"]) {
    return 1;
  }

  constructor(readonly capacity: number, readonly index: number) {}

  managesItem(itemId: Item["id"]) {
    return Worker.itemIdToNumber(itemId) % this.capacity === this.index;
  }
}
