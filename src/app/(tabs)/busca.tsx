import { useMemo, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Container from '../../components/Container';
import { useOrdens } from '../../hooks';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../theme';

export default function BuscaPage() {
  const { colors } = useAppTheme();
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
			<Text style={[styles.title, { color: colors.text }]}>Buscar Ordens</Text>

			<View style={styles.searchRow}>
				<TextInput placeholder="Numero, defeito ou status" placeholderTextColor={colors.textMuted} value={query} onChangeText={setQuery} style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]} />
				<Button title="Limpar" onPress={() => setQuery('')} />
			</View>

			<FlatList
				data={results}
				keyExtractor={i => i.id}
				ListEmptyComponent={<Text style={{ marginTop: 16, color: colors.textMuted }}>Nenhum resultado</Text>}
			renderItem={({ item }) => (
				<TouchableOpacity style={[styles.item, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => {
					router.push(`/(tabs)/ordem?id=${item.id}`);
				}}>
						<Text style={[styles.itemTitle, { color: colors.text }]}>Ordem #{item.numero} - {item.status}</Text>
						<Text numberOfLines={2} style={{ color: colors.text }}>{item.defeito}</Text>
						<Text style={[styles.itemSmall, { color: colors.textMuted }]}>R$ {Number(item.valorTotal).toFixed(2)}</Text>
					</TouchableOpacity>
				)}
			/>
		</Container>
	);
}

const styles = StyleSheet.create({
	title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
	searchRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 8 },
	input: { flex: 1, borderWidth: 1, borderRadius: 8, padding: 8, marginRight: 8 },
	item: { padding: 12, borderWidth: 1, borderRadius: 10, marginBottom: 8 },
	itemTitle: { fontWeight: 'bold' },
	itemSmall: { marginTop: 6 }
});
