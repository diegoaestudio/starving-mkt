import NFTMarketPlace from 0xf435453dd633a663

transaction(id: UInt64) {
  prepare(acct: AuthAccount) {
    let saleCollection = acct.borrow<&NFTMarketPlace.SaleCollection>(from: /storage/MySaleCollection2)
        ?? panic("This MySaleCollection2 doesn't exist")

    saleCollection.unlistFromSale(id: id)
  }

  execute {
    log("A user unlisted an NFT from Sale")  
  }

}