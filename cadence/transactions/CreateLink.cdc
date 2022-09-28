// Create Link

import TAPToken from 0xf435453dd633a663

// This transaction creates a capability 
// that is linked to the account's token vault.
// The capability is restricted to the fields in the `Receiver` interface,
// so it can only be used to deposit funds into the account.
transaction {
  prepare(acct: AuthAccount) {

    // Create a link to the Vault in storage that is restricted to the
    // fields and functions in `Receiver` and `Balance` interfaces, 
    // this only exposes the balance field 
    // and deposit function of the underlying vault.
    //
    acct.link<&TAPToken.Vault{TAPToken.Receiver, TAPToken.Balance}>(/public/ReceiverPath2, target: /storage/VaultPath2)

    log("Public Receiver reference created!")
  }

  post {
    // Check that the capabilities were created correctly
    // by getting the public capability and checking 
    // that it points to a valid `Vault` object 
    // that implements the `Receiver` interface
    getAccount(0xf435453dd633a663).getCapability<&TAPToken.Vault{TAPToken.Receiver}>(/public/ReceiverPath2)
                    .check():
                    "Vault Receiver Reference was not created correctly"
    }
}
