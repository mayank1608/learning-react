import { useState,useEffect } from 'react'
import axios from "axios";
import './App.css'
import MyAPI from './API';



function App1() {
  const [myData, setMyData] = useState([]);
  const [isError, setIsError] = useState(""); 

//   const API="https://jsonplaceholder.typicode.com";


  // using Async Await
  const getMyPostData = async () => {
    try 
    {
      const res = await MyAPI.get("/posts");
      setMyData(res.data);
    //  setIsError("");
    } 
    catch (error) {
      setIsError(error.message);
    }
  };
 
  useEffect(() => {
    getMyPostData();
    
  }, []);


  function showData()
   {
    console.log(myData);
    return (
    <div className="grid">
        {myData.slice(0, 9).map((post) => {
          const { body, id, title } = post;
         return (
            <div key={id} className="card">
              <h2>{title.slice(0, 15).toUpperCase()}</h2>
              <p>{body.slice(0, 100)}</p>
            </div>
          );
        })} 
      </div> );
   }

  return (
    <>
   
     <h1>Axios Tutorial with Async and Await</h1>     
       {  isError!=="" ? isError :  showData() }      
      <h1> End</h1>
    </>
  )
}

export default App1
