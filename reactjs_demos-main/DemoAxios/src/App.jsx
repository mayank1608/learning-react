import { useState ,useEffect } from 'react'
import axios  from "axios";
import './App.css'

function App() {
  const [myData, setMyData] = useState([]);
  const [isError, setIsError] = useState("");

 
  //using Promises
  useEffect(() => {
    console.log("api fetched")
    axios
      .get("https://jsonplaceholder.typicode.com/posts")
      .then((response) => {setMyData(response.data); })
      .catch((error) => {setIsError(error.message);}
      );
  },);
 
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
    
       <div> Axios Example</div>     
          
       {  isError!=="" ? isError :  showData() }      
      <h1> End</h1>
     
    </>
  )
}

export default App
