import { useRef, useState } from 'react'
import './App.css'

function App() {
  const textAreaEl: any = useRef(null);
  const handleBtnClick = () => {
    textAreaEl.current.value = "The is the story of your life. You are an human being, and you're on a website about React Hooks";
    textAreaEl.current.focus();
  };



  // 
  const styleDiv:any = {
    width: '800px',
    height: '200px',
    padding: '10px',
    border: '1px solid #ccc',
    overflow: 'auto',
    resize: 'both'
  }
  const containerElementRef:any = useRef(null);
  const [message, setMessage] = useState(
    "Click button to get container width"
  );

  const calculateContainerWidth = () => {
    setMessage(`Container width: ${containerElementRef.current.clientWidth}px`);
  };

  return (
    <>
      <h3>React useRef Hook</h3>
      <pre><code>
        {` 
        returns a 'ref' object.
        Call signature: const refContainer = useRef(initialValueToBePersisted)
        Value is persisted in the refContainer.current property.
        values are accessed from the .current property of the returned object.
        The.current property could be initialised to an initial value e.g. useRef(initialValue)
        The object is persisted for the entire lifetime of the component.
        `}
      </code></pre>
      <section style={{ textAlign: "center" }}>
        <div>
          <button onClick={handleBtnClick}>Focus and Populate Text Field</button>
        </div>
        <label
          htmlFor="story"
          style={{
            display: "block",
            background: "olive",
            margin: "1em",
            padding: "1em"
          }}
        >
          The input box below will be focused and populated with some text
          (imperatively) upon clicking the button above.
        </label>
        <textarea ref={textAreaEl} id="story" rows={5} cols={33} />
      </section>

      <pre><code>{`
      Get the width of a container using useRef react hook
      `}</code></pre>
      <div className="container" style={styleDiv} ref={containerElementRef}>
        <h2>{message}</h2>
        <button onClick={calculateContainerWidth}>
          Calculate container width
        </button>
      </div>

    </>
  )
}

export default App
