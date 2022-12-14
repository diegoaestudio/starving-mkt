import NFTMarketPlace from 0xf435453dd633a663

transaction(id: UInt64, price: UFix64) {
  prepare(acct: AuthAccount) {
    let saleCollection = acct.borrow<&NFTMarketPlace.SaleCollection>(from: /storage/MySaleCollection2)
        ?? panic("This MySaleCollection2 doesn't exist")

    saleCollection.listForSale(id: id, price: price)
  }

  execute {
    log("A user listed an NFT for Sale")  
  }

}