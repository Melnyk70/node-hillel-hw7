import { useState } from 'react'

function App() {
  const [cities, setCities] = useState([])

  const handleInput = async (event) => {
    const city = event.target.value

    console.log(city)

    if (!city.trim()) {
      setCities([])
      return
    }

    try {
      const searchParams = new URLSearchParams({ city })
      const response = await fetch(`http://localhost:3000/api/city?${searchParams.toString()}`)

      if (!response.ok) {
        throw new Error('Failed to fetch cities')
      }

      const cityList = await response.json()
      
      setCities(Array.isArray(cityList.cities) ? cityList.cities : [])
    } catch (error) {
      console.error(error)
      setCities([])
    }
  }

  return (
    <main className="app">
      <form className="app__form">
        <label className="app__label" htmlFor="message">
          Enter city name:
        </label>
        <input
          id="message"
          name="message"
          type="text"
          className="app__input"
          onInput={handleInput}
          placeholder="Type something"
        />

        {cities.length > 0 && (
          <ul className="app__list">
            {cities.map((cityName) => (
              <li key={cityName} className="app__list-item">
                {cityName}
              </li>
            ))}
          </ul>
        )}
      </form>
    </main>
  )
}

export default App
