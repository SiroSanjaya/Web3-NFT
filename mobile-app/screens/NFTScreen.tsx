import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type NFTScreenProps = {
  route: RouteProp<{
    NFTScreen: {
      id: string;
      name: string;
      image: string;
      price: string;
      owner: string;
    }
  }, 'NFTScreen'>;
  navigation: StackNavigationProp<any>;
};

const NFTScreen: React.FC<NFTScreenProps> = ({ route, navigation }) => {
  const { id, name, image, price, owner } = route.params || {
    id: '0',
    name: 'NFT Name',
    image: 'https://via.placeholder.com/300',
    price: '0.0 ETH',
    owner: '0x...'
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image 
          source={{ uri: image }}
          style={styles.image}
          resizeMode="cover"
        />
        
        <View style={styles.content}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.price}>{price}</Text>
          
          <View style={styles.ownerSection}>
            <Text style={styles.sectionTitle}>Owner</Text>
            <Text style={styles.ownerAddress}>{owner}</Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Make Offer</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                View History
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 350,
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    color: '#666',
    marginBottom: 20,
  },
  ownerSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  ownerAddress: {
    fontSize: 16,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#3498db',
  },
  secondaryButtonText: {
    color: '#3498db',
  },
});

export default NFTScreen;