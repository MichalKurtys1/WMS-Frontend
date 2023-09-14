import { Font } from "@react-pdf/renderer";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { useState } from "react";

const stylesText = StyleSheet.create({
  text1: {
    fontSize: 10,
    padding: 5,
    fontWeight: 600,
  },
  text2: {
    fontSize: 10,
    padding: 5,
    fontWeight: 600,
    textAlign: "center",
  },
  text9: {
    fontSize: 10,
    padding: 5,
    fontWeight: 600,
    textAlign: "center",
    borderTopWidth: 1,
  },
  text3: {
    fontSize: 9,
    padding: 5,
  },
  text3_2: {
    fontSize: 9,
    padding: 5,
    borderTopWidth: 1,
  },
  text3_3: {
    fontSize: 9,
    paddingTop: 20,
    fontWeight: 300,
    width: "25%",
    textAlign: "center",
  },
  text3_4: {
    fontSize: 9,
    paddingTop: 20,
    fontWeight: 300,
    width: "50%",
    textAlign: "center",
  },
  text4: {
    fontSize: 12,
    padding: 10,
    fontWeight: 600,
    textAlign: "center",
  },
  text5: {
    fontSize: 9,
    padding: 5,
    borderBottomWidth: 1,
  },
  text6: {
    fontSize: 9,
    padding: 5,
    fontWeight: 600,
    borderBottomWidth: 1,
  },
  text7: {
    width: "100%",
    fontSize: 9,
    padding: 5,
    borderTopWidth: 1,
  },
});

const stylesRow = StyleSheet.create({
  row100: {
    margin: "auto",
    width: "100%",
    flexDirection: "row",
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  row100_2: {
    margin: "auto",
    width: "100%",
    flexDirection: "row",
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  row100_3: {
    margin: "auto",
    width: "100%",
    height: 50,
    flexDirection: "row",
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  row100_4: {
    margin: "auto",
    width: "100%",
    flexDirection: "row",
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  row100_5: {
    margin: "auto",
    width: "100%",
    flexDirection: "row",
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomWidth: 1,
  },
  row25: {
    width: "25%",
    borderRightWidth: 1,
  },
  row50: {
    width: "50%",
    borderBottomWidth: 0,
  },
  row50_2: {
    width: "50%",
    borderRightWidth: 1,
  },
  tableCol100_2: {
    width: "95%",
    margin: "auto",
    borderStyle: "solid",
    flexDirection: "row",
  },
  tableCol60_2: {
    width: "70%",
    borderStyle: "solid",
    flexDirection: "row",
    borderTopWidth: 0,
    borderRightWidth: 1,
  },
  tableCol60: {
    width: "70%",
    borderStyle: "solid",
    borderTopWidth: 0,
    borderRightWidth: 1,
  },
  tableCol60_4: {
    width: "70%",
    borderStyle: "solid",
    borderTopWidth: 0,
    height: 80,
    borderRightWidth: 1,
  },
  tableCol40: {
    width: "30%",
    borderStyle: "solid",
  },
  tableCol40First: {
    width: "30%",
    borderStyle: "solid",
  },
  tableCol30: {
    width: "35%",
    borderStyle: "solid",
    borderRightWidth: 1,
  },
  tableCol30Sec: {
    width: "35%",
    borderStyle: "solid",
    borderRightWidth: 1,
  },
  tableCol40Sec: {
    width: "30%",
    borderStyle: "solid",
  },
});

const styles = StyleSheet.create({
  container: {
    display: "flex",
    height: "100%",
    marginTop: 30,
    alignItems: "center",
  },
  table: {
    display: "table",
    width: "90%",
    borderStyle: "solid",
  },
  tableRow100: {
    margin: "auto",
    width: "100%",
    flexDirection: "row",
    borderWidth: 1,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
  },
});

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
      fontWeight: 300,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: 400,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
      fontWeight: 500,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: 600,
    },
  ],
});

const pageStyles = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
  },
});

