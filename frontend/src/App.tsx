import { BrowserRouter, Route, Routes } from "react-router-dom"
import Layout from "./Layout"
import Dashboard from "./pages/navigations/dashboard/Dashboard"
import PageNotFound from "./pages/PageNotFound"
import Inventory from "./pages/navigations/inventory/Inventory"
import Units from "./pages/navigations/units/Units"

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
            <Route path="/" element={<Dashboard />}/>
            <Route path="/inventory" element={<Inventory />}/>
            <Route path="/units" element={<Units />}/>
            <Route path="*" element={<PageNotFound />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App