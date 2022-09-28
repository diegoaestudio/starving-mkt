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
