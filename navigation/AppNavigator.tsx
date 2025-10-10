import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';


import HomeScreen from '../screens/Home';
import ListaOSScreen from '../screens/ListaOS';
import NovaOSScreen from '../screens/NovaOS';
import DetalhesOSScreen from '../screens/DetalhesOS';
import EditarOSScreen from '../screens/EditarOS';
import ClientesScreen from '../screens/Clientes';
import NovoClienteScreen from '../screens/NovoCliente';
import EditarClienteScreen from '../screens/EditarCliente';
import VeiculosScreen from '../screens/Veiculos';
import NovoVeiculoScreen from '../screens/NovoVeiculo';
import EditarVeiculoScreen from '../screens/EditarVeiculo';
import ServicosScreen from '../screens/Servicos';
import NovoServicoScreen from '../screens/NovoServico';
import EditarServicoScreen from '../screens/EditarServico';
import RelatoriosAvancados from '../screens/Relatorios';
import ConfiguracoesScreen from '../screens/Configuracoes';
import NotificacoesScreen from '../screens/Notificacoes';

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
	return (
		<NavigationContainer>
			<Stack.Navigator
				initialRouteName="Home"
				screenOptions={{
					headerStyle: {
						backgroundColor: '#2c3e50',
					},
					headerTintColor: '#fff',
					headerTitleStyle: {
						fontWeight: 'bold',
					},
          
					headerBackTitle: 'Voltar',
				}}
			>
				<Stack.Screen 
					name="Home" 
					component={HomeScreen} 
					options={{ title: 'OS Fácil - Menu Principal' }}
				/>
				<Stack.Screen 
					name="ListaOS" 
					component={ListaOSScreen} 
					options={{ title: 'Ordens de Serviço' }}
				/>
				<Stack.Screen 
					name="NovaOS" 
					component={NovaOSScreen} 
					options={{ title: 'Nova Ordem de Serviço' }}
				/>
				<Stack.Screen 
					name="DetalhesOS" 
					component={DetalhesOSScreen} 
					options={{ title: 'Detalhes da OS' }}
				/>
				<Stack.Screen 
					name="EditarOS" 
					component={EditarOSScreen} 
					options={{ title: 'Editar OS' }}
				/>
				<Stack.Screen 
					name="Clientes" 
					component={ClientesScreen} 
					options={{ title: 'Clientes' }}
				/>
				<Stack.Screen 
					name="NovoCliente" 
					component={NovoClienteScreen} 
					options={{ title: 'Novo Cliente' }}
				/>
				<Stack.Screen 
					name="EditarCliente" 
					component={EditarClienteScreen} 
					options={{ title: 'Editar Cliente' }}
				/>
				<Stack.Screen 
					name="Veiculos" 
					component={VeiculosScreen} 
					options={{ title: 'Veículos' }}
				/>
				<Stack.Screen 
					name="NovoVeiculo" 
					component={NovoVeiculoScreen} 
					options={{ title: 'Novo Veículo' }}
				/>
				<Stack.Screen 
					name="EditarVeiculo" 
					component={EditarVeiculoScreen} 
					options={{ title: 'Editar Veículo' }}
				/>
				<Stack.Screen 
					name="Servicos" 
					component={ServicosScreen} 
					options={{ title: 'Serviços' }}
				/>
				<Stack.Screen 
					name="NovoServico" 
					component={NovoServicoScreen} 
					options={{ title: 'Novo Serviço' }}
				/>
				<Stack.Screen 
					name="EditarServico" 
					component={EditarServicoScreen} 
					options={{ title: 'Editar Serviço' }}
				/>
				<Stack.Screen 
					name="Relatorios" 
					component={RelatoriosAvancados} 
					options={{ title: 'Relatórios' }}
				/>
				<Stack.Screen 
					name="Notificacoes" 
					component={NotificacoesScreen} 
					options={{ title: 'Notificações' }}
				/>
				<Stack.Screen 
					name="Configuracoes" 
					component={ConfiguracoesScreen} 
					options={{ title: 'Configurações' }}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}
