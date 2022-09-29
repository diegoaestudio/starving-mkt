import NFTMarketPlace from 0xf435453dd633a663
import MyNFT from 0xf435453dd633a663
import NonFungibleToken from 0x631e88ae7f1d7c20
import FlowToken from 0x7e60df042a9c0868

transaction(account: Address, id: UInt64) {
  prepare(acct: AuthAccount) {
    let saleCollection = getAccount(account).getCapability(/public/MySaleCollection2)
        .borrow<&NFTMarketPlace.SaleCollection{NFTMarketPlace.SaleCollectionPublic}>()
            ?? panic("This MySaleCollection2 doesn't exist")

    let recipientCollection = getAccount(acct.address).getCapability(/public/MyNFTCollection)
        .borrow<&MyNFT.Collection{NonFungibleToken.CollectionPublic}>()
            ?? panic("This user cannot purchase")

    let price = saleCollection.getPrice(id: id)
    let payment <- acct
        .borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: price) as! @FlowToken.Vault

    saleCollection.purchase(id: id, recipientCollection: recipientCollection, payment: <- payment)
  }

  execute {
    log("A user purchased an NFT")  
  }

}