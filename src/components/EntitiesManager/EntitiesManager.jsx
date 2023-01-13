import Person from '../Entities/Person'
import Car from '../Entities/Car'
import { TEMP_TYPES } from '../../constants'
import { useEffect, useMemo, useRef, useState } from 'react'
import Particles from './Particles'
import Bird from '../Entities/Bird'
import Bike from '../Entities/Bike'
import { getDateWithTimezoneOffset } from '../../utils'

// Time between ticks in milliseconds
const tickInterval = 1000

let hasRendered = false

export default function EntitiesManager({ weather }) {

    const [tick, setTick] = useState(0)
    const particlesRef = useRef()

    const particlesMemo = useMemo(() => <Particles ref={particlesRef} />, [])

    useEffect(() => {

        setInterval(() => {
            setTick(Date.now())
        }, tickInterval)

    }, [])

    if (!weather && !hasRendered) return null

    hasRendered = true

    return (
        <div className="entities-container">
            <div className="entities-area">
                <div className="background"></div>
                {/* <Bird particles={particlesRef} weather={weather} tick={tick} /> */}
                <div className='tree' />
                <Person particles={particlesRef} weather={weather} tick={tick} />
                {/* <Bike particles={particlesRef} weather={weather} tick={tick} /> */}
                {/* <Car particles={particlesRef} weather={weather} tick={tick} /> */}

                {particlesMemo}
            </div>
        </div>
    )
}

export function converDataToWeather(data) {
    if (!data || data.loading || data.cod !== 200) return null

    const { temp } = data.main
    
    let tempType = 0

    if (temp > 30) {
        tempType = TEMP_TYPES.verySunny
    } else if (temp > 25) {
        tempType = TEMP_TYPES.sunny
    } else if (temp < 0) {
        tempType = TEMP_TYPES.veryCold
    } else if (temp < 15) {
        tempType = TEMP_TYPES.cold
    } else {
        tempType = TEMP_TYPES.normal
    }

    const date = getDateWithTimezoneOffset((data.dt + data.timezone) * 1000)
    const hours = date.getHours()

    return {
        id: `${data.sys.id}${temp}`,
        temp: temp,
        tempType,
        isDay: hours >= 4 && hours <= 17,
        isRaining: Boolean(data.rain)
    }
}