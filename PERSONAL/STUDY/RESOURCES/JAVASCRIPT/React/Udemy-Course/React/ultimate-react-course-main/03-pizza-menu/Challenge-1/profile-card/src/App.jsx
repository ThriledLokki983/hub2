import { useState } from 'react'
import './App.css'

function App() {

  return (
    <div className='contianer'>
        <h1>Profile Card</h1>
        <ProfileCard />
    </div>
  )
}

const ProfileCard = () => {
    const name = 'Gideon Nimoh';
    
    return (
        <article className='profile-card'>
            <figure>
                <img src='data:image/jpeg;base64,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' alt='Gideon Nimoh'/>
            </figure>
            <h2>{name}</h2>
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
            <ul>
                <li> HTML = CSS 💪🏾</li>
                <li> Javascript 💪🏾</li>
                <li> Web Design 💪🏾</li>
                <li> Git and GitHb 👍🏽</li>
                <li> React 💪🏾</li>
                <li> Svelte 👶🏽</li>
            </ul>
        </article>
    )
}

export default App
