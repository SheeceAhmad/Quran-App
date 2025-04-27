import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Quran</Text>
        <Image 
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2232/2232688.png' }} 
          style={styles.headerImage} 
        />
        <Text style={styles.LastRead}>Last Read</Text>
        <Text style={styles.subTitle}>Surah-Al-Fatiha</Text>
        <Text style={styles.verse}>Verse No. 7</Text>
        <Text style={styles.time}>Thu Feb 27 2025 09:31 AM</Text>
      </View>

      <View style={styles.featuresContainer}>
        <Text style={styles.featuresTitle}>Features</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.featureButton} onPress={() => navigation.navigate('ReadQuran')}>
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/8332/8332365.png' }} 
              style={styles.icon} 
            />
            <Text style={styles.buttonText}>Read Quran</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureButton} onPress={() => navigation.navigate('Search')}>
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3031/3031293.png' }} 
              style={styles.icon} 
            />
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.featureButton} onPress={() => navigation.navigate('Bookmark')}>
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3176/3176369.png' }} 
              style={styles.icon} 
            />
            <Text style={styles.buttonText}>Bookmark</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureButton} onPress={() => navigation.navigate('Settings')}>
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3524/3524659.png' }} 
              style={styles.icon} 
            />
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#4a6da7' 
  },
  header: {
    flex: 0.4, 
    backgroundColor: '#4a6da7', 
    padding: 20, 
    alignItems: 'center', 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#fff' 
  },
  subTitle: { 
    fontSize: 16, 
    color: '#fff', 
    marginTop: 10 
  },
  verse: { 
    fontSize: 16, 
    color: '#fff' 
  },
  time: { 
    fontSize: 14, 
    color: '#fff', 
    marginTop: 5 
  },
  featuresContainer: { 
    flex: 0.7,
    backgroundColor: '#fff', 
    padding: 20, 
    elevation: 5,
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20 
  },
  featuresTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 20 
  },
  buttonRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-around',
    margin: 20 
  },
  featureButton: { 
    alignItems: 'center', 
    padding: 10, 
    backgroundColor: '#f7f7f7', 
    borderRadius: 10, 
    width: 120,
    elevation: 3 
  },
  icon: { 
    width: 40, 
    height: 40, 
    marginBottom: 5 
  },
  buttonText: { 
    fontSize: 14, 
    fontWeight: 'bold' 
  },
  headerImage: {
    width: 40, 
    height: 40, 
    marginBottom: 10
  }
});
