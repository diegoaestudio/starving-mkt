// Setup Account

import TapToken from 0xf435453dd633a663

// This transaction configures an account to store and receive tokens defined by
// the TapToken contract.
transaction(receiverAccount: Address) {
	prepare(acct: AuthAccount) {
		// Create a new empty Vault object
		let vaultA <- TapToken.createEmptyVault()
			
		// Store the vault in the account storage
		acct.save<@TapToken.Vault>(<-vaultA, to: /storage/CadenceFungibleTokenTutorialVault)

    log("Empty Vault stored")

    // Create a public Receiver capability to the Vault
		let ReceiverRef = acct.link<&TapToken.Vault{TapToken.Receiver, TapToken.Balance}>(/public/CadenceFungibleTokenTutorialReceiver, target: /storage/CadenceFungibleTokenTutorialVault)

    log("References created")
	}

    post {
        // Check that the capabilities were created correctly
        getAccount(receiverAccount).getCapability<&TapToken.Vault{TapToken.Receiver}>(/public/CadenceFungibleTokenTutorialReceiver)
                        .check():  
                        "Vault Receiver Reference was not created correctly"
    }
}
