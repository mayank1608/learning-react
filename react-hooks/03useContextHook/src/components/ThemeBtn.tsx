import {useEffect, useState} from 'react'
import { ThemeProvider } from '../contexts/themeContext';

function ThemeBtn() {
  const [themeMode, setThemeMode] = useState("light");

  const lightTheme = () => {
    setThemeMode("light")
  }

  const darkTheme = () => {
    setThemeMode("dark")
  }

  const switchTheme = (isChecked:boolean) => {
    isChecked ? darkTheme() : lightTheme()
  }

  useEffect(() => {
    document.querySelector('html')?.classList.remove("light", "dark")
    document.querySelector('html')?.classList.add(themeMode)
  }, [themeMode])
  return (
    <ThemeProvider value={{ themeMode, lightTheme, darkTheme }}>
       <input type='checkbox' onChange={(e) => {switchTheme(e.target.checked)}}/><label htmlFor='toggleTheme'>Toggle Theme</label>
    </ThemeProvider>
  )
}

export default ThemeBtn