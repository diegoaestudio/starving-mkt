// CheckSetupScript.cdc

import TAPToken from 0xf435453dd633a663
import XNFT from 0xf435453dd633a663

// This script checks that the accounts are set up correctly for the marketplace tutorial.
//
// Account 0x01: Vault Balance = 40, NFT.id = 1
pub fun main(receiverAccount: Address): UFix64 {
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

    return acctReceiverRef.balance
}
