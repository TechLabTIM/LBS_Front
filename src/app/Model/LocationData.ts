export interface CircularArcArea{
    type: 'circularArcArea';
    latitude: number;
    longitude: number;
    innerRadius: number;
    outerRadius: number;
    startAngle: number;
    stopAngle: number;
    requestedTime: number;
}

export interface CircularArea{
    type: 'circularArea';
    latitude: number;
    longitude: number;
    radius: number;
    requestedTime: number;
}