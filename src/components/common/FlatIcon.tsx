type FlatIconProps = {
    style?: 'rs' | 'bs' | 'sr' | 'br' | 'rr' | 'ss' | 'ts' | 'tr';
    icon: string;
};

const iconSIze = '40px';

export function FlatIcon({ style = 'rs', icon }: FlatIconProps) {
    return (
        <i
            className={`fi fi-${style}-${icon}`}
            style={{
                display: 'block',
                height: iconSIze,
                width: iconSIze,
                fontSize: iconSIze,
            }}
        ></i>
    );
}
