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
        self.mintingRef = acct.borrow<&TAPToken.VaultMinter>(from: /storage/CadenceFungibleTokenTutorialMinter)
            ?? panic("Could not borrow a reference to the minter")
        
        // Get the public account object for account 0x03
        let recipient = getAccount(recipientAccount)

        // Get their public receiver capability
        self.receiver = recipient.getCapability<&TAPToken.Vault{TAPToken.Receiver}>(/public/CadenceFungibleTokenTutorialReceiver)

	}

    execute {
        // Mint 10 tokens and deposit them into the recipient's Vault
        self.mintingRef.mintTokens(amount: amount, recipient: self.receiver)

        log(" tokens minted and deposited to account 0xf435453dd633a663")
    }
}

