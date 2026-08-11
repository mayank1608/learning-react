import React, {useState} from 'react';
import ChildComponent from './ChildComp';

function ParentComponent() {
  const items = [
    { title: 'RRR', content: 'Superhit Action Movie', ticket:500},
    { title: 'Bahubali', content: 'Superhit Action Movie',ticket:700 },
    { title: 'Titanic', content: 'Romantic Movie',ticket:800 },
    { title: 'Hera Pheri', content: 'Comedy Movie',ticket:300 }
  ];

  const [total, setTotal] = useState(0);

  

  function handleTotal(amt) {
   
    //alert("ok")
    if(total<0)
      setTotal(0)
    else
     setTotal(total+amt);
  }

  

  return (
    <>
       
      <h1>Movies</h1>Total Ticket Price:{total}    
      <div className="container">
      <div className="row">   
      {items.map((item, index) => (
       <div className="col-sm-4 badge text-bg-primary border"> 
       <ChildComponent abc={handleTotal} price={item.ticket} key={index} title={item.title} content={item.content} />
       </div>        

      )


      )}

      
        </div>  
        </div>    
      
    </>
  );
}

export default ParentComponent;
