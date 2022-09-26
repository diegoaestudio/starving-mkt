export const createNFTContract = (name) => `
    pub contract ${name} {
        pub let CollectionStoragePath: StoragePath
        pub let CollectionPublicPath: PublicPath
        pub let MinterStoragePath: StoragePath

        pub resource NFT {
            pub let id: UInt64

            init(initID: UInt64) {
                self.id = initID
            }
        }

        pub resource interface NFTReceiver {

            pub fun deposit(token: @NFT)

            pub fun getIDs(): [UInt64]

            pub fun idExists(id: UInt64): Bool
        }

        pub resource Collection: NFTReceiver {
            pub var ownedNFTs: @{UInt64: NFT}

            init () {
                self.ownedNFTs <- {}
            }

            pub fun withdraw(withdrawID: UInt64): @NFT {
                let token <- self.ownedNFTs.remove(key: withdrawID)!

                return <-token
            }

            pub fun deposit(token: @NFT) {
                self.ownedNFTs[token.id] <-! token
            }

            pub fun idExists(id: UInt64): Bool {
                return self.ownedNFTs[id] != nil
            }

            pub fun getIDs(): [UInt64] {
                return self.ownedNFTs.keys
            }

            destroy() {
                destroy self.ownedNFTs
            }
        }

        pub fun createEmptyCollection(): @Collection {
            return <- create Collection()
        }

        pub resource NFTMinter {

            pub var idCount: UInt64

            init() {
                self.idCount = 1
            }

            pub fun mintNFT(): @NFT {

                var newNFT <- create NFT(initID: self.idCount)

                self.idCount = self.idCount + 1
                
                return <-newNFT
            }
        }

        init() {
            self.CollectionStoragePath = /storage/nftTutorialCollection
            self.CollectionPublicPath = /public/nftTutorialCollection
            self.MinterStoragePath = /storage/nftTutorialMinter

            self.account.save(<-self.createEmptyCollection(), to: self.CollectionStoragePath)

            self.account.link<&{NFTReceiver}>(self.CollectionPublicPath, target: self.CollectionStoragePath)

            self.account.save(<-create NFTMinter(), to: self.MinterStoragePath)
        }
    }
`;
