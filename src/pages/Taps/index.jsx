import Nullstack from "nullstack";
import Button from "../../components/Button";
import Footer from "../../components/Footer";
import Input from "../../components/Input";
import NavHeader from "../../components/NavHeader";
import NonFungibility from "../../components/NonFungibility";
import "./Taps.css";

class TAPs extends Nullstack {
  data = {
    flow: 0,
    taps: 0,
  };

  prepare({ project, page }) {
    page.title = "Starving Market place";
    page.description = `${project.name} was made with Nullstack`;
  }

  render() {
    return (
      <section>
        <NavHeader />

        <div class="taps">
          <div class="buy-taps">
            <img src="/buy-taps.svg" alt="" />

            <div class="buy-taps-card">
              <Input label={"Flow"} bind={this.data.flow} type="number" />
              <Input label={"Taps"} bind={this.data.taps} type="number" />
              <Button>Connect your wallet</Button>
            </div>
          </div>
        </div>

        <NonFungibility />
        <Footer />
      </section>
    );
  }
}

export default TAPs;
