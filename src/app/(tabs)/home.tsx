import HomeHeader from '../../components/Home';
import HomeCliente from '../../components/HomeCliente';
import Container from '../../components/Container';
import useAuth from '../../hooks/useAuth';
import { ActivityIndicator, View } from 'react-native';
import { useAppTheme } from '../../theme';

export default function HomePage() {
	const auth = useAuth();
	const { colors } = useAppTheme();
	
	const isFuncionario = auth.role && ['funcionario', 'admin'].includes(auth.role.toLowerCase());
	
	if (auth.isLoading) {
		return (
			<Container>
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<ActivityIndicator size="large" color={colors.primary} />
				</View>
			</Container>
		);
	}

	return (
		<Container>
			{isFuncionario ? <HomeHeader /> : <HomeCliente />}
		</Container>
	);
}
