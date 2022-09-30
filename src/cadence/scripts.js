export const CHECK_SETUP = `
// CheckSetupScript.cdc

import TAPToken from 0xf435453dd633a663
import XNFT from 0xf435453dd633a663

// This script checks that the accounts are set up correctly for the marketplace tutorial.
//
// Account 0x01: Vault Balance = 40, NFT.id = 1
pub fun main(receiverAccount: Address) {
    // Get the accounts' public account objects
    let acct = getAccount(receiverAccount)

    // Get references to the account's receivers
    // by getting their public capability
    // and borrowing a reference from the capability
    let acctReceiverRef = acct.getCapability(/public/ReceiverPath2)
                          .borrow<&TAPToken.Vault{TAPToken.Balance}>()
                          ?? panic("Could not borrow acct vault reference")

    // Log the Vault balance of both accounts and ensure they are
    // the correct numbers.
    // Account 0x01 should have 40.
    // Account 0x02 should have 20.
    log("Account Balance")
    log(acctReceiverRef.balance)

    // Find the public Receiver capability for their Collections
    let acctCapability = acct.getCapability(XNFT.CollectionPublicPath)

    // borrow references from the capabilities
    let nftRef = acctCapability.borrow<&{XNFT.NFTReceiver}>()
        ?? panic("Could not borrow acct nft collection reference")

    // Print both collections as arrays of IDs
    log("Account NFTs")
    log(nftRef.getIDs())

    // verify that the collections are correct
    if nftRef.getIDs()[0] != 1 {
        panic("Wrong Collections!")
    }
}
`;

export const GET_BALANCE = `
// This script reads the balance field of an account's FlowToken Balance
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868

pub fun main(account: Address): UFix64 {

    let vaultRef = getAccount(account)
        .getCapability(/public/flowTokenBalance)
        .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference to the Vault")

    return vaultRef.balance
}
`;

export const CHECK_MINT = `

// CheckSetupScript.cdc

import TAPToken from 0xf435453dd633a663
import XNFT from 0xf435453dd633a663

// This script checks that the accounts are set up correctly for the marketplace tutorial.
//
// Account 0x01: Vault Balance = 40, NFT.id = 1
pub fun main(receiverAccount: Address) {
    // Get the accounts' public account objects
    let acct = getAccount(receiverAccount)

    // Get references to the account's receivers
    // by getting their public capability
    // and borrowing a reference from the capability
    let acctReceiverRef = acct.getCapability(/public/Minter)
        .borrow<&TAPToken.VaultMinter>()
        ?? panic("Could not borrow owner's vault minter reference")
}

`;

export const GET_USER_NFTS = `
import NonFungibleToken from 0x631e88ae7f1d7c20
import MyNFT from 0xf435453dd633a663

pub fun main(account: Address): [&MyNFT.NFT] {
    let collection = getAccount(account).getCapability(/public/MyNFTCollection)
        .borrow<&MyNFT.Collection{NonFungibleToken.CollectionPublic, MyNFT.CollectionPublic}>()
            ?? panic("Could not borrow capability from public collection")
    

    let returnVals: [&MyNFT.NFT] = []

    let ids = collection.getIDs()
    for id in ids {
        returnVals.append(collection.borrowEntireNFT(id: id))
    }

    return returnVals
}
`;

export const GET_SALES_NFT = `
import NonFungibleToken from 0x631e88ae7f1d7c20
import MyNFT from 0xf435453dd633a663
import NFTMarketPlace from 0xf435453dd633a663

pub fun main(account: Address): [{String: AnyStruct}] {
  let saleCollection = getAccount(account).getCapability(/public/MySaleCollection2)
    .borrow<&NFTMarketPlace.SaleCollection{NFTMarketPlace.SaleCollectionPublic}>()
      ?? panic("Could not borrow capability from sale collection")

  let collection = getAccount(account).getCapability(/public/MyNFTCollection)
    .borrow<&MyNFT.Collection{NonFungibleToken.CollectionPublic, MyNFT.CollectionPublic}>()
        ?? panic("Could not borrow capability from collection")

  let saleIDs = saleCollection.getIDs()

  let returnVals: [{String: AnyStruct}] = []

  for saleID in saleIDs {
    let price = saleCollection.getPrice(id: saleID)
    let nftRef = collection.borrowEntireNFT(id: saleID)
    returnVals.append({"nft": nftRef, "price": price})
  }

  return returnVals
}
`;
