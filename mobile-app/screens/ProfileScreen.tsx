import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Image 
            style={styles.avatar}
            source={{ uri: 'https://via.placeholder.com/100' }}
          />
          <Text style={styles.username}>Username</Text>
          <Text style={styles.walletAddress}>0x...ABC</Text>
        </View>

        <View style={styles.stats}>
          <StatBox title="NFTs" value="0" />
          <StatBox title="Collections" value="0" />
          <StatBox title="Following" value="0" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My NFTs</Text>
          <Text style={styles.emptyText}>No NFTs yet</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const StatBox = ({ title, value }: { title: string; value: string }) => (
  <View style={styles.statBox}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  walletAddress: {
    fontSize: 14,
    color: '#666',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
});

export default ProfileScreen;