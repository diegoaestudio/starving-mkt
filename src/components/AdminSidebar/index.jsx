import ButtonLink from "../ButtonLink";
import "./AdminSidebar.css";

const AdminSideBar = () => {
  return (
    <aside class="admin-sidebar">
      <ButtonLink linkPath="/admin/create">Create NFT</ButtonLink>

      <div class="admin-navigation">
        <a href="/admin" class="text-3 pt-10">
          Faucet
        </a>
        <a href="/admin/nfts" class="text-3 pt-10">
          NFTS
        </a>
      </div>
    </aside>
  );
};

export default AdminSideBar;
