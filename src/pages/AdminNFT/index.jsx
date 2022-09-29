import Nullstack from "nullstack";
import * as fcl from "@onflow/fcl";
import { Web3Storage } from "web3.storage";
import { createNFT, createNFTContract } from "../../cadence/contracts";
import Button from "../../components/Button";
import ButtonLink from "../../components/ButtonLink";
import Input from "../../components/Input";
import NavHeader from "../../components/NavHeader";
import Select from "../../components/Select";
import TextArea from "../../components/TextArea";
import "./AdminNFT.css";
import AdminSideBar from "../../components/AdminSidebar";
import { getUser } from "../../utils/user";
import { MINT_NFT, SETUP_USER } from "../../cadence/transactions";

class AdminNFT extends Nullstack {
  user = null;
  data = {
    img: "",
    name: "",
    externalLink: "",
    maxEditions: 0,
    description: "",
    dehydrated: false,
    crying: false,
    price: 0,
    donation: {
      img: "",
      name: "",
      externalLink: "",
      maxEditions: 0,
      description: "",
    },
  };

  files = [];

  options = [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ];

  loading = false;

  static async getWebStorageTokenApi({ secrets }) {
    return secrets.webStorageApiToken;
  }

  async initiate() {
    this.user = getUser();
    this.tokenApi = await this.getWebStorageTokenApi();
  }

  static async saveNFT({ nft, database }) {
    const existingNFT = await database
      .collection("nfts")
      .findOne({ name: new RegExp(nft.name, "i") });

    if (existingNFT) {
      return { error: "NFT with this name already exists" };
    }

    const newNFT = await database.collection("nfts").insertOne(nft);
    return newNFT;
  }

  async selectImage({ event }) {
    this.files = event.target.files;
  }

  async uploadImage({ files }) {
    const client = new Web3Storage({ token: this.tokenApi });
    const rootCid = await client.put(files);
    console.log({ rootCid });
    const info = await client.status(rootCid);
    console.log({ info });

    const url = `https://${rootCid}.ipfs.w3s.link/${files[0].name}`;
    console.log({ url });
    return { rootCid, url };
  }

  async mint() {
    this.loading = true;

    if (!this.data.name) alert("Include a name pls");

    const name = this.data.name;

    try {
      const { rootCid, url } = await this.uploadImage({
        files: this.files,
      });

      const trxId = await fcl.mutate({
        cadence: MINT_NFT,
        payer: fcl.authz,
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 999,
        args: (arg, t) => [arg(rootCid, t.String), arg(name, t.String)],
      });

      const result = await fcl.tx(trxId).onceSealed();

      const depositEvent = result.events.find((event) => {
        console.log({ eventType: event.type });
        return /deposit/gi.test(event.type);
      });

      console.log({ depositEvent });

      const id = depositEvent.data.id;

      console.log({ result });
      const savedInDB = await this.saveNFT({
        nft: { ...this.data, id, img: url, addr: getUser().addr },
      });

      console.log({ savedInDB });
      this.loading = false;

      return result;
    } catch (err) {
      console.log("to no erro");
      console.log(JSON.stringify(err));
      this.loading = false;
      alert(err);
    }
  }

  async setupUser() {
    const trxId = await fcl.mutate({
      cadence: SETUP_USER,
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 999,
    });

    console.log({ trxId });

    const result = await fcl.tx(trxId).onceSealed();
    console.log({ result });
    return result;
  }

  render({ instances }) {
    return (
      <>
        <NavHeader />
        <main class="admin-nft">
          <AdminSideBar />
          <div class="create-nft">
            <form class="form" action="submit">
              <div class="side-a">
                {/* <Button onclick={this.setupUser}>Setup user</Button> */}
                <h2>Create a new NFT</h2>
                <input type="file" oninput={this.selectImage} />
                <Input label="Name" bind={this.data.name} />
                <Input label="External Link" bind={this.data.externalLink} />
                <Input
                  label="Max Editions"
                  bind={this.data.maxEditions}
                  type="number"
                />
                <TextArea label="Description" bind={this.data.description} />
                <Select
                  label="Dehydrated"
                  bind={this.data.dehydrated}
                  options={this.options}
                />

                <Select
                  label="Crying"
                  bind={this.data.crying}
                  options={this.options}
                />

                <Input label="Price" bind={this.data.price} type="number" />
              </div>
              <div class="side-b">
                <h2>Side B - NFT For Donation</h2>
                <Input label="Image Url" bind={this.data.donation.img} />
                <Input label="Name" bind={this.data.donation.name} />
                <Input
                  label="External Link"
                  bind={this.data.donation.externalLink}
                />
                <Input
                  label="Max Editions"
                  bind={this.data.donation.maxEditions}
                />
                <TextArea
                  label="Description"
                  bind={this.data.donation.description}
                />
              </div>
              <Button
                onclick={this.mint}
                disable={!instances.application.user.addr || this.loading}
              >
                {this.loading ? "Loading" : "Create NFT"}
              </Button>
            </form>
          </div>
        </main>
      </>
    );
  }
}

export default AdminNFT;
