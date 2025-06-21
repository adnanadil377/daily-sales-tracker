import { BrowserRouter, Route, Routes } from "react-router-dom"
import Layout from "./Layout"
import Dashboard from "./pages/dashboard/Dashboard"
import PageNotFound from "./pages/PageNotFound"

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
            <Route path="/" element={<Dashboard />}/>
            <Route path="*" element={<PageNotFound />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App