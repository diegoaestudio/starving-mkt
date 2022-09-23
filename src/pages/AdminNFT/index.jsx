import Nullstack from "nullstack";
import Button from "../../components/Button";
import ButtonLink from "../../components/ButtonLink";
import Input from "../../components/Input";
import NavHeader from "../../components/NavHeader";
import Select from "../../components/Select";
import TextArea from "../../components/TextArea";
import "./AdminNFT.css";

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

  async handleSubmit({ instances }) {
    const nft = {
      ...this.data,
      addr: instances.application.user.addr,
    };
    const response = await this.saveNFT({ nft });
    if (!response || response.error) {
      alert(response.error || "Something went wrong");
    } else {
      alert("NFT created successfully");
    }
  }

  render({ instances }) {
    return (
      <>
        <NavHeader />
        <main class="admin-nft">
          <aside>
            <ButtonLink linkPath="/admin/create">Create NFT</ButtonLink>

            <a href="/admin/nfts" class="text-3 pt-10">
              NFTS
            </a>
          </aside>
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
                onclick={this.handleSubmit}
                disable={!instances.application.user.addr}
              >
                Create NFT
              </Button>
            </form>
          </div>
        </main>
      </>
    );
  }
}

export default AdminNFT;
