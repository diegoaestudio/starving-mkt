import Nullstack from "nullstack";
import * as fcl from "@onflow/fcl";
import AdminSideBar from "../../components/AdminSidebar";
import Button from "../../components/Button";
import NavHeader from "../../components/NavHeader";
import NFTList from "../../components/NFTList";
import { getUser } from "../../utils/user";
import "./AdminNFTList.css";
import { GET_USER_NFTS } from "../../cadence/scripts";
import Input from "../../components/Input";
import { LIST_FOR_SALE, UNLIST_FOR_SALE } from "../../cadence/transactions";
import { Web3Storage } from "web3.storage";

class AdminNFTList extends Nullstack {
  nfts = [];
  selectedNFT = {};
  user = {};

  async prepare({ project, page }) {
    page.title = "Starving Market place";
    page.description = `${project.name} was made with Nullstack`;
  }

  static async getNFTs({ database, user }) {
    return database.collection("nfts").find({ addr: user.addr }).toArray();
  }

  static async updateNFT({ database, id, price, forSale }) {
    return database.collection("nfts").updateOne(
      { id },
      {
        $set: {
          price,
          forSale,
        },
      }
    );
  }

  async getUserNFTs({ addr }) {
    console.log("loading");
    try {
      const result = await fcl.query({
        cadence: GET_USER_NFTS,
        payer: fcl.authz,
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        args: (arg, t) => [arg(addr, t.Address)],
      });

      console.log({ result });
      return result;
    } catch (error) {
      console.error(error);
      alert(JSON.stringify(error));
    }
  }

  static async getWebStorageTokenApi({ secrets }) {
    return secrets.webStorageApiToken;
  }

  async update({ authUser }) {
    if (authUser && authUser.addr !== this.user.addr) {
      this.user = authUser;
      this.nfts = await this.getNFTs({ user: authUser });
    }
  }

  async initiate() {
    this.selectedNFT = {};
    this.tokenApi = await this.getWebStorageTokenApi();
  }

  async hydrate({ authUser }) {
    //   const list = await this.getUserNFTs({ addr: user.addr });
    //   console.log({ list });
    //   const client = new Web3Storage({ token: this.tokenApi });
    //   const nfts = await Promise.all(
    //     list.map(async (nft) => {
    //       const res = await client.get(nft.ipfsHash);
    //       const files = await res.files();
    //       const { name } = files[0];
    //       return {
    //         id: nft.id,
    //         name: nft.metadata.name,
    //         img: `https://${nft.ipfsHash}.ipfs.w3s.link/${name}`,
    //       };
    //     })
    //   );
    //   console.log({ nfts });
    //   // this.nfts = nfts;
    //   console.log({ list });
  }

  async listForSale({ authUser }) {
    const id = +this.selectedNFT.id;
    const price = this.selectedNFT.price;
    console.log({ id });
    console.log({ price });

    try {
      const trxId = await fcl.mutate({
        cadence: LIST_FOR_SALE,
        payer: fcl.authz,
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 999,
        args: (arg, t) => [arg(id, t.UInt64), arg(price, t.UFix64)],
      });

      const result = await fcl.tx(trxId).onceSealed();
      console.log({ result });

      const updateNFT = await this.updateNFT({
        id: String(id),
        price: price,
        forSale: true,
      });

      console.log({ updateNFT });

      this.selectedNFT = {};
      this.nfts = await this.getNFTs({ user: authUser });

      return result;
    } catch (error) {
      console.error(error);
      alert(JSON.stringify(error));
    }
  }

  async unlistForSale({ authUser }) {
    const id = +this.selectedNFT.id;
    console.log({ id });

    try {
      const trxId = await fcl.mutate({
        cadence: UNLIST_FOR_SALE,
        payer: fcl.authz,
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 999,
        args: (arg, t) => [arg(id, t.UInt64)],
      });

      const result = await fcl.tx(trxId).onceSealed();
      console.log({ result });

      await this.updateNFT({
        id: String(id),
        price: "0",
        forSale: false,
      });
      this.selectedNFT = {};
      this.nfts = await this.getNFTs({ user: authUser });
      return result;
    } catch (error) {
      console.error(error);
      alert(JSON.stringify(error));
    }
  }

  render() {
    return (
      <>
        <NavHeader />
        <main class="admin-nft-list">
          <AdminSideBar />
          <div class="nfts">
            <h2>NFTs</h2>
            <span>Manage all your nfts</span>

            <form action="submit">
              <Input type="number" bind={this.selectedNFT.id} />
              <Input
                // type="number"
                bind={this.selectedNFT.price}
              />
              {!this.selectedNFT.forSale ? (
                <Button onclick={this.listForSale}>List for sale</Button>
              ) : (
                <Button className="btn-pink" onclick={this.unlistForSale}>
                  Unlist from sale
                </Button>
              )}
            </form>

            {/* <div class="filters">
              <Button>All</Button>
              <Button>Minted</Button>
              <Button>Sold</Button>
              <Button>Listed</Button>
            </div> */}

            <NFTList
              nfts={this.nfts}
              onSelect={(nft) => (this.selectedNFT = nft)}
              mode="admin"
            />
          </div>
        </main>
      </>
    );
  }
}

export default AdminNFTList;
