import Nullstack from "nullstack";
import Button from "../../components/Button";
import "./Admin.scss";

class Admin extends Nullstack {
  data = {};

  prepare({ project, page }) {
    page.title = "Starving Market place";
    page.description = `${project.name} was made with Nullstack`;
  }

  initiate() {
    this.data = {
      address: "",
      price: 0,
    };
  }

  handleChange({ field }) {
    return ({ event }) => {
      event.preventDefault();
      this.data[field] = event.target.value;
    };
  }

  navigateToNFT({ router }) {
    router.url = "/admin/nft";
  }

  render() {
    return (
      <main class="admin">
        <aside>
          <Button onclick={this.navigateToNFT}>Create NFT</Button>
        </aside>
        <div class="faucet">
          <h2>Faucet</h2>
          <form class="form" action="submit">
            <input
              type="text"
              placeholder="address"
              value={this.data.address}
              oninput={this.handleChange({ field: "address" })}
            />
            <input
              type="number"
              placeholder="taps"
              value={this.data.price}
              oninput={this.handleChange({ field: "price" })}
            />
            <Button
              className="btn-pink"
              onclick={() => console.log("I was clicked")}
            >
              Mint and send
            </Button>
          </form>
        </div>
      </main>
    );
  }
}

export default Admin;
