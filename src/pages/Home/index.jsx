import Nullstack from "nullstack";
import NavHeader from "../../components/NavHeader";
import Kidness from "../../components/Kindness";
import Hope from "../../components/Hope";
import BuyNft from "../../components/BuyNft";
import "./Home.css";
import NonFungibility from "../../components/NonFungibility";
import Footer from "../../components/Footer";

class Home extends Nullstack {
  prepare({ project, page }) {
    page.title = "Starving Market place";
    page.description = `${project.name} was made with Nullstack`;
  }

  render() {
    return (
      <section>
        <NavHeader />
        <Kidness />
        <Hope />
        <BuyNft />
        <NonFungibility />
        <Footer />
      </section>
    );
  }
}

export default Home;
