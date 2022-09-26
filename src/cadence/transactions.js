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
        acct.link<&TAPToken.Vault{TAPToken.Receiver, TAPToken.Balance}>(/public/CadenceFungibleTokenTutorialReceiver, target: /storage/CadenceFungibleTokenTutorialVault)

        log("Public Receiver reference created!")
    }

    post {
        // Check that the capabilities were created correctly
        // by getting the public capability and checking 
        // that it points to a valid 'Vault' object 
        // that implements the 'Receiver' interface
        getAccount(0x02).getCapability<&TAPToken.Vault{TAPToken.Receiver}>(/public/CadenceFungibleTokenTutorialReceiver)
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


`;
