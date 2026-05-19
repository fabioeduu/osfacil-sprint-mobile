import { Redirect } from 'expo-router';
import useAuth from '../../hooks/useAuth';
import Veiculo from '../../components/Veiculo';

export default function VeiculosPage() {
  const auth = useAuth();
  
  
  if (auth.role && !['funcionario', 'admin'].includes(auth.role.toLowerCase())) {
    return <Redirect href="/(tabs)/busca" />;
  }
  
  return <Veiculo />;
}
