import type { OutFileSchema } from "@/types/logger.types";
import { Helpers } from "@/services/Helpers";
import { OutOfRangeError } from "@/interfaces/Errors";

class DataAdapter {
  private positionalArrayOfRatios?: number[];

  constructor(private data: OutFileSchema) {}

  /**
   * Returns an array of ratios of the total number of chats,
   * each position in the array is the sum
   * of the ratios up to that position
   */
  async getPositionalSumOfRatios() {
    const ratios = this.data.tally.map((log) => log.ratioOfTotalChats);

    this.positionalArrayOfRatios =
      Helpers.analytics.getPositionalSumOfRatios(ratios);

    return this.positionalArrayOfRatios;
  }

  /**
   * Returns the ratio of the total number of chats the position passed
   * @param position - The position index of the ratio to return
   * @returns The ratio of the position passed
   *
   * Example:
   * ```js
   * const ratioOfTop10 = await dataAdapter.getRatioOfPosition(9);
   * ```
   */
  async getRatioOfPosition(position: number) {
    const distribution = this.positionalArrayOfRatios
      ? this.positionalArrayOfRatios
      : await this.getPositionalSumOfRatios();

    if (position > distribution.length || position < 0) {
      throw new OutOfRangeError(
        "The passed position index is out of range of the positional array."
      );
    }
    return distribution[position];
  }

  /**
   * Gets the number of chatters that is
   * representative of the 20% of the total number of chatters
   * 100 return the total number of chatters
   * @param percentage - The percentage of the total number of chatters
   *
   * ```js
   * const twentyPercentNumber = await dataAdapter.getNumberToPercentage(20);
   * const allChatters = await dataAdapter.getNumberToPercentage(100);
   * ```
   */
  async getNumberToPercentage(percentage: number) {
    const { chatters } = this.data;
    return Math.round(percentage * (chatters.unique / 100));
  }
}

export { DataAdapter };
