import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from "react-native";

export default function Search({ navigation }) {
  const [surahs, setSurahs] = useState([]);
  const [filteredSurah, setFilteredSurah] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchSurah = async () => {
      try {
        const response = await fetch("https://api.alquran.cloud/v1/quran/quran-uthmani");
        const translationResponse = await fetch("https://api.alquran.cloud/v1/quran/en.sahih");

        if (!response.ok || !translationResponse.ok)
          throw new Error("API Fetch failed");

        const quranData = await response.json();
        const translationData = await translationResponse.json();

        const surahList = quranData.data.surahs.map((surah, surahIndex) => ({
          Name: surah.englishName,
          translation: surah.englishNameTranslation,
          number: surah.number,
          Text: surah.ayahs.map((ayah, ayahIndex) => ({
            arabic: ayah.text,
            translation: translationData.data.surahs[surahIndex].ayahs[ayahIndex]?.text || "Translation missing",
            number: ayah.numberInSurah,
            ruku: ayah.ruku,
            globalIndex: ayah.number,
          })),
        }));

        setSurahs(surahList);
        setFilteredSurah(surahList);

      } catch (err) {
        console.error(err);
      }
    };
    fetchSurah();
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = surahs.filter((item) =>
      item.Name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredSurah(filtered);
  };

  const renderList = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.surahItem}
        onPress={() =>
          navigation.navigate("SurahDetails", {
            surahIndex: item.number,
            surahName: item.Name,
            surahAyahs: item.Text,
          })
        }
      >
        <Text style={styles.surahNumber}>{item.number}.</Text>
        <View>
          <Text style={styles.surahName}>{item.Name}</Text>
          <Text style={styles.translation}>{item.translation}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Search Surah"
        value={searchQuery}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filteredSurah}
        renderItem={renderList}
        keyExtractor={(item) => item.number.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  search: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 10,
    borderRadius: 5,
  },
  surahItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
  },
  surahNumber: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  surahName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  translation: {
    fontSize: 14,
    color: "gray",
  },
});
