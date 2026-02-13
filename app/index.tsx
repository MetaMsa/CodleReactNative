import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

export default function HomeScreen() {
  const [langName, onChangeLangName] = useState<string | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  const [tried, setTried] = useState<number>(0);
  const [fetchStatus, setFetchStatus] = useState<string | null>(null);
  const [yearData, setYearData] = useState<string | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [compiledData, setCompiledData] = useState<string | null>(null);
  const [cData, setCData] = useState<string | null>(null);

  const [modal, setModal] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch("https://benserhat.com/api/yesterDay").then((response) => response.json());
        setImgUrl(res.image);
      } catch (error) {
        console.error("Error fetching image:", error);
        setImgUrl(null);
      }
    };

    fetchImage();
  }, []);

  const handleSubmit = async () => {
    setTried((prev) => prev + 1);

    setYearData(null);
    setCompiledData(null);
    setCData(null);
    setFetchStatus(null);

    const res = await fetch("https://benserhat.com/api/langApi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: langName }),
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error("Error:", error);
        alert("Bir hata oluştu. Lütfen tekrar deneyin.");
      });

    alert(res.c);
  };

  return (
    <ImageBackground
      source={require("@/assets/images/background.png")}
      resizeMode="repeat"
      style={{ width: "100%", height: "100%" }}
    >
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#a1cedc00", dark: "#1d3d4700" }}
        headerImage={
          <ThemedView
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Image
              source={require("@/assets/images/codle.svg")}
              style={styles.codleLogo}
            />
          </ThemedView>
        }
      >
        <ThemedView style={styles.inputContainer}>
          <TextInput
            style={{
              flex: 1,
              color: "white",
              backgroundColor: "#101828",
              padding: 12,
              width: 200,
              borderRadius: 8,
            }}
            placeholder="Bir programlama dili giriniz"
            placeholderTextColor="#ffffff99"
            onChangeText={onChangeLangName}
            value={langName!}
            onSubmitEditing={handleSubmit}
            textAlign="center"
          />
          <View
            style={{
              borderRadius: 8,
              overflow: "hidden",
              borderColor: "#ffffff",
              borderWidth: 1,
              marginHorizontal: "auto",
            }}
          >
            <Pressable onPress={handleSubmit} disabled={!langName?.trim()}>
              <ThemedText
                style={{ padding: 12, textAlign: "center", width: 100 }}
              >
                Tahmin Et
              </ThemedText>
            </Pressable>
          </View>
        </ThemedView>
        <ThemedView style={{ height: 600, gap: 10 }}>
          <View
            style={{
              flex: 0.2,
              backgroundColor: "#101828",
              borderRadius: 16,
              borderColor: "white",
              borderWidth: 1,
            }}
          >
            <ThemedText style={{ textAlign: "center" }}>Çıkış Yılı</ThemedText>
          </View>
          <View
            style={{
              flex: 0.2,
              backgroundColor: "#101828",
              borderRadius: 16,
              borderColor: "white",
              borderWidth: 1,
            }}
          >
            <ThemedText style={{ textAlign: "center" }}>
              Derlenen/Yorumlanan
            </ThemedText>
          </View>
          <View
            style={{
              flex: 0.2,
              backgroundColor: "#101828",
              borderRadius: 16,
              borderColor: "white",
              borderWidth: 1,
            }}
          >
            <ThemedText style={{ textAlign: "center" }}>
              C türevi mi?
            </ThemedText>
          </View>
          <View
            style={{
              borderRadius: 16,
              backgroundColor: "#101828",
              borderColor: "white",
              borderWidth: 1,
              marginHorizontal: "auto",
            }}
          >
            <Image
              source={imgUrl}
              style={{
                width: 200,
                height: 100,
                alignSelf: "center",
                marginVertical: 12,
              }}
            />
            <ThemedText style={{ textAlign: "center" }}>
              Önceki Günün Dili
            </ThemedText>
          </View>
        </ThemedView>
      </ParallaxScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  codleLogo: {
    height: 178,
    width: 500,
  },
  inputContainer: {
    marginHorizontal: "auto",
    gap: 12,
  },
});
