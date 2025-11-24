import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const WalletScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [balance, setBalance] = useState('0.0');
  const [assets, setAssets] = useState([]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // TODO: Implement wallet refresh logic
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>{balance} ETH</Text>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.buttonText}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.buttonText}>Receive</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {assets.length === 0 ? (
            <Text style={styles.emptyText}>No recent transactions</Text>
          ) : (
            <View>{/* Transaction list will go here */}</View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Assets</Text>
          {assets.length === 0 ? (
            <Text style={styles.emptyText}>No assets found</Text>
          ) : (
            <View>{/* Asset list will go here */}</View>
          )}
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
  balanceCard: {
    backgroundColor: '#3498db',
    padding: 20,
    margin: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  balanceLabel: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.8,
  },
  balanceAmount: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  actionButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 12,
  },
});

export default WalletScreen;