import { AppRoutes } from "./routes/app.routes";
import { AuthProvider } from "./contexts/AuthProvider"

function App() {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    )
}

export default App
