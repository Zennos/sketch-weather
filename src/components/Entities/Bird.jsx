import { ENTITIES_CLASS_TYPES, TEMP_TYPES } from "../../constants";
import { randNumber } from "../../utils";
import Entity from "./Entity";

/**
 * Birds show up at day, owl at night.
 * Owl are a bit more rare.
 * Birds will not show up in strong rain.
 * Birds/Owls will not show up extreme cold
 */

export default class Bird extends Entity {
    constructor(props) {
        super(props)
        
        this.baseClassName = ENTITIES_CLASS_TYPES.bird

        this.setBirdSpawnConfig()

        this.debugKey = '4'
    }

    setBirdSpawnConfig() {
        this.spawnChancesConfig = {
            minTime: 5000,
            maxTime: 15000,
            chancePerTick: 0.075
        }
    }

    setOwlSpawnConfig() {
        this.spawnChancesConfig = {
            minTime: 10000,
            maxTime: 20000,
            chancePerTick: 0.055
        }
    }

    spawn() {
        // fly at random height.
        this.element.current.style.bottom = `${randNumber(100, 169)}px`;
        super.spawn();
    }

    handleWeatherUpdate(weather) {
        if (weather.isDay) {
            this.setBirdSpawnConfig()
        } else {
            this.setOwlSpawnConfig();
        }
        this.updateSpawnChances();

        super.handleWeatherUpdate(weather);
    }

    getEntityToSpawn(weather) {
        if (weather.tempType <= TEMP_TYPES.veryCold) return null;
        if (weather.isDay && weather.isRaining) return null;
        if (!weather.isDay) return this.props.entities.owl;
        return this.props.entities.bird;
    }
}