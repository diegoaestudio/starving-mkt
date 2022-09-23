import Nullstack from "nullstack";
import Button from "../../components/Button";
import ButtonLink from "../../components/ButtonLink";
import NavHeader from "../../components/NavHeader";
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

            <a href="/admin/nfts" class="text-3">
              NFTS
            </a>

            <h1 class="text-3xl font-bold underline">Hello world!</h1>
          </aside>
          <div class="create-nft">
            <form class="form" action="submit">
              <div class="side-a">
                <h2>Create a new NFT</h2>
                <input
                  type="text"
                  placeholder="image url"
                  value={this.data.img}
                  oninput={this.handleChange({ field: "img" })}
                />
                <input
                  type="text"
                  placeholder="name"
                  value={this.data.name}
                  oninput={this.handleChange({ field: "name" })}
                />
                <input
                  type="text"
                  placeholder="external link"
                  value={this.data.externalLink}
                  oninput={this.handleChange({ field: "externalLink" })}
                />
                <input
                  type="number"
                  placeholder="max editions"
                  bind={this.data.maxEditions}
                />
                <textarea
                  placeholder="description"
                  value={this.data.description}
                  oninput={this.handleChange({ field: "description" })}
                />
                <select
                  name="dehydrated"
                  id="dehydrated"
                  bind={this.data.dehydrated}
                  placeholder="dehydrated"
                >
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </select>
                <select
                  name="crying"
                  id="crying"
                  bind={this.data.crying}
                  placeholder="crying"
                >
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </select>
                <input
                  type="number"
                  placeholder="price"
                  bind={this.data.price}
                />
              </div>
              <div class="side-b">
                <h2>Side B - NFT For Donation</h2>
                <input
                  type="text"
                  placeholder="img url"
                  value={this.data.donation.img}
                  oninput={this.handleDonationChange({ field: "img" })}
                />
                <input
                  type="text"
                  placeholder="name"
                  value={this.data.donation.name}
                  oninput={this.handleDonationChange({ field: "name" })}
                />
                <input
                  type="text"
                  placeholder="external link"
                  value={this.data.donation.externalLink}
                  oninput={this.handleDonationChange({ field: "externalLink" })}
                />
                <input type="number" placeholder="max editions" disabled />
                <textarea
                  placeholder="description"
                  value={this.data.donation.description}
                  oninput={this.handleDonationChange({ field: "description" })}
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