const ShippmentPDF = (props) => {
  const [shippingData] = useState(props.shipment);

  console.log(shippingData);

  return (
    <Document
      title={`Dostawa/${shippingData[0].deliveryDate}/${
        Math.floor(Math.random() * (10 - 1 + 1)) + 1
      }`}
    >
      {shippingData.map((item) => (
        <Page size="A4" style={pageStyles.page} wrap={false}>
          <View style={styles.container}>
            <View style={styles.table}>
              <View style={stylesRow.row100}>
                <Text style={stylesText.text1}>LIST PRZEWOZOWY</Text>
              </View>
              <View style={stylesRow.row100}>
                <View style={stylesRow.tableCol60}>
                  <Text style={stylesText.text2}>ZAŁADUNEK</Text>
                </View>
                <View style={stylesRow.tableCol40First}>
                  <Text style={stylesText.text2}>PRZEWOŹNIK</Text>
                </View>
              </View>
              <View style={stylesRow.row100}>
                <View style={stylesRow.tableCol30}>
                  <Text style={stylesText.text3}>Odbiorca:</Text>
                  <Text style={stylesText.text4}>{item.clientName}</Text>
                </View>
                <View style={stylesRow.tableCol30}>
                  <Text style={stylesText.text3}>Adres odbiorcy:</Text>
                  <Text style={stylesText.text4}>{item.clientAddress}</Text>
                </View>
                <View style={stylesRow.tableCol40}>
                  <Text style={stylesText.text3}>
                    Imię i nazwisko kierowcy:
                  </Text>
                  <Text style={stylesText.text4}>{item.employeeName}</Text>
                </View>
              </View>
              <View style={stylesRow.row100}>
                <View style={stylesRow.tableCol30Sec}>
                  <Text style={stylesText.text3}>Miejsce nadania:</Text>
                  <Text style={stylesText.text4}>{item.warehouseAddress}</Text>
                </View>
                <View style={stylesRow.tableCol30Sec}>
                  <Text style={stylesText.text3}>Miejsce przeznaczenia:</Text>
                  <Text style={stylesText.text4}>
                    {item.destinationAddress}
                  </Text>
                </View>
                <View style={stylesRow.tableCol40Sec}>
                  <Text style={stylesText.text3}>Nr rej. pojazdu:</Text>
                  <Text style={stylesText.text4}>
                    {item.registrationNumber}
                  </Text>
                </View>
              </View>
              <View style={stylesRow.row100}>
                <View style={stylesRow.tableCol60_2}>
                  <View style={stylesRow.row25}>
                    <Text style={stylesText.text6}>Ilość</Text>
                    {item.products.map((item) => (
                      <Text style={stylesText.text5}>{item.quantity}</Text>
                    ))}
                  </View>
                  <View style={stylesRow.row25}>
                    <Text style={stylesText.text6}>Jednostka</Text>
                    {item.products.map((item) => (
                      <Text style={stylesText.text5}>{item.unit}</Text>
                    ))}
                  </View>
                  <View style={stylesRow.row50}>
                    <Text style={stylesText.text6}>Nazwa</Text>
                    {item.products.map((item) => (
                      <Text style={stylesText.text5}>{item.product}</Text>
                    ))}
                  </View>
                </View>
                <View style={stylesRow.tableCol40Sec}>
                  <Text style={stylesText.text3}>
                    Zastrzeżenia i uwagi przewoźnika:
                  </Text>
                  <Text style={stylesText.text4}>{""}</Text>
                </View>
              </View>
              <View style={stylesRow.row100_3}>
                <View style={stylesRow.tableCol60_2}>
                  <Text style={stylesText.text3}>Uwagi:</Text>
                </View>
                <View style={stylesRow.tableCol40Sec}></View>
              </View>
              <View style={stylesRow.row100_4}>
                <View style={stylesRow.tableCol60_2}>
                  <Text style={stylesText.text7}>
                    Przesyłkę należy dostarczyć dnia:{" "}
                    <Text style={stylesText.text2}>{item.deliveryDate}</Text>
                  </Text>
                </View>
              </View>
              <View style={stylesRow.row100}>
                <View style={stylesRow.tableCol60_2}>
                  <View style={stylesRow.row50_2}>
                    <Text style={stylesText.text3}>
                      Nadawca (podpis/pieczątka):
                    </Text>
                  </View>
                  <View style={stylesRow.row50}>
                    <Text style={stylesText.text3}>
                      Nadawca (podpis/pieczątka):
                    </Text>
                  </View>
                </View>
                <View style={stylesRow.tableCol40Sec}>
                  <Text style={stylesText.text3}>
                    Kwituję odbiór przesyłki (podpis kierowcy):
                  </Text>
                  <Text style={stylesText.text4}>{""}</Text>
                </View>
              </View>
              <View style={stylesRow.row100_4}>
                <View style={stylesRow.tableCol60}>
                  <Text style={stylesText.text9}>ROZŁADUNEK</Text>
                </View>
              </View>
              <View style={stylesRow.row100}>
                <View style={stylesRow.tableCol60_4}>
                  <Text style={stylesText.text3}>
                    Zastrzeżenia i uwagi odbiorcy:
                  </Text>
                </View>
                <View style={stylesRow.tableCol40Sec}>
                  <Text style={stylesText.text3}>
                    Zastrzeżenia i uwagi przewoźnika:
                  </Text>
                </View>
              </View>
              <View style={stylesRow.row100_5}>
                <View style={stylesRow.tableCol60_4}>
                  <Text style={stylesText.text3_2}>Przesyłkę otrzymano:</Text>
                  <View style={stylesRow.tableCol100_2}>
                    <Text style={stylesText.text3_3}>miejscowość</Text>
                    <Text style={stylesText.text3_3}>data</Text>
                    <Text style={stylesText.text3_4}>
                      podpis/pieczątka odbiorcy
                    </Text>
                  </View>
                </View>
                <View style={stylesRow.tableCol40Sec}></View>
              </View>
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default ShippmentPDF;
