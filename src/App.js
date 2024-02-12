import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = 'https://jsonplaceholder.typicode.com/users';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    axios.get(API_URL)
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, []);

  const addUser = () => {
    axios.post(API_URL, { name, email, phone })
      .then(response => {
        setUsers([...users, response.data]);
        setName('');
        setEmail('');
        setPhone('');
      })
      .catch(error => {
        console.error('Error adding user: ', error);
      });
  };

  const deleteUser = (id) => {
    axios.delete(`${API_URL}/${id}`)
      .then(() => {
        setUsers(users.filter(user => user.id !== id));
      })
      .catch(error => {
        console.error('Error deleting user: ', error);
      });
  };

  const editUser = (id) => {
    setEditingUserId(id);
    const userToEdit = users.find(user => user.id === id);
    setName(userToEdit.name);
    setEmail(userToEdit.email);
    setPhone(userToEdit.phone);
  };

  const saveUser = (id) => {
    axios.put(`${API_URL}/${id}`, { name, email, phone })
      .then(() => {
        setUsers(users.map(user => user.id === id ? { ...user, name, email, phone } : user));
        setEditingUserId(null);
        setName('');
        setEmail('');
        setPhone('');
      })
      .catch(error => {
        console.error('Error updating user: ', error);
      });
  };

  return (
    <div className="container">
      <div className='row'>
        <div className="col-12">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <input type="text" className="form-control mr-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="email" className="form-control mr-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="text" className="form-control mr-2" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <button className="btn btn-primary" onClick={addUser}>Add User</button>
          </div>
        </div>
      </div>

      <div className="row">
        {users.map(user => (
          <div key={user.id} className="col-3">
            <div className="card mb-3" style={{ maxWidth: '18rem' }}>
              <div className="card-body">
                {editingUserId === user.id ? (
                  <>
                    <input type="text" className="form-control mb-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <input type="email" className="form-control mb-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="text" className="form-control mb-2" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    <button onClick={() => saveUser(user.id)} className="btn btn-success mr-2">Save</button>
                  </>
                ) : (
                  <>
                    <h5 className="card-title">{user.name}</h5>
                    <h5 className="card-title">{user.email}</h5>
                    <p className="card-text">{user.phone}</p>
                    <div className='row'>
                      <div className='col-6'>
                       <button onClick={() => deleteUser(user.id)} className="btn btn-danger mr-2">Delete</button>
                       
                      </div>
                      <div className='col-6'>
                      <button onClick={() => editUser(user.id)} className="btn btn-primary">Edit</button>
                      </div>
                    </div>
                   
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
