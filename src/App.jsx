import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/" element={<Index />} />
                    {/* test comment */}
                </Routes>
            </Router>
        </div>
    );
}

export default App
