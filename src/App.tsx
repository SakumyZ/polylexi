import { useState } from 'react'
import './App.css'
import Home from './pages/Home'
import Detial from './pages/Detial'

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

  return <>{showDetial ? detial : home}</>
}

export default App
