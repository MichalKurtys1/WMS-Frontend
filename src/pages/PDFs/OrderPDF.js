import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { getAuth } from "../../context/index";

const stylesText = StyleSheet.create({
  text1: {
    fontSize: 10,
    padding: 5,
    fontWeight: 500,
    textAlign: "center",
    width: "100%",
    backgroundColor: "#f5f5f5",
  },
  text2: {
    fontSize: 10,
    padding: 5,
    textAlign: "center",
    width: "100%",
  },
  text3: {
    fontSize: 11,
    padding: 5,
    textAlign: "center",
    width: "100%",
    backgroundColor: "#f5f5f5",
  },
  text4: {
    fontSize: 10,
    padding: 2,
    fontWeight: 200,
    width: "100%",
  },
  text5: {
    fontSize: 9,
    padding: 2,
    width: "100%",
    textAlign: "center",
    fontWeight: 500,
    backgroundColor: "#f5f5f5",
  },
  text6: {
    fontSize: 9,
    padding: 2,
    width: "100%",
    textAlign: "center",
  },
  text4last: {
    fontSize: 10,
    padding: 2,
    paddingBottom: 10,
    fontWeight: 200,
    width: "100%",
    borderBottom: 1,
    borderColor: "#646e78",
  },
  title: {
    fontSize: 20,
    padding: 5,
    fontWeight: 500,
    textAlign: "center",
    width: "100%",
    margin: 0,
  },
  text7: {
    fontSize: 14,
    padding: 5,
    width: "100%",
    textAlign: "center",
  },
  text8: {
    fontSize: 14,
    padding: 5,
    width: "100%",
    textAlign: "center",
    backgroundColor: "#f5f5f5",
    borderTop: 1,
    borderColor: "#646e78",
  },
  text9: {
    fontSize: 14,
    padding: 15,
    width: "100%",
    textAlign: "center",
  },
});

const stylesRow = StyleSheet.create({
  row100: {
    margin: "auto",
    width: "100%",
    flexDirection: "row",
    borderWidth: 1,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderColor: "#646e78",
  },
  rowlast: {
    margin: "auto",
    width: "100%",
    borderBottom: 1,
    borderColor: "#646e78",
  },
  row100Last: {
    margin: "auto",
    width: "100%",
    flexDirection: "row",
    borderWidth: 1,
    borderRightWidth: 0,
    borderColor: "#646e78",
  },
  col50: {
    width: "50%",
    margin: "auto",
    borderStyle: "solid",
    flexDirection: "row",
    borderRight: 1,
    borderColor: "#646e78",
  },
  col: {
    width: "12.5%",
    margin: "auto",
    borderStyle: "solid",
    flexDirection: "row",
    borderRight: 1,
    borderColor: "#646e78",
  },
  col5: {
    width: "5%",
    margin: "auto",
    borderStyle: "solid",
    flexDirection: "row",
    borderRight: 1,
    borderColor: "#646e78",
  },
  col10: {
    width: "10%",
    margin: "auto",
    borderStyle: "solid",
    flexDirection: "row",
    borderRight: 1,
    borderColor: "#646e78",
  },
  col7: {
    width: "22.5%",
    margin: "auto",
    borderStyle: "solid",
    flexDirection: "row",
    borderRight: 1,
    borderColor: "#646e78",
  },
  colSum: {
    width: "25%",
    margin: "auto",
    borderStyle: "solid",
    flexDirection: "row",
    borderRight: 1,
    borderColor: "#646e78",
  },
  colSum20: {
    width: "20%",
    margin: "auto",
    borderStyle: "solid",
    flexDirection: "row",
    borderRight: 1,
    borderColor: "#646e78",
  },
  colSum40: {
    width: "40%",
    margin: "auto",
    borderStyle: "solid",
    flexDirection: "row",
    borderRight: 1,
    borderColor: "#646e78",
  },
});

