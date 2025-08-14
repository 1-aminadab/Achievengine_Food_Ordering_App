import React from 'react';
import Button from './button.component';
import { Intent } from '../../../../domain/enum/button';



// Interface for component props
interface IconButtonProps {
    icon: React.ReactNode;
    onPress: () => void;
    style?: any

}

const IconButton: React.FC<IconButtonProps> = ({ onPress, icon, style }) => {
    return (
        <Button intent={Intent.Secondary} onPress={onPress} style={style}>
            {
                icon
            }
        </Button>
    );
};


export default IconButton;
