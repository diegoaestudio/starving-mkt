import Nullstack from "nullstack";
import * as fcl from "@onflow/fcl";
import { Web3Storage } from "web3.storage";
import Footer from "../../components/Footer";
import Input from "../../components/Input";
import NavHeader from "../../components/NavHeader";
import NFTList from "../../components/NFTList";
import { getUser } from "../../utils/user";
import "./Explore.css";
import { GET_SALES_NFT } from "../../cadence/scripts";
import { PURCHASE_NFT } from "../../cadence/transactions";

class Explore extends Nullstack {
  nfts = [];
  search = null;
  user = null;
  tokenApi = null;
  loading = false;
  adminAddress = "";

  prepare({ project, page }) {
    page.title = "Starving Market place";
    page.description = `${project.name} was made with Nullstack`;
  }

  static async getWebStorageTokenApi({ secrets }) {
    return secrets.webStorageApiToken;
  }

  static async getAdminAddress({ secrets }) {
    return secrets.adminAddress;
  }

  static async updatePurchasedNFT({ addr, id, database }) {
    return database
      .collection("nfts")
      .updateOne({ id }, { $set: { addr, forSale: false } });
  }

  static async getNFTs({ database, inputSearch, addr }) {
    return database
      .collection("nfts")
      .find({
        // addr,
        forSale: true,
        ...(inputSearch && {
          $or: [
            { name: { $regex: inputSearch, $options: "i" } },
            { description: { $regex: inputSearch, $options: "i" } },
            { price: { $regex: inputSearch, $options: "i" } },
            { "donation.name": { $regex: inputSearch, $options: "i" } },
            { "donation.description": { $regex: inputSearch, $options: "i" } },
            { "donation.description": { $regex: inputSearch, $options: "i" } },
          ],
        }),
      })
      .toArray();
  }

  async update() {
    if (this.user.addr !== getUser().addr) {
      this.user = getUser();
      this.nfts = await this.getNFTs({
        inputSearch: this.search,
        addr: this.adminAddress,
        forSale: true,
      });
    }
  }

  async initiate() {
    this.tokenApi = await this.getWebStorageTokenApi();
    this.adminAddress = await this.getAdminAddress();
    console.log("adminAddres", this.adminAddress);
    this.user = getUser();
    this.nfts = await this.getNFTs({ addr: this.adminAddress, forSale: true });
    this.loading = false;
  }

  async searchNfts({ event }) {
    this.search = event.target.value;
    this.nfts = await this.getNFTs({
      inputSearch: this.search,
      addr: this.user.addr,
    });
  }

  async getSaleNFTs() {
    try {
      const result = await fcl.query({
        cadence: GET_SALES_NFT,
        payer: fcl.authz,
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 999,
        args: (arg, t) => [arg(getUser().addr, t.Address)],
      });

      console.log({ result });
      return result;
    } catch (error) {
      console.error(error);
      alert(JSON.stringify(error));
      return [];
    }
  }

  async hydrate() {
    const items = await this.getSaleNFTs();
    const client = new Web3Storage({ token: this.tokenApi });
    const nfts = await Promise.all(
      items.map(async ({ nft, price }) => {
        const res = await client.get(nft.ipfsHash);
        const files = await res.files();
        const { name } = files[0];
        return {
          id: nft.id,
          name: nft.metadata.name,
          price: parseFloat(price).toFixed(1),
          img: `https://${nft.ipfsHash}.ipfs.w3s.link/${name}`,
        };
      })
    );
    console.log({ nfts });
    // this.nfts = nfts;
  }

  async purchase({ nftId }) {
    const id = String(nftId);
    console.log({ id });

    this.loading = true;

    try {
      const trxId = await fcl.mutate({
        cadence: PURCHASE_NFT,
        payer: fcl.authz,
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 999,
        args: (arg, t) => [
          arg(this.adminAddress, t.Address),
          arg(id, t.UInt64),
        ],
      });

      const result = await fcl.tx(trxId).onceSealed();
      console.log({ result });
      this.loading = false;

      const updatedNFT = await this.updatePurchasedNFT({
        id,
        addr: this.user.addr,
      });
      console.log({ updatedNFT });
      this.nfts = await this.getNFTs({ user: this.user });
      return result;
    } catch (error) {
      this.loading = false;
      console.error(error);
      alert(JSON.stringify(error));
    }
  }

  render() {
    // return <OverlayLoader />;
    return (
      <section>
        <NavHeader />

        <div class="explore">
          {this.loading && <h2>"Loading..."</h2>}

          <img src="/explore.svg" alt="explore starving children" />

          <Input oninput={this.searchNfts} />

          <NFTList
            nfts={this.nfts}
            onPurchase={(nftId) => this.purchase({ nftId })}
          />
        </div>

        <Footer />
      </section>
    );
  }
}

export default Explore;
