// SetupAccount2Transaction.cdc

import TAPToken from 0xf435453dd633a663
import XNFT from 0xf435453dd633a663

// This transaction adds an empty Vault to account 0x02
// and mints an NFT with id=1 that is deposited into
// the NFT collection on account 0x01.
transaction(receiverAddress: Address) {
  // Private reference to this account's minter resource
  let minterRef: &XNFT.NFTMinter

  prepare(acct: AuthAccount) {
    // Borrow a reference for the NFTMinter in storage
    self.minterRef = acct.borrow<&XNFT.NFTMinter>(from: XNFT.MinterStoragePath)
        ?? panic("Could not borrow owner's NFT minter reference")
  }

  execute {
    // Get the recipient's public account object
    let recipient = getAccount(receiverAddress)

    // Get the Collection reference for the receiver
    // getting the public capability and borrowing a reference from it
    let receiverRef = recipient.getCapability(XNFT.CollectionPublicPath)
                               .borrow<&{XNFT.NFTReceiver}>()
                               ?? panic("Could not borrow nft receiver reference")

    // Mint an NFT and deposit it into account 0x01's collection
    // receiverRef.deposit(token: <-self.minterRef.mintNFT())

    log("New NFT minted for account 1")
  }
}
