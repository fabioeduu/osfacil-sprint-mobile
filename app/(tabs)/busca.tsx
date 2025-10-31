import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Container from '../../components/Container';
import { useOrdens } from '../../src/hooks';
import { useRouter } from 'expo-router';

export default function BuscaPage() {
	const [query, setQuery] = useState('');
	const { ordens } = useOrdens();
	const router = useRouter();

	

	const results = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return ordens;
		return ordens.filter(o => {
			if (String(o.numero).includes(q)) return true;
			if ((o.defeito || '').toLowerCase().includes(q)) return true;
			if ((o.status || '').toLowerCase().includes(q)) return true;
			return false;
		});
	}, [query, ordens]);

	return (
		<Container>
			<Text style={styles.title}>Buscar Ordens</Text>

			<View style={styles.searchRow}>
				<TextInput placeholder="Número, defeito ou status" value={query} onChangeText={setQuery} style={styles.input} />
				<Button title="Limpar" onPress={() => setQuery('')} />
			</View>

			<FlatList
				data={results}
				keyExtractor={i => i.id}
				ListEmptyComponent={<Text style={{ marginTop: 16 }}>Nenhum resultado</Text>}
			renderItem={({ item }) => (
				<TouchableOpacity style={styles.item} onPress={() => {
					router.push(`/(tabs)/ordem?id=${item.id}`);
				}}>
						<Text style={styles.itemTitle}>Ordem #{item.numero} — {item.status}</Text>
						<Text numberOfLines={2}>{item.defeito}</Text>
						<Text style={styles.itemSmall}>R$ {Number(item.valorTotal).toFixed(2)}</Text>
					</TouchableOpacity>
				)}
			/>
		</Container>
	);
}

const styles = StyleSheet.create({
	title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
	searchRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 8 },
	input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginRight: 8 },
	item: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
	itemTitle: { fontWeight: 'bold' },
	itemSmall: { color: '#666', marginTop: 6 }
});
