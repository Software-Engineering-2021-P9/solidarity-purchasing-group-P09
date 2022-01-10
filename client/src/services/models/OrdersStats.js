class OrdersStats {
  constructor(totalCount, unretrievedCount) {
    this.totalCount = totalCount;
    this.unretrievedCount = unretrievedCount;
  }

  static fromJSON(json) {
    return new OrdersStats(json.totalCount, json.unretrievedCount);
  }
}

export default OrdersStats;
