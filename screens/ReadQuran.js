import React, { useEffect, useState, useRef } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ReadQuranScreen() {
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    const fetchQuran = async () => {
      try {
        const response = await fetch("https://api.alquran.cloud/v1/quran/quran-uthmani");
        const translationResponse = await fetch("https://api.alquran.cloud/v1/quran/en.sahih");

        if (!response.ok) throw new Error(`Arabic API Failed: ${response.status}`);
        if (!translationResponse.ok) throw new Error(`Translation API Failed: ${translationResponse.status}`);

        const quranData = await response.json();
        const translationData = await translationResponse.json();

        setVerses(quranData.data.surahs.flatMap((surah, surahIndex) =>
          surah.ayahs.map((ayah, ayahIndex) => ({
            arabic: ayah.text,
            translation: translationData.data.surahs[surahIndex].ayahs[ayahIndex]?.text || "Translation missing",
            number: ayah.numberInSurah,
            ruku: ayah.ruku,
            globalIndex: ayah.number,
          }))
        ));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuran();
  }, []);

  useEffect(() => {
    let interval;
    if (isPlaying && selectedVerse !== null) {
      interval = setInterval(() => {
        setSelectedVerse((prevIndex) => {
          const nextIndex = prevIndex + 1;
          if (nextIndex >= verses.length) {
            clearInterval(interval);
            setIsPlaying(false);
            return prevIndex;
          }
          flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
          return nextIndex;
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, selectedVerse]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b5998" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      if (selectedVerse === null) setSelectedVerse(0);
    }
  };

  const renderVerse = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => setSelectedVerse(index)}
      style={[styles.verseRow, selectedVerse === index && styles.selectedRow]}
    >
      <View style={styles.translationContainer}>
        <Text style={styles.translationText}>{item.translation}</Text>
      </View>
      <View style={styles.separatorVertical} />
      <View style={styles.arabicContainer}>
        <Text style={styles.arabicText}>{item.arabic}</Text>
        <Text style={styles.verseNumber}>({item.number})</Text>
      </View>
      <View style={styles.separatorHorizontal} />
    </TouchableOpacity>
  );

  return (

    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>الأعراف</Text>
        {selectedVerse !== null && (
          <TouchableOpacity onPress={togglePlay} style={styles.playButton}>
            <Ionicons name={isPlaying ? "pause" : "play"} size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
        {console.log("re rendering")}
      <FlatList
        
        ref={flatListRef}
        data={verses}
        keyExtractor={(item) => item.globalIndex.toString()}
        renderItem={renderVerse}
        extraData={selectedVerse}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f0f0", padding: 10 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { fontSize: 18, color: "red" },
  header: {
    backgroundColor: "#3b5998",
    padding: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerText: { fontSize: 26, color: "#fff", fontWeight: "bold" },
  playButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 50,
  },
  verseRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginVertical: 2,
    borderRadius: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  selectedRow: { backgroundColor: "#d1e7fd" },
  separatorVertical: { width: 1, backgroundColor: "#ccc", height: "80%", marginHorizontal: 10 },
  separatorHorizontal: { height: 1, backgroundColor: "#ddd", marginVertical: 5 },
  arabicContainer: { flex: 1, alignItems: "flex-end", paddingRight: 10 },
  arabicText: { fontSize: 22, textAlign: "right", fontWeight: "bold", fontFamily: "Amiri-Regular", color: "#222" },
  verseNumber: { fontSize: 16, color: "#555", textAlign: "right" },
  translationContainer: { flex: 1, paddingLeft: 10 },
  translationText: { fontSize: 18, textAlign: "left", fontWeight: "400", fontFamily: "NotoSans-Regular", color: "#444" },
});
