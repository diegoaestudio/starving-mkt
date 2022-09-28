import NonFungibleToken from 0x631e88ae7f1d7c20
import MyNFT from 0xf435453dd633a663
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868
import NFTMarketPlace from 0xf435453dd633a663

transaction(id: UInt64, price: UFix64) {
  prepare(acct: AuthAccount) {
    let saleCollection = acct.borrow<&NFTMarketPlace.SaleCollection>(from: /storage/MySaleAccount)
        ?? panic("This SaleCollection doesn't exist")

    saleCollection.listForSale(id: id, price: price)
  }

  execute {
    log("A user listed an NFT for Sale")  
  }

}