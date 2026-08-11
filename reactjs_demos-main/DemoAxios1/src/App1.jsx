import { useState,useEffect } from 'react'
import './App.css'
import MyAPI from './MyAPI';


function App1() {
  const [myData, setMyData] = useState([]);
  const [isError, setIsError] = useState(""); 
  

  // using Async Await
  const getMyPostData = async () => {
    try 
    {
      let region="Europe";
      const res = await MyAPI.get(`/geo/country/region/${region}`);
      setMyData(res.data);
    
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
    //return ("test");
    return (
    <div className="grid">
        {myData.map((post,index) => {
          const { name, capital, region,borders,flag } = post;
         return (
            <div key={index} className="card">
              <h2>Name:{name}</h2>
              <p>Capital:{capital}</p>
              <p>Region:{region}</p>
              <p>Borders:{
                borders.map((val) =>{
                  return ( val + ',' );
              })
                }</p>
                
            </div>
          );
        })} 
      </div> );
   }

  return (
    <>
     <div>
     <h1>Axios Tutorial with Async and Await</h1>     
       {  isError!=="" ? isError :  showData() }      
      <h1> End</h1>
      </div>
    </>
  )
}

export default App1
