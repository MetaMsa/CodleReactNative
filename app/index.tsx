import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Image } from "expo-image";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect, useState } from "react";
import {
  ImageBackground,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Share,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import * as fa from "@fortawesome/free-solid-svg-icons";

export default function HomeScreen() {
  const [langName, onChangeLangName] = useState<string | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [yesterdayLang, setYesterdayLang] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const [tried, setTried] = useState<number>(0);
  const [fetchStatus, setFetchStatus] = useState<string | null>(null);
  const [yearData, setYearData] = useState<string | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [compiledData, setCompiledData] = useState<string | null>(null);
  const [cData, setCData] = useState<string | null>(null);

  const [cStatus, setCStatus] = useState<boolean | null>(null);
  const [compiledStatus, setCompiledStatus] = useState<boolean | null>(null);
  const [yearStatus, setYearStatus] = useState<string | null>(null);

  const [status, setStatus] = useState<boolean>(false);

  const [modal, setModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch("https://benserhat.com/api/yesterDay").then(
          (response) => response.json(),
        );
        setImgUrl(res.image);
        setYesterdayLang(res.name);
      } catch (error) {
        console.error("Error fetching image:", error);
        setImgUrl(null);
      }
    };

    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.DEFAULT,
      );
    };

    fetchImage();
    lockOrientation();
  }, [imgUrl]);

  const handleSubmit = async () => {
    setTried((prev) => prev + 1);

    if (!langName?.trim()) return;

    setFetchStatus("Yükleniyor...");

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
      })
      .finally(() => {
        setYearData(null);
        setCompiledData(null);
        setCData(null);
        setFetchStatus(null);
      });

    setCStatus(res.cStatus);
    setYearStatus(res.yearStatus);
    setCompiledStatus(res.compiledStatus);

    setStatus(res.status);

    if (res === "Böyle bir dil yok") {
      setFetchStatus(res);
      setYear(null);
    } else if (res.status === true) {
      setYearData(null);
      setYear(res.year);
      setCompiledData(res.compiled);
      setCData(res.c);

      setModal(true);
    } else {
      if (res.yearStatus === "true") {
        setYearData("Bu yıl çıkmış başka bir dil");
      } else if (res.yearStatus === "old") {
        setYearData("Daha eski bir dil");
      } else if (res.yearStatus === "new") {
        setYearData("Daha yeni bir dil");
      }

      setYear(res.year);

      setCompiledData(res.compiled);

      setCData(res.c);
    }
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
          <View>
            <Pressable
              onPress={handleSubmit}
              disabled={!langName?.trim()}
              style={{
                borderRadius: 8,
                overflow: "hidden",
                borderColor: "#ffffff",
                borderWidth: 1,
                marginHorizontal: "auto",
              }}
            >
              <ThemedText style={{ padding: 12, textAlign: "center" }}>
                Tahmin Et
              </ThemedText>
            </Pressable>
            <ThemedText style={{ paddingTop: 12, textAlign: "center" }}>
              {fetchStatus}
            </ThemedText>
          </View>
        </ThemedView>
        <ThemedView style={{ height: 600, gap: 10 }}>
          <View
            style={{
              flex: 0.2,
              backgroundColor:
                yearStatus === "" || status ? "green" : "#101828",
              borderRadius: 16,
              borderColor: "white",
              borderWidth: 1,
            }}
          >
            <ThemedText style={{ textAlign: "center" }}>Çıkış Yılı</ThemedText>
            <ThemedText style={{ textAlign: "center" }}>
              {yearData} {yearData && "\n"} {year}
            </ThemedText>
          </View>
          <View
            style={{
              flex: 0.2,
              backgroundColor: compiledStatus || status ? "green" : "#101828",
              borderRadius: 16,
              borderColor: "white",
              borderWidth: 1,
            }}
          >
            <ThemedText style={{ textAlign: "center" }}>
              Derlenen/Yorumlanan
            </ThemedText>
            <ThemedText style={{ textAlign: "center" }}>
              {compiledData}
            </ThemedText>
          </View>
          <View
            style={{
              flex: 0.2,
              backgroundColor: cStatus || status ? "green" : "#101828",
              borderRadius: 16,
              borderColor: "white",
              borderWidth: 1,
            }}
          >
            <ThemedText style={{ textAlign: "center" }}>
              C türevi mi?
            </ThemedText>
            <ThemedText style={{ textAlign: "center" }}>{cData}</ThemedText>
          </View>
          <View
            style={{
              borderRadius: 16,
              backgroundColor: "#101828",
              borderColor: "white",
              borderWidth: 1,
              marginHorizontal: "auto",
              marginTop: 12,
            }}
          >
            <TouchableOpacity onPress={() => setShowTooltip((prev) => !prev)}>
              <Image
                source={imgUrl}
                style={{
                  width: 200,
                  height: 100,
                  alignSelf: "center",
                  marginVertical: 12,
                }}
              />
            </TouchableOpacity>
            {showTooltip && (
              <View
                style={{
                  position: "absolute",
                  bottom: 150,
                  left: 75,
                  backgroundColor: "#101828",
                  padding: 8,
                  borderRadius: 8,
                  borderColor: "white",
                  borderWidth: 1,
                }}
              >
                <ThemedText style={{ color: "white" }}>
                  {yesterdayLang}
                </ThemedText>
              </View>
            )}
            <ThemedText style={{ textAlign: "center" }}>
              Önceki Günün Dili
            </ThemedText>
          </View>
        </ThemedView>
        <Modal animationType="slide" transparent={true} visible={modal}>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <View
              style={{
                margin: 20,
                backgroundColor: "#101828",
                borderRadius: 20,
                borderWidth: 1,
                borderColor: "white",
                padding: 35,
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              <ThemedText
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  paddingBottom: 12,
                  textAlign: "center",
                }}
              >
                Tebrikler doğru bildiniz
              </ThemedText>
              <ThemedText style={{ paddingVertical: 12 }}>
                Yeni dil için yarını bekleyin. {"\n"}
                Paylaşmak için: {"\n"}
              </ThemedText>
              <View style={{ flexDirection: "column", gap: 12 }}>
                <Pressable
                  style={{
                    borderRadius: 8,
                    overflow: "hidden",
                    borderColor: "#ffffff",
                    borderWidth: 1,
                    marginHorizontal: "auto",
                    padding: 12,
                  }}
                  onPress={async () => {
                    const shareData = {
                      message:
                        "#Codle# " +
                        "Ben " +
                        tried +
                        " denemede doğru cevaba ulaştım. Peki sen kaç denemede ulaşacaksın? Hemen tıkla ve dene: https://benserhat.com/codle",
                    };

                    try {
                      const result = await Share.share(shareData);

                      if (result.action === Share.sharedAction) {
                        if (result.activityType) {
                          console.log(
                            "Paylaşıldı, aktivite tipi: " + result.activityType,
                          );
                        } else {
                          console.log("Paylaşıldı");
                        }
                      } else if (result.action === Share.dismissedAction) {
                        console.log("Paylaşım iptal edildi");
                      }
                    } catch (error) {
                      console.error("Paylaşım hatası: ", error);
                    }
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    <ThemedText>Paylaş</ThemedText>
                    <FontAwesomeIcon icon={fa.faShare} />
                  </View>
                </Pressable>
                <Pressable
                  style={{
                    borderRadius: 8,
                    overflow: "hidden",
                    borderColor: "#ffffff",
                    borderWidth: 1,
                    marginHorizontal: "auto",
                    padding: 12,
                  }}
                  onPress={() => {
                    onChangeLangName(null);
                    setImgUrl(null);
                    setYesterdayLang(null);
                    setShowTooltip(false);
                    setTried(0);
                    setFetchStatus(null);
                    setYearData(null);
                    setYear(null);
                    setCompiledData(null);
                    setCData(null);
                    setModal(false);
                    setCStatus(null);
                    setCompiledStatus(null);
                    setYearStatus(null);
                    setStatus(false);
                  }}
                >
                  <ThemedText>Yeniden Oyna</ThemedText>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </ParallaxScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  codleLogo: {
    height: "50%",
    width: "100%",
  },
  inputContainer: {
    marginHorizontal: "auto",
    gap: 12,
  },
});
