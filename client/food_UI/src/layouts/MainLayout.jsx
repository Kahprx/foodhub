import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MobileBottomNav from "../components/MobileBottomNav";
import { useAuth } from "../context/AuthContext";

function MainLayout(){
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";
    return (
        <>

        {!isAdmin && <Navbar />}
         <main className="pb-16 md:pb-0">
            <Outlet />
         </main>

         {!isAdmin && <Footer />}

         {!isAdmin && <MobileBottomNav />}
        </>
    );
}
export default MainLayout;