import pointIcon from './point.png';

export const createCollectionMap = (points) => {
    return points.map(function (point, index) {
        return {
            id: index,
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [point.latitude, point.longitude]
            },
            options: {
                iconColor: `#5790b9`,
                iconLayout: 'default#image',
                iconImageHref: pointIcon,
                iconImageSize: [34, 52],
                iconImageOffset: [-18, -52],
                hideIconOnBalloonOpen: false,
                groupByCoordinates: false
            }
        };
    });
};

export const setCenterAndZoomMap = ({
    ymaps,
    mapObjectManager,
    mapObject,
    collection,
    objectId = null
}) => {
    if (ymaps && mapObjectManager) {
        if (objectId !== null) {
            const objectCoordinates =
                mapObjectManager.objects.getById(objectId).geometry.coordinates;
            mapObject.setCenter(objectCoordinates, 15);
        } else {
            const result = ymaps.util.bounds.getCenterAndZoom(
                mapObjectManager.getBounds(),
                mapObject.container.getSize()
            );

            mapObject.setCenter(result.center, result.zoom);
        }
    }
};
