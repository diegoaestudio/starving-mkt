import Nullstack from "nullstack";
import Button from "../../components/Button";
import ButtonLink from "../../components/ButtonLink";
import Input from "../../components/Input";
import NavHeader from "../../components/NavHeader";
import "./Admin.css";

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
  render() {
    return (
      <>
        <NavHeader />
        <main class="admin">
          <aside>
            <ButtonLink linkPath="/admin/create">Create NFT</ButtonLink>
          </aside>
          <div class="faucet">
            <img src="/faucet.svg" alt="" />
            <form class="form" action="submit">
              <Input placeholder="address" bind={this.data.address} />
              <Input placeholder="taps" bind={this.data.price} />
              <Button
                className="btn-pink"
                onclick={() => console.log("I was clicked")}
              >
                Mint and send
              </Button>
            </form>
          </div>
        </main>
      </>
    );
  }
}

export default Admin;
