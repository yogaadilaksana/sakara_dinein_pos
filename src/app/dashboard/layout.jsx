import Header from "@/app/_components/_dashboard/Header";
import SideBar from "../_components/_dashboard/SideBar";
import EditQuantityModal from "../_components/_dashboard/EditQuantityModal";

export const metadata = {
  title: {
    template: "%s | Dashboard Sakara Kopi Bali",
    default: "Home | Dashboard Sakara Kopi Bali",
  },
};

function Layout({ children }) {
  return (
    <div className="relative overflow-x-hidden overscroll-x-none">
      <Header />
      <div className="flex flex-row h-screen mb-20">
        <SideBar />
        {children}
      </div>
      {/* Modal Pop Up */}
      {/* <EditQuantityModal /> */}
    </div>
  );
}

export default Layout;
