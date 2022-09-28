import Nullstack from "nullstack";
import * as fcl from "@onflow/fcl";
import { Web3Storage } from "web3.storage";
import Button from "../../components/Button";
import Input from "../../components/Input";
import NavHeader from "../../components/NavHeader";
import { getUser } from "../../utils/user";
import "./Admin.css";
import {
  MINT_NFT,
  MINT_TOKENS,
  SETUP_ACCOUNT,
} from "../../cadence/transactions";
import AdminSideBar from "../../components/AdminSidebar";
import { CHECK_MINT, CHECK_SETUP } from "../../cadence/scripts";

// const ipfsClient = ipfs.create({})

class Admin extends Nullstack {
  data = {};
  user = {};
  loading = false;
  tokenApi = null;

  prepare({ project, page }) {
    page.title = "Starving Market place";
    page.description = `${project.name} was made with Nullstack`;
  }

  static async getWebStorageTokenApi({ secrets }) {
    return secrets.webStorageApiToken;
  }

  async initiate() {
    this.user = getUser();
    this.data = {
      name: "",
      address: this.user.addr,
      price: 0,
      files: [],
    };
    this.tokenApi = await this.getWebStorageTokenApi();
  }

  handleChange({ field }) {
    return ({ event }) => {
      event.preventDefault();
      this.data[field] = event.target.value;
    };
  }

  async checkMintTrx({ address }) {
    this.loading = true;
    const trxId = await fcl.query({
      cadence: CHECK_MINT,
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      args: (arg, t) => [arg(address, t.Address)],
    });

    const result = await fcl.tx(trxId).onceSealed();
    this.loading = false;
    console.log({ result });
    return result;
  }

  async mintTrx({ address, amount }) {
    this.loading = true;
    const trxId = await fcl.mutate({
      cadence: MINT_TOKENS,
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      args: (arg, t) => [arg(amount, t.UFix64), arg(address, t.Address)],
    });

    const result = await fcl.tx(trxId).onceSealed();
    this.loading = false;
    console.log({ result });
    return result;
  }

  async mintAndSend() {
    console.log("minting");

    const address = this.data.address;
    const amount = parseFloat(this.data.price).toFixed(1).toString();

    console.log({ address });
    console.log({ amount });

    try {
      const result = await this.checkMintTrx({ address });
      console.log({ mintResult: result });
    } catch (err) {
      console.log(JSON.stringify(err));
      alert(err.message);
    }

    // try {
    //   const result = await this.mintTrx({ address, amount });
    //   console.log({ finalResult: result });
    // } catch (err) {
    //   console.log(JSON.stringify(err));
    //   alert(err.message);
    // }
  }

  async uploadImage({ files }) {
    const client = new Web3Storage({ token: this.tokenApi });
    const rootCid = await client.put(files);
    console.log({ rootCid });
    const info = await client.status(rootCid);
    console.log({ info });

    const url = `https://${rootCid}.ipfs.w3s.link/${this.data.file.name}`;
    console.log({ url });
    return { rootCid, url };
  }

  async mint() {
    this.loading = true;
    try {
      const { rootCid, url } = await this.uploadImage({
        files: this.data.files,
      });

      const trxId = await fcl
        .mutate({
          cadence: MINT_NFT,
          payer: fcl.authz,
          proposer: fcl.authz,
          authorizations: [fcl.authz],
          limit: 999,
          args: (arg, t) => [
            arg(rootCid, t.String),
            arg(this.data.name, t.String),
          ],
        })
        .then(fcl.decode);

      const result = await fcl.tx(trxId).onceSealed();
      console.log({ result });
      return result;
    } catch (err) {
      console.log(JSON.stringify(err));
      alert(err.message);
    }

    this.loading = false;
  }

  async selectImage({ event }) {
    this.data.files = event.target.files;
  }

  render() {
    console.log({ tokenApi: this.tokenApi });
    return (
      <>
        <NavHeader />
        <main class="admin">
          <AdminSideBar />
          <div class="faucet">
            <img src="/faucet.svg" alt="" />
            <form class="form" action="submit">
              {/* <Input placeholder="address" bind={this.data.address} /> */}
              <Input placeholder="NFT Name" bind={this.data.name} />
              <input type="file" oninput={this.selectImage} />
              {/* <Input placeholder="taps" type="number" bind={this.data.price} /> */}
              <Button
                className="btn-pink"
                onclick={this.mintAndSend}
                disable={this.loading}
              >
                {this.loading ? "Loading" : "Mint and send"}
              </Button>
            </form>
          </div>
        </main>
      </>
    );
  }
}

export default Admin;
