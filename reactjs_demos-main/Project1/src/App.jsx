
import './App.css'
import MyComponent from './components/MyComponent'
import MySecComponent from './components/MySecComponent'
import MyTrdComponent from './components/MyTrdComponent'
 function App() {
 

  return (
    <>
    <MyComponent/>
      This is my second reactjs application with Material UI
      <div class="d-flex bd-highlight">
  <div class="p-2 flex-fill bd-highlight"><MySecComponent imageUrl="image1.png" mname="Titanic" details="Titanic is a 1997 American epic romantic disaster film directed, written, co-produced and co-edited by James Cameron."/></div>
  <div class="p-2 flex-fill bd-highlight"><MySecComponent imageUrl="image2.png"  manme="RRR" details="RRR is a 2022 Indian Telugu-language epic historical action drama film directed by S. S. Rajamouli, "/></div>
  <div class="p-2 flex-fill bd-highlight"><MySecComponent  mname="About to release"  /></div>
  
</div>
<MyTrdComponent/>
 
    </>
  )
}

export default App
