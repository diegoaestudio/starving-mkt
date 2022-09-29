import NonFungibleToken from 0x631e88ae7f1d7c20
import MyNFT from 0xf435453dd633a663
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868
import NFTMarketPlace from 0xf435453dd633a663

transaction {
  prepare(acct: AuthAccount) {
    acct.save(<- MyNFT.createEmptyCollection(), to: /storage/MyNFTCollection)
    acct.link<&MyNFT.Collection{MyNFT.CollectionPublic, NonFungibleToken.CollectionPublic}>(/public/MyNFTCollection, target: /storage/MyNFTCollection)
    acct.link<&MyNFT.Collection>(/private/MyNFTCollection, target: /storage/MyNFTCollection)

    let MyNFTCollection = acct.getCapability<&MyNFT.Collection>(/private/MyNFTCollection)
    let FlowTokenVault = acct.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)

    acct.save(<- NFTMarketPlace.createSaleCollection(MyNFTCollection: MyNFTCollection, FlowTokenVault: FlowTokenVault), to: /storage/MySaleCollection2)
    acct.link<&NFTMarketPlace.SaleCollection{NFTMarketPlace.SaleCollectionPublic}>(/public/MySaleCollection2, target: /storage/MySaleCollection2)
  }

  execute {
    log("A user stored a Collection inside their account")  
  }

}