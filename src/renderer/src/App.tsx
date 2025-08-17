import { useState } from 'react'
import './App.css'
import Home from './pages/Home'
import Detial from './pages/Detial'
import { DialogProvider } from './components/Dialog/DialogProvider'

function App() {
  const [showDetial, setShowDetial] = useState(false)
  const [selectedDictionaryId, setSelectedDictionaryId] = useState(-1)

  const home = (
    <Home
      onShowDetail={(dictionaryId: number) => {
        setShowDetial(true)
        setSelectedDictionaryId(dictionaryId)
      }}
    />
  )

  const detial = (
    <Detial
      dictionaryId={selectedDictionaryId}
      onCancelHome={() => {
        setShowDetial(false)
      }}
    />
  )

  return <DialogProvider>{showDetial ? detial : home}</DialogProvider>
}

export default App
