import { useEffect, useRef, useState } from 'react'
import { getDateWithTimezoneOffset } from '../../utils'
import EntitiesManager from '../EntitiesManager/EntitiesManager'
import TempCounter from './TempCounter'
import WeatherIcon from '../WeatherIcon/WeatherIcon'
import './WeatherCard.scss'

let dataLoadTimeout = null

export default function WeatherCard({ data, weather, previousData, onEntityCollected, entities }) {

  const [location, setLocation] = useState('')
  const [temp, setTemp] = useState(0)
  const [previousTemp, setPreviousTemp] = useState(0)
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')

  const tempElementRef = useRef()

  useEffect(() => {
    if (!data) return

    if (data.loading) {

      clearTimeout(dataLoadTimeout)

      document.querySelectorAll('.info .loading-anim').forEach(el => {
        el.classList.add('close')
        el.classList.remove('open')
      })

    } else {

      dataLoadTimeout = setTimeout(() => {

        if (data.cod !== '404') {

          setTemp(Math.floor(data.main.temp))
          setPreviousTemp(previousData && previousData.main ? Math.floor(previousData.main.temp) : Math.floor(data.main.temp))

          setLocation(`${data.name}${data.sys.country ? ', ' + data.sys.country : ''}`)
          setDescription(data.weather[0].description)

          const date = getDateWithTimezoneOffset((data.dt + data.timezone) * 1000)

          const weekday = date.toLocaleString('en-US', { weekday: 'long' })
          const time = date.toLocaleString('en-US', { hourCycle: 'h23', hour: '2-digit', minute: '2-digit' })

          setDate(`${weekday}, ${time}`)

          tempElementRef.current.classList.add('open')
          tempElementRef.current.classList.remove('close')
          tempElementRef.current.classList.remove('mask-hide')


        } else {

          setLocation(`City not found :(`)
          setDescription('')
          setDate('')

          tempElementRef.current.classList.add('close')
          tempElementRef.current.classList.remove('open')

        }

        document.querySelectorAll('.info .loading-anim').forEach(el => {
          el.classList.add('open')
          el.classList.remove('close')
        })

      }, 1000)
    }

  }, [data, previousData])

  if (!data) return null

  return (
    <div className='weather-card border-anim'>

      <div className='left-area'>
        <div className='top-left row'>
          <WeatherIcon data={data} onEntityCollected={onEntityCollected} entities={entities} />
          <div ref={tempElementRef} className={`temp-container row loading-anim mask-hide`}>
            <TempCounter className='temp' from={previousTemp} to={temp} />
            <div className='metric'>°C</div>
          </div>
        </div>
        <div className='column'>
          <div className='info location'>
            <span className='loading-anim close'>{location}</span>
          </div>
          <div className='info date'>
            <span className='loading-anim close'>{date}</span>
          </div>
          <div className='info desc'>
            <span className='loading-anim close'>{description}</span>
          </div>
        </div>
      </div>
      <div className='right-area'>
        { weather && <EntitiesManager weather={weather} onEntityCollected={onEntityCollected} entities={entities} /> }
      </div>

    </div>
  )
}