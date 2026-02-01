import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ScrollToTop } from "./components/ScrollToTop";
import MainLayout from "./components/layout/MainLayout";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import HomeLoans from "./pages/services/HomeLoans";
import InteriorDesign from "./pages/services/InteriorDesign";
import PropertyPromotions from "./pages/services/PropertyPromotions";
import Careers from "./pages/Careers";
import Blog from "./pages/Blog";
import Help from "./pages/Help";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Sitemap from "./pages/Sitemap";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminAddProperty from "./pages/admin/AdminAddProperty";
import AdminEditProperty from "./pages/admin/AdminEditProperty";
import AdminEnquiries from "./pages/admin/AdminEnquiries";
import AdminLocations from "./pages/admin/AdminLocations";
import AdminSettings from "./pages/admin/AdminSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/property/:slug" element={<PropertyDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/services/home-loans" element={<HomeLoans />} />
              <Route path="/services/interior-design" element={<InteriorDesign />} />
              <Route path="/services/property-promotions" element={<PropertyPromotions />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/help" element={<Help />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/sitemap" element={<Sitemap />} />
            </Route>
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="properties" element={<AdminProperties />} />
              <Route path="properties/add" element={<AdminAddProperty />} />
              <Route path="properties/edit/:id" element={<AdminEditProperty />} />
              <Route path="enquiries" element={<AdminEnquiries />} />
              <Route path="locations" element={<AdminLocations />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