const styles = StyleSheet.create({
  container: {
    display: "flex",
    height: "100%",
    marginTop: 5,
    alignItems: "center",
  },
  upperBox: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  logoBox: {
    width: "49%",
  },
  image: {
    width: "60%",
    marginLeft: 20,
  },
  dateBox: {
    width: "49%",
    marginRight: 5,
  },
  personalData: {
    marginTop: 20,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  personalBox: {
    width: "49%",
    margin: 10,
  },
  personalTital: {
    borderWidth: 1,
    borderColor: "#646e78",
  },
  titleBox: {
    width: "100%",
  },
  tableBox: {
    width: "98%",
    margin: 10,
  },
  tableBoxSummary: {
    width: "65%",
    marginTop: 20,
    marginLeft: 6,
    alignSelf: "flex-start",
  },
  summary: {
    backgroundColor: "#f5f5f5",
    width: "65%",
    marginTop: 20,
    marginLeft: 6,
    display: "flex",
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    borderTop: 1,
    borderColor: "#646e78",
  },
  summaryBox: {
    width: "40%",
  },
  signatureBox: {
    width: "98%",
    margin: 6,
    marginTop: 50,
    display: "flex",
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    flexWrap: "wrap",
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

const OrderPDF = ({ deliveryData }) => {
  const { name } = getAuth();
  let index = 0;

  const priceHandler = (name) => {
    const product = deliveryData.productsInfo.products.filter(
      (item) => item.name + " " + item.type + " " + item.capacity === name
    );
    return product[0].pricePerUnit;
  };

  const vatSum = () => {
    let totalVat = 0;
    deliveryData.products.map((item) => {
      return (totalVat += priceHandler(item.product) * +item.quantity * 0.23);
    });
    return totalVat * (1.4).toFixed(2);
  };

  const priceSum = () => {
    let totalPrice = 0;
    deliveryData.products.map((item) => {
      return (totalPrice += priceHandler(item.product) * item.quantity);
    });
    return totalPrice * (1.4).toFixed(2);
  };

  return (
    <Document
      title={`FAKTURA/${
        new Date(deliveryData.deliveryDate).toISOString().split("T")[0]
      }/${Math.floor(Math.random() * (10 - 1 + 1)) + 1}`}
    >
      <Page size="A4" style={pageStyles.page} wrap={false}>
        <View style={styles.container}>
          <View style={styles.upperBox}>
            <View style={styles.logoBox}>
              <Image
                style={styles.image}
                src={require("../../assets/logo.png")}
              />
            </View>
            <View style={styles.dateBox}>
              <View style={stylesRow.row100}>
                <View style={stylesRow.col50}>
                  <Text style={stylesText.text1}>Miejsce wystawienia</Text>
                </View>
                <View style={stylesRow.col50}>
                  <Text style={stylesText.text2}>Bydgoszcz</Text>
                </View>
              </View>
              <View style={stylesRow.row100}>
                <View style={stylesRow.col50}>
                  <Text style={stylesText.text1}>Data zakończenia dostawy</Text>
                </View>
                <View style={stylesRow.col50}>
                  <Text style={stylesText.text2}>
                    {
                      new Date(deliveryData.deliveryDate)
                        .toISOString()
                        .split("T")[0]
                    }
                  </Text>
                </View>
              </View>
              <View style={stylesRow.row100Last}>
                <View style={stylesRow.col50}>
                  <Text style={stylesText.text1}>Data wystawienia</Text>
                </View>
                <View style={stylesRow.col50}>
                  <Text style={stylesText.text2}>
                    {
                      new Date(deliveryData.issueDate)
                        .toISOString()
                        .split("T")[0]
                    }
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.personalData}>
            <View style={styles.personalBox}>
              <View style={styles.personalTital}>
                <Text style={stylesText.text3}>Sprzedawca</Text>
              </View>
              <View style={styles.personalDetails}>
                <Text style={stylesText.text4}>Oaza napojów Sp. z.o.o.</Text>
                <Text style={stylesText.text4}>ul. Cicha 2 Bydgoszcz</Text>
                <Text style={stylesText.text4}>NIP: 1112233444</Text>
                <Text style={stylesText.text4}>
                  PKO Bank Polski O/Bydgoszcz
                </Text>
                <Text style={stylesText.text4}>
                  11 2222 3333 4444 5555 6666
                </Text>
                <Text style={stylesText.text4last}>
                  oaza-napoi@support.pl Tel:111222331
                </Text>
              </View>
            </View>
            <View style={styles.personalBox}>
              <View style={styles.personalTital}>
                <Text style={stylesText.text3}>Nabywca</Text>
              </View>
              <View style={styles.personalDetails}>
                <Text style={stylesText.text4}>{deliveryData.seller.name}</Text>
                <Text style={stylesText.text4}>
                  {deliveryData.seller.address}
                </Text>
                <Text style={stylesText.text4}>{deliveryData.seller.nip}</Text>
                <Text style={stylesText.text4}>&nbsp;</Text>
                <Text style={stylesText.text4}>&nbsp;</Text>
                <Text style={stylesText.text4last}>&nbsp;</Text>
              </View>
            </View>
          </View>
          <View style={styles.titleBox}>
            <Text style={stylesText.title}>
              {" "}
              {`FAKTURA VAT ${
                new Date(deliveryData.deliveryDate).toISOString().split("T")[0]
              }/${Math.floor(Math.random() * (10 - 1 + 1)) + 1}`}
            </Text>
          </View>
          <View style={styles.tableBox}>
            <View style={stylesRow.row100}>
              <View style={stylesRow.col5}>
                <Text style={stylesText.text5}>Lp.</Text>
              </View>
              <View style={stylesRow.col7}>
                <Text style={stylesText.text5}>Nazwa</Text>
              </View>
              <View style={stylesRow.col10}>
                <Text style={stylesText.text5}>Ilość</Text>
              </View>
              <View style={stylesRow.col}>
                <Text style={stylesText.text5}>j.m.</Text>
              </View>
              <View style={stylesRow.col}>
                <Text style={stylesText.text5}>Wartość netto</Text>
              </View>
              <View style={stylesRow.col}>
                <Text style={stylesText.text5}>VAT [%]</Text>
              </View>
              <View style={stylesRow.col}>
                <Text style={stylesText.text5}>VAT</Text>
              </View>
              <View style={stylesRow.col}>
                <Text style={stylesText.text5}>Wartość brutto</Text>
              </View>
            </View>
            {deliveryData?.products.map((product) => (
              <View style={stylesRow.row100}>
                <View style={stylesRow.col5}>
                  <Text style={stylesText.text6}>{++index}.</Text>
                </View>
                <View style={stylesRow.col7}>
                  <Text style={stylesText.text6}>{product.product}</Text>
                </View>
                <View style={stylesRow.col10}>
                  <Text style={stylesText.text6}>{product.quantity}</Text>
                </View>
                <View style={stylesRow.col}>
                  <Text style={stylesText.text6}>{product.unit}</Text>
                </View>
                <View style={stylesRow.col}>
                  <Text style={stylesText.text6}>
                    {priceHandler(product.product) * +product.quantity} zł
                  </Text>
                </View>
                <View style={stylesRow.col}>
                  <Text style={stylesText.text6}>23</Text>
                </View>
                <View style={stylesRow.col}>
                  <Text style={stylesText.text6}>
                    {(
                      priceHandler(product.product) *
                      +product.quantity *
                      1.4 *
                      0.23
                    ).toFixed(2)}{" "}
                    zł
                  </Text>
                </View>
                <View style={stylesRow.col}>
                  <Text style={stylesText.text6}>
                    {(
                      +priceHandler(product.product) * +product.quantity * 1.4 +
                      priceHandler(product.product) *
                        +product.quantity *
                        1.4 *
                        0.23
                    ).toFixed(2)}{" "}
                    zł
                  </Text>
                </View>
              </View>
            ))}

            <View style={stylesRow.rowlast}></View>
          </View>
          <View style={styles.tableBoxSummary}>
            <View style={stylesRow.row100}>
              <View style={stylesRow.colSum40}>
                <Text style={stylesText.text5}>według stawki VAT</Text>
              </View>
              <View style={stylesRow.colSum20}>
                <Text style={stylesText.text5}>wartość netto</Text>
              </View>
              <View style={stylesRow.colSum}>
                <Text style={stylesText.text5}>kwota VAT </Text>
              </View>
              <View style={stylesRow.colSum}>
                <Text style={stylesText.text5}>wartość brutto</Text>
              </View>
            </View>
            <View style={stylesRow.row100}>
              <View style={stylesRow.colSum40}>
                <Text style={stylesText.text6}>Podstawowy podatek VAT 23%</Text>
              </View>
              <View style={stylesRow.colSum20}>
                <Text style={stylesText.text6}>{priceSum().toFixed(2)} zł</Text>
              </View>
              <View style={stylesRow.colSum}>
                <Text style={stylesText.text6}>{vatSum().toFixed(2)} zł</Text>
              </View>
              <View style={stylesRow.colSum}>
                <Text style={stylesText.text6}>
                  {(+priceSum() + +vatSum()).toFixed(2)} zł
                </Text>
              </View>
            </View>
            <View style={stylesRow.rowlast}></View>
          </View>
          <View style={styles.summary}>
            <View style={styles.summaryBox}>
              <Text style={stylesText.text7}>Razem do zapłaty:</Text>
            </View>
            <View style={styles.summaryBox}>
              <Text style={stylesText.text7}>
                {(+priceSum() + +vatSum()).toFixed(2)} zł
              </Text>
            </View>
          </View>
          <View style={styles.signatureBox}>
            <View style={styles.summaryBox}>
              <Text style={stylesText.text8}>Wystawił(a):</Text>
              <Text style={stylesText.text9}>{name}</Text>
            </View>
            <View style={styles.summaryBox}>
              <Text style={stylesText.text8}>Odebrał(a):</Text>
              <Text style={stylesText.text9}>&nbsp;</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default OrderPDF;
