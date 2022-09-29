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
  data = {};

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

  async initiate() {
    this.data = {
      id: 0,
      price: 0,
    };
    const user = getUser();
    this.nfts = await this.getNFTs({ user });
    this.tokenApi = await this.getWebStorageTokenApi();
  }

  async hydrate() {
    const user = getUser();

    // const list = await this.getUserNFTs({ addr: user.addr });

    // console.log({ list });

    // const client = new Web3Storage({ token: this.tokenApi });
    // const nfts = await Promise.all(
    //   list.map(async (nft) => {
    //     const res = await client.get(nft.ipfsHash);
    //     const files = await res.files();
    //     const { name } = files[0];
    //     return {
    //       id: nft.id,
    //       name: nft.metadata.name,
    //       img: `https://${nft.ipfsHash}.ipfs.w3s.link/${name}`,
    //     };
    //   })
    // );
    // console.log({ nfts });
    // this.nfts = nfts;

    // console.log({ list });
  }

  async listForSale() {
    const id = +this.data.id;
    const price = parseFloat(this.data.price).toFixed(1).toString();
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
        price: +price,
        forSale: true,
      });

      console.log({ updateNFT });

      this.nfts = await this.getNFTs({ user });

      return result;
    } catch (error) {
      console.error(error);
      alert(JSON.stringify(error));
    }
  }

  async unlistForSale() {
    const id = +this.data.id;
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
      this.nfts = await this.getNFTs({ user });
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
              <Input type="number" bind={this.data.id} />
              <Input type="number" bind={this.data.price} />
              <Button onclick={this.listForSale}>List for sale</Button>
              <Button className="btn-pink" onclick={this.unlistForSale}>
                Unlist from sale
              </Button>
            </form>

            {/* <div class="filters">
              <Button>All</Button>
              <Button>Minted</Button>
              <Button>Sold</Button>
              <Button>Listed</Button>
            </div> */}

            <NFTList
              nfts={this.nfts}
              onSelectId={(id) => (this.data.id = id)}
            />
          </div>
        </main>
      </>
    );
  }
}

export default AdminNFTList;
