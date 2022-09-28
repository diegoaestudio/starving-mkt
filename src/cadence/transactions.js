export const CREATE_LINK = `
    // Create Link

    import TAPToken from 0xf435453dd633a663

    // This transaction creates a capability 
    // that is linked to the account's token vault.
    // The capability is restricted to the fields in the 'Receiver' interface,
    // so it can only be used to deposit funds into the account.
    transaction {
    prepare(acct: AuthAccount) {

        // Create a link to the Vault in storage that is restricted to the
        // fields and functions in 'Receiver' and 'Balance' interfaces, 
        // this only exposes the balance field 
        // and deposit function of the underlying vault.
        //
        acct.link<&TAPToken.Vault{TAPToken.Receiver, TAPToken.Balance}>(/public/ReceiverPath2, target: /storage/VaultPath2)

        log("Public Receiver reference created!")
    }

    post {
        // Check that the capabilities were created correctly
        // by getting the public capability and checking 
        // that it points to a valid 'Vault' object 
        // that implements the 'Receiver' interface
        getAccount(0x02).getCapability<&TAPToken.Vault{TAPToken.Receiver}>(/public/ReceiverPath2)
                        .check():
                        "Vault Receiver Reference was not created correctly"
        }
    }
`;

export const MINT_TOKENS = `
    // Mint Tokens

    import TAPToken from 0xf435453dd633a663

    // This transaction mints tokens and deposits them into account 3's vault
    transaction(amount: UFix64, recipientAccount: Address) {

        // Local variable for storing the reference to the minter resource
        let mintingRef: &TAPToken.VaultMinter

        // Local variable for storing the reference to the Vault of
        // the account that will receive the newly minted tokens
        var receiver: Capability<&TAPToken.Vault{TAPToken.Receiver}>

        prepare(acct: AuthAccount) {
            // Borrow a reference to the stored, private minter resource
            self.mintingRef = acct.borrow<&TAPToken.VaultMinter>(from: /storage/MinterPath2)
                ?? panic("Could not borrow a reference to the minter")
            
            // Get the public account object for account 0x03
            let recipient = getAccount(recipientAccount)

            // Get their public receiver capability
            self.receiver = recipient.getCapability<&TAPToken.Vault{TAPToken.Receiver}>(/public/ReceiverPath2)

        }

        execute {
            // Mint 10 tokens and deposit them into the recipient's Vault
            self.mintingRef.mintTokens(amount: amount, recipient: self.receiver)

            log(" tokens minted and deposited to account 0xf435453dd633a663")
        }
    }


`;

export const SETUP_ACCOUNT = `
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
`;

export const SETUP_ACCOUNT_2 = `
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
    if acct.borrow<&TAPToken.Vault>(from: /storage/VaultPath2) == nil {
        // create a new vault instance with an initial balance of 30
        let vaultA <- TAPToken.createEmptyVault()

        // Store the vault in the account storage
        acct.save<@TAPToken.Vault>(<-vaultA, to: /storage/VaultPath2)

        // Create a public Receiver capability to the Vault
        let ReceiverRef = acct.link<&TAPToken.Vault{TAPToken.Receiver, TAPToken.Balance}>(/public/ReceiverPath2, target: /storage/VaultPath2)

        log("Created a Vault and published a reference")
    }

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
    receiverRef.deposit(token: <-self.minterRef.mintNFT())

    log("New NFT minted for account 1")
  }
}
`;
