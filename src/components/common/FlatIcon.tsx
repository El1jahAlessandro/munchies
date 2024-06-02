type FlatIconProps = {
    style?: 'rs' | 'bs' | 'sr' | 'br' | 'rr' | 'ss' | 'ts' | 'tr';
    icon: string;
};

export function FlatIcon({ style = 'rs', icon }: FlatIconProps) {
    return (
        <i
            className={`fi fi-${style}-${icon}`}
            style={{
                display: 'block',
                height: '50px',
                fontSize: '50px',
            }}
        ></i>
    );
}
