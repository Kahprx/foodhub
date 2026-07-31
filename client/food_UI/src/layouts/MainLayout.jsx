import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MobileBottomNav from "../components/MobileBottomNav";

function MainLayout(){
    return (
        <>

        <Navbar />
         <main className="pb-16 md:pb-0">
            <Outlet />
         </main>

         <Footer />

         <MobileBottomNav />
        </>
    );
}
export default MainLayout;