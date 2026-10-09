type Props = {
    doorWidth: number;
    doorHeight: number;
    clearance: number;
    itemAcross: number;
    itemUp: number;
    fits: boolean;
};

export default function FitDiagram({ doorWidth, doorHeight, clearance, itemAcross, itemUp, fits }: Props) {
    const maxW = 300;
    const maxH = 300;
    const pad = 10;

    const biggestW = Math.max(doorWidth, itemAcross);
    const biggestH = Math.max(doorHeight, itemUp);
    const scale = Math.min(maxW / biggestW, maxH / biggestH);

    const svgW = biggestW * scale + pad * 2;
    const svgH = biggestH * scale + pad * 2;

    const doorX = pad + (biggestW - doorWidth) * scale / 2;
    const doorY = pad + (biggestH - doorHeight) * scale / 2;
    const itemX = pad + (biggestW - itemAcross) * scale / 2;
    const itemY = pad + (biggestH - itemUp) * scale / 2;

    const half = (clearance / 2) * scale;

    return (
        <svg width={svgW} height={svgH} role="img" aria-label="Diagram of the item against the doorway">
            {/* doorway */}
            <rect x={doorX} y={doorY} width={doorWidth * scale} height={doorHeight * scale}
                fill="#f3f3f3" stroke="#333" strokeWidth={2} />
            {/* usable opening after clearance */}
            <rect x={doorX + half} y={doorY + half}
                width={Math.max(0, (doorWidth - clearance) * scale)}
                height={Math.max(0, (doorHeight - clearance) * scale)}
                fill="none" stroke="#888" strokeDasharray="4 3" />
            {/* item cross-section */}
            <rect x={itemX} y={itemY} width={itemAcross * scale} height={itemUp * scale}
                fill={fits ? "rgba(46,160,67,0.5)" : "rgba(220,53,69,0.5)"}
                stroke={fits ? "#2ea043" : "#dc3545"} strokeWidth={2} />
        </svg>
    );
}