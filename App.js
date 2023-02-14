import React, { useEffect, useState } from 'react'
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native'
import Svg from 'react-native-svg'
import { Dimensions } from 'react-native'
import { useFonts } from 'expo-font'
// import AyaActions from './AyaActions'

var width = Dimensions.get('window').width
var height = Dimensions.get('window').height

const QuranPage = () => {
  const [quran, setQuran] = useState([])
  const [value, setValue] = useState(-1)

  const fetchData = async () => {
    const response = await fetch(
      'https://api.alquran.cloud/v1/page/5/ar.alafasy'
    )
    const { data } = await response.json()
    setQuran(data)
  }
  useEffect(() => {
    fetchData()
  }, [])

  const [loaded] = useFonts({
    Qalam: require('./assets/fonts/Al-Qalam-Quran.ttf'),
  })

  let x = 0
  let y = 100
  let lineHeight = 36
  let maxWidth = 2000

  const wrapText = (ayahs, x, y, maxWidth, lineHeight) => {
    let line = {}
    let lines = []

    ayahs?.forEach((aya) => {
      line = aya
      let testLine = line.text + aya.text + ' '
      let testWidth = (testLine.length * lineHeight) / 2
      if (testWidth > maxWidth) {
        lines.push({ line, x, y })
        line.text = aya.text + ' '
        y += lineHeight
      } else {
        line.text = testLine
      }
    })
    return lines
  }
  const image = {
    uri: 'https://o.remove.bg/downloads/9979b532-b143-4e42-a4b9-44092d771f22/503-5034905_quran-ayat-separator-hd-png-download-removebg-preview.png',
  }

  if (!loaded) {
    return null
  }
  if (quran?.ayahs?.length === 0) {
    return <Text>Loading...</Text>
  }
  return (
    <View style={styles.container}>
      <Svg style={styles.svgContainer}>
        <Text>
          {wrapText(quran?.ayahs, x, y, maxWidth, lineHeight).map(
            ({ line }, index) => (
              <Text
                key={index}
                style={[styles.quranT, value === index && styles.quranActiveT]}
                onPress={() => {
                  console.log('does not work')
                  setValue(index)
                }}
              >
                {line.text}
                <ImageBackground
                  source={image}
                  resizeMode='center'
                  style={{
                    width: 25,
                    height: 25,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                  }}
                >
                  <Text style={{ fontSize: 8 }}>{line.numberInSurah}</Text>
                </ImageBackground>
              </Text>
            )
          )}
        </Text>
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    paddingTop: 30,
    padding: 8,
    width,
    height,
  },
  svgContainer: {},
  quranT: {
    fontSize: 26,
    lineHeight: 48,
    textAlign: 'center',
    width: '100%',
    fontFamily: 'Qalam',
    direction: 'rtl',
  },
  quranActiveT: {
    backgroundColor: 'lightgray',
  },
  quranAyaNum: {
    width: 30,
    height: 30,
    textAlign: 'center',
    fontSize: 10,
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default QuranPage
