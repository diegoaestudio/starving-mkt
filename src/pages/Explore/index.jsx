import Nullstack from "nullstack";
import Footer from "../../components/Footer";
import Input from "../../components/Input";
import NavHeader from "../../components/NavHeader";
import NFTList from "../../components/NFTList";
import { getUser } from "../../utils/user";
import "./Explore.css";

class Explore extends Nullstack {
  nfts = [];
  search = null;
  user = null;

  prepare({ project, page }) {
    page.title = "Starving Market place";
    page.description = `${project.name} was made with Nullstack`;
  }

  static async getNFTs({ database, inputSearch, addr }) {
    return database
      .collection("nfts")
      .find({
        addr,
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
    this.user = getUser();
    this.nfts = await this.getNFTs({
      inputSearch: this.search,
      addr: this.user.addr,
    });
  }

  async initiate() {
    this.user = getUser();
    this.nfts = await this.getNFTs({ addr: this.user.addr });
  }

  async searchNfts({ event }) {
    this.search = event.target.value;
    this.nfts = await this.getNFTs({
      inputSearch: this.search,
      addr: this.user.addr,
    });
  }

  render() {
    return (
      <section>
        <NavHeader />

        <div class="explore">
          <img src="/explore.svg" alt="explore starving children" />

          <Input oninput={this.searchNfts} />

          <NFTList nfts={this.nfts} />
        </div>

        <Footer />
      </section>
    );
  }
}

export default Explore;
