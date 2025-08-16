import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useThemeContext } from '../../../theme/theme-provider';
import Icon, { IconLibraryName } from '../../atom/icon/icon.component';
import Typography from '../../atom/typography/text.component';
import { FontSizes, FontWeights } from '../../../../domain/enum/theme';

const { width } = Dimensions.get('window');

interface ModalAction {
  text: string;
  onPress: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  actions?: ModalAction[];
  showCloseButton?: boolean;
  children?: React.ReactNode;
}

export const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  title,
  message,
  actions = [],
  showCloseButton = true,
  children,
}) => {
  const { colors } = useThemeContext();

  const defaultActions: ModalAction[] = actions.length > 0 ? actions : [
    { text: 'OK', onPress: onClose, style: 'default' }
  ];

  const getButtonStyle = (style: string = 'default') => {
    switch (style) {
      case 'cancel':
        return { backgroundColor: colors.border, color: colors.text };
      case 'destructive':
        return { backgroundColor: '#FF3B30', color: '#FFFFFF' };
      default:
        return { backgroundColor: colors.primary, color: '#FFFFFF' };
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
          {/* Close Button */}
          {showCloseButton && (
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon
                from={IconLibraryName.MaterialIcons}
                name="close"
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>
          )}

          {/* Title */}
          {title && (
            <View style={styles.titleContainer}>
              <Typography
                size={FontSizes.Large}
                weight={FontWeights.Bold}
                color={colors.text}
              >
                {title}
              </Typography>
            </View>
          )}

          {/* Message */}
          {message && (
            <View style={styles.messageContainer}>
              <Typography
                size={FontSizes.Medium}
                color={colors.text}
                style={styles.messageText}
              >
                {message}
              </Typography>
            </View>
          )}

          {/* Custom Content */}
          {children && (
            <View style={styles.contentContainer}>
              {children}
            </View>
          )}

          {/* Actions */}
          {defaultActions.length > 0 && (
            <View style={styles.actionsContainer}>
              {defaultActions.map((action, index) => {
                const buttonStyle = getButtonStyle(action.style);
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.actionButton,
                      { backgroundColor: buttonStyle.backgroundColor },
                      defaultActions.length === 1 && styles.singleButton,
                    ]}
                    onPress={action.onPress}
                  >
                    <Typography
                      size={FontSizes.Medium}
                      weight={FontWeights.SemiBold}
                      color={buttonStyle.color}
                    >
                      {action.text}
                    </Typography>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: width * 0.9,
    maxWidth: 400,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
    zIndex: 1,
  },
  titleContainer: {
    marginBottom: 12,
    alignItems: 'center',
  },
  messageContainer: {
    marginBottom: 20,
  },
  messageText: {
    textAlign: 'center',
    lineHeight: 20,
  },
  contentContainer: {
    marginBottom: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  singleButton: {
    flex: 0,
    paddingHorizontal: 32,
    alignSelf: 'center',
  },
});

export default CustomModal;