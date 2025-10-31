import * as React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

interface ProfileHeaderProps {
  name?: string;
  email?: string;
  onEdit?: () => void;
}

export default function ProfileHeader({ name = 'Usuário', email = '', onEdit = () => {} }: ProfileHeaderProps) {
  return (
    <View style={styles.header}>
      <Image
        source={require("../assets/user.png")}
        style={styles.avatar}
      />
      <Text style={styles.nome}>{name}</Text>
      <Text style={styles.email}>{email}</Text>

      <TouchableOpacity style={styles.editButton} onPress={onEdit}>
        <Text style={styles.editText}>Editar Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 45,
    backgroundColor: "#ddd",
    marginBottom: 10,
  },
  nome: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  email: {
    fontSize: 14,
    color: "#777",
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: "#2596be",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  editText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
