import { BrowserRouter, Route, Routes } from "react-router-dom"
import Layout from "./Layout"
import Dashboard from "./pages/navigations/dashboard/Dashboard"
import PageNotFound from "./pages/PageNotFound"
import Inventory from "./pages/navigations/inventory/Inventory"
import Units from "./pages/navigations/units/Units"
import SalesReport from "./pages/navigations/units/salesReport/SalesReport"
import DailySales from "./pages/navigations/units/dailySales/DailySales"

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
            <Route path="/" element={<Dashboard />}/>
            <Route path="/inventory" element={<Inventory />}/>
            <Route path="/units" element={<Units />}/>
            <Route path="units/merchandiser/:id/sales" element={<SalesReport />} />
            <Route path="/units/merchandiser/:partnerId/sales/:reportId/dailysales" element={<DailySales />} />
            <Route path="*" element={<PageNotFound />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App