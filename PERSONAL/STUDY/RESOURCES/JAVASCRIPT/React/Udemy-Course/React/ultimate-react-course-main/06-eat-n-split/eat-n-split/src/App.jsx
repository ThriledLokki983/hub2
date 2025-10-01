import { useState } from 'react'
import './App.css'
import { initialFriends } from './data';

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState({});
  const [showForm, setShowForm] = useState(false);

  const handleToggle = () => {
    setShowForm((prev) => !prev)
  }

  const handleAddFriend = (newFriend) => {
    setFriends((prev) => [...prev, newFriend]);
    setShowForm(false);
  }

  const handleFriendSelect = (friend) => {
    setSelectedFriend((prev) => prev.id === friend.id ? {} : friend);
    setShowForm(false);
  };

  const handleSplitBill = (bill) => {
    const newFriend = {
      ...selectedFriend,
      balance: selectedFriend.balance + bill,
    };

    setFriends((prev) => prev.map((friend) => friend.id === newFriend.id ? newFriend : friend));
    setSelectedFriend({});
  };

  return (
    <div className='app'>
      <div className='sidebar'>
        <FriendList
          friends={friends}
          onFriendSelect={handleFriendSelect}
          selected={selectedFriend}
        />
        {showForm && <FormAddFriend onFriendAdd={handleAddFriend}/>}
        <Button onClick={handleToggle}>{showForm ? 'Close' : 'Add a friend'}</Button>
      </div>
      <div>
        {selectedFriend.id ? <FormSplitBill friend={selectedFriend} onSplitBill={handleSplitBill}/> : null}
      </div>
    </div>
  )
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick} className='button'>{children}</button>
  )
};

const FriendList = ({ friends, onFriendSelect, selected }) => {
  return (
    <ul>
      {friends.map((friend) => (
        <FriendListItem
          key={friend.id}
          friend={friend}
          selected={selected?.id === friend.id}
          onSelect={onFriendSelect}
        />
      ))}
    </ul>
  )
};

const FriendListItem = ({ friend, onSelect, selected }) => {
  return (
    <li className={selected ? 'selected' : ''}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 ? (
        <p className='red'>You owe {Math.abs(friend.balance)}€</p>
      ) : friend.balance > 0 ? (
        <p className='green'>{friend.name} owes you {friend.balance}€</p>
      ) : (
        <p className='gray'>You and {friend.name} are even</p>
      )}
      <Button onClick={() => onSelect(friend)}>{selected ? 'Close' : 'Select'}</Button>
    </li>
  )
};

const FormAddFriend = ({ onFriendAdd }) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState('https://i.pravatar.cc/48');

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = crypto.randomUUID();

    if (!name || !image) return;

    const newFriend = {
      id,
      name,
      image: `${image}?u=${id}`,
      balance: 0,
    };

    onFriendAdd(newFriend);
    setImage('https://i.pravatar.cc/48');
    setName('');
  };

  return (
    <form className='form-add-friend' onSubmit={handleSubmit}>
      <label htmlFor=""> 👨‍👨‍👧‍👦Friend name</label>
      <input value={name} onChange={(e) => setName(e.target.value)} type="text" />

      <label htmlFor="">🔥Image URL</label>
      <input value={image} onChange={(e) => setImage(e.target.value)} type="text" />

     <Button>Add</Button>
    </form>
  )
};

const FormSplitBill = ({ friend, onSplitBill}) => {
  const [bill, setBill] = useState(0);
  const [paidByUser, setPaidByUser] = useState(0);
  const paidByFriend = bill ? bill - paidByUser : '';
  const [whoIsPaying, setWhoIsPaying] = useState('user');


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === 'user' ? paidByFriend : -paidByUser);
  };

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {friend.name}</h2>

      <div>
        <label>💰 Bill value</label>
        <input value={bill} onChange={(e) => setBill(Number(e.target.value))} type="text" />
      </div>

      <div>
        <label>🧍‍♀️ Your expense</label>
        <input value={paidByUser} onChange={(e) => setPaidByUser(
          Number(e.target.value) > bill
            ? paidByUser
            : Number(e.target.value))} type="text"
          />
      </div>

      <div>
        <label>👫 {friend.name}'s expense</label>
        <input value={paidByFriend} type="text" disabled />
      </div>

      <div>
        <label>🤑 Who is paying the bill</label>
        <select value={whoIsPaying} onChange={(e) => setWhoIsPaying(e.target.value)}>
          <option value="user">You</option>
          <option value="friend">{friend.name}</option>
        </select>
      </div>

      <Button>Split bill</Button>
    </form>
  )
};
