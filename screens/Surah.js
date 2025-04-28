import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, navigation } from "react-native";

export default function Surah({ route , navigation}) {
  const { SurahNumber } = route.params;
  const [surah, setSurah] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadMore, setLoadMore] = useState(false);
  const pageSize = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");

  const [surahName, setSurahName] = useState("");

  useEffect(() => {
    const fetchQuran = async () => {
      try {
        setLoading(true);

        const response = await fetch(`https://api.alquran.cloud/v1/surah/${SurahNumber}`);  
        const translationResponse = await fetch("https://api.alquran.cloud/v1/quran/en.sahih");

        if (!response.ok) throw new Error(`Arabic API Failed: ${response.status}`);
        if (!translationResponse.ok) throw new Error(`Translation API Failed: ${translationResponse.status}`);

        const arabicData = await response.json();
        const translationData = await translationResponse.json();

        const translatedSurah = arabicData.data.ayahs.map((ayah, ayahIndex) => ({
          arabic: ayah.text,
          translation: translationData.data.surahs[SurahNumber - 1]?.ayahs[ayahIndex]?.text || "Translation missing",
          number: ayah.numberInSurah,
          ruku: ayah.ruku,
          globalIndex: ayah.number,
        }));

        setSurah(translatedSurah);   
        setSurahName(arabicData.data.englishName);  
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuran();
  }, [SurahNumber]);

  const loadingMore = () => {
    if (loadMore) return;
    if (surah.length >= (currentPage * pageSize)) return;

    setLoadMore(true);

    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * 20;
    const lastIndex = startIndex + 20;

    const newAyahs = surah.slice(startIndex, lastIndex);  

    setSurah(prevAyahs => [...prevAyahs, ...newAyahs]);
    setCurrentPage(nextPage);
    setLoadMore(false);
  };

  const renderAyat = ({ item }) => {
    return (
      <TouchableOpacity activeOpacity={0.7}>
        <View style={styles.arabicContainer}>
            <Text style={styles.arabicText}>{item.arabic}</Text>
            <Text style={styles.verseNumber}>({item.number})</Text>
        </View>
        <View style={styles.separatorVertical} />
        <View style={styles.translationContainer}>
            <Text style={styles.translationText}>{item.translation}</Text>
        </View>
        <View style={styles.separatorHorizontal} />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00aaff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{surahName}</Text>

      <FlatList
        data={surah}
        renderItem={renderAyat}
        keyExtractor={(item) => item.globalIndex.toString()}
        onEndReached={loadingMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}

// CSS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#2e2e2e",
  },
  translationContainer: {
    marginBottom: 6,
    paddingHorizontal: 10,
    borderRadius:8,
  },
  translationText: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
    textAlign: "left",
  },
  arabicContainer: {
    
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    // marginTop:3,
    padding: 8,
    borderRadius: 8,
    marginVertical: 4,
  },
  arabicText: {
    fontSize: 23,
    textAlign: "right",
    fontFamily: "Amiri-Regular",    
    fontWeight: "bold",
    flex: 1,
    color: "#111",
  },
  verseNumber: {
    marginLeft: 8,
    fontSize: 16,
    color: "#888",
  },
  separatorHorizontal: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 8,
  },
  separatorVertical: {
    height: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
});
