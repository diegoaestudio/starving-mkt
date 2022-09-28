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
