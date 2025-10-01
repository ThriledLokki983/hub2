import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import StarRating from './components/StarRating/StarRating.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <App /> */}
    <Test />
    <StarRating
      maxRating={5}
      messages={['Terrible', 'Bad', 'Okay', 'Good', 'Amazing']}
      defaultRating={3}
      onSetRating={(rating) => console.log(rating)}
    />
    <StarRating maxRating={5} size={20} color='red' className="test" defaultRating={2}/>
  </React.StrictMode>,
)


function Test() {
  const [rating, setRating] = useState(0)
  return (
    <div>
      <StarRating
        maxRating={5}
        messages={['Terrible', 'Bad', 'Okay', 'Good', 'Amazing']}
        defaultRating={rating}
        color='orangered'
        onSetRating={setRating}
      />
      <p> This movie was rated <strong>{rating}</strong> stars</p>
    </div>
  )
}