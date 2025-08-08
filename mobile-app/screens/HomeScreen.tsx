import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const mockFeaturedNFTs = [
  {
    id: '1',
    name: 'Cosmic Explorer #1',
    price: '0.05',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=300&fit=crop&crop=center&q=80',
    creator: 'CryptoCreator',
  },
  {
    id: '2',
    name: 'Digital Dreams #2',
    price: '0.25',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop&crop=center&q=80',
    creator: 'DigitalDreamer',
  },
  {
    id: '3',
    name: 'Neon City #3',
    price: '0.15',
    image: 'https://images.unsplash.com/photo-1507003211169-e695c5b0c85a?w=300&h=300&fit=crop&crop=center&q=80',
    creator: 'NeonArtist',
  },
];

const mockStats = {
  totalNFTs: 45678,
  totalVolume: 2345.67,
  activeUsers: 8921,
};

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>NexusVerse</Text>
            <Text style={styles.subtitle}>Next-Gen NFT Marketplace</Text>
          </View>
          <TouchableOpacity
            style={styles.walletButton}
            onPress={() => navigation.navigate('Wallet')}
          >
            <Ionicons name="wallet-outline" size={24} color="#6366f1" />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="images-outline" size={24} color="#6366f1" />
            <Text style={styles.statNumber}>{mockStats.totalNFTs.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total NFTs</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trending-up-outline" size={24} color="#10b981" />
            <Text style={styles.statNumber}>{mockStats.totalVolume.toFixed(2)} ETH</Text>
            <Text style={styles.statLabel}>Total Volume</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="people-outline" size={24} color="#f59e0b" />
            <Text style={styles.statNumber}>{mockStats.activeUsers.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Active Users</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Marketplace')}
          >
            <Ionicons name="grid-outline" size={24} color="#6366f1" />
            <Text style={styles.actionText}>Browse NFTs</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="add-circle-outline" size={24} color="#10b981" />
            <Text style={styles.actionText}>Create NFT</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="trending-up-outline" size={24} color="#f59e0b" />
            <Text style={styles.actionText}>Analytics</Text>
          </TouchableOpacity>
        </View>

        {/* Featured NFTs */}
        <View style={styles.featuredContainer}>
          <Text style={styles.sectionTitle}>Featured NFTs</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {mockFeaturedNFTs.map((nft) => (
              <TouchableOpacity
                key={nft.id}
                style={styles.nftCard}
                onPress={() => navigation.navigate('NFT', { nft })}
              >
                <Image source={{ uri: nft.image }} style={styles.nftImage} />
                <View style={styles.nftInfo}>
                  <Text style={styles.nftName}>{nft.name}</Text>
                  <Text style={styles.nftCreator}>by {nft.creator}</Text>
                  <Text style={styles.nftPrice}>{nft.price} ETH</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recent Activity */}
        <View style={styles.activityContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Ionicons name="trending-up" size={16} color="#10b981" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>
                <Text style={styles.activityUser}>CryptoCreator</Text> sold Cosmic Explorer #1 for 0.05 ETH
              </Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Ionicons name="add-circle" size={16} color="#6366f1" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>
                <Text style={styles.activityUser}>DigitalDreamer</Text> minted Digital Dreams #2
              </Text>
              <Text style={styles.activityTime}>4 hours ago</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  walletButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 8,
  },
  featuredContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  nftCard: {
    width: 200,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nftImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  nftInfo: {
    padding: 12,
  },
  nftName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  nftCreator: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  nftPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
    marginTop: 4,
  },
  activityContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  activityItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#1e293b',
    lineHeight: 20,
  },
  activityUser: {
    fontWeight: 'bold',
    color: '#6366f1',
  },
  activityTime: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
});
