import Maintenance from "Pages/Maintenance/Maintenance";

// The `maintenance` branch deliberately ships a single, route-less page: every
// path a visitor lands on serves the same maintenance notice (Vercel already
// rewrites all non-file requests to index.html). The router, Header, Footer and
// AuthProvider are intentionally out of the tree here — the real app shell lives
// on `main`, so switching back is a branch swap, not a rewrite.
const App = () => <Maintenance />;

export default App;
