import { async } from '@firebase/util';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { db } from './firebase';

const Dasboard = () => {
  const user = localStorage.getItem("user")
  const dbref = collection(db, "Users")
  const [currentuser, setcurrentuser] = useState({})

  const [signout, setSignout] = useState(false);
  const [Todo, SetTodo] = useState("")
  const [ref, setref] = useState(false)
  const [todo, setTodo] = useState([])



  const navigate = useNavigate()
  console.log(currentuser)

  //  Toodo APP
  useEffect(async () => {
    const dbref = collection(db, "Todos")

    const Update = await getDocs(dbref)
    let getTodo = []

    Update.forEach((doc) => {
      getTodo.push({ key: doc.id, data: doc.data().todo })
    })
    setTodo(getTodo)

  }, [ref])







  useEffect(async () => {
    console.log(user)

    const userdata = await getDocs(dbref)
    userdata.forEach((data) => {
      if (user === data.data().userUid) {
        setcurrentuser(data.data())
      }
    })
    console.log(user)
    console.log(userdata)

  }, []);



  useEffect(() => {
    if (!user) {
      navigate("/")

    }

  }, [signout])



  const logout = () => {
    localStorage.removeItem("user")
    setSignout(true)

  }

  // ToDO APP




  const Add = async () => {
    console.log(Todo)
    const dbref = collection(db, "Todos")

    try {
      const data = await addDoc(dbref, {
        todo: Todo
      })
      setref(!ref)
      console.log(data)
    } catch (error) {
      console.log(error)

    }
    SetTodo("")
  }
   

  const edit=async (key)=>{
    console.log(key)

    const dbref = doc(db,"Todos",key)
    const update = prompt("Enter NEw Todo")
    const obj = {
      todo :update
    }

    try {
       const data = await setDoc(dbref,obj)
       setref(!ref)
       console.log(data)

    } catch (error) {
      console.log(error)
    }
    
  }
 

  const del = async (key)=>{
    const dbref = doc(db,"Todos",key)
    try {
      const datares = await deleteDoc(dbref)
      console.log(datares)
      setref(!ref)
  } catch (error) {
       console.log(error)
  }
  }
  return (
    <div>
      <div className=' text-white  pt-3'>
        <div className='d-flex justify-content-between'>

          <h1 className=''>Name: <span> {currentuser.name} </span></h1>
          <h1 className=''>Number: <span> {currentuser.number} </span></h1>
          <h1 className=''>Email: <span> {currentuser.email} </span></h1>

          <div>
            <button onClick={logout} className='btn btn-info'>LogOut </button>
          </div>

        </div>


        <div className='mx-auto w-50'>
          <input type="text" value={Todo} className='input-group' placeholder='Enter Your Todo' onChange={(e) => SetTodo(e.target.value)} />
          <div className='text-center pt-2'>
            <button onClick={Add} className="ml-1 btn btn-info">Add</button>
            <button className="ml-1 btn btn-danger">Delete</button>

          </div>

          <div>
            {todo.map((val, index) => {
              return (
                <ul key={index}>
                  <li >
                    {val.todo}
                  </li>
                  <div>
                    <button onClick={()=>edit(val.key)}>Edit</button>
                    <button onClick={()=>del(val.key)}>Delete</button>
                  </div>
                </ul>

              )

            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dasboard
