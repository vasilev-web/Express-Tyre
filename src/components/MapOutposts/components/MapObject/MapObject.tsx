import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Map, YMaps, ObjectManager } from 'react-yandex-maps';

import styles from './MapObject.module.scss';
import { createCollectionMap, setCenterAndZoomMap } from './helpers';

export interface MapProps extends React.HTMLAttributes<HTMLDivElement> {
    data: any;
    onCurrentValue: React.Dispatch<React.SetStateAction<number>>;
    currentValue?: number;
    show?: boolean;
    city: string;
}

const MapObject = ({ data = {}, city, onCurrentValue, currentValue }: MapProps) => {
    const [ymaps, setYmaps] = useState(null);
    const [center, setCenter] = React.useState([56.80245, 60.604913]);
    const [mapObjectManager, setMapObjectManager] = useState(null);
    const [mapObject, setMapObject] = useState(null);

    const mapState = useMemo(
        () => ({
            center,
            zoom: 12,
            controls: ['zoomControl']
        }),
        [center]
    );

    const collection = useMemo(() => {
        return ymaps ? createCollectionMap(data) : {};
    }, [ymaps, data]);

    const setCenterMap = useCallback(
        (mapObjectManager, objectId: number = null) => {
            setCenterAndZoomMap({
                ymaps,
                mapObjectManager,
                mapObject,
                collection,
                objectId
            });
        },
        [ymaps, mapObject, collection]
    );

    const changeValueHandler = useCallback(
        (objectId) => {
            onCurrentValue && onCurrentValue(objectId);
        },
        [onCurrentValue]
    );

    useEffect(() => {
        if (mapObjectManager && currentValue !== null && mapObject) {
            changeValueHandler(currentValue);
            setCenterMap(mapObjectManager, currentValue);
        } else {
            changeValueHandler(null);
        }
    }, [currentValue, mapObjectManager, setCenterMap, mapObject, changeValueHandler]);

    return (
        <YMaps
            query={{
                load: 'util.bounds,geocode',
                apikey: '2924354d-77ea-4446-8589-82d82f39470d'
            }}
        >
            <div className='map-wrapper'>
                <Map
                    onLoad={(ymaps) => {
                        setYmaps(ymaps);
                        ymaps.geocode(city).then((res) => {
                            !currentValue &&
                                setCenter(res.geoObjects.get(0).geometry.getCoordinates());
                        });
                    }}
                    className={styles.map}
                    state={mapState}
                    modules={['control.ZoomControl', 'layout.PieChart', 'templateLayoutFactory']}
                    instanceRef={(ref) => {
                        setMapObject(ref);
                    }}
                >
                    {ymaps !== null ? (
                        <>
                            <ObjectManager
                                objects={{
                                    openBalloonOnClick: true
                                }}
                                options={{
                                    clusterize: true,
                                    gridSize: 64,
                                    maxZoom: 15,
                                    maxAnimationZoomDifference: Infinity,
                                    clusterIconLayout: 'default#pieChart',
                                    clusterIconPieChartRadius: 20,
                                    clusterIconPieChartCoreRadius: 14,
                                    clusterIconPieChartStrokeWidth: 1,
                                    hideIconOnBalloonOpen: false
                                }}
                                features={{
                                    type: 'FeatureCollection',
                                    features: collection
                                }}
                                modules={[
                                    'objectManager.addon.objectsBalloon',
                                    'objectManager.addon.clustersBalloon'
                                ]}
                                instanceRef={(ref) => {
                                    if (ref && ref !== mapObjectManager) {
                                        setMapObjectManager(ref);
                                    }
                                    !currentValue && setCenterMap(ref);
                                }}
                                onClick={(e) => {
                                    const objectId = e.get('objectId');
                                    const objectState = mapObjectManager.getObjectState(objectId);

                                    if (objectState?.found && objectState?.isShown) {
                                        if (!objectState.isClustered) {
                                            changeValueHandler(objectId);
                                        }
                                    }
                                }}
                            />
                        </>
                    ) : null}
                </Map>
            </div>
        </YMaps>
    );
};

export default MapObject;
