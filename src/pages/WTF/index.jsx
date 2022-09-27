import Nullstack from "nullstack";
import Charity from "../../components/Charity";
import Footer from "../../components/Footer";
import NavHeader from "../../components/NavHeader";
import NonFungibility from "../../components/NonFungibility";

class WTF extends Nullstack {
  prepare({ project, page }) {
    page.title = "Starving Market place";
    page.description = `${project.name} was made with Nullstack`;
  }

  render() {
    return (
      <section>
        <NavHeader />
        <Charity />
        <NonFungibility />
        <Footer />
      </section>
    );
  }
}

export default WTF;
