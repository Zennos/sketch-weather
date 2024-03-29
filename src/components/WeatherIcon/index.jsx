import { useContext, useEffect, useState } from "react";
import { EntitiesContext } from "../../contexts/EntitiesContext";
import './index.scss';
import icons from './icons';

const iconWidth = 64;
let isFirstIcon = true;

export default function WeatherIcon({ data }) {
    const [ selectedIconIndex, setSelecectedIconIndex ] = useState(-1);
    const { collectEntity, entities } = useContext(EntitiesContext);

    useEffect(() => {
        if (!data || data.loading) return;

        if (selectedIconIndex !== -1) isFirstIcon = false;

        if (data.cod !== 200) {
            setIcon('not_found');
        } else {
            setIcon(data.weather[0].icon);
        }
    }, [data, selectedIconIndex]);

    function setIcon(icon) {
        const index = icons.findIndex(ic => ic === icon);
        if (index === -1) return console.log(`Could not find icon named "${icon}"`);

        setSelecectedIconIndex(index);
    }

    function getIconUrl(icon) {
        return `/sketch-weather/images/icons/animated/weathers/${icon}.gif`;
    }

    function handleOnClick(e) {
        const currentIcon = icons[selectedIconIndex];
        const clickedIcon = e.target.id;
        if (!currentIcon) return;
        if (clickedIcon !== currentIcon) return;

        const entity = getEntityFromIcon(currentIcon);
        if (entity) collectEntity(entity, true);
    }

    function getEntityFromIcon(icon) {
        if (icon === '13d') return entities.snowDay;
        return null
    }

    function getCurrentEntity() {
        const icon = icons[selectedIconIndex];
        if (!icon) return null;
        const entity = getEntityFromIcon(icon);
        return entity;
    }

    return (
        <div 
            className="weather-icon-container"
            style={{
                width: iconWidth + 'px',
                height: iconWidth,
            }}
        >
            <div 
                className="icons"
                style={{ 
                    left: (selectedIconIndex * -iconWidth) + 'px',
                    transitionDuration: isFirstIcon ? '0s' : '' 
                }}
            >
                {
                    icons.map(icon => {
                        let className = 'icon'
                        const currentEntity = getCurrentEntity();
                        const entity = getEntityFromIcon(icon)

                        if (entity) className += ' entity ' + (entity.collected ? 'collected' : 'collectable');

                        return <div 
                            className={className}
                            id={icon}
                            key={icon} 
                            onClick={(e) => handleOnClick(e)}
                            keyname={entity ? entity.keyName : null}
                            style={{ 
                                width: iconWidth + 'px',
                                height: iconWidth + 'px',
                                backgroundImage: `url(${entity ? entity.iconAnimated : getIconUrl(icon)})`,
                                cursor: entity && currentEntity && entity.id === currentEntity && !entity.collected ? 'pointer' : null
                            }} 
                        />
                    })
                }
            </div>
        </div>
    )
}