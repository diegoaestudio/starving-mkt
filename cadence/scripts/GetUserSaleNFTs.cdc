import NonFungibleToken from 0x631e88ae7f1d7c20
import MyNFT from 0xf435453dd633a663
import NFTMarketPlace from 0xf435453dd633a663

pub fun main(account: Address): {UFix64: &MyNFT.NFT} {
  let saleCollection = getAccount(account).getCapability(/public/MySaleCollection2)
    .borrow<&NFTMarketPlace.SaleCollection{NFTMarketPlace.SaleCollectionPublic}>()
      ?? panic("Could not borrow capability from sale collection")

  let collection = getAccount(account).getCapability(/public/MyNFTCollection)
    .borrow<&MyNFT.Collection{NonFungibleToken.CollectionPublic, MyNFT.CollectionPublic}>()
        ?? panic("Could not borrow capability from collection")

  let saleIDs = saleCollection.getIDs()

  let returnVals: {UFix64: &MyNFT.NFT} = {}

  for saleID in saleIDs {
    let price = saleCollection.getPrice(id: saleID)
    let nftRef = collection.borrowEntireNFT(id: saleID)
    returnVals.insert(key: price, nftRef)
  }

  return returnVals
}