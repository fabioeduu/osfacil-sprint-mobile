import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'danger';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'info',
}) => {
  const getIconName = () => {
    switch (type) {
      case 'warning': return 'warning';
      case 'danger': return 'trash';
      case 'info':
      default: return 'information-circle';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'warning': return '#f39c12';
      case 'danger': return '#e74c3c';
      case 'info':
      default: return '#3498db';
    }
  };

  const getConfirmButtonColor = () => {
    switch (type) {
      case 'danger': return '#e74c3c';
      case 'warning': return '#f39c12';
      case 'info':
      default: return '#3498db';
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
        <View style={styles.modal}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name={getIconName() as any} 
              size={48} 
              color={getIconColor()} 
            />
          </View>
          
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>{cancelText}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.button,
                styles.confirmButton,
                { backgroundColor: getConfirmButtonColor() }
              ]}
              onPress={() => {
                onConfirm();
                onClose();
              }}
            >
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
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
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    minWidth: 280,
    maxWidth: 320,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  iconContainer: {
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 25,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ecf0f1',
  },
  confirmButton: {
    backgroundColor: '#3498db',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});