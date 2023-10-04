import { Font } from "@react-pdf/renderer";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { useState } from "react";
import { dateToInput, dateToPolish } from "../../utils/dateFormatters";

// const stylesRow = StyleSheet.create({
//   row100: {
//     margin: "auto",
//     width: "100%",
//     flexDirection: "row",
//     borderWidth: 1,
//     borderBottomWidth: 0,
//     borderRightWidth: 0,
//     borderColor: "#646e78",
//   },
//   rowlast: {
//     margin: "auto",
//     width: "100%",
//     borderBottom: 1,
//     borderColor: "#646e78",
//   },
//   row100Last: {
//     margin: "auto",
//     width: "100%",
//     flexDirection: "row",
//     borderWidth: 1,
//     borderRightWidth: 0,
//     borderColor: "#646e78",
//   },
//   col50: {
//     width: "50%",
//     margin: "auto",
//     borderStyle: "solid",
//     flexDirection: "row",
//     borderRight: 1,
//     borderColor: "#646e78",
//   },
//   col: {
//     width: "12.5%",
//     margin: "auto",
//     borderStyle: "solid",
//     flexDirection: "row",
//     borderRight: 1,
//     borderColor: "#646e78",
//   },
//   col5: {
//     width: "5%",
//     margin: "auto",
//     borderStyle: "solid",
//     flexDirection: "row",
//     borderRight: 1,
//     borderColor: "#646e78",
//   },
//   col10: {
//     width: "10%",
//     margin: "auto",
//     borderStyle: "solid",
//     flexDirection: "row",
//     borderRight: 1,
//     borderColor: "#646e78",
//   },
//   col7: {
//     width: "22.5%",
//     margin: "auto",
//     borderStyle: "solid",
//     flexDirection: "row",
//     borderRight: 1,
//     borderColor: "#646e78",
//   },
//   colSum: {
//     width: "25%",
//     margin: "auto",
//     borderStyle: "solid",
//     flexDirection: "row",
//     borderRight: 1,
//     borderColor: "#646e78",
//   },
//   colSum20: {
//     width: "20%",
//     margin: "auto",
//     borderStyle: "solid",
//     flexDirection: "row",
//     borderRight: 1,
//     borderColor: "#646e78",
//   },
//   colSum40: {
//     width: "40%",
//     margin: "auto",
//     borderStyle: "solid",
//     flexDirection: "row",
//     borderRight: 1,
//     borderColor: "#646e78",
//   },
// });

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
    width: "40%",
    marginRight: 10,
  },
  mainDataBox: {
    width: "50%",
    marginLeft: 10,
  },
  bold: {
    fontWeight: "bold",
  },
  text1: {
    fontSize: "30px",
    fontWeight: "bold",
  },
  text2: {
    fontSize: "12px",
    marginBottom: 5,
  },
  text4: {
    width: "10%",
    fontSize: "10px",
    textAlign: "left",
    marginRight: 40,
  },
  text6: {
    width: "20%",
    fontSize: "10px",
    textAlign: "left",
    marginRight: 15,
  },
  text7: {
    width: "100%",
    fontSize: "10px",
    textAlign: "left",
    marginRight: 20,
  },
  text8: {
    width: "60%",
    fontSize: "10px",
    textAlign: "left",
  },
  text3: {
    fontSize: "16px",
  },
  tableBox: {
    width: "97%",
    margin: " 15 auto 0",
  },
  row: {
    width: "100%",
    paddingLeft: 2,
  },
  titles: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    paddingBottom: 3,
    borderBottom: 1,
  },
  orderData: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    paddingTop: 5,
  },
  productBox: {
    width: "83%",
    marginTop: 15,
    marginLeft: "17%",
    marginRight: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  text5: {
    width: "20%",
    fontSize: "10px",
    textAlign: "left",
    marginRight: 30,
  },
  dataTitles: {
    width: "80%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    paddingBottom: 3,
    borderBottom: 1,
  },
  dataTitlesSec: {
    width: "20%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    paddingBottom: 3,
    borderBottom: 1,
  },
  productBoxSec: {
    width: "83%",
    marginTop: 5,
    marginLeft: "17%",
    marginRight: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  dataBox: {
    width: "80%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  dataBoxSec: {
    width: "20%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  line: {
    width: "100%",
    paddingTop: 5,
    paddingBottom: 10,
    borderBottom: 1,
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

const OrderPDF = (props) => {
  const [picklistData] = useState(props.picklistData);
  let index = 0;

  return (
    <Document
      title={`PICKLIST/${
        new Date(picklistData.createDate).toISOString().split("T")[0]
      }/${Math.floor(Math.random() * (10 - 1 + 1)) + 1}`}
    >
      <Page size="A4" style={pageStyles.page} wrap={false}>
        <View style={styles.container}>
          <View style={styles.upperBox}>
            <View style={styles.mainDataBox}>
              <Text style={styles.text1}>Lista kompletacyjna</Text>
              <Text style={styles.text2}>
                Stworzono{" "}
                <Text style={styles.bold}>
                  {dateToPolish(new Date(picklistData.createDate).getTime())}
                </Text>
              </Text>
              <Text style={styles.text3}>ID: {picklistData.picklistID}</Text>
            </View>
            <View style={styles.logoBox}>
              <Image
                style={styles.image}
                src={require("../../assets/logo.png")}
              />
            </View>
          </View>
          <View style={styles.tableBox}>
            <View style={styles.row}>
              <View style={styles.titles}>
                <Text style={styles.text4}>Zamówinie</Text>
                <Text style={styles.text4}>ID</Text>
                <Text style={styles.text4}>Data</Text>
              </View>
              {picklistData.orders.map((order) => (
                <>
                  <View style={styles.orderData}>
                    <Text style={styles.text4}>{++index}.</Text>
                    <Text style={styles.text4}>{order.orderID}</Text>
                    <Text style={styles.text4}>
                      {dateToInput(order.orderDate).split("T")[0]}
                    </Text>
                  </View>
                  <View style={styles.productBox}>
                    <View style={styles.dataTitles}>
                      <Text style={styles.text6}>SKU</Text>
                      <Text style={styles.text8}>Nazwa</Text>
                    </View>
                    <View style={styles.dataTitlesSec}>
                      <Text style={styles.text7}>Ilość</Text>
                    </View>
                  </View>
                  {order.products.map((product) => (
                    <View style={styles.productBoxSec}>
                      <View style={styles.dataBox}>
                        <Text style={styles.text6}>{product.productCode}</Text>
                        <Text style={styles.text8}>{product.productName}</Text>
                      </View>
                      <View style={styles.dataBoxSec}>
                        <Text style={styles.text7}>
                          <Text style={styles.bold}>
                            {product.productQuantity}
                          </Text>
                          x {product.productUnit}
                        </Text>
                      </View>
                    </View>
                  ))}
                  <View style={styles.line}></View>
                </>
              ))}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default OrderPDF;
