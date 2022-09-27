import { ObjectId } from "mongodb";
import Nullstack from "nullstack";
import Footer from "../../components/Footer";
import NavHeader from "../../components/NavHeader";
import NonFungibility from "../../components/NonFungibility";
import "./NFTDetail.css";

class NFTDetail extends Nullstack {
  nft = {};

  prepare({ project, page }) {
    page.title = "Starving Market place";
    page.description = `${project.name} was made with Nullstack`;
  }

  static async getNFT({ database, id }) {
    return database.collection("nfts").findOne({ _id: ObjectId(id) });
  }

  async initiate({ params }) {
    this.nft = await this.getNFT({ id: params.id });
  }

  render() {
    return (
      <section>
        <NavHeader />

        <div class="nft-detail">
          <div class="images">
            <img src={this.nft?.img} alt="" />
            <img src={this.nft?.donation?.img} alt="" />
          </div>
          <div class="details">
            <h1>{this.nft?.name}</h1>
            <span>{this.nft?.addr}</span>
            <p>Price: {this.nft?.price}</p>
            <p>{this.nft?.description}</p>
          </div>
        </div>

        <Footer />
      </section>
    );
  }
}

export default NFTDetail;
