import axios from 'axios';
import React, { useContext, useState } from 'react'
import { UserContext } from '../context/UserContext';
function RegisterAndLoginForm() {
  const [username, setUsernameLocal] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginOrRegister, setIsLoginOrRegister] = useState('register');

  const { setUsername, setId } = useContext(UserContext);

  async function handleSubmit(e) {
    e.preventDefault();
    const url = isLoginOrRegister === 'register'?'register':'login';
    if (!username || !password) {
      console.log("Please fill in both username and password fields.");
      alert("Fields can't be empty");
      return; // Exit the function early if fields are empty
    }



    console.log("Hi from register frontend");
    const { data } = await axios.post(url, { username, password });
    //updating in context
    setUsername(username);
    setId(data.id);
  }
  return (
    <div className='bg-blue-50 h-screen flex items-center' >
      <form className='w-64 mx-auto mb-12' onSubmit={handleSubmit}>
        <input type='text' value={username}
          onChange={e => setUsernameLocal(e.target.value)} placeholder='username' className='block w-full rounded-sm p-2 mb-2 border'></input>
        <input type='password' value={password} onChange={e => setPassword(e.target.value)} placeholder='password' className='block w-full rounded-sm p-2 mb-2 border'></input>
        <button className='bg-blue-500 text-white block w-full rounded-sm p-2  '>
          {isLoginOrRegister === 'register' ? 'Register' : 'Login'}
        </button>

        <div className='text-center mt-2'>
          {isLoginOrRegister === 'register' && (
            <div>
              Already a memeber?
              <button onClick={() => { setIsLoginOrRegister('login') }}>
                {<u>&nbsp;Login Here</u>}
              </button>
            </div>
          )}

          {isLoginOrRegister === 'login' && (
            <div>
              Don't have an account ?
              <button onClick={() => { setIsLoginOrRegister('register') }}>
                <u>&nbsp;Register</u>
              </button>
            </div>
          )}



        </div>

      </form>
    </div>
  )
}

export default RegisterAndLoginForm;
