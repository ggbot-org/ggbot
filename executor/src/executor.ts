import { Item, itemIdCharacters } from "@ggbot2/models";

export class Executor {
  static itemIdToNaturalNumber(itemId: Item["id"]) {
    const firstCharacter = itemId.charAt(0);
    for (let i = 0; i < itemIdCharacters.length; i++)
      if (itemIdCharacters.charAt(i) === firstCharacter) return i + 1;
    throw new TypeError();
  }

  constructor(readonly capacity: number, readonly index: number) {}

  managesItem(itemId: Item["id"]) {
    return (
      Executor.itemIdToNaturalNumber(itemId) % this.capacity === this.index
    );
  }
}
