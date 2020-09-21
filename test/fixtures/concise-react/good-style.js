import React from 'react'
import { render } from 'react-dom'

const App = ({ title = 'Hello World' }) => (
  <div>
    <h1>{title}</h1>
  </div>
)

render(<App />, document.getElementById('app'))
