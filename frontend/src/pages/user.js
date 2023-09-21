import '../App.css';
import React from 'react';

function User() {
  return (
    <div className="App">
        <p>register here</p> 
      <form action="/user/register" method="POST">
        <div> 
            <input type='text' id='name' name='name' placeholder='Name' required/>
        </div>
        <div>
            <input type='email' id="email" name="email" placeholder='Email' required/>
        </div>
        <div>
            <input type='password' id='password' name='password' placeholder='Password' required/>
        </div>
        <div>
            <input type='password' id='password2' name='password2' placeholder='Confirm Passowrd' required/>
        </div>
        <div>
            <input type='submit' value='Register'/>
        </div>
      </form>
    </div>
  );
}

export default User;
