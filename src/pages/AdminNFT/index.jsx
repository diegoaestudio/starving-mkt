import Nullstack from "nullstack";
import * as fcl from "@onflow/fcl";
import { createNFT, createNFTContract } from "../../cadence/contracts";
import Button from "../../components/Button";
import ButtonLink from "../../components/ButtonLink";
import Input from "../../components/Input";
import NavHeader from "../../components/NavHeader";
import Select from "../../components/Select";
import TextArea from "../../components/TextArea";
import "./AdminNFT.css";
import AdminSideBar from "../../components/AdminSidebar";

class AdminNFT extends Nullstack {
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

  options = [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ];

  loading = false;

  handleChange({ field }) {
    return ({ event }) => {
      event.preventDefault();
      this.data[field] = event.target.value;
    };
  }

  handleDonationChange({ field }) {
    return ({ event }) => {
      event.preventDefault();
      this.data.donation[field] = event.target.value;
    };
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

  async createNFT({ instances }) {
    const nft = {
      ...this.data,
      addr: instances.application.user.addr,
    };

    try {
      await this.executeCreateNFTTrx();
    } catch (err) {
      alert(err.message || "Oops, something went wrong");
    }

    // const response = await this.saveNFT({ nft });
    // if (!response || response.error) {
    //   alert(response.error || "Something went wrong");
    // } else {
    //   alert("NFT created successfully");
    // }
  }

  async executeCreateNFTTrx() {
    const name = this.data.name;
    console.log({ name });

    this.loading = true;
    const transactionId = await fcl.mutate({
      cadence: createNFTContract(name),
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      // limit: 50,
    });

    fcl.tx(transactionId).subscribe((res) => {
      console.log({ res });
      if (res.status === 4) {
        alert(res.errorMessage || "NFT Created successfully");
        this.loading = false;
      }
    });

    // 0xc5531baf74dc0626 ae.studio
    // 0x1a5abf28cd91ef1f +1@ae.studio
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
                <h2>Create a new NFT</h2>
                <Input label="Image Url" bind={this.data.img} />
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
                onclick={this.createNFT}
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
