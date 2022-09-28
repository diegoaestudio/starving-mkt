// SetupAccount1Transaction.cdc

import TAPToken from 0xf435453dd633a663
import XNFT from 0xf435453dd633a663

// This transaction sets up account 0x01 for the marketplace tutorial
// by publishing a Vault reference and creating an empty NFT Collection.
transaction {
  prepare(acct: AuthAccount) {
    // Create a public Receiver capability to the Vault
    acct.link<&TAPToken.Vault{TAPToken.Receiver, TAPToken.Balance}>
             (/public/ReceiverPath2, target: /storage/VaultPath2)

    log("Created Vault references")

    // store an empty NFT Collection in account storage
    acct.save<@XNFT.Collection>(<-XNFT.createEmptyCollection(), to: /storage/nftTutorialCollection)

    // publish a capability to the Collection in storage
    acct.link<&{XNFT.NFTReceiver}>(XNFT.CollectionPublicPath, target: XNFT.CollectionStoragePath)

    log("Created a new empty collection and published a reference")
  }
}
