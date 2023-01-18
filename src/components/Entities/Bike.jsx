import { ENTITIES_CLASS_TYPES, TEMP_TYPES } from "../../constants";
import entities from "../EntitiesList/entities";
import Entity from "./Entity";

/**
 * Bike does not show up in rain or extreme heat/cold.
 */

export default class Bike extends Entity {
    constructor(props) {
        super(props)
        
        this.baseClassName = ENTITIES_CLASS_TYPES.bike

        this.spawnChancesConfig = {
            minTime: 5000,
            maxTime: 20000,
            chancePerTick: 0.075
        }

        this.maxTimeOnScreen = 12000
        this.debugKey = '3'
    }

    shouldSpawn({ tempType }) {
        if (tempType <= TEMP_TYPES.veryCold || tempType >= TEMP_TYPES.verySunny) return false
        return true
    }
}